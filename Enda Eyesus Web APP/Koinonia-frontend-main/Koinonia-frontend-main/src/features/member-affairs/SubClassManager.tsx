"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi, useMemberAffairsClassId } from "./memberAffairsApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SubClassManager() {
  const classId = useMemberAffairsClassId();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [subClassName, setSubClassName] = useState("");
  const [subChairId, setSubChairId] = useState("");
  const [subSecretaryId, setSubSecretaryId] = useState("");

  // Fetch sub‑classes
  const { data: subClasses, isLoading } = useQuery({
    queryKey: ["member-affairs", "sub-classes", classId],
    enabled: !!classId,
    queryFn: async () => {
      const res = await memberAffairsApi.getSubClasses(classId!);
      return res.data;
    },
  });

  // Fetch members of this class only
  const { data: allMembers, isLoading: membersLoading } = useQuery({
    queryKey: ["member-affairs", "members-for-subclass", classId],
    enabled: !!classId,
    queryFn: async () => {
      const res = await memberAffairsApi.listMembers({ serviceClassId: classId! });
      return res.data;
    },
  });

  // Debugging: log members and their graduations
  useEffect(() => {
    if (allMembers) {
      console.log("All members of class:", allMembers);
      allMembers.forEach((m: any) => {
        console.log(`Member ${m.full_name_three_parts}: graduated_phases =`, m.graduated_phases);
      });
    }
  }, [allMembers]);

  // Filter: only members who have graduated Gubae Hawaryat or higher
  const eligibleMembers = useMemo(() => {
    if (!allMembers || !classId) return [];

    return allMembers.filter((m: any) => {
      // Graduation check – handle both stringified JSON and raw array
      let phases: string[] = [];
      const gradData = m.graduated_phases;
      if (gradData) {
        try {
          phases = typeof gradData === "string" ? JSON.parse(gradData) : gradData;
          if (!Array.isArray(phases)) phases = [];
          phases = phases.map((p: string) => p.toLowerCase());
        } catch (e) {
          console.warn("Failed to parse graduated_phases for user", m.id, e);
          phases = [];
        }
      }

      const hasRequired = phases.includes("gubae_hawaryat") || phases.includes("gubae_eclessia");
      // Also log the result for debugging
      if (hasRequired) {
        console.log(`✅ ${m.full_name_three_parts} is eligible`);
      }
      return hasRequired;
    });
  }, [allMembers, classId]);

  const createMutation = useMutation({
    mutationFn: () =>
      memberAffairsApi.createSubClass(classId!, {
        sub_class_name: subClassName,
        sub_chair_id: subChairId || undefined,
        sub_secretary_id: subSecretaryId || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "sub-classes"] });
      setOpen(false);
      setSubClassName("");
      setSubChairId("");
      setSubSecretaryId("");
      toast.success("Sub‑class created successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to create sub‑class";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => memberAffairsApi.deleteSubClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "sub-classes"] });
      toast.success("Sub‑class deleted");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Failed to delete sub‑class";
      toast.error(message);
    },
  });

  if (isLoading || membersLoading) return <div className="p-4 text-center">Loading sub‑classes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)} className="bg-[#C9A227] hover:bg-[#B8911A]">
          <Plus className="h-4 w-4 mr-2" /> Create Sub‑Class
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto bg-white/60 dark:bg-[#1C1C1F]/60 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sub‑Chair</TableHead>
              <TableHead>Sub‑Secretary</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subClasses?.map((sc: any) => (
              <TableRow key={sc.id}>
                <TableCell>{sc.sub_class_name}</TableCell>
                <TableCell>{sc.users_sub_classes_sub_chair_idTousers?.full_name_three_parts || "—"}</TableCell>
                <TableCell>{sc.users_sub_classes_sub_secretary_idTousers?.full_name_three_parts || "—"}</TableCell>
                <TableCell>{sc.members?.length || 0}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(sc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white/95 dark:bg-[#1C1C1F]/95 backdrop-blur-xl border border-[#C9A227]/40">
          <DialogHeader>
            <DialogTitle className="text-[#7A1C1C] dark:text-[#D4AF37]">Create New Sub‑Class</DialogTitle>
            <DialogDescription>
              Assign a name and select leaders for the new sub‑class. Only members who have completed
              at least Gubae Hawaryat are eligible for leadership roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Sub‑Class Name"
              value={subClassName}
              onChange={(e) => setSubClassName(e.target.value)}
              className="bg-white/80 dark:bg-[#1C1C1F]/80"
            />

            <Select value={subChairId} onValueChange={setSubChairId}>
              <SelectTrigger className="bg-white/80 dark:bg-[#1C1C1F]/80">
                <SelectValue placeholder="Select Sub‑Chair" />
              </SelectTrigger>
              <SelectContent>
                {eligibleMembers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No eligible members in this class (must have completed Gubae Hawaryat or higher)
                  </div>
                ) : (
                  eligibleMembers.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name_three_parts}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={subSecretaryId} onValueChange={setSubSecretaryId}>
              <SelectTrigger className="bg-white/80 dark:bg-[#1C1C1F]/80">
                <SelectValue placeholder="Select Sub‑Secretary" />
              </SelectTrigger>
              <SelectContent>
                {eligibleMembers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No eligible members in this class (must have completed Gubae Hawaryat or higher)
                  </div>
                ) : (
                  eligibleMembers.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name_three_parts}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="bg-[#C9A227] hover:bg-[#B8911A]">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}