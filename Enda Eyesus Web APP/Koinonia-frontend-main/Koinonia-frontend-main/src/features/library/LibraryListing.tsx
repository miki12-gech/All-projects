"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Download,
  Heart,
  Eye,
  FileText,
  File,
  Image,
  FileArchive,
  Film,
  Music,
  Cross,
  BookOpen,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  Filter,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/api";
import DocumentViewer from "./DocumentViewer";
import { cn } from "@/lib/utils";

// ---------- Types ----------
interface LibraryItem {
  id: string;
  title: string;
  description?: string;
  drive_url: string;
  drive_file_id?: string;
  preview_url?: string;
  category: "SPIRITUAL" | "ACADEMIC" | "OTHER";
  academic_department?: string;
  academic_year?: number;
  course_id?: string;
  document_type?: "TEXTBOOK" | "PAST_EXAM";
  likes_count: number;
  downloads_count: number;
  is_link_broken: boolean;
  created_at: string;
}

type GroupByKey = "category" | "department" | "document_type" | "academic_year";

// ---------- Helpers ----------
function extractGoogleFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)\//,
    /open\?id=([a-zA-Z0-9_-]+)/,
    /\/document\/d\/([a-zA-Z0-9_-]+)\//,
    /\/presentation\/d\/([a-zA-Z0-9_-]+)\//,
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)\//,
    /\/forms\/d\/([a-zA-Z0-9_-]+)\//,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
}

