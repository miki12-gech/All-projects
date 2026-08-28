"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi, useMemberAffairsClassId } from "./memberAffairsApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  ThumbsUp,
  Star,
  Reply,
  Send,
  RefreshCw,
  Edit,
  FileText,
  Calendar,
  Layers,
  User,
  CornerDownRight,
} from "lucide-react";

const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#F3EFE7] dark:from-[#09090B] dark:via-[#121110] dark:to-[#0F0E0D]" />
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="crossPattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 10 L41.5 37 L68 40 L41.5 43 L40 70 L38.5 43 L12 40 L38.5 37 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-[#C9A227]"
          />
          <circle
            cx="40"
            cy="40"
            r="3"
            fill="currentColor"
            className="text-[#7A1C1C]"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#7A1C1C]/5 rounded-full blur-[140px] animate-pulse delay-1000" />
  </div>
);

const isValidDriveUrl = (url: string) =>
  /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\//.test(url) ||
  /^https:\/\/docs\.google\.com\/(document|presentation|spreadsheets|forms)\/d\//.test(
    url,
  );

export default function PlanReportMatrix() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const userClassId = useMemberAffairsClassId();
  const userRole: string = user?.system_role || user?.role || "";
  const isChairman = userRole === "SECRETARIAT_CHAIRMAN";
  const isSecretariat = [
    "SECRETARIAT_CHAIRMAN",
    "SECRETARIAT_VICE",
    "SECRETARIAT_SECRETARY",
    "SUPER_ADMIN",
  ].includes(userRole);
  const isServiceManager = userRole === "SERVICE_MANAGER";

  const { data: serviceClassesData } = useQuery({
    queryKey: ["service-classes"],
    queryFn: () => memberAffairsApi.getServiceClasses(),
    enabled: !isSecretariat && !userClassId,
  });
  const serviceClasses = serviceClassesData?.data || [];

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState<"PLAN" | "REPORT">("PLAN");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [quarter, setQuarter] = useState("");

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDriveUrl, setEditDriveUrl] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // ---------- Fetch documents ----------
  const fetchDocuments = async (type: "PLAN" | "REPORT") => {
    if (isSecretariat) {
      const res = await memberAffairsApi.getSecretariatDocuments(type);
      return res.data;
    } else {
      const classId = userClassId || selectedClassId;
      if (!classId) return [];
      const res = await memberAffairsApi.getDocuments(classId, type);
      return res.data;
    }
  };

  const { data: plans, refetch: refetchPlans } = useQuery({
    queryKey: [
      "member-affairs",
      "documents",
      "PLAN",
      isSecretariat ? "secretariat" : userClassId || selectedClassId,
    ],
    enabled: true,
    staleTime: 2000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchDocuments("PLAN"),
  });

  const { data: reports, refetch: refetchReports } = useQuery({
    queryKey: [
      "member-affairs",
      "documents",
      "REPORT",
      isSecretariat ? "secretariat" : userClassId || selectedClassId,
    ],
    enabled: true,
    staleTime: 2000,
    refetchOnWindowFocus: true,
    queryFn: () => fetchDocuments("REPORT"),
  });

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refetchPlans();
      refetchReports();
    }, 5000);
    return () => clearInterval(pollInterval);
  }, [refetchPlans, refetchReports]);

  const handleRefresh = () => {
    refetchPlans();
    refetchReports();
  };

  // ---------- Mutations ----------
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (isSecretariat) {
        return memberAffairsApi.uploadSecretariatDocument({
          document_type: docType,
          title,
          description,
          drive_url: driveUrl,
          academic_year: docType === "PLAN" ? parseInt(academicYear) : null,
          quarter: docType === "REPORT" ? parseInt(quarter) : null,
        });
      } else {
        let finalClassId = userClassId || selectedClassId;
        if (!finalClassId) throw new Error("Please select a service class");
        return memberAffairsApi.uploadDocument(finalClassId, {
          document_type: docType,
          title,
          description,
          drive_url: driveUrl,
          academic_year: docType === "PLAN" ? parseInt(academicYear) : null,
          quarter: docType === "REPORT" ? parseInt(quarter) : null,
        });
      }
    },
    onSuccess: async (data) => {
      await Promise.all([refetchPlans(), refetchReports()]);
      setOpen(false);
      resetForm();
      if (!isSecretariat) {
        try {
          await memberAffairsApi.notifyChairmanOfPendingDocument();
        } catch (error) {
          console.error("Failed to notify chairman:", error);
        }
      } else {
        const doc = data?.data;
        if (doc?.id) {
          try {
            await memberAffairsApi.notifyDocumentApproved({
              documentId: doc.id,
              excludeUserId: user?.id,
            });
          } catch (error) {
            console.error("Failed to notify about new document:", error);
          }
        }
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => memberAffairsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-affairs", "documents"] });
      refetchPlans();
      refetchReports();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      memberAffairsApi.updateDocument(id, data),
    onSuccess: async () => {
      await Promise.all([refetchPlans(), refetchReports()]);
      setEditDialogOpen(false);
      setEditingDoc(null);
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => memberAffairsApi.approveDocument(id),
    onSuccess: async (response: any) => {
      const data = response?.data;
      await Promise.all([refetchPlans(), refetchReports()]);
      try {
        await memberAffairsApi.notifyDocumentApproved({
          documentId: data?.id,
          excludeUserId: user?.id,
        });
      } catch (error) {
        console.error("Failed to notify class managers:", error);
      }
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      memberAffairsApi.rejectDocument(id, reason),
    onSuccess: async (response: any) => {
      const data = response?.data;
      await Promise.all([refetchPlans(), refetchReports()]);
      try {
        await memberAffairsApi.notifyDocumentRejected(
          data?.uploaded_by,
          data?.title || "Document",
          data?.rejection_reason || "No reason provided",
        );
      } catch (error) {
        console.error("Failed to notify of rejection:", error);
      }
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({
      docId,
      content,
      parentId,
    }: {
      docId: string;
      content: string;
      parentId?: string;
    }) => memberAffairsApi.addComment(docId, content, parentId),
    onSuccess: async () => {
      await Promise.all([refetchPlans(), refetchReports()]);
      setCommentText("");
      setReplyToId(null);
      try {
        const doc = [...(plans || []), ...(reports || [])].find(
          (d) => d.id === selectedDocId,
        );
        if (doc && doc.uploaded_by !== user?.id) {
          await memberAffairsApi.notifyCommentAdded(
            doc.uploaded_by,
            doc.title || "Document",
          );
        }
      } catch (error) {
        console.error("Failed to notify of comment:", error);
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      memberAffairsApi.deleteComment(commentId),
    onSuccess: async () => {
      await Promise.all([refetchPlans(), refetchReports()]);
    },
  });

  const addReactionMutation = useMutation({
    mutationFn: ({
      docId,
      reactionType,
    }: {
      docId: string;
      reactionType: "LIKE" | "STAR";
    }) => memberAffairsApi.addReaction(docId, reactionType),
    onSuccess: async (response: any) => {
      const data = response?.data;
      await Promise.all([refetchPlans(), refetchReports()]);
      try {
        const doc = [...(plans || []), ...(reports || [])].find(
          (d) => d.id === data?.document_id,
        );
        if (doc && doc.uploaded_by !== user?.id) {
          await memberAffairsApi.notifyReactionAdded(
            doc.uploaded_by,
            doc.title || "Document",
          );
        }
      } catch (error) {
        console.error("Failed to notify of reaction:", error);
      }
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: (docId: string) => memberAffairsApi.removeReaction(docId),
    onSuccess: async () => {
      await Promise.all([refetchPlans(), refetchReports()]);
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDriveUrl("");
    setAcademicYear("");
    setQuarter("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium text-xs backdrop-blur-xs flex items-center gap-1 shadow-xs animate-fade-in">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-medium text-xs backdrop-blur-xs flex items-center gap-1 shadow-xs">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-2.5 py-0.5 rounded-full font-medium text-xs backdrop-blur-xs flex items-center gap-1 shadow-xs">
            <Clock className="h-3 w-3 animate-pulse" /> Pending
          </Badge>
        );
    }
  };

  const handleDelete = (docId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(docId);
    }
  };

  const handleEdit = (doc: any) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditDescription(doc.description || "");
    setEditDriveUrl(doc.drive_url);
    setEditStatus(doc.status);
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    const payload: any = {
      title: editTitle,
      description: editDescription,
      drive_url: editDriveUrl,
    };
    if (isChairman) {
      payload.status = editStatus;
    }
    updateMutation.mutate({ id: editingDoc.id, data: payload });
  };

  const renderDocumentCard = (doc: any) => {
    const userLike = doc.reactions?.find(
      (r: any) => r.user_id === user?.id && r.reaction_type === "LIKE",
    );
    const userStar = doc.reactions?.find(
      (r: any) => r.user_id === user?.id && r.reaction_type === "STAR",
    );

    return (
      <Card key={doc.id} className="group relative overflow-hidden bg-white/60 dark:bg-[#131211]/40 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/60 hover:border-[#C9A227]/40 dark:hover:border-[#C9A227]/40 transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.2)] flex flex-col justify-between rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div>
          <CardHeader className="p-6 pb-4">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl group-hover:scale-105 transition-transform duration-300 border border-neutral-200/40 dark:border-neutral-800/40">
                <FileText className="h-5 w-5 text-[#C9A227]" />
              </div>
              {getStatusBadge(doc.status)}
            </div>

            <CardTitle className="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 group-hover:text-[#C9A227] dark:group-hover:text-[#E5B82E] transition-colors duration-200 line-clamp-1">
              {doc.title}
            </CardTitle>

            <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-900 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                <User className="h-3.5 w-3.5 opacity-60" />
                <span>{doc.uploader?.full_name_three_parts || "System Admin"}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80">
                <Calendar className="h-3.5 w-3.5 opacity-60" />
                <span>{new Date(doc.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
              {!isSecretariat && doc.service_class && (
                <div className="flex items-center gap-1.5 mt-0.5 text-[#7A1C1C] dark:text-amber-400/80 font-medium bg-amber-500/5 dark:bg-amber-500/5 px-2 py-0.5 rounded-md w-fit">
                  <Layers className="h-3 w-3" />
                  <span>{doc.service_class?.class_name_amharic}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 space-y-4">
            {doc.description ? (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 min-h-[40px] leading-relaxed">
                {doc.description}
              </p>
            ) : (
              <p className="text-sm text-neutral-400 dark:text-neutral-600 italic min-h-[40px]">
                No description provided for this matrix item.
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center pt-2">
              <a
                href={doc.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full gap-2 bg-white/40 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-xl transition-all font-medium text-xs shadow-xs">
                  <ExternalLink className="h-3.5 w-3.5" /> Open Matrix File
                </Button>
              </a>

              {(doc.uploaded_by === user?.id || isChairman) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(doc)}
                  className="h-9 w-9 p-0 rounded-xl border-neutral-200 dark:border-neutral-800 hover:text-[#C9A227] hover:border-[#C9A227]/30"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}

              {(doc.uploaded_by === user?.id || isChairman) && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {isChairman && doc.status === "PENDING" && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800 animate-slide-up">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs text-xs font-medium gap-1"
                  onClick={() => approveMutation.mutate(doc.id)}
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs text-xs font-medium gap-1"
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason) rejectMutation.mutate({ id: doc.id, reason });
                  }}
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            )}
          </CardContent>
        </div>

        <div className="flex justify-around items-center px-4 py-2.5 bg-neutral-50/60 dark:bg-neutral-900/40 border-t border-neutral-150 dark:border-neutral-850 rounded-b-2xl">
          <button
            onClick={() => {
              if (userLike) removeReactionMutation.mutate(doc.id);
              else addReactionMutation.mutate({ docId: doc.id, reactionType: "LIKE" });
            }}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-medium transition-all ${
              userLike
                ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                : "text-neutral-500 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${userLike ? "fill-current" : ""}`} />
            <span>{doc.reactions?.filter((r: any) => r.reaction_type === "LIKE").length || 0}</span>
          </button>

          <button
            onClick={() => {
              if (userStar) removeReactionMutation.mutate(doc.id);
              else addReactionMutation.mutate({ docId: doc.id, reactionType: "STAR" });
            }}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-medium transition-all ${
              userStar
                ? "text-[#7A1C1C] dark:text-[#E5B82E] bg-rose-500/5 dark:bg-amber-500/10"
                : "text-neutral-500 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${userStar ? "fill-current" : ""}`} />
            <span>{doc.reactions?.filter((r: any) => r.reaction_type === "STAR").length || 0}</span>
          </button>

          <button
            onClick={() => setSelectedDocId(doc.id)}
            className="flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-medium text-neutral-500 hover:text-[#C9A227] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{doc.comments?.length || 0}</span>
          </button>
        </div>
      </Card>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden antialiased">
      <SacredBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Module Header Elements */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pb-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center gap-3 self-end md:self-auto">
            <Button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-[#C9A227] to-[#B8911A] text-white shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/15 rounded-xl font-medium gap-2 transition-all duration-200"
            >
              <Plus className="h-4 w-4" /> Upload Document
            </Button>
          </div>
        </div>

        {/* Tab-Based Layout Engine */}
        <Tabs defaultValue="plans" className="space-y-8">
          <div className="flex justify-center md:justify-start">
            <TabsList className="p-1 bg-neutral-100/80 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/40 dark:border-neutral-800/40 rounded-xl w-full max-w-[400px] md:w-auto grid grid-cols-2">
              <TabsTrigger
                value="plans"
                className="px-6 py-2 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-[#C9A227] dark:data-[state=active]:text-amber-400 data-[state=active]:shadow-xs transition-all"
              >
                Annual Plans
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="px-6 py-2 rounded-lg text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-[#C9A227] dark:data-[state=active]:text-amber-400 data-[state=active]:shadow-xs transition-all"
              >
                Quarterly Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="plans" className="space-y-6 outline-hidden">
            {plans?.length === 0 ? (
              <div className="text-center py-20 bg-white/40 dark:bg-neutral-950/20 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-8 max-w-md mx-auto">
                <FileText className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300">No organizational plans registered</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Uploaded annual strategical matrixes will populate this container block.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {plans?.map(renderDocumentCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 outline-hidden">
            {reports?.length === 0 ? (
              <div className="text-center py-20 bg-white/40 dark:bg-neutral-950/20 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-8 max-w-md mx-auto">
                <FileText className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300">No quarterly logs registered</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Performance review papers and quarterly updates will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {reports?.map(renderDocumentCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Matrix Entry Dialog Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[480px] bg-white/95 dark:bg-[#0F0E0E]/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Upload Matrix Architecture</DialogTitle>
              <DialogDescription className="text-xs text-neutral-400 dark:text-neutral-500">
                Register a validated plan layout or review worksheet inside the matrix repository.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Context Variant</label>
                <Select value={docType} onValueChange={(v) => setDocType(v as "PLAN" | "REPORT")}>
                  <SelectTrigger className="w-full h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-1 focus:ring-[#C9A227]">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <SelectItem value="PLAN" className="rounded-lg">Annual Strategy Plan</SelectItem>
                    <SelectItem value="REPORT" className="rounded-lg">Quarterly Operations Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isSecretariat && !userClassId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Target Service Class Identification</label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <SelectValue placeholder="Select class attachment" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl">
                      {serviceClasses.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="rounded-lg">
                          {c.class_name_amharic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Title Label</label>
                <Input
                  placeholder="Ex: FY26 Core Deliverables Framework"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Executive Summary / Notes</label>
                <Input
                  placeholder="Context markers, references, or specific area descriptions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Cloud Storage URL Link</label>
                <Input
                  placeholder="Google Drive, Doc, Sheet direct endpoint address..."
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                />
              </div>

              {docType === "PLAN" && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Academic Year Validation</label>
                  <Input
                    type="number"
                    placeholder="Enter calendar timeline (e.g., 2026)"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                  />
                </div>
              )}

              {docType === "REPORT" && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Quarter Partition</label>
                  <Select value={quarter} onValueChange={setQuarter}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <SelectValue placeholder="Select target quarter phase" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl">
                      <SelectItem value="1" className="rounded-lg">Quarter Phase 1 (Q1)</SelectItem>
                      <SelectItem value="2" className="rounded-lg">Quarter Phase 2 (Q2)</SelectItem>
                      <SelectItem value="3" className="rounded-lg">Quarter Phase 3 (Q3)</SelectItem>
                      <SelectItem value="4" className="rounded-lg">Quarter Phase 4 (Q4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {driveUrl && !isValidDriveUrl(driveUrl) && (
                <p className="text-rose-500 text-xs font-medium bg-rose-500/5 px-3 py-2 rounded-lg border border-rose-500/10 animate-shake">
                  Format warning: Provided cloud entry does not align with standardized storage formatting structures.
                </p>
              )}
            </div>
            <DialogFooter className="mt-6 gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-neutral-200 dark:border-neutral-800">
                Cancel
              </Button>
              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={
                  uploadMutation.isPending ||
                  (!isSecretariat && !userClassId && !selectedClassId)
                }
                className="bg-gradient-to-r from-[#C9A227] to-[#B8911A] text-white rounded-xl shadow-xs"
              >
                {uploadMutation.isPending ? "Processing upload..." : "Commit Matrix Document"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update and Patch System Dialog Modal */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[480px] bg-white/95 dark:bg-[#0F0E0E]/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Modify Matrix Entry Parameters</DialogTitle>
              <DialogDescription className="text-xs text-neutral-400 dark:text-neutral-500">
                Adjust resource identifiers and contextual details of this document entry.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Document Label</label>
                <Input
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Description Abstract</label>
                <Input
                  placeholder="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Cloud Data Pipeline Address</label>
                <Input
                  placeholder="Google Drive URL"
                  value={editDriveUrl}
                  onChange={(e) => setEditDriveUrl(e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs font-mono"
                />
              </div>

              {isChairman && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Overriding Governance Status</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl">
                      <SelectItem value="PENDING" className="rounded-lg">Set State Pending</SelectItem>
                      <SelectItem value="APPROVED" className="rounded-lg">Force Approve State</SelectItem>
                      <SelectItem value="REJECTED" className="rounded-lg">Force Reject State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter className="mt-6 gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="rounded-xl border-neutral-200 dark:border-neutral-800">
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="bg-gradient-to-r from-[#C9A227] to-[#B8911A] text-white rounded-xl shadow-xs"
              >
                {updateMutation.isPending ? "Executing update workflow..." : "Commit Update Package"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Discussion Infrastructure & Interactive Feedback Thread Panel */}
        <Dialog
          open={!!selectedDocId}
          onOpenChange={() => setSelectedDocId(null)}
        >
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-white/95 dark:bg-[#0D0D0E]/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-4 border-b border-neutral-100 dark:border-neutral-900">
              <DialogTitle className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#C9A227]" />
                Matrix Analytics & Feedback Forum
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400 dark:text-neutral-500">
                Peer analysis notes, clarification parameters, and feedback timelines regarding this file.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin max-h-[50vh]">
              {(() => {
                const doc = [...(plans || []), ...(reports || [])].find(
                  (d) => d.id === selectedDocId,
                );
                if (!doc) return null;

                const rootComments = doc.comments?.filter((c: any) => !c.parent_id) || [];

                if (doc.comments?.length === 0) {
                  return (
                    <div className="text-center py-12 text-neutral-400 dark:text-neutral-600">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm italic">No feedback entries pinned yet. Be the first to add clarification notes.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {rootComments.map((comment: any) => (
                      <div
                        key={comment.id}
                        className="group/comment space-y-3 p-4 bg-neutral-50/70 dark:bg-neutral-900/30 rounded-xl border border-neutral-150 dark:border-neutral-850 animate-fade-in"
                      >
                        <div className="flex gap-3 items-start">
                          <Avatar className="h-9 w-9 border border-[#C9A227]/20 shadow-xs">
                            <AvatarFallback className="bg-gradient-to-br from-[#FAF8F5] to-[#EDE5D8] dark:from-neutral-800 dark:to-neutral-900 text-xs font-bold text-[#7A1C1C] dark:text-amber-400">
                              {comment.user?.full_name_three_parts?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                                {comment.user?.full_name_three_parts || "Anonymous Auditor"}
                              </p>
                              <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded-md">
                                {new Date(comment.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1.5 leading-relaxed">
                              {comment.content}
                            </p>

                            <div className="flex items-center gap-3 mt-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setReplyToId(comment.id)}
                                className="h-7 px-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-[#C9A227] hover:bg-neutral-100 dark:hover:bg-neutral-900 gap-1"
                              >
                                <Reply className="h-3 w-3" /> Inline Reply
                              </Button>

                              {(comment.user_id === user?.id || isChairman) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                                  className="h-7 px-2.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-rose-600 hover:bg-rose-500/5 opacity-0 group-hover/comment:opacity-100 transition-opacity duration-200"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Nested Secondary Communication Blocks */}
                        {doc.comments
                          .filter((c: any) => c.parent_id === comment.id)
                          .map((reply: any) => (
                            <div
                              key={reply.id}
                              className="ml-7 mt-2 p-3 bg-white/60 dark:bg-neutral-950/20 rounded-xl border border-neutral-100 dark:border-neutral-900 flex gap-3 animate-fade-in"
                            >
                              <CornerDownRight className="h-4 w-4 text-neutral-300 dark:text-neutral-700 mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xs text-neutral-700 dark:text-neutral-300">
                                      {reply.user?.full_name_three_parts || "Staff Member"}
                                    </span>
                                    <Badge className="text-[9px] font-bold px-1 py-0 bg-amber-500/10 text-[#C9A227] hover:bg-amber-500/10 border-none rounded-sm">Reply</Badge>
                                  </div>
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                    {new Date(reply.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Input Submission Deck */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-900 space-y-3">
              {replyToId && (
                <div className="flex items-center justify-between bg-amber-500/5 border border-[#C9A227]/20 px-3 py-1.5 rounded-xl animate-slide-up">
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Reply className="h-3 w-3 text-[#C9A227]" />
                    Staging an inline sub-thread answer log response...
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyToId(null)}
                    className="h-6 px-2 text-[11px] font-semibold text-rose-500 hover:bg-rose-500/10 rounded-lg"
                  >
                    Clear Path
                  </Button>
                </div>
              )}

              <div className="flex gap-2 items-end">
                <Textarea
                  placeholder={
                    replyToId
                      ? "Compose formal response message..."
                      : "Provide architectural review feedback, modification notes, or audit markers..."
                  }
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 min-h-[44px] max-h-[120px] h-11 rounded-xl bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-900 text-sm py-2.5 resize-none focus-visible:ring-[#C9A227]"
                />
                <Button
                  onClick={() =>
                    addCommentMutation.mutate({
                      docId: selectedDocId!,
                      content: commentText,
                      parentId: replyToId || undefined,
                    })
                  }
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  className="h-11 w-11 bg-gradient-to-r from-[#C9A227] to-[#B8911A] text-white rounded-xl shadow-xs p-0 flex items-center justify-center shrink-0 hover:shadow-md transition-all active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}