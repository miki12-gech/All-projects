"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "./educationApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText, Filter, GraduationCap } from "lucide-react";

// Sacred Background (same as before)
const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-linear-to-br from-[#F8F5F0]/90 via-[#FFF9F0]/70 to-[#EDE5D8]/90 dark:from-[#0E0E0F] dark:via-[#1A1816] dark:to-[#0A0A0B]" />
    <svg className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="crossPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M50 15 L52 48 L85 50 L52 52 L50 85 L48 52 L15 50 L48 48 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A227]" />
        <circle cx="50" cy="50" r="4" fill="currentColor" className="text-[#7A1C1C]" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7A1C1C]/10 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
);

// Phase configuration
const phases = [
  { key: "GUBAE_ABEW", label: "ጉባኤ አበው", order: 1 },
  { key: "GUBAE_HAWARYAT", label: "ጉባኤ ሐዋርያት", order: 2 },
  { key: "GUBAE_ECCLESIAE", label: "ጉባኤ ኤቅሌስያ", order: 3 },
];

export default function StudentResults() {
  const queryClient = useQueryClient();
  const [filterBatch, setFilterBatch] = useState("all");

  const { data: batchesResp } = useQuery({
    queryKey: ["education", "batches"],
    queryFn: () => educationApi.listBatches(),
  });
  const batches = batchesResp?.data || [];

  const { data: resultsResp, refetch } = useQuery({
    queryKey: ["education", "results", filterBatch],
    queryFn: () => educationApi.getStudentResults({ batchId: filterBatch === "all" ? undefined : filterBatch }),
  });
  const enrollments = resultsResp?.data || [];

  // Build a map: member → phase → enrollment data
  const memberData = useMemo(() => {
    const map = new Map();
    for (const enrollment of enrollments) {
      const userId = enrollment.user_id;
      if (!map.has(userId)) {
        map.set(userId, {
          id: userId,
          fullName: enrollment.users?.full_name_three_parts,
          email: enrollment.users?.email,
          phases: {},
        });
      }
      const phaseKey = enrollment.lms_batches?.course_track;
      map.get(userId).phases[phaseKey] = enrollment;
    }
    return Array.from(map.values());
  }, [enrollments]);

  const graduateMutation = useMutation({
    mutationFn: (enrollmentId: string) => educationApi.graduateMember(enrollmentId),
    onSuccess: () => refetch(),
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SacredBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#C9A227]/10 backdrop-blur-sm rounded-full px-4 py-2 border border-[#C9A227]/30">
            <FileText className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">የተማሪ ውጤቶች</span>
          </motion.div>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-64">
            <Select value={filterBatch} onValueChange={setFilterBatch}>
              <SelectTrigger className="bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-sm border-[#C9A227]/40">
                <Filter className="h-4 w-4 mr-2 text-[#C9A227]" />
                <SelectValue placeholder="በዙር አጣራ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ሁሉም ዙሮች</SelectItem>
                {batches.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.course_track} - ዙር {b.batch_number}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Table - One row per member, columns for each phase */}
        {memberData.length === 0 ? (
          <div className="text-center py-20 bg-white/60 dark:bg-black/20 rounded-3xl backdrop-blur-sm border border-dashed border-[#C9A227]/40">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">ምንም ውጤት አልተገኘም</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-white/70 dark:bg-[#1C1C1F]/70 backdrop-blur-md shadow-xl">
            <Table>
              <TableHeader className="bg-linear-to-r from-[#7A1C1C]/5 to-[#C9A227]/5 dark:from-[#7A1C1C]/10 dark:to-[#D4AF37]/10">
                <TableRow>
                  <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">ተማሪ</TableHead>
                  <TableHead className="text-[#7A1C1C] dark:text-[#D4AF37]">ኢሜይል</TableHead>
                  {phases.map(phase => (
                    <TableHead key={phase.key} className="text-center text-[#7A1C1C] dark:text-[#D4AF37]">
                      {phase.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberData.map((member) => (
                  <TableRow key={member.id} className="hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors">
                    <TableCell className="font-medium whitespace-nowrap">{member.fullName}</TableCell>
                    <TableCell className="whitespace-nowrap">{member.email}</TableCell>
                    {phases.map((phase) => {
                      const enrollment = member.phases[phase.key];
                      if (!enrollment) {
                        return <TableCell key={phase.key} className="text-center text-muted-foreground">—</TableCell>;
                      }
                      const passed = enrollment.is_passed;
                      const exitScore = enrollment.final_exam_score;
                      const avgSubjectScore = (() => {
                        const scores = Object.values(enrollment.quiz_scores || {}) as any[];
                        if (!scores.length) return null;
                        const avg = scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length;
                        return Math.round(avg);
                      })();
                      const isGraduated = enrollment.status === "GRADUATED";
                      return (
                        <TableCell key={phase.key} className="text-center p-2">
                          <div className="space-y-1">
                            <div className="text-xs">
                              {avgSubjectScore !== null ? `ክፍል: ${avgSubjectScore}%` : "ክፍል:—"}
                            </div>
                            <div className={`text-xs font-semibold ${passed ? "text-green-600" : "text-red-600"}`}>
                              መውጫ: {exitScore ? `${exitScore}%` : "—"}
                            </div>
                            {!isGraduated && passed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => graduateMutation.mutate(enrollment.id)}
                                className="mt-1 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white text-xs h-7"
                              >
                                <GraduationCap className="h-3 w-3 mr-1" /> አስመርቅ
                              </Button>
                            )}
                            {isGraduated && (
                              <Badge variant="default" className="bg-amber-500 text-white text-xs">ተመርቋል</Badge>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}