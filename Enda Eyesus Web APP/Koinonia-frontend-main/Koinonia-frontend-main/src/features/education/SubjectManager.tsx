"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "./educationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, ChevronDown, ChevronRight, BookOpen, FileText, Layers, Church, Sparkles, FolderOpen, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// Background (same as BatchList)
const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-linear-to-br from-[#F8F5F0]/90 via-[#FFF9F0]/70 to-[#EDE5D8]/90 dark:from-[#0E0E0F] dark:via-[#1A1816] dark:to-[#0A0A0B]" />
    <svg className="absolute inset-0 w-full h-full opacity-[0.05] dark:opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="crossGridSubject" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M50 15 L52 48 L85 50 L52 52 L50 85 L48 52 L15 50 L48 48 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A227]" />
          <circle cx="50" cy="50" r="4" fill="currentColor" className="text-[#7A1C1C]" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossGridSubject)" />
    </svg>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7A1C1C]/10 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
);

const phaseLabels: Record<string, { label: string; icon: any }> = {
  GUBAE_ABEW: { label: "ጉባኤ አበው", icon: Church },
  GUBAE_HAWARYAT: { label: "ጉባኤ ሐዋርያት", icon: Sparkles },
  GUBAE_ECCLESIAE: { label: "ጉባኤ ኤቅሌስያ", icon: GraduationCap },
};

