"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi } from "./memberAffairsApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  Users,
  UserPlus,
  Shield,
  Filter,
  Church,
  Heart,
  User,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Helpers ----------
function getRoleLabel(role: string): string {
  switch (role) {
    case "repentance_father_id":
      return "Repentance Father";
    case "repentance_deacon_id":
      return "Coordinator Deacon";
    case "spiritual_father_id":
      return "Spiritual Father";
    case "spiritual_mother_id":
      return "Spiritual Mother";
    default:
      return role;
  }
}

function getInitials(name: string): string {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";
}

// ---------- Main Component ----------
export default function SpiritualAssignments() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("unassigned");
  const [filterType, setFilterType] = useState<"priest" | "spiritual_father" | "spiritual_mother">("priest");
  const [selectedMentorId, setSelectedMentorId] = useState<string>("all");

  // Fetch data
  const { data: unassigned, isLoading: loadingUnassigned } = useQuery({
    queryKey: ["member-affairs", "unassigned-spiritual"],
    queryFn: async () => {
      const res = await memberAffairsApi.getUnassignedSpiritual();
      return res.data;
    },
  });

  const { data: allMembers, isLoading: loadingAll } = useQuery({
    queryKey: ["member-affairs", "members-with-spiritual"],
    queryFn: async () => {
      const res = await memberAffairsApi.listMembers({});
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

  const maleCandidates = spiritualCandidates?.filter((c: any) => c.sex === "MALE") || [];
  const femaleCandidates = spiritualCandidates?.filter((c: any) => c.sex === "FEMALE") || [];

  const assignMutation = useMutation({
    mutationFn: ({ memberId, role, valueId }: { memberId: string; role: string; valueId: string }) =>
      memberAffairsApi.assignSpiritual(memberId, role, valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "unassigned-spiritual"] });
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "members-with-spiritual"] });
    },
  });

  // Filter assigned members
  const assignedMembers = useMemo(() => {
    if (!allMembers) return [];
    let filtered = allMembers;
    if (selectedMentorId !== "all") {
      filtered = filtered.filter((m: any) => {
        if (filterType === "priest") return m.repentance_father_id === selectedMentorId;
        if (filterType === "spiritual_father") return m.spiritual_father_id === selectedMentorId;
        if (filterType === "spiritual_mother") return m.spiritual_mother_id === selectedMentorId;
        return false;
      });
    }
    return filtered;
  }, [allMembers, selectedMentorId, filterType]);

  const getMentorName = (id: string | null) => {
    if (!id) return "—";
    const all = [...(priests || []), ...(deacons || []), ...maleCandidates, ...femaleCandidates];
    const mentor = all.find((m: any) => m.id === id);
    return mentor?.full_name_three_parts || "Unknown";
  };

  const getMissingRoles = (member: any) => {
    const missing = [];
    if (!member.repentance_father_id) missing.push("Repentance Father");
    if (!member.repentance_deacon_id) missing.push("Deacon");
    if (!member.spiritual_father_id) missing.push("Spiritual Father");
    if (!member.spiritual_mother_id) missing.push("Spiritual Mother");
    return missing;
  };

  if (loadingUnassigned || loadingAll) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#C9A227]" />
          <div className="absolute inset-0 blur-2xl bg-[#C9A227]/20 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#C9A227]/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#7A1C1C]/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with glass effect */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7A1C1C]/10 to-[#C9A227]/10 dark:from-[#D4AF37]/10 dark:to-transparent rounded-2xl blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/60 dark:bg-[#1C1C1F]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#C9A227]/20 shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#C9A227] font-medium mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Spiritual Care</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-white bg-clip-text text-transparent">
                Spiritual Assignments
              </h1>
              <p className="text-muted-foreground mt-1">Connect members with their spiritual guides and mentors</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#7A1C1C]/10 text-[#7A1C1C] dark:bg-[#D4AF37]/10 dark:text-[#D4AF37] border-none px-4 py-2">
                <Users className="h-4 w-4 mr-1" /> {unassigned?.length || 0} unassigned
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Glossy Tabs */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/5 to-transparent rounded-2xl blur" />
            <TabsList className="relative bg-white/70 dark:bg-[#1C1C1F]/70 backdrop-blur-md p-1.5 rounded-2xl border border-[#C9A227]/20 w-full max-w-md mx-auto shadow-sm">
              <TabsTrigger
                value="unassigned"
                className="flex-1 rounded-xl py-3 data-[state=active]:bg-[#7A1C1C] data-[state=active]:text-white dark:data-[state=active]:bg-[#D4AF37] dark:data-[state=active]:text-black transition-all duration-300 font-medium gap-2"
              >
                <Users className="h-4 w-4" /> Unassigned
              </TabsTrigger>
              <TabsTrigger
                value="assigned"
                className="flex-1 rounded-xl py-3 data-[state=active]:bg-[#7A1C1C] data-[state=active]:text-white dark:data-[state=active]:bg-[#D4AF37] dark:data-[state=active]:text-black transition-all duration-300 font-medium gap-2"
              >
                <Shield className="h-4 w-4" /> Assigned
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Unassigned Tab – Card Grid */}
          <TabsContent value="unassigned" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#C9A227]" />
                Members Needing Spiritual Guidance
              </h2>
              <Badge variant="outline" className="bg-white/50 dark:bg-black/30 px-3 py-1">
                {unassigned?.length || 0} members
              </Badge>
            </div>

            {unassigned?.length === 0 ? (
              <div className="text-center py-20 bg-white/40 dark:bg-black/20 rounded-3xl backdrop-blur-sm border border-dashed border-[#C9A227]/30">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground">All Members Are Assigned!</h3>
                <p className="text-muted-foreground mt-2">Every member has a complete set of spiritual guides. Well done!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {unassigned?.map((member: any) => {
                  const missing = getMissingRoles(member);
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group relative bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-xl rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Gradient accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A1C1C] via-[#C9A227] to-transparent" />

                      <div className="p-6 space-y-4">
                        {/* Member header */}
                        <div className="flex items-start gap-4">
                          <Avatar className="h-14 w-14 border-2 border-[#C9A227] shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] text-white font-bold text-lg">
                              {getInitials(member.full_name_three_parts)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-foreground truncate">{member.full_name_three_parts}</h4>
                            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <Badge variant="secondary" className="bg-[#C9A227]/10 text-[#C9A227] text-[10px] border-none">
                                {member.service_classes?.class_name_amharic || "No class"}
                              </Badge>
                              {member.university_id && (
                                <Badge variant="outline" className="text-[10px]">ID: {member.university_id}</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Missing roles chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {missing.map((role) => (
                            <Badge key={role} variant="destructive" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs">
                              <X className="h-3 w-3 mr-1" /> {role}
                            </Badge>
                          ))}
                        </div>

                        {/* Assignment dropdowns */}
                        <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                          {!member.repentance_father_id && (
                            <div className="flex items-center gap-2">
                              <Church className="h-4 w-4 text-[#C9A227] flex-shrink-0" />
                              <Select
                                onValueChange={(val) =>
                                  assignMutation.mutate({ memberId: member.id, role: "repentance_father_id", valueId: val })
                                }
                              >
                                <SelectTrigger className="flex-1 h-8 text-sm border-[#C9A227]/30 focus:ring-[#C9A227] rounded-xl bg-white/50 dark:bg-black/30">
                                  <SelectValue placeholder="Assign Priest" />
                                </SelectTrigger>
                                <SelectContent>
                                  {priests?.map((p: any) => (
                                    <SelectItem key={p.id} value={p.id}>{p.full_name_three_parts}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {!member.repentance_deacon_id && (
                            <div className="flex items-center gap-2">
                              <Church className="h-4 w-4 text-[#C9A227] flex-shrink-0" />
                              <Select
                                onValueChange={(val) =>
                                  assignMutation.mutate({ memberId: member.id, role: "repentance_deacon_id", valueId: val })
                                }
                              >
                                <SelectTrigger className="flex-1 h-8 text-sm border-[#C9A227]/30 focus:ring-[#C9A227] rounded-xl bg-white/50 dark:bg-black/30">
                                  <SelectValue placeholder="Assign Deacon" />
                                </SelectTrigger>
                                <SelectContent>
                                  {deacons?.map((d: any) => (
                                    <SelectItem key={d.id} value={d.id}>{d.full_name_three_parts}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {!member.spiritual_father_id && (
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-[#C9A227] flex-shrink-0" />
                              <Select
                                onValueChange={(val) =>
                                  assignMutation.mutate({ memberId: member.id, role: "spiritual_father_id", valueId: val })
                                }
                              >
                                <SelectTrigger className="flex-1 h-8 text-sm border-[#C9A227]/30 focus:ring-[#C9A227] rounded-xl bg-white/50 dark:bg-black/30">
                                  <SelectValue placeholder="Assign Spiritual Father" />
                                </SelectTrigger>
                                <SelectContent>
                                  {maleCandidates.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.full_name_three_parts}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {!member.spiritual_mother_id && (
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-[#C9A227] flex-shrink-0" />
                              <Select
                                onValueChange={(val) =>
                                  assignMutation.mutate({ memberId: member.id, role: "spiritual_mother_id", valueId: val })
                                }
                              >
                                <SelectTrigger className="flex-1 h-8 text-sm border-[#C9A227]/30 focus:ring-[#C9A227] rounded-xl bg-white/50 dark:bg-black/30">
                                  <SelectValue placeholder="Assign Spiritual Mother" />
                                </SelectTrigger>
                                <SelectContent>
                                  {femaleCandidates.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.full_name_three_parts}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Assignment progress</span>
                            <span>{4 - missing.length} / 4</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] rounded-full transition-all duration-500"
                              style={{ width: `${((4 - missing.length) / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Assigned Tab – Modern Table with Avatars */}
          <TabsContent value="assigned" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/60 dark:bg-[#1C1C1F]/60 backdrop-blur-lg rounded-2xl p-5 border border-[#C9A227]/20 shadow-lg">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#C9A227]" />
                  <span className="text-sm font-medium text-foreground">Filter by</span>
                </div>
                <Select value={filterType} onValueChange={(v) => { setFilterType(v as any); setSelectedMentorId("all"); }}>
                  <SelectTrigger className="w-44 border-[#C9A227]/30 rounded-xl bg-white/50 dark:bg-black/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priest">🕊️ Repentance Father</SelectItem>
                    <SelectItem value="spiritual_father">👨 Spiritual Father</SelectItem>
                    <SelectItem value="spiritual_mother">👩 Spiritual Mother</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                  <SelectTrigger className="w-56 border-[#C9A227]/30 rounded-xl bg-white/50 dark:bg-black/30">
                    <SelectValue placeholder="All mentors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All {filterType === "priest" ? "Priests" : filterType === "spiritual_father" ? "Spiritual Fathers" : "Spiritual Mothers"}
                    </SelectItem>
                    {filterType === "priest" && priests?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.full_name_three_parts}</SelectItem>
                    ))}
                    {filterType === "spiritual_father" && maleCandidates.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name_three_parts}</SelectItem>
                    ))}
                    {filterType === "spiritual_mother" && femaleCandidates.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name_three_parts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedMentorId("all")}
                className="rounded-xl border-[#C9A227]/30 hover:bg-[#C9A227]/10"
              >
                <X className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>

            <div className="bg-white/70 dark:bg-[#1C1C1F]/70 backdrop-blur-xl rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#7A1C1C]/5 to-[#C9A227]/5 dark:from-[#D4AF37]/5 dark:to-transparent border-b border-[#ddd8d0] dark:border-[#2a2a2d]">
                      <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider text-[#7A1C1C] dark:text-[#D4AF37]">Member</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider text-[#7A1C1C] dark:text-[#D4AF37]">Service Class</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider text-[#7A1C1C] dark:text-[#D4AF37]">Repentance Father</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider text-[#7A1C1C] dark:text-[#D4AF37]">Deacon</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider text-[#7A1C1C] dark:text-[#D4AF37]">Spiritual Father</th>
                      <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider text-[#7A1C1C] dark:text-[#D4AF37]">Spiritual Mother</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Shield className="h-12 w-12 text-muted-foreground/30" />
                            <p className="font-medium">No members found for the selected filter</p>
                            <p className="text-sm">Try adjusting your filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      assignedMembers.map((member: any) => (
                        <tr key={member.id} className="border-b border-[#ddd8d0]/50 dark:border-[#2a2a2d]/50 hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-[#C9A227]/30">
                                <AvatarFallback className="bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] text-white text-xs font-bold">
                                  {getInitials(member.full_name_three_parts)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{member.full_name_three_parts}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <Badge variant="secondary" className="bg-[#C9A227]/10 text-[#C9A227] border-none">
                              {member.service_classes?.class_name_amharic || "—"}
                            </Badge>
                          </td>
                          <td className="py-4 px-5 text-foreground">{getMentorName(member.repentance_father_id)}</td>
                          <td className="py-4 px-5 text-foreground">{getMentorName(member.repentance_deacon_id)}</td>
                          <td className="py-4 px-5 text-foreground">{getMentorName(member.spiritual_father_id)}</td>
                          <td className="py-4 px-5 text-foreground">{getMentorName(member.spiritual_mother_id)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}