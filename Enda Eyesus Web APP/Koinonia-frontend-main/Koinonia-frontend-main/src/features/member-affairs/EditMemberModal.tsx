// src/features/member-affairs/EditMemberModal.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi } from "./memberAffairsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Loader2, User, Shield, Home, Briefcase } from "lucide-react";

interface EditMemberModalProps {
  member: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditMemberModal({ member, onClose, onSuccess }: EditMemberModalProps) {
  const queryClient = useQueryClient();

  const toSelectValue = (val: string | null | undefined) => val || "none";

  const [formData, setFormData] = useState({
    service_class_id: member.service_class_id || "",
    repentance_father_id: toSelectValue(member.repentance_father_id),
    repentance_deacon_id: toSelectValue(member.repentance_deacon_id),
    spiritual_father_id: toSelectValue(member.spiritual_father_id),
    spiritual_mother_id: toSelectValue(member.spiritual_mother_id),
    is_active: member.is_active ?? true,
    academic_year: member.academic_year?.toString() || "",
    academic_dept: member.academic_dept || "",
    phone_number: member.phone_number || "",
    dorm_block: member.dorm_block || "",
    dorm_room: member.dorm_room || "",
  });

  const { data: serviceClasses } = useQuery({
    queryKey: ["service-classes"],
    queryFn: async () => {
      const res = await memberAffairsApi.getServiceClasses();
      return res.data;
    },
  });

  const { data: priests } = useQuery({
    queryKey: ["spiritual-candidates", "priest"],
    queryFn: async () => {
      const res = await memberAffairsApi.getSpiritualCandidates("priest");
      return res.data;
    },
  });

  const { data: deacons } = useQuery({
    queryKey: ["spiritual-candidates", "deacon"],
    queryFn: async () => {
      const res = await memberAffairsApi.getSpiritualCandidates("deacon");
      return res.data;
    },
  });

  const { data: spiritualCandidates } = useQuery({
    queryKey: ["spiritual-candidates", "spiritual"],
    queryFn: async () => {
      const res = await memberAffairsApi.getSpiritualCandidates("spiritual");
      return res.data;
    },
  });

const updateMutation = useMutation({
  mutationFn: () => {
    const apiData = {
      ...formData,
      // Convert "none" back to null
      repentance_father_id: formData.repentance_father_id === "none" ? null : formData.repentance_father_id,
      repentance_deacon_id: formData.repentance_deacon_id === "none" ? null : formData.repentance_deacon_id,
      spiritual_father_id: formData.spiritual_father_id === "none" ? null : formData.spiritual_father_id,
      spiritual_mother_id: formData.spiritual_mother_id === "none" ? null : formData.spiritual_mother_id,
      // Send null for empty academic_year
      academic_year: formData.academic_year === "" ? null : formData.academic_year,
      // Send null for empty strings
      dorm_block: formData.dorm_block === "" ? null : formData.dorm_block,
      dorm_room: formData.dorm_room === "" ? null : formData.dorm_room,
      phone_number: formData.phone_number === "" ? null : formData.phone_number,
      academic_dept: formData.academic_dept === "" ? null : formData.academic_dept,
    };
    return memberAffairsApi.updateMember(member.id, apiData);
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "members"] });
      onSuccess();
      onClose();
    },
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const maleCandidates = spiritualCandidates?.filter((c: any) => c.sex === "MALE") || [];
  const femaleCandidates = spiritualCandidates?.filter((c: any) => c.sex === "FEMALE") || [];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">
            Edit Member
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{member.full_name_three_parts}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37] border-b pb-1">
              <User className="h-4 w-4" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Phone Number</Label>
                <Input 
                  value={formData.phone_number} 
                  onChange={(e) => handleChange("phone_number", e.target.value)} 
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label>Academic Department</Label>
                <Input 
                  value={formData.academic_dept} 
                  onChange={(e) => handleChange("academic_dept", e.target.value)} 
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label>Academic Year</Label>
                <Input 
                  type="number" 
                  value={formData.academic_year} 
                  onChange={(e) => handleChange("academic_year", e.target.value)} 
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-4 space-y-0">
                <Label>Active Status</Label>
                <Switch checked={formData.is_active} onCheckedChange={(v) => handleChange("is_active", v)} />
              </div>
            </div>
          </div>

          {/* Service Class */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37] border-b pb-1">
              <Briefcase className="h-4 w-4" /> Service Class
            </h3>
            <Select value={formData.service_class_id} onValueChange={(v) => handleChange("service_class_id", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service class" />
              </SelectTrigger>
              <SelectContent>
                {serviceClasses?.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.class_name_amharic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Spiritual Mentors */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37] border-b pb-1">
              <Shield className="h-4 w-4" /> Spiritual Mentors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Repentance Father (Priest)</Label>
                <Select value={formData.repentance_father_id} onValueChange={(v) => handleChange("repentance_father_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {priests?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.full_name_three_parts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Repentance Deacon</Label>
                <Select value={formData.repentance_deacon_id} onValueChange={(v) => handleChange("repentance_deacon_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deacon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {deacons?.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>{d.full_name_three_parts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Spiritual Father</Label>
                <Select value={formData.spiritual_father_id} onValueChange={(v) => handleChange("spiritual_father_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spiritual father" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {maleCandidates.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name_three_parts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Spiritual Mother</Label>
                <Select value={formData.spiritual_mother_id} onValueChange={(v) => handleChange("spiritual_mother_id", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spiritual mother" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {femaleCandidates.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name_three_parts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dormitory Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37] border-b pb-1">
              <Home className="h-4 w-4" /> Dormitory Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Dorm Block</Label>
                <Input 
                  value={formData.dorm_block} 
                  onChange={(e) => handleChange("dorm_block", e.target.value)} 
                  placeholder="e.g., Block A"
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label>Dorm Room</Label>
                <Input 
                  value={formData.dorm_room} 
                  onChange={(e) => handleChange("dorm_room", e.target.value)} 
                  placeholder="Room number"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="bg-[#7A1C1C] hover:bg-[#9B2323] text-white">
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}