"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi, useEducationManager } from "./educationApi";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Calendar, Users, Church, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Animated Sacred Background ----------
const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-linear-to-br from-[#F8F5F0]/80 via-[#FFF9F0]/60 to-[#EDE5D8]/80 dark:from-[#0E0E0F] dark:via-[#1A1816] dark:to-[#0A0A0B]" />
    <svg className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="crossGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M60 20 L62 58 L100 60 L62 62 L60 100 L58 62 L20 60 L58 58 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C9A227]" />
          <circle cx="60" cy="60" r="5" fill="currentColor" className="text-[#7A1C1C]" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossGrid)" />
    </svg>
    <div className="absolute top-0 -left-64 w-96 h-96 bg-[#C9A227]/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 -right-64 w-96 h-96 bg-[#7A1C1C]/20 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
);

const phases = [
  { value: "GUBAE_ABEW", label: "ጉባኤ አበው", icon: Church, color: "from-amber-500 to-amber-700" },
  { value: "GUBAE_HAWARYAT", label: "ጉባኤ ሐዋርያት", icon: Sparkles, color: "from-yellow-500 to-amber-600" },
  { value: "GUBAE_ECCLESIAE", label: "ጉባኤ ኤቅሌስያ", icon: Church, color: "from-amber-600 to-orange-700" },
];

export default function BatchList() {
  const isManager = useEducationManager();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ course_track: "", batch_number: "", academic_year: "" });

  const { data: batchesResp } = useQuery({
    queryKey: ["education", "batches"],
    queryFn: () => educationApi.listBatches(),
  });
  const batches = batchesResp?.data || [];

  const createMutation = useMutation({
    mutationFn: () =>
      educationApi.createBatch({
        course_track: form.course_track,
        batch_number: parseInt(form.batch_number),
        academic_year: parseInt(form.academic_year),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", "batches"] });
      setOpen(false);
      setForm({ course_track: "", batch_number: "", academic_year: "" });
    },
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SacredBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#C9A227]/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#C9A227]/30"
          >
            <Layers className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">የትምህርት ዙሮች አስተዳደር</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-[#7A1C1C] dark:text-[#D4AF37] tracking-tight"
          >
            ዙሮችን ያስተዳድሩ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            ለእያንዳንዱ የጉባኤ ደረጃ ዙሮችን ይፍጠሩ፣ ያረጋግጡ እና የተማሪዎችን ምዝገባ ይከታተሉ
          </motion.p>
        </div>

        {/* Create Button */}
        {isManager && (
          <div className="flex justify-end mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(true)}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#C9A227] to-[#B8911A] rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
              አዲስ ዙር ፍጠር
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </motion.button>
          </div>
        )}

        {/* Batches Grid */}
        {batches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white/50 dark:bg-black/30 rounded-3xl backdrop-blur-md border border-dashed border-[#C9A227]/40"
          >
            <Layers className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold text-foreground">ምንም ዙር አልተፈጠረም</h3>
            <p className="text-muted-foreground mt-2">“አዲስ ዙር ፍጠር” በማለት ይጀምሩ</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {batches.map((batch: any, idx: number) => {
              const phase = phases.find(p => p.value === batch.course_track) || phases[0];
              const PhaseIcon = phase.icon;
              return (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-lg border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {/* Glowing gradient border on hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-[#C9A227]/0 via-[#C9A227]/0 to-[#C9A227]/0 group-hover:from-[#C9A227]/20 group-hover:via-[#C9A227]/10 group-hover:to-transparent transition-all duration-500" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-linear-to-br from-[#7A1C1C]/10 to-[#C9A227]/10">
                        <PhaseIcon className="h-8 w-8 text-[#C9A227]" />
                      </div>
                      <Badge variant="outline" className="border-[#C9A227] text-[#C9A227] text-xs">
                        Batch #{batch.batch_number}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">{phase.label}</h3>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{batch.academic_year} ዓ.ም.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{batch._count?.lms_enrollments ?? 0} ተማሪዎች</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 border-t border-[#ddd8d0] dark:border-[#2a2a2d] bg-linear-to-r from-transparent to-[#C9A227]/5 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">የተፈጠረ {new Date(batch.created_at).toLocaleDateString()}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-white/95 dark:bg-[#1C1C1F]/95 backdrop-blur-xl border border-[#C9A227]/40 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl text-[#7A1C1C] dark:text-[#D4AF37]">
                <Plus className="h-6 w-6" /> አዲስ ዙር ፍጠር
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">ደረጃ</label>
                <Select onValueChange={(v) => setForm({ ...form, course_track: v })}>
                  <SelectTrigger className="border-[#C9A227]/40">
                    <SelectValue placeholder="ይምረጡ" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">ዙር ቁጥር</label>
                <Input type="number" placeholder="ለምሳሌ: 1" onChange={(e) => setForm({ ...form, batch_number: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">አካዳሚክ ዘመን</label>
                <Input type="number" placeholder="ለምሳሌ: 2024" onChange={(e) => setForm({ ...form, academic_year: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>ሰርዝ</Button>
              <Button onClick={() => createMutation.mutate()} className="bg-linear-to-r from-[#C9A227] to-[#B8911A] text-white hover:shadow-lg transition-all">ፍጠር</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}