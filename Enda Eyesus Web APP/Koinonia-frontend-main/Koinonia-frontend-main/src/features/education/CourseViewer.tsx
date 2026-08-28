"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseContent, Subject, Lesson } from "./courses";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Edit,
  Trash2,
  CheckCircle,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Circle,
  Menu,
  X,
  BookMarked
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

// ---------- Sacred Background ----------
const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[#F8F5F0]/90 via-[#FFF9F0]/70 to-[#EDE5D8]/90 dark:from-[#0E0E0F] dark:via-[#1A1816] dark:to-[#0A0A0B]" />
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.08]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="crossPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M50 15 L52 48 L85 50 L52 52 L50 85 L48 52 L15 50 L48 48 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[#C9A227]"
          />
          <circle cx="50" cy="50" r="4" fill="currentColor" className="text-[#7A1C1C]" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7A1C1C]/5 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
);

// ---------- Helper ----------
const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// ---------- Explanation Marker Inserter ----------
const insertExplanationMarkers = (
  container: HTMLElement,
  explanations: Array<{ id: string; quotedText: string; explanation: string }>
) => {
  if (!container || !explanations.length) return;
  
  const existingMarkers = container.querySelectorAll(".inline-explain-trigger");
  existingMarkers.forEach((marker) => {
    const parent = marker.parentNode;
    if (parent) {
      const text = document.createTextNode(marker.getAttribute("data-quoted") || "");
      parent.replaceChild(text, marker);
      parent.normalize();
    }
  });

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentNode;
    if (parent && parent instanceof Element && !parent.closest(".inline-explain-trigger")) {
      textNodes.push(node);
    }
  }

  for (const exp of explanations) {
    const quoted = exp.quotedText.trim();
    if (!quoted) continue;
    let replaced = false;
    for (const node of textNodes) {
      const text = node.textContent || "";
      const index = text.indexOf(quoted);
      if (index !== -1 && !replaced) {
        const parent = node.parentNode;
        if (!parent || !(parent instanceof Element)) continue;

        const before = text.slice(0, index);
        const match = text.slice(index, index + quoted.length);
        const after = text.slice(index + quoted.length);

        const matchSpan = document.createElement("span");
        matchSpan.className = "inline-explain-trigger cursor-pointer group relative inline-flex items-center transition-all duration-300 hover:bg-[#C9A227]/20 rounded px-1";
        matchSpan.style.borderBottom = "2px dotted #C9A227";
        matchSpan.style.backgroundColor = "rgba(201,162,39,0.08)";
        matchSpan.innerHTML = `${match}<span class="inline-explain-icon ml-1 text-[#C9A227] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">ⓘ</span>`;
        matchSpan.setAttribute("data-explanation", exp.explanation);
        matchSpan.setAttribute("data-quoted", quoted);
        matchSpan.setAttribute("data-id", exp.id);

        const beforeNode = before ? document.createTextNode(before) : null;
        const afterNode = after ? document.createTextNode(after) : null;

        if (beforeNode) parent.insertBefore(beforeNode, node);
        parent.insertBefore(matchSpan, node);
        if (afterNode) parent.insertBefore(afterNode, node);
        parent.removeChild(node);

        replaced = true;
        break;
      }
    }
  }
};

