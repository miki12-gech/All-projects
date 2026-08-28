"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "./educationApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Search,
  Users,
  Church,
} from "lucide-react";

// ---------- Sacred Background (same as SubjectManager) ----------
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

// ---------- Amharic Phase Configuration ----------
const phaseConfig: Record<string, { labelAm: string; labelEn: string; color: string; icon: any }> = {
  GUBAE_ABEW: { labelAm: "ጉባኤ አበው", labelEn: "Gubae Abew", color: "gold", icon: Church },
  GUBAE_HAWARYAT: { labelAm: "ጉባኤ ሐዋርያት", labelEn: "Gubae Hawaryat", color: "gold", icon: Sparkles },
  GUBAE_ECCLESIAE: { labelAm: "ጉባኤ ኤቅሌስያ", labelEn: "Gubae Eclessia", color: "gold", icon: Award },
};

const normalizePhase = (phase: string) => phase.toLowerCase().trim();

const ProgressRing = ({ score, size = 48 }: { score: number; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = score >= 70 ? "#C9A227" : "#7A1C1C";
  return (
    <div className="relative inline-flex items-center justify-center group">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth="4" fill="none" className="text-muted-foreground/20" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={strokeColor} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} fill="none" strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="absolute text-xs font-bold">{Math.round(score)}%</span>
      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap">ውጤት: {Math.round(score)}%</div>
    </div>
  );
};

const StatusBadge = ({ status, graduated }: { status: string; graduated: boolean }) => {
  if (graduated) return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 gap-1"><CheckCircle2 className="h-3 w-3" /> ተመርቋል</Badge>;
  switch (status) {
    case "PENDING": return <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1"><Loader2 className="h-3 w-3 animate-spin" /> በመጠባበቅ ላይ</Badge>;
    case "ACTIVE": return <Badge variant="outline" className="border-green-500 text-green-600 gap-1"><CheckCircle2 className="h-3 w-3" /> ንቁ</Badge>;
    case "REJECTED": return <Badge variant="outline" className="border-red-500 text-red-600 gap-1"><AlertCircle className="h-3 w-3" /> ውድቅ ተደርጓል</Badge>;
    default: return null;
  }
};

export default function GraduationList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<Record<string, string>>({});

  const { data: members, isLoading } = useQuery({
    queryKey: ["education", "enrolled-members"],
    queryFn: async () => { const res = await educationApi.getEnrolledMembers(); return res.data; },
  });

  const graduateMutation = useMutation({
    mutationFn: ({ memberId, phase }: { memberId: string; phase: string }) => {
      return educationApi.markMemberGraduated({ memberId, phase: normalizePhase(phase) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", "enrolled-members"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("ተማሪው በስኬት ተመርቋል 🎓", { duration: 4000 });
    },
    onError: (error: any) => toast.error(error.response?.data?.error || error.message || "ምረቃው አልተሳካም"),
  });

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((member: any) => {
      const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (activePhaseFilter === "all") return true;
      return member.enrollments.some((e: any) => e.phase === activePhaseFilter);
    });
  }, [members, searchTerm, activePhaseFilter]);

  const phaseCounts = useMemo(() => {
    if (!members) return {};
    const counts: Record<string, number> = { all: members.length };
    Object.keys(phaseConfig).forEach((phase) => { counts[phase] = members.filter((m: any) => m.enrollments.some((e: any) => e.phase === phase)).length; });
    return counts;
  }, [members]);

  if (isLoading) return <div className="flex items-center justify-center min-h-100"><Loader2 className="animate-spin h-10 w-10 text-[#C9A227]" /></div>;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SacredBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section (same as SubjectManager) */}
        <div className="text-center mb-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#C9A227]/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#C9A227]/30">
            <GraduationCap className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">የምረቃ አስተዳደር</span>
          </motion.div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="🔍 በስም ወይም ኢሜይል ፈልግ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-sm border-[#C9A227]/30 focus:border-[#C9A227]" />
          </div>
          <Tabs value={activePhaseFilter} onValueChange={setActivePhaseFilter} className="w-full md:w-auto">
            <TabsList className="bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-sm border border-[#ddd8d0] dark:border-[#2a2a2d] p-1 rounded-full">
              <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-[#C9A227] data-[state=active]:text-white">ሁሉም ({phaseCounts.all || 0})</TabsTrigger>
              {Object.entries(phaseConfig).map(([key, config]) => (<TabsTrigger key={key} value={key} className="rounded-full data-[state=active]:bg-[#C9A227] data-[state=active]:text-white gap-1">{config.labelAm} ({phaseCounts[key] || 0})</TabsTrigger>))}
            </TabsList>
          </Tabs>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white/60 dark:bg-black/20 rounded-3xl backdrop-blur-sm border border-dashed border-[#C9A227]/40">
            <Users className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground">ምንም አባል አልተገኘም</h3>
            <p className="text-muted-foreground mt-2">ከላይ ያለውን የፍለጋ ማጣሪያ ቀይረው ይሞክሩ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredMembers.map((member: any) => (
              <div key={member.id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute -bottom-8 -right-8 text-8xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">✙</div>
                <div className="relative p-6 pb-2 border-b border-[#ddd8d0] dark:border-[#2a2a2d] bg-linear-to-r from-[#F8F5F0] to-white dark:from-[#1C1C1F] dark:to-[#1C1C1F]">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] tracking-wide">{member.fullName}</h3><p className="text-sm text-muted-foreground">{member.email}</p></div>
                    {member.enrollments.some((e: any) => e.graduated) && <div className="bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Award className="h-3 w-3" /> ሙሉ ተመራቂ</div>}
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {member.enrollments.map((enrollment: any) => {
                    const config = phaseConfig[enrollment.phase];
                    if (!config) return null;
                    const isGraduated = enrollment.graduated;
                    const hasPassed = enrollment.isPassed;
                    const examScore = enrollment.finalExamScore;
                    return (
                      <div key={enrollment.phase} className={`relative rounded-xl p-4 transition-all duration-300 ${isGraduated ? "bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800" : "bg-[#F8F5F0] dark:bg-[#252529] border border-[#ddd8d0] dark:border-[#2a2a2d]"}`}>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><config.icon className="h-5 w-5 text-[#C9A227]" /><span className="font-semibold text-foreground">{config.labelAm}</span><StatusBadge status={enrollment.status} graduated={isGraduated} /></div>
                          {examScore && <ProgressRing score={examScore} size={44} />}
                        </div>
                        {!isGraduated && (
                          <div className="mt-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                            {hasPassed ? (
                              <>
                                <select value={selectedPhase[member.id] || ""} onChange={(e) => setSelectedPhase((prev) => ({ ...prev, [member.id]: e.target.value }))} className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227]">
                                  <option value="">ምረቃ የሚፈልጉትን ደረጃ ይምረጡ</option>
                                  {member.enrollments.filter((e: any) => !e.graduated && e.isPassed).map((e: any) => (<option key={e.phase} value={e.phase}>{phaseConfig[e.phase]?.labelAm}</option>))}
                                </select>
                                <Button size="sm" className="bg-[#C9A227] hover:bg-[#B8911A] text-white shadow-sm" onClick={() => graduateMutation.mutate({ memberId: member.id, phase: selectedPhase[member.id] })} disabled={!selectedPhase[member.id] || graduateMutation.isPending}><GraduationCap className="h-4 w-4 mr-1" /> አስመርቅ</Button>
                              </>
                            ) : (
                              <div className="flex-1 text-xs text-muted-foreground">{enrollment.status === "PENDING" ? "⏳ ምዝገባ በመጠባበቅ ላይ" : enrollment.status === "REJECTED" ? "❌ ምዝገባ ውድቅ ተደርጓል" : "📖 ፈተናውን ገና አላለፉም"}</div>
                            )}
                            <Button size="sm" variant="destructive" className="bg-[#7A1C1C] hover:bg-[#5C1515] text-white shadow-sm" onClick={() => { if (confirm(`⚠️ በግዳጅ ማስመረቅ: ${member.fullName} ከ ${config.labelAm}\n\nይህ እርምጃ ፈተና ሳይወሰድ ተመራቂ ያደርጋቸዋል። መቀጠል እንደሚፈልጉ እርግጠኛ ኖት?`) ) graduateMutation.mutate({ memberId: member.id, phase: enrollment.phase }); }} disabled={graduateMutation.isPending}><AlertCircle className="h-3.5 w-3.5 mr-1" /> በግዳጅ አስመርቅ</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {member.enrollments.length === 0 && <div className="text-center py-4 text-muted-foreground text-sm italic">በምንም የትምህርት ደረጃ አልተመዘገቡም</div>}
                </div>
                <div className="p-3 border-t border-[#ddd8d0] dark:border-[#2a2a2d] bg-linear-to-r from-transparent to-[#C9A227]/5 text-center text-[10px] text-muted-foreground">✙ እንዳ ኢየሱስ ግቢ ጉባኤ - ትምህርት ክፍል ✙</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}