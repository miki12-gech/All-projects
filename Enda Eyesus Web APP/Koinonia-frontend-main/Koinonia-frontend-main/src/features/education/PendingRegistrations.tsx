"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "./educationApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";

// Sacred Background (same as other pages)
const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-linear-to-br from-[#F8F5F0]/90 via-[#FFF9F0]/70 to-[#EDE5D8]/90 dark:from-[#0E0E0F] dark:via-[#1A1816] dark:to-[#0A0A0B]" />
    <svg className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="crossPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M50 15 L52 48 L85 50 L52 52 L50 85 L48 52 L15 50 L48 48 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A227]" />
          <circle cx="50" cy="50" r="4" fill="currentColor" className="text-[#7A1C1C]" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7A1C1C]/10 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
);

export default function PendingRegistrations() {
  const queryClient = useQueryClient();
  const { data: pendingResp, refetch } = useQuery({
    queryKey: ["education", "pending-registrations"],
    queryFn: () => educationApi.getPendingEnrollments(),
  });
  const pending = pendingResp?.data || [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => educationApi.updateEnrollmentStatus(id, "ACTIVE"),
    onSuccess: () => refetch(),
  });
  const rejectMutation = useMutation({
    mutationFn: (id: string) => educationApi.updateEnrollmentStatus(id, "REJECTED"),
    onSuccess: () => refetch(),
  });

  if (!pending.length) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <SacredBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20 bg-white/60 dark:bg-black/20 rounded-3xl backdrop-blur-sm border border-dashed border-[#C9A227]/40">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">ምንም ያልተረጋገጡ ጥያቄዎች የሉም</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SacredBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subtle header badge */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#C9A227]/10 backdrop-blur-sm rounded-full px-4 py-2 border border-[#C9A227]/30">
            <ClipboardList className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">ያልተረጋገጡ ምዝገባዎች</span>
          </motion.div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-white/70 dark:bg-[#1C1C1F]/70 backdrop-blur-md shadow-xl">
          <Table>
            <TableHeader className="bg-linear-to-r from-[#7A1C1C]/5 to-[#C9A227]/5 dark:from-[#7A1C1C]/10 dark:to-[#D4AF37]/10">
              <TableRow>
                <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">አባል</TableHead>
                <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">ደረጃ</TableHead>
                <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">ዙር ቁጥር</TableHead>
                <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">የጥያቄ ቀን</TableHead>
                <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">ድርጊት</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((req: any) => (
                <TableRow key={req.id} className="hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors">
                  <TableCell>{req.users?.full_name_three_parts}</TableCell>
                  <TableCell>{req.lms_batches?.course_track}</TableCell>
                  <TableCell>{req.lms_batches?.batch_number}</TableCell>
                  <TableCell>{new Date(req.enrolled_at).toLocaleDateString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => approveMutation.mutate(req.id)} className="bg-[#C9A227] hover:bg-[#B8911A] text-white">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> ፈቅድ
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate(req.id)} className="bg-[#7A1C1C] hover:bg-[#5C1515] text-white">
                      <XCircle className="h-3.5 w-3.5 mr-1" /> ውድቅ አድርግ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}