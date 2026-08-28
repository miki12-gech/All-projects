"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi } from "./memberAffairsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, User, Mail, BookOpen, Home, Phone } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingApprovals() {
  const queryClient = useQueryClient();
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; userId: string; reason: string }>({ open: false, userId: "", reason: "" });
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; userId: string; preferredClassId?: string }>({ open: false, userId: "" });
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: pending, isLoading } = useQuery({
    queryKey: ["member-affairs", "pending"],
    queryFn: async () => {
      const res = await memberAffairsApi.getPending();
      return res.data;
    },
  });

  const { data: serviceClasses } = useQuery({
    queryKey: ["service-classes"],
    queryFn: async () => {
      const res = await memberAffairsApi.getServiceClasses();
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ userId, preferredClassId }: { userId: string; preferredClassId?: string }) =>
      memberAffairsApi.approve(userId, preferredClassId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "members"] });
      setApproveDialog({ open: false, userId: "" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      memberAffairsApi.reject(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "pending"] });
      setRejectDialog({ open: false, userId: "", reason: "" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]" /></div>;
  if (!pending?.length) return <div className="text-center py-12 text-muted-foreground">No pending applications.</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pending.map((user: any) => (
          <Card
            key={user.id}
            className="group cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 border-border"
            onClick={() => setSelectedUser(user)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{user.full_name_three_parts}</h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300">
                  Pending
                </Badge>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={(e) => { e.stopPropagation(); setApproveDialog({ open: true, userId: user.id, preferredClassId: user.preferred_class_id }); }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-3 w-3 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => { e.stopPropagation(); setRejectDialog({ open: true, userId: user.id, reason: "" }); }}
                >
                  <XCircle className="h-3 w-3 mr-1" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review the applicant's information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#7A1C1C]/10 rounded-full">
                  <User className="h-5 w-5 text-[#7A1C1C] dark:text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.full_name_three_parts}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Badge variant="outline">ID</Badge> {selectedUser.university_id || "—"}</div>
                <div className="flex items-center gap-2"><Badge variant="outline">Dept</Badge> {selectedUser.academic_dept || "—"}</div>
                <div className="flex items-center gap-2"><Badge variant="outline">Year</Badge> {selectedUser.academic_year || "—"}</div>
                <div className="flex items-center gap-2"><Badge variant="outline">Dorm</Badge> {selectedUser.dorm_block || "—"} / {selectedUser.dorm_room || "—"}</div>
              </div>
              <div className="pt-2">
                <Badge>Preferred Class</Badge>
                <p className="mt-1">{selectedUser.preferred_class?.class_name_amharic || "Not specified"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject dialogs remain same */}
      <Dialog open={approveDialog.open} onOpenChange={(open) => !open && setApproveDialog({ open: false, userId: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Membership</DialogTitle>
            <DialogDescription>Confirm approval. You may optionally change the service class.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Service Class</label>
            <Select value={approveDialog.preferredClassId} onValueChange={(val) => setApproveDialog(prev => ({ ...prev, preferredClassId: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {serviceClasses?.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.class_name_amharic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog({ open: false, userId: "" })}>Cancel</Button>
            <Button onClick={() => approveMutation.mutate({ userId: approveDialog.userId, preferredClassId: approveDialog.preferredClassId })} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? "Approving..." : "Confirm Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialog.open} onOpenChange={(open) => !open && setRejectDialog({ open: false, userId: "", reason: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Membership</DialogTitle>
            <DialogDescription>Provide a reason (optional).</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason..." value={rejectDialog.reason} onChange={(e) => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, userId: "", reason: "" })}>Cancel</Button>
            <Button variant="destructive" onClick={() => rejectMutation.mutate({ userId: rejectDialog.userId, reason: rejectDialog.reason })}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}