// ---------- Main Component ----------
export default function CourseViewer({
  phase,
  onSubjectComplete,
}: {
  phase: string;
  onSubjectComplete?: () => void;
}) {
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examResults, setExamResults] = useState<Record<string, { score: number; passed: boolean }>>({});
  const [selectedText, setSelectedText] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [explanationDialogOpen, setExplanationDialogOpen] = useState(false);
  const [newExplanation, setNewExplanation] = useState("");
  const [viewExplanation, setViewExplanation] = useState<{ id: string; quoted: string; explanation: string } | null>(null);
  const [editingExplanation, setEditingExplanation] = useState<{ id: string; quotedText: string; explanation: string } | null>(null);
  const [markerVersion, setMarkerVersion] = useState(0);
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const examContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const isManager = user?.system_role === "SERVICE_MANAGER" && user?.serviceClassName === "የትምህርት ክፍል";
  const queryClient = useQueryClient();

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [completedSubjects, setCompletedSubjects] = useState<string[]>([]);

  const content = getCourseContent(phase);
  if (!content) return <div className="text-center p-8 text-muted-foreground font-medium">Course content not available.</div>;
  const subjects: Subject[] = content.subjects;

  const [activeSubjectIndex, setActiveSubjectIndex] = useState<number>(0);
  const activeSubject = subjects[activeSubjectIndex] || null;

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSubjectIndex]);

  useEffect(() => {
    const saved = localStorage.getItem("completed_lessons");
    if (saved) {
      try { setCompletedLessons(JSON.parse(saved)); } catch {}
    }
    const savedSubj = localStorage.getItem("completed_subjects");
    if (savedSubj) {
      try { setCompletedSubjects(JSON.parse(savedSubj)); } catch {}
    }
  }, []);

  const saveCompletedLessons = (newVal: Record<string, boolean>) => {
    setCompletedLessons(newVal);
    localStorage.setItem("completed_lessons", JSON.stringify(newVal));
  };

  const saveCompletedSubjects = (newVal: string[]) => {
    setCompletedSubjects(newVal);
    localStorage.setItem("completed_subjects", JSON.stringify(newVal));
    if (onSubjectComplete) onSubjectComplete();
  };

  // ---------- TanStack Query for Explanations ----------
  const { data: explanationsMap, refetch: refetchExplanations } = useQuery({
    queryKey: ["course-explanations", phase],
    queryFn: async () => {
      const map: Record<string, any[]> = {};
      for (const subject of subjects) {
        for (const lesson of subject.lessons) {
          try {
            const res = await apiClient.instance.get(`/education/lessons/${lesson.id}/explanations`, {
              headers: getAuthHeaders(),
            });
            map[lesson.id] = res.data;
          } catch (e) {
            console.warn(`No explanations found for lesson ${lesson.id}`);
          }
        }
        if (subject.exam) {
          try {
            const examId = `exam_${subject.id}`;
            const res = await apiClient.instance.get(`/education/lessons/${examId}/explanations`, {
              headers: getAuthHeaders(),
            });
            map[examId] = res.data;
          } catch (e) {
             console.warn(`No explanations found for exam ${subject.id}`);
          }
        }
      }
      return map;
    },
    enabled: true,
    refetchOnWindowFocus: false, 
  });

  useLayoutEffect(() => {
    if (!explanationsMap) return;
    const timer = setTimeout(() => {
      for (const [lessonId, explanations] of Object.entries(explanationsMap)) {
        const container = contentRefs.current.get(lessonId);
        if (container && explanations.length) insertExplanationMarkers(container, explanations);
      }
      for (const [examId, explanations] of Object.entries(explanationsMap)) {
        if (examId.startsWith("exam_")) {
          const container = examContainerRefs.current.get(examId);
          if (container && explanations.length) insertExplanationMarkers(container, explanations);
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [explanationsMap, markerVersion, activeSubjectIndex]);

  useEffect(() => {
    const handleMarkerClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      while (target && !target.classList?.contains("inline-explain-trigger")) {
        target = target.parentElement as HTMLElement;
      }
      if (target && target.classList.contains("inline-explain-trigger")) {
        const id = target.getAttribute("data-id");
        const explanation = target.getAttribute("data-explanation");
        const quoted = target.getAttribute("data-quoted") || "";
        if (id && explanation) setViewExplanation({ id, quoted, explanation });
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("click", handleMarkerClick);
    return () => document.removeEventListener("click", handleMarkerClick);
  }, []);

  // ---------- Robust CRUD Mutations ----------
  const addExplanationMutation = useMutation({
    mutationFn: async ({ lessonId, quotedText, explanation }: { lessonId: string; quotedText: string; explanation: string; }) => {
      const res = await apiClient.instance.post(
        `/education/lessons/${lessonId}/explanations`,
        { quotedText, explanation },
        { headers: getAuthHeaders() }
      );
      return res.data;
    },
    onSuccess: async () => {
      toast.success("✅ Explanation successfully saved");
      setExplanationDialogOpen(false);
      setNewExplanation("");
      await queryClient.invalidateQueries({ queryKey: ["course-explanations", phase] });
      await refetchExplanations();
      setMarkerVersion((prev) => prev + 1);
    },
    onError: (err: any) => {
      console.error("Add Explanation Error:", err);
      toast.error(err.response?.data?.error || "Failed to save explanation to server. Check logs.");
    },
  });

  const updateExplanationMutation = useMutation({
    mutationFn: async ({ id, quotedText, explanation }: { id: string; quotedText: string; explanation: string; }) => {
      const res = await apiClient.instance.patch(
        `/education/explanations/${id}`,
        { quotedText, explanation },
        { headers: getAuthHeaders() }
      );
      return res.data;
    },
    onSuccess: async () => {
      toast.success("✅ Explanation successfully updated");
      setEditingExplanation(null);
      setViewExplanation(null);
      await queryClient.invalidateQueries({ queryKey: ["course-explanations", phase] });
      await refetchExplanations();
      setMarkerVersion((prev) => prev + 1);
    },
    onError: (err: any) => {
      console.error("Update Explanation Error:", err);
      toast.error(err.response?.data?.error || "Failed to update explanation. Check logs.");
    },
  });

  const deleteExplanationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.instance.delete(`/education/explanations/${id}`, { headers: getAuthHeaders() });
    },
    onSuccess: async () => {
      toast.success("🗑️ Explanation deleted permanently");
      setViewExplanation(null);
      await queryClient.invalidateQueries({ queryKey: ["course-explanations", phase] });
      await refetchExplanations();
      setMarkerVersion((prev) => prev + 1);
    },
    onError: (err: any) => {
       console.error("Delete Explanation Error:", err);
       toast.error(err.response?.data?.error || "Failed to delete explanation. Check logs.");
    },
  });

  // ---------- Completion Logic ----------
  const tryCompleteSubject = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;
    const allLessonsDone = subject.lessons.every((l) => completedLessons[`${subjectId}_${l.id}`]);
    const examPassed = examResults[subjectId]?.passed || false;
    const hasExam = !!subject.exam;

    if (allLessonsDone && (!hasExam || examPassed)) {
      if (!completedSubjects.includes(subjectId)) {
        const newList = [...completedSubjects, subjectId];
        saveCompletedSubjects(newList);
        toast.success(`🎉 ትምህርቱን አጠናቀቅክ: ${subject.title}`);
      }
    }
  };

  const handleTextSelection = (targetId: string) => {
    if (!isManager) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selected = selection.toString().trim();
    if (!selected) return;
    setSelectedText(selected);
    setSelectedLessonId(targetId);
    setExplanationDialogOpen(true);
    selection.removeAllRanges();
  };

  const handleExamSubmit = (subjectId: string, questions: any[]) => {
    let totalPoints = 0, earned = 0;
    for (const q of questions) {
      const pts = q.points || 1;
      totalPoints += pts;
      if (examAnswers[q.id] === q.correctAnswer) earned += pts;
    }
    const score = (earned / totalPoints) * 100;
    const passed = score >= 70;
    setExamResults((prev) => ({ ...prev, [subjectId]: { score, passed } }));
    toast.success(passed ? `Passed! ${score.toFixed(1)}%` : `Failed, try again.`);
    if (passed) tryCompleteSubject(subjectId);
  };

  const markLessonComplete = (subjectId: string, lessonId: string) => {
    const key = `${subjectId}_${lessonId}`;
    saveCompletedLessons({ ...completedLessons, [key]: true });
    tryCompleteSubject(subjectId);
  };

  const isLessonComplete = (subjectId: string, lessonId: string) => !!completedLessons[`${subjectId}_${lessonId}`];
  const isSubjectComplete = (subjectId: string) => completedSubjects.includes(subjectId);

  const goToPrevious = () => { if (activeSubjectIndex > 0) setActiveSubjectIndex(activeSubjectIndex - 1); };
  const goToNext = () => { if (activeSubjectIndex < subjects.length - 1) setActiveSubjectIndex(activeSubjectIndex + 1); };

  // ---------- Render ----------
  return (
    <div className="relative min-h-screen w-full flex font-sans text-foreground overflow-hidden">
      <SacredBackground />

      {/* Sidebar Toggle Button – fixed, vertically centered, on the left edge */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 left-0 z-40 p-2 rounded-r-xl bg-white/90 dark:bg-[#1C1C1F]/90 backdrop-blur-md shadow-lg border border-l-0 border-[#C9A227]/30 text-[#7A1C1C] dark:text-[#D4AF37] hover:scale-105 transition-all duration-300 hover:shadow-[#C9A227]/20 group",
          isSidebarOpen ? "opacity-0 pointer-events-none translate-x-[-120%]" : "opacity-100 translate-x-0"
        )}
      >
        <div className="flex flex-col items-center gap-0.5">
          <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100">Menu</span>
        </div>
      </button>

      {/* Dark Overlay Backdrop */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar – slides from left, attached to the button */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col bg-white/95 dark:bg-[#131315]/95 backdrop-blur-2xl border-r border-[#C9A227]/20 shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#C9A227]/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] rounded-xl shadow-inner text-white">
               <BookMarked className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-white">
              Course Menu
            </h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar inside Sidebar */}
        <div className="px-6 py-4">
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round((subjects.filter(s => isSubjectComplete(s.id)).length / subjects.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#e5e0d8] dark:bg-[#2a2a2d] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] transition-all duration-1000 ease-out"
              style={{ width: `${((subjects.filter(s => isSubjectComplete(s.id)).length) / subjects.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Subjects List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-2">
          {subjects.map((subject, index) => {
            const isActive = index === activeSubjectIndex;
            const isComplete = isSubjectComplete(subject.id);
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setActiveSubjectIndex(index);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full text-left group flex items-start gap-3 p-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-r from-[#7A1C1C]/10 to-transparent dark:from-[#C9A227]/20 border border-[#7A1C1C]/20 dark:border-[#C9A227]/30 shadow-sm" 
                    : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shadow-emerald-500/50 drop-shadow-md" />
                  ) : isActive ? (
                    <Circle className="w-5 h-5 text-[#C9A227] animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                    Subject {index + 1}
                  </span>
                  <span className={cn(
                    "text-sm font-medium leading-tight truncate",
                    isActive ? "text-[#7A1C1C] dark:text-[#D4AF37]" : "text-foreground group-hover:text-foreground/80"
                  )}>
                    {subject.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content – minimal padding, full width */}
      <div className="relative z-10 flex-1 h-screen overflow-y-auto scroll-smooth">
        <div ref={mainContentRef} className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
          {activeSubject ? (
            <>
              {/* Header */}
              <div className="mb-6">
                 <Badge variant="outline" className="mb-3 bg-white/50 dark:bg-black/50 border-[#C9A227]/50 text-[#C9A227] px-3 py-1 text-xs tracking-widest uppercase shadow-sm">
                   Phase: {phase.replace("_", " ")}
                 </Badge>
                 <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-white pb-1">
                   {activeSubject.title}
                 </h1>
              </div>

              {/* Lessons */}
              <div className="space-y-6">
                {activeSubject.lessons.map((lesson) => {
                  const complete = isLessonComplete(activeSubject.id, lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className="group bg-white/80 dark:bg-[#1C1C1F]/90 backdrop-blur-xl rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6 border-b border-black/10 dark:border-white/10 pb-4">
                          <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                            <span className="p-2 bg-[#C9A227]/10 text-[#C9A227] rounded-lg">
                              <BookOpen className="w-5 h-5" />
                            </span>
                            {lesson.title}
                          </h3>
                          {complete && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 shadow-inner">
                              <CheckCircle className="w-4 h-4 mr-1.5" /> ተጠናቋል
                            </Badge>
                          )}
                        </div>
                        <div
                          ref={(el) => { if (el) contentRefs.current.set(lesson.id, el); }}
                          className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed marker:text-[#C9A227]"
                          dangerouslySetInnerHTML={{ __html: lesson.content }}
                          onMouseUp={() => handleTextSelection(lesson.id)}
                        />
                        
                        {!complete && !isSubjectComplete(activeSubject.id) && (
                          <div className="mt-8 pt-4">
                            <Button
                              onClick={() => markLessonComplete(activeSubject.id, lesson.id)}
                              className="w-full sm:w-auto bg-[#1C1C1F] hover:bg-[#2a2a2d] dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white rounded-xl shadow-lg transition-transform active:scale-95"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> ትምህርቱን አጠናቅቄአለሁ
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Exam Section */}
              {activeSubject.exam && (
                <div
                  ref={(el) => { if (el) examContainerRefs.current.set(`exam_${activeSubject.id}`, el); }}
                  className="relative bg-gradient-to-br from-[#7A1C1C]/10 to-[#C9A227]/10 dark:from-[#C9A227]/10 dark:to-transparent backdrop-blur-xl rounded-3xl border border-[#C9A227]/30 p-6 md:p-10 shadow-2xl overflow-hidden mt-12"
                  onMouseUp={() => handleTextSelection(`exam_${activeSubject.id}`)}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Award className="w-32 h-32 text-[#C9A227]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#7A1C1C] dark:text-[#D4AF37] mb-8 flex items-center gap-3 relative z-10">
                    <div className="p-2 bg-[#7A1C1C] dark:bg-[#C9A227] text-white dark:text-black rounded-lg shadow-lg">
                      <Award className="w-6 h-6" />
                    </div>
                    ፈተና ማጠቃለያ
                  </h3>
                  
                  {!examResults[activeSubject.id]?.passed ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleExamSubmit(activeSubject.id, activeSubject.exam!.questions);
                      }}
                      className="relative z-10 space-y-6"
                    >
                      {activeSubject.exam.questions.map((q: any, idx: number) => (
                        <div key={q.id} className="p-6 bg-white/80 dark:bg-black/40 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm backdrop-blur-md">
                          <p className="font-semibold text-lg mb-4 text-foreground">
                            {idx + 1}. {q.text}
                          </p>
                          <RadioGroup
                            onValueChange={(val) => setExamAnswers({ ...examAnswers, [q.id]: val })}
                            className="space-y-3"
                          >
                            {q.options.map((opt: string) => (
                              <div key={opt} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent has-[[data-state=checked]]:border-[#C9A227]/50 has-[[data-state=checked]]:bg-[#C9A227]/10">
                                <RadioGroupItem value={opt} id={`${q.id}-${opt}`} className="text-[#C9A227] border-[#C9A227]" />
                                <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer flex-1 font-medium text-foreground">{opt}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                      <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] hover:opacity-90 text-white border-0 shadow-xl shadow-[#7A1C1C]/20 rounded-xl font-bold text-lg mt-8 transition-transform active:scale-[0.98]">
                        Submit Examination
                      </Button>
                    </form>
                  ) : (
                    <div className="relative z-10 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-inner flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Outstanding! Passed.</h4>
                        <p className="font-medium opacity-80">Score: {examResults[activeSubject.id].score.toFixed(1)}%</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-16 pt-8 border-t border-black/10 dark:border-white/10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={goToPrevious}
                  disabled={activeSubjectIndex === 0}
                  className="rounded-xl border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> ቀዳሚ
                </Button>

                <div className="flex items-center gap-4">
                  {isSubjectComplete(activeSubject.id) && (
                    <span className="hidden sm:flex px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-semibold items-center gap-2 border border-emerald-500/20">
                      <CheckCircle className="w-4 h-4" /> ተጠናቋል
                    </span>
                  )}
                  <Button
                    size="lg"
                    onClick={goToNext}
                    disabled={activeSubjectIndex >= subjects.length - 1}
                    className="rounded-xl bg-[#C9A227] hover:bg-[#B8911A] text-white shadow-lg shadow-[#C9A227]/20 border-0 gap-2 disabled:opacity-50 transition-transform active:scale-95"
                  >
                    ቀጣይ <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <BookMarked className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-xl font-medium text-muted-foreground">No subjects available.</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Dialogs (same as before, but with dark mode fixes) ===== */}
      <Dialog open={explanationDialogOpen} onOpenChange={setExplanationDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-[#131315]/95 backdrop-blur-3xl border border-[#C9A227]/30 rounded-[2rem] shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37]">
              <div className="p-2 bg-[#C9A227]/10 rounded-lg"><HelpCircle className="w-5 h-5 text-[#C9A227]" /></div>
              Add Knowledge Note
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Referenced Text</label>
              <div className="p-4 bg-black/5 dark:bg-white/10 rounded-xl text-foreground font-medium italic border-l-4 border-[#C9A227]">
                “{selectedText}”
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Manager Explanation</label>
              <Textarea
                rows={5}
                className="rounded-xl border-black/10 dark:border-white/10 focus-visible:ring-[#C9A227] resize-none bg-white/50 dark:bg-black/50 text-foreground"
                placeholder="Type your deep explanation here..."
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 bg-black/5 dark:bg-white/5">
            <Button variant="ghost" className="rounded-xl" onClick={() => setExplanationDialogOpen(false)}>Cancel</Button>
            <Button
              className="rounded-xl bg-[#C9A227] hover:bg-[#B8911A] text-white shadow-md transition-all active:scale-95"
              onClick={() => addExplanationMutation.mutate({ lessonId: selectedLessonId, quotedText: selectedText, explanation: newExplanation })}
              disabled={!newExplanation.trim() || addExplanationMutation.isPending}
            >
              {addExplanationMutation.isPending ? "Saving to Server..." : "Publish Explanation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewExplanation} onOpenChange={(open) => { if (!open) { setViewExplanation(null); setMarkerVersion((p) => p + 1); }}}>
        <DialogContent className="sm:max-w-2xl w-[95vw] bg-white/95 dark:bg-[#1C1C1F]/95 backdrop-blur-3xl border border-[#C9A227]/30 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-black/5 dark:border-white/5 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-foreground">
              <span className="p-2 bg-[#C9A227]/10 rounded-xl text-[#C9A227]"><BookOpen className="w-5 h-5" /></span>
              Manager Context
            </DialogTitle>
            {isManager && viewExplanation && (
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="rounded-xl border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 h-9 w-9" onClick={() => { setEditingExplanation({ id: viewExplanation.id, quotedText: viewExplanation.quoted, explanation: viewExplanation.explanation }); setViewExplanation(null); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white h-9 w-9 transition-colors" onClick={() => { if (confirm("Delete this explanation permanently from the server?")) { deleteExplanationMutation.mutate(viewExplanation.id); } }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </DialogHeader>
          <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
            <div className="p-5 bg-white/50 dark:bg-black/50 rounded-2xl border border-[#C9A227]/20 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C9A227]"></div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Original Text</p>
              <p className="text-foreground text-lg font-medium leading-relaxed">“{viewExplanation?.quoted}”</p>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
              <div dangerouslySetInnerHTML={{ __html: viewExplanation?.explanation || "" }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingExplanation} onOpenChange={() => setEditingExplanation(null)}>
        <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-[#131315]/95 backdrop-blur-3xl border border-[#C9A227]/30 rounded-4xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Edit Knowledge Note</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Referenced Text</label>
              <Input
                className="rounded-xl border-black/10 dark:border-white/10 focus-visible:ring-[#C9A227] text-foreground bg-white/50 dark:bg-black/50"
                value={editingExplanation?.quotedText || ""}
                onChange={(e) => setEditingExplanation((prev) => (prev ? { ...prev, quotedText: e.target.value } : null))}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Explanation</label>
              <Textarea
                rows={5}
                className="rounded-xl border-black/10 dark:border-white/10 focus-visible:ring-[#C9A227] resize-none bg-white/50 dark:bg-black/50 text-foreground"
                value={editingExplanation?.explanation || ""}
                onChange={(e) => setEditingExplanation((prev) => (prev ? { ...prev, explanation: e.target.value } : null))}
              />
            </div>
          </div>
          <DialogFooter className="p-6 pt-2 bg-black/5 dark:bg-white/5">
            <Button variant="ghost" className="rounded-xl" onClick={() => setEditingExplanation(null)}>Cancel</Button>
            <Button
              className="rounded-xl bg-[#C9A227] hover:bg-[#B8911A] text-white shadow-md transition-all active:scale-95"
              onClick={() => editingExplanation && updateExplanationMutation.mutate({ id: editingExplanation.id, quotedText: editingExplanation.quotedText, explanation: editingExplanation.explanation })}
              disabled={!editingExplanation?.quotedText || !editingExplanation?.explanation || updateExplanationMutation.isPending}
            >
              {updateExplanationMutation.isPending ? "Updating Server..." : "Update Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}