export default function SubjectManager() {
  const queryClient = useQueryClient();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [openSubject, setOpenSubject] = useState(false);
  const [openLesson, setOpenLesson] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [subjectForm, setSubjectForm] = useState({ title: "", description: "", order: 0 });
  const [lessonForm, setLessonForm] = useState({ subjectId: "", title: "", content: "", order: 0 });
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const { data: batchesResp } = useQuery({
    queryKey: ["education", "batches"],
    queryFn: () => educationApi.listBatches(),
  });
  const batches = batchesResp?.data || [];

  const { data: subjectsResp, refetch } = useQuery({
    queryKey: ["education", "subjects", selectedBatch],
    queryFn: () => educationApi.getSubjectsWithLessons(selectedBatch),
    enabled: !!selectedBatch,
  });
  const subjects = subjectsResp?.data || [];

  const createSubject = useMutation({
    mutationFn: () => educationApi.createSubject({ ...subjectForm, batchId: selectedBatch, order: Number(subjectForm.order) }),
    onSuccess: () => { refetch(); setOpenSubject(false); resetSubjectForm(); },
  });
  const createLesson = useMutation({
    mutationFn: () => educationApi.createLesson(lessonForm),
    onSuccess: () => { refetch(); setOpenLesson(false); resetLessonForm(); },
  });

  const resetSubjectForm = () => setSubjectForm({ title: "", description: "", order: 0 });
  const resetLessonForm = () => setLessonForm({ subjectId: "", title: "", content: "", order: 0 });

  const selectedBatchMeta = batches.find((b: any) => b.id === selectedBatch);
  const selectedPhaseInfo = selectedBatchMeta ? phaseLabels[selectedBatchMeta.course_track] : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SacredBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
 <div className="text-center mb-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-[#C9A227]/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#C9A227]/30">
            <GraduationCap className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">ክፍሎች እና ትምህርቶች</span>
          </motion.div>
        </div>

        {/* Batch Selector + Add Subject */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex gap-4 items-center w-full sm:w-auto">
            <div className="w-80">
              <Select onValueChange={setSelectedBatch} value={selectedBatch}>
                <SelectTrigger className="bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-md border-[#C9A227]/40 shadow-sm">
                  <SelectValue placeholder="ዙር ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b: any) => (
                    <SelectItem key={b.id} value={b.id}>
                      {phaseLabels[b.course_track]?.label || b.course_track} - ዙር {b.batch_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBatch && selectedPhaseInfo && (
              <Badge variant="outline" className="border-[#C9A227] text-[#C9A227] gap-1">
                {(() => {
                  const IconComp = selectedPhaseInfo.icon;
                  return <IconComp className="h-3 w-3" />;
                })()}
                {selectedPhaseInfo.label}
              </Badge>
            )}
          </div>
          {selectedBatch && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOpenSubject(true)} className="px-5 py-2 bg-linear-to-r from-[#C9A227] to-[#B8911A] text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="h-4 w-4" /> አዲስ ክፍል
            </motion.button>
          )}
        </div>

        {/* Subjects Accordion */}
        {selectedBatch && subjects.length > 0 && (
          <div className="space-y-4">
            {subjects.map((subject: any, idx: number) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-white/70 dark:bg-[#1C1C1F]/70 backdrop-blur-md shadow-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors"
                  onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedSubject === subject.id ? <ChevronDown className="h-5 w-5 text-[#C9A227]" /> : <ChevronRight className="h-5 w-5 text-[#C9A227]" />}
                    <BookOpen className="h-5 w-5 text-[#7A1C1C] dark:text-[#D4AF37]" />
                    <span className="font-semibold text-lg text-foreground">{subject.title}</span>
                    <Badge variant="secondary" className="text-xs">ደረጃ {subject.order}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditingSubject(subject); setSubjectForm({ title: subject.title, description: subject.description || "", order: subject.order }); setOpenSubject(true); }} className="text-[#C9A227]">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <AnimatePresence>
                  {expandedSubject === subject.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden"
                    >
                      <div className="p-5">
                        {subject.description && <p className="text-muted-foreground mb-4 italic">“{subject.description}”</p>}
                        <div className="flex justify-end mb-4">
                          <Button size="sm" onClick={() => { setLessonForm({ ...lessonForm, subjectId: subject.id }); setOpenLesson(true); }} className="bg-[#C9A227] hover:bg-[#B8911A] text-white gap-1">
                            <Plus className="h-3 w-3" /> አዲስ ትምህርት
                          </Button>
                        </div>
                        <div className="rounded-xl border overflow-hidden">
                          <Table>
                            <TableHeader className="bg-[#F8F5F0] dark:bg-[#252529]">
                              <TableRow>
                                <TableHead>ትምህርት</TableHead>
                                <TableHead>ደረጃ</TableHead>
                                <TableHead>ድርጊት</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {subject.lessons.map((lesson: any) => (
                                <TableRow key={lesson.id} className="hover:bg-[#F8F5F0] dark:hover:bg-[#252529]">
                                  <TableCell>{lesson.title}</TableCell>
                                  <TableCell>{lesson.order}</TableCell>
                                  <TableCell><Button size="sm" variant="ghost" className="text-[#C9A227]"><Edit className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                              ))}
                              {subject.lessons.length === 0 && (
                                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">ምንም ትምህርት የለም</TableCell></TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
        {selectedBatch && subjects.length === 0 && (
          <div className="text-center py-24 bg-white/50 dark:bg-black/30 rounded-3xl backdrop-blur-md border border-dashed border-[#C9A227]/40">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground">ምንም ክፍል የለም</h3>
            <p className="text-muted-foreground mt-2">እባክዎ “አዲስ ክፍል” ቁልፍን በመጫን ይጀምሩ</p>
          </div>
        )}

        {/* Subject Dialog */}
        <Dialog open={openSubject} onOpenChange={setOpenSubject}>
          <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-[#1C1C1F]/95 backdrop-blur-xl border border-[#C9A227]/40 rounded-2xl">
            <DialogHeader><DialogTitle className="text-2xl text-[#7A1C1C] dark:text-[#D4AF37]">{editingSubject ? "ክፍል አርትዕ" : "አዲስ ክፍል"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="ርዕስ" value={subjectForm.title} onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })} />
              <Textarea placeholder="መግለጫ" value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} rows={3} />
              <Input type="number" placeholder="ቅደም ተከተል" value={subjectForm.order} onChange={(e) => setSubjectForm({ ...subjectForm, order: parseInt(e.target.value) })} />
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpenSubject(false)}>ሰርዝ</Button><Button onClick={() => createSubject.mutate()} className="bg-linear-to-r from-[#C9A227] to-[#B8911A] text-white">አስቀምጥ</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lesson Dialog */}
        <Dialog open={openLesson} onOpenChange={setOpenLesson}>
          <DialogContent className="sm:max-w-2xl bg-white/95 dark:bg-[#1C1C1F]/95 backdrop-blur-xl border border-[#C9A227]/40 rounded-2xl">
            <DialogHeader><DialogTitle className="text-2xl text-[#7A1C1C] dark:text-[#D4AF37]">አዲስ ትምህርት</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="ርዕስ" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
              <Textarea placeholder="ይዘት (HTML)" rows={8} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} className="font-mono" />
              <Input type="number" placeholder="ቅደም ተከተል" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) })} />
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setOpenLesson(false)}>ሰርዝ</Button><Button onClick={() => createLesson.mutate()} className="bg-linear-to-r from-[#C9A227] to-[#B8911A] text-white">አስቀምጥ</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}