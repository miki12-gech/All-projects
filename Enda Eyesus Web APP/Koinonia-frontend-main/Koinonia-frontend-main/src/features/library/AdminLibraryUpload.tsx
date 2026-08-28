//src/features/library/AdminLibraryUploads.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UploadCloud } from "lucide-react";
import apiClient from "@/api";

// ... (Keep existing interface and validation functions exactly the same)
interface LibraryItemForm {
  title: string; description: string; drive_url: string; category: "SPIRITUAL" | "ACADEMIC" | "OTHER";
  academic_department?: string; academic_year?: number; course_id?: string; document_type?: "TEXTBOOK" | "PAST_EXAM";
}

export default function AdminLibraryUpload({ onSuccess }: { onSuccess?: () => void }) {
  // ... (Keep state, mutation, and validation logic unchanged)
  const [formData, setFormData] = useState<LibraryItemForm>({
    title: "", description: "", drive_url: "", category: "SPIRITUAL", academic_department: "",
    academic_year: undefined, course_id: "", document_type: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: LibraryItemForm) => apiClient.instance.post("/library", data),
    onSuccess: () => {
      setFormData({ title: "", description: "", drive_url: "", category: "SPIRITUAL", academic_department: "", academic_year: undefined, course_id: "", document_type: undefined });
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => setErrors({ submit: error.response?.data?.message || "Failed to engrave item" }),
  });

  const isValidDriveUrl = (url: string): boolean => {
    const pattern = /^(https?:\/\/)?(drive\.google\.com\/file\/d\/|docs\.google\.com\/(document|presentation|spreadsheets|forms)\/d\/)([a-zA-Z0-9_-]+)\/(?:edit|view|preview|viewform)(?:\?.*)?$/;
    return pattern.test(url);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.drive_url.trim()) newErrors.drive_url = "Source URL is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!isValidDriveUrl(formData.drive_url)) newErrors.drive_url = "Invalid Source URI";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) createMutation.mutate(formData);
  };

  const updateField = (field: keyof LibraryItemForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden">
      <div className="px-8 py-6 border-b border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#faf8f5]/50 dark:bg-[#0E0E0F]/50 flex items-center gap-3">
        <UploadCloud className="w-6 h-6 text-[#C9A227]" />
        <h2 className="text-xl font-serif font-bold text-[#1a1a1a] dark:text-gray-100 tracking-wide">Deposit New Resource</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {errors.submit && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            {errors.submit}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Attributes */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Title *</label>
              <input value={formData.title} onChange={(e) => updateField("title", e.target.value)}
                className={`w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0E0E0F] border ${errors.title ? 'border-red-400 focus:ring-red-500' : 'border-[#ddd8d0] dark:border-[#2a2a2d] focus:ring-[#C9A227]/50 focus:border-[#C9A227]'} rounded-xl transition-all outline-none text-gray-900 dark:text-gray-100`} />
              {errors.title && <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Source URL *</label>
              <input type="url" value={formData.drive_url} onChange={(e) => updateField("drive_url", e.target.value)}
                placeholder="Google Drive / Docs Link"
                className={`w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0E0E0F] border ${errors.drive_url ? 'border-red-400 focus:ring-red-500' : 'border-[#ddd8d0] dark:border-[#2a2a2d] focus:ring-[#C9A227]/50 focus:border-[#C9A227]'} rounded-xl transition-all outline-none text-gray-900 dark:text-gray-100`} />
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-2">Supports Drive, Docs, Sheets, Slides, Forms</p>
              {errors.drive_url && <p className="text-xs text-red-500 mt-1.5">{errors.drive_url}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Classification *</label>
              <div className="relative">
                <select value={formData.category} onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0E0E0F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] transition-all outline-none appearance-none text-gray-900 dark:text-gray-100 font-medium">
                  <option value="SPIRITUAL">Spiritual (መንፈሳዊ)</option>
                  <option value="ACADEMIC">Academic (አካዳሚክ)</option>
                  <option value="OTHER">Others (ሌሎች)</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">▼</div>
              </div>
            </div>
          </div>

          {/* Secondary & Conditional Attributes */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Description / Notes</label>
              <textarea rows={5} value={formData.description} onChange={(e) => updateField("description", e.target.value)}
                className="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0E0E0F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] transition-all outline-none text-gray-900 dark:text-gray-100 resize-none" />
            </div>

            <AnimatePresence>
              {formData.category === "ACADEMIC" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 p-5 bg-[#faf8f5] dark:bg-[#0E0E0F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl">
                    <input placeholder="Department" value={formData.academic_department || ""} onChange={(e) => updateField("academic_department", e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg text-sm outline-none focus:border-[#C9A227] text-gray-900 dark:text-gray-100" />
                    <input type="number" placeholder="Academic Year" value={formData.academic_year || ""} onChange={(e) => updateField("academic_year", e.target.value ? parseInt(e.target.value) : undefined)}
                      className="px-4 py-2.5 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg text-sm outline-none focus:border-[#C9A227] text-gray-900 dark:text-gray-100" />
                    <input placeholder="Course ID (e.g., CS101)" value={formData.course_id || ""} onChange={(e) => updateField("course_id", e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg text-sm outline-none focus:border-[#C9A227] text-gray-900 dark:text-gray-100" />
                    <select value={formData.document_type || ""} onChange={(e) => updateField("document_type", e.target.value === "" ? undefined : e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg text-sm outline-none focus:border-[#C9A227] text-gray-900 dark:text-gray-100">
                      <option value="">Doc Type</option>
                      <option value="TEXTBOOK">Textbook</option>
                      <option value="PAST_EXAM">Past Exam</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-6 border-t border-[#ddd8d0] dark:border-[#2a2a2d] flex justify-end">
          <button type="submit" disabled={createMutation.isPending}
            className="px-8 py-3.5 bg-gradient-to-r from-[#7A1C1C] to-[#992626] hover:from-[#5e1515] hover:to-[#7A1C1C] text-white rounded-xl font-medium tracking-wide shadow-lg shadow-[#7A1C1C]/20 transition-all disabled:opacity-50 flex items-center gap-2">
            {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
            {createMutation.isPending ? "Engraving..." : "Commit to Archive"}
          </button>
        </div>
      </form>
    </div>
  );
}