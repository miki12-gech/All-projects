"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi } from "./memberAffairsApi";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Users, CheckSquare, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BatchAssign() {
  const queryClient = useQueryClient();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [targetClassId, setTargetClassId] = useState("");

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["member-affairs", "members-for-batch"],
    queryFn: async () => {
      const res = await memberAffairsApi.listMembers({});
      return res.data;
    },
  });

  const { data: serviceClasses, isLoading: classesLoading } = useQuery({
    queryKey: ["service-classes"],
    queryFn: async () => {
      const res = await memberAffairsApi.getServiceClasses();
      return res.data;
    },
  });

  const batchMutation = useMutation({
    mutationFn: () => memberAffairsApi.batchAssign(selectedMembers, targetClassId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "members"] });
      setSelectedMembers([]);
      setTargetClassId("");
      alert("✅ Members assigned successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || "❌ Failed to assign members.");
    },
  });

  const toggleSelectAll = () => {
    if (selectedMembers.length === (members?.length || 0)) setSelectedMembers([]);
    else setSelectedMembers(members?.map((m: any) => m.id) || []);
  };

  if (membersLoading || classesLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#C9A227]" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">Target Service Class</label>
          <Select value={targetClassId} onValueChange={setTargetClassId}>
            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
            <SelectContent>
              {serviceClasses?.map((cls: any) => <SelectItem key={cls.id} value={cls.id}>{cls.class_name_amharic}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleSelectAll}>
            {selectedMembers.length === members?.length ? <CheckSquare className="h-4 w-4 mr-1" /> : <Square className="h-4 w-4 mr-1" />}
            Select All
          </Button>
          <Button onClick={() => batchMutation.mutate()} disabled={selectedMembers.length === 0 || !targetClassId} className="bg-[#7A1C1C] hover:bg-[#9B2323] text-white">
            {batchMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : `Assign ${selectedMembers.length} Member(s)`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members?.map((m: any) => (
          <Card key={m.id} className={`cursor-pointer transition ${selectedMembers.includes(m.id) ? 'border-[#C9A227] bg-[#C9A227]/5' : ''}`} onClick={() => {
            setSelectedMembers(prev => prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]);
          }}>
            <CardContent className="p-3 flex items-center gap-3">
              <Checkbox checked={selectedMembers.includes(m.id)} onCheckedChange={() => {}} />
              <div className="flex-1">
                <p className="font-medium">{m.full_name_three_parts}</p>
                <p className="text-xs text-muted-foreground">{m.email} • {m.service_classes?.class_name_amharic || "Unassigned"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {members?.length === 0 && <div className="col-span-full text-center py-12">No members found.</div>}
      </div>
    </div>
  );
}