function getFileTypeInfo(url: string): { label: string; icon: React.ReactElement; bgClass: string } {
  const lower = url.toLowerCase();
  if (lower.includes(".pdf")) return { label: "PDF", icon: <FileText className="w-8 h-8" />, bgClass: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" };
  if (lower.includes(".doc") || lower.includes(".docx")) return { label: "DOC", icon: <FileText className="w-8 h-8" />, bgClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" };
  if (lower.includes(".ppt") || lower.includes(".pptx") || lower.includes("presentation")) return { label: "PPT", icon: <FileText className="w-8 h-8" />, bgClass: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" };
  if (lower.includes(".xls") || lower.includes(".xlsx") || lower.includes("spreadsheet")) return { label: "XLS", icon: <FileText className="w-8 h-8" />, bgClass: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" };
  if (lower.includes(".jpg") || lower.includes(".jpeg") || lower.includes(".png") || lower.includes(".gif")) return { label: "IMAGE", icon: <Image className="w-8 h-8" />, bgClass: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" };
  if (lower.includes(".zip") || lower.includes(".rar") || lower.includes(".7z")) return { label: "ARCHIVE", icon: <FileArchive className="w-8 h-8" />, bgClass: "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300" };
  if (lower.includes(".mp4") || lower.includes(".mov") || lower.includes(".avi")) return { label: "VIDEO", icon: <Film className="w-8 h-8" />, bgClass: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" };
  if (lower.includes(".mp3") || lower.includes(".wav")) return { label: "AUDIO", icon: <Music className="w-8 h-8" />, bgClass: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300" };
  if (lower.includes("docs.google.com/document")) return { label: "GOOGLE DOC", icon: <FileText className="w-8 h-8" />, bgClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" };
  if (lower.includes("docs.google.com/presentation")) return { label: "GOOGLE SLIDES", icon: <FileText className="w-8 h-8" />, bgClass: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" };
  if (lower.includes("docs.google.com/spreadsheets")) return { label: "GOOGLE SHEETS", icon: <FileText className="w-8 h-8" />, bgClass: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" };
  if (lower.includes("docs.google.com/forms")) return { label: "GOOGLE FORM", icon: <FileText className="w-8 h-8" />, bgClass: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" };
  return { label: "FILE", icon: <File className="w-8 h-8" />, bgClass: "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300" };
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "SPIRITUAL": return <Cross className="w-5 h-5" />;
    case "ACADEMIC": return <BookOpen className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "SPIRITUAL": return "from-purple-500 to-purple-700 border-purple-300 dark:border-purple-700";
    case "ACADEMIC": return "from-blue-500 to-blue-700 border-blue-300 dark:border-blue-700";
    default: return "from-gray-500 to-gray-700 border-gray-300 dark:border-gray-700";
  }
}

// ---------- Main Component ----------
export default function LibraryListing({ initialCategory }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<{
    category?: string;
    search?: string;
    groupBy: GroupByKey;
  }>({
    category: initialCategory,
    groupBy: "category",
  });
  const [selectedPreview, setSelectedPreview] = useState<LibraryItem | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["library", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "ALL") params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      const response = await apiClient.instance.get(`/library?${params.toString()}`);
      return response.data.items;
    },
  });

  // Group items
  const groupedItems = useMemo(() => {
    if (!items) return {};
    const groupKey = filters.groupBy;
    const groups: Record<string, LibraryItem[]> = {};
    for (const item of items) {
      let key = "Uncategorized";
      if (groupKey === "category") key = item.category;
      else if (groupKey === "department") key = item.academic_department || "No Department";
      else if (groupKey === "document_type") key = item.document_type || "Other";
      else if (groupKey === "academic_year") key = item.academic_year ? `Year ${item.academic_year}` : "Unknown Year";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    // Sort groups by key
    const sortedKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b));
    const sortedGroups: Record<string, LibraryItem[]> = {};
    for (const k of sortedKeys) sortedGroups[k] = groups[k];
    return sortedGroups;
  }, [items, filters.groupBy]);

  // Initialize expanded state for all groups (expanded by default)
  useEffect(() => {
    if (Object.keys(groupedItems).length > 0) {
      const newState: Record<string, boolean> = {};
      for (const key of Object.keys(groupedItems)) {
        if (!(key in expandedGroups)) newState[key] = true;
      }
      if (Object.keys(newState).length > 0) {
        setExpandedGroups((prev) => ({ ...prev, ...newState }));
      }
    }
  }, [groupedItems]);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mutations (like, download)
  const likeMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.instance.post(`/library/${itemId}/like`, {}),
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: ["library"] });
      queryClient.setQueryData(["library", filters], (old: any) => {
        if (!old) return old;
        return old.map((it: any) => it.id === itemId ? { ...it, likes_count: it.likes_count + 1 } : it);
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const downloadMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.instance.post(`/library/${itemId}/download`, {}),
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: ["library"] });
      queryClient.setQueryData(["library", filters], (old: any) => {
        if (!old) return old;
        return old.map((it: any) => it.id === itemId ? { ...it, downloads_count: it.downloads_count + 1 } : it);
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const handleDownload = async (item: LibraryItem) => {
    await downloadMutation.mutateAsync(item.id);
    window.open(item.drive_url, "_blank");
  };

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  }, []);

  const handleTabChange = (tab: string) => {
    setFilters((prev) => ({ ...prev, category: tab === "ALL" ? undefined : tab }));
  };

  const handleGroupByChange = (value: GroupByKey) => {
    setFilters((prev) => ({ ...prev, groupBy: value }));
  };

  // Count total items
  const totalItems = items?.length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground mt-4">Loading library archives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center text-destructive">
        Failed to load resources. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Search and Category Tabs */}
      <div className="space-y-4 mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, description..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "SPIRITUAL", "ACADEMIC", "OTHER"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                (filters.category === undefined && tab === "ALL") || filters.category === tab
                  ? "bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] shadow-md"
                  : "bg-white/60 dark:bg-[#1C1C1F]/60 text-muted-foreground hover:bg-white/80 dark:hover:bg-[#252529]"
              }`}
            >
              {tab === "ALL" ? "All Resources" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Content */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <p className="text-muted-foreground text-lg">No resources found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([groupKey, groupItems]) => {
            const isExpanded = expandedGroups[groupKey] !== false;
            const count = groupItems.length;

            return (
              <div key={groupKey} className="bg-white/60 dark:bg-[#1C1C1F]/60 backdrop-blur-sm rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-sm overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#7A1C1C]/5 to-[#C9A227]/5 dark:from-[#D4AF37]/5 dark:to-transparent hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">{groupKey}</span>
                    <span className="text-xs text-muted-foreground bg-white/50 dark:bg-black/30 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{count} items</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Group Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groupItems.map((item) => {
                          const fileId = item.drive_file_id || extractGoogleFileId(item.drive_url);
                          const thumbnailUrl = fileId ? getThumbnailUrl(fileId) : null;
                          const hasImageError = imageErrors[item.id];
                          const fileTypeInfo = getFileTypeInfo(item.drive_url);
                          const categoryColor = getCategoryColor(item.category);

                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="group bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-sm rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/30"
                            >
                              {/* Thumbnail Area */}
                              {thumbnailUrl && !hasImageError ? (
                                <div className="relative w-full h-44 bg-muted overflow-hidden">
                                  <img
                                    src={thumbnailUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={() => setImageErrors((prev) => ({ ...prev, [item.id]: true }))}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              ) : (
                                <div className={`w-full h-44 flex flex-col items-center justify-center gap-2 ${fileTypeInfo.bgClass}`}>
                                  {fileTypeInfo.icon}
                                  <span className="text-xs font-bold uppercase tracking-wide">{fileTypeInfo.label}</span>
                                </div>
                              )}

                              {/* Category Badge on thumbnail */}
                              <div className="absolute top-3 left-3">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/90 dark:bg-black/90 text-${item.category.toLowerCase()}-700 shadow-sm border border-white/20`}>
                                  {item.category}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="p-4">
                                <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-[#C9A227] transition-colors">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                                )}
                                {item.academic_department && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                      {item.academic_department}
                                    </span>
                                    {item.academic_year && (
                                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                        Yr {item.academic_year}
                                      </span>
                                    )}
                                    {item.document_type && (
                                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                        {item.document_type.replace("_", " ")}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => likeMutation.mutate(item.id)}
                                      disabled={item.is_link_broken}
                                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition disabled:opacity-50"
                                    >
                                      <Heart className="w-4 h-4" />
                                      <span>{item.likes_count}</span>
                                    </button>
                                    <button
                                      onClick={() => setSelectedPreview(item)}
                                      disabled={item.is_link_broken}
                                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 transition disabled:opacity-50"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Preview</span>
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleDownload(item)}
                                    disabled={item.is_link_broken}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] text-xs font-medium hover:opacity-90 transition disabled:opacity-50"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedPreview && (
        <DocumentViewer
          url={selectedPreview.drive_url}
          title={selectedPreview.title}
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          isBroken={selectedPreview.is_link_broken}
        />
      )}
    </div>
  );
}