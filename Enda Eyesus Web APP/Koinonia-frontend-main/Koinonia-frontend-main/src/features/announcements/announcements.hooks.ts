import { useState, useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { Announcement } from "./announcements.types";
import {
    getAnnouncements,
    approveAnnouncement,
    rejectAnnouncement,
    reactToAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    createAnnouncement,
    uploadMedia
} from "./announcements.service";

export const useAnnouncements = () => {
    const { user, isChairman, isSecretariat, isServiceManager } = useAuthStore();

    // Data State
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [highlightId, setHighlightId] = useState<string | null>(null);

    // Form State for creating new announcements
    const [showForm, setShowForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formTarget, setFormTarget] = useState<"ALL" | "CLASS">("ALL");
    const [formImageUrls, setFormImageUrls] = useState<string[]>([]);
    const [formVideoUrl, setFormVideoUrl] = useState("");
    const [formPdfUrls, setFormPdfUrls] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editTarget, setEditTarget] = useState<"ALL" | "CLASS">("ALL");
    const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
    const [editVideoUrl, setEditVideoUrl] = useState("");
    const [editPdfUrls, setEditPdfUrls] = useState<string[]>([]);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState("");

    // Rejection State
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectAnnouncementId, setRejectAnnouncementId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxMedia, setLightboxMedia] = useState<{ type: "image" | "video"; url: string }[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Misc UI State
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const announcementRefs = useRef<Record<string, HTMLElement | null>>({});

    const fetchAllAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAnnouncements();
            const items = Array.isArray(data) ? data : (data as any)?.items || [];
            setAnnouncements(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllAnnouncements();
        const interval = setInterval(fetchAllAnnouncements, 30000);
        return () => clearInterval(interval);
    }, [fetchAllAnnouncements]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const annId = params.get("announcementId");
            if (annId) {
                setHighlightId(annId);
            }
        }
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await approveAnnouncement(id);
            await fetchAllAnnouncements();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to approve announcement");
        }
    };

    const handleReject = async () => {
        if (!rejectAnnouncementId || !rejectReason.trim()) {
            alert("Please provide a rejection reason");
            return;
        }
        try {
            await rejectAnnouncement(rejectAnnouncementId, rejectReason);
            setRejectDialogOpen(false);
            setRejectAnnouncementId(null);
            setRejectReason("");
            await fetchAllAnnouncements();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to reject announcement");
        }
    };

    const updateReactionLocally = useCallback(
        (announcementId: string, reactionType: "LIKE" | "STAR") => {
            setAnnouncements((prev) =>
                prev.map((ann) => {
                    if (ann.id !== announcementId) return ann;
                    const reactions = ann.reactions || [];
                    const existingIndex = reactions.findIndex((r) => r.user_id === user?.id);
                    const newReactions = [...reactions];
                    let countDelta = 0;
                    const reactionKey = reactionType === "LIKE" ? "likes" : "stars";

                    if (existingIndex !== -1) {
                        const existingType = newReactions[existingIndex].reaction_type;
                        if (existingType === reactionType) {
                            newReactions.splice(existingIndex, 1);
                            countDelta = -1;
                        } else {
                            newReactions[existingIndex] = { user_id: user?.id!, reaction_type: reactionType };
                            const oldKey = existingType === "LIKE" ? "likes" : "stars";
                            const newKey = reactionType === "LIKE" ? "likes" : "stars";
                            const currentOld = ann.reaction_counts?.[oldKey] || 0;
                            const currentNew = ann.reaction_counts?.[newKey] || 0;
                            return {
                                ...ann,
                                reactions: newReactions,
                                reaction_counts: {
                                    ...ann.reaction_counts,
                                    [oldKey]: Math.max(0, currentOld - 1),
                                    [newKey]: currentNew + 1,
                                },
                            };
                        }
                    } else {
                        newReactions.push({ user_id: user?.id!, reaction_type: reactionType });
                        countDelta = 1;
                    }

                    const currentCount = ann.reaction_counts?.[reactionKey] || 0;
                    return {
                        ...ann,
                        reactions: newReactions,
                        reaction_counts: {
                            ...ann.reaction_counts,
                            [reactionKey]: Math.max(0, currentCount + countDelta),
                        } as any,
                    };
                })
            );
        },
        [user?.id]
    );

    const handleReact = useCallback(
        async (announcementId: string, type: "LIKE" | "STAR") => {
            updateReactionLocally(announcementId, type);
            try {
                await reactToAnnouncement(announcementId, type);
            } catch (err: any) {
                await fetchAllAnnouncements();
                alert(err.response?.data?.message || "Failed to update reaction");
            }
        },
        [updateReactionLocally, fetchAllAnnouncements]
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle.trim() || !formContent.trim()) {
            setFormError("Title and content are required.");
            return;
        }
        setSubmitting(true);
        setFormError("");

        try {
            let targetType = formTarget === "ALL" ? "ALL" : "CLASS";
            let targetClassID = formTarget === "CLASS" ? (user?.serviceClassID || user?.classLeaderOf || null) : null;

            if (isSecretariat && formTarget === "CLASS") {
                targetType = "LEADERS";
                targetClassID = null;
            }

            if (targetType === "CLASS" && !targetClassID) {
                setFormError("You don't have a service class assigned. Please contact admin.");
                return;
            }

            const payload = {
                targetType,
                targetClassID,
                title: formTitle,
                content: formContent,
                isPinned: false,
                imageUrl: formImageUrls.length > 0 ? formImageUrls : null,
                videoUrl: formVideoUrl ? [formVideoUrl] : null,
                pdfUrl: formPdfUrls.length > 0 ? formPdfUrls : null,
            };

            await createAnnouncement(payload);
            await fetchAllAnnouncements();
            setShowForm(false);
            setFormTitle("");
            setFormContent("");
            setFormTarget("ALL");
            setFormImageUrls([]);
            setFormVideoUrl("");
            setFormPdfUrls([]);
        } catch (err: any) {
            const data = err.response?.data;
            const msg = data?.message || data?.detail || "Failed to create announcement.";
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!editTitle.trim() || !editContent.trim()) {
                setEditError("Title and content are required.");
                return;
            }
            setEditSubmitting(true);
            setEditError("");
            try {
                let targetType = editTarget === "ALL" ? "ALL" : "CLASS";
                let targetClassID = editTarget === "CLASS" ? (user?.serviceClassID || user?.classLeaderOf || null) : null;

                if (isSecretariat && editTarget === "CLASS") {
                    targetType = "LEADERS";
                    targetClassID = null;
                }

                if (targetType === "CLASS" && !targetClassID) {
                    setEditError("You don't have a service class assigned.");
                    return;
                }

                const isPublic = editTarget === "ALL";
                const targetClassId = editTarget === "CLASS"
                    ? (isSecretariat ? undefined : (user?.serviceClassID || user?.classLeaderOf || undefined))
                    : undefined;

                const payload = {
                    targetType,
                    targetClassID,
                    is_public: isPublic,
                    target_class_id: targetClassId,
                    title: editTitle,
                    content: editContent,
                    imageUrl: editImageUrls.length > 0 ? editImageUrls : null,
                    videoUrl: editVideoUrl ? [editVideoUrl] : null,
                    pdfUrl: editPdfUrls.length > 0 ? editPdfUrls : null,
                };

                const updatedAnnouncement = await updateAnnouncement(editingId!, payload);
                setAnnouncements((prev) =>
                    prev.map((a) => (a.id === editingId ? { ...a, ...updatedAnnouncement } : a))
                );
                fetchAllAnnouncements();
                setEditingId(null);
                setEditTitle("");
                setEditContent("");
                setEditTarget("ALL");
                setEditImageUrls([]);
                setEditVideoUrl("");
                setEditPdfUrls([]);
            } catch (err: any) {
                setEditError(err.response?.data?.message || "Failed to update announcement.");
            } finally {
                setEditSubmitting(false);
            }
        },
        [editTitle, editContent, editTarget, editImageUrls, editVideoUrl, editPdfUrls, editingId, user, isSecretariat, fetchAllAnnouncements]
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await deleteAnnouncement(id);
            await fetchAllAnnouncements();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete announcement.");
        }
    };

    const startEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setEditTitle(announcement.title);
        setEditContent(announcement.content);
        setEditTarget(
            isChairman
                ? "ALL"
                : announcement.is_public
                ? "ALL"
                : "CLASS"
        );
        const parseMedia = (field: any) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try { return JSON.parse(field); } catch { return []; }
        };
        setEditImageUrls(parseMedia(announcement.image_url));
        const videoUrls = parseMedia(announcement.video_url);
        setEditVideoUrl(videoUrls.length > 0 ? videoUrls[0] : "");
        setEditPdfUrls(parseMedia(announcement.pdf_url));
        setEditError("");
    };

    const handleUploadFiles = async (
        files: FileList,
        type: "image" | "pdf",
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const uploadPromises = Array.from(files).map(async (file: File) => {
            return await uploadMedia(type, file);
        });
        const urls = await Promise.all(uploadPromises);
        setter((prev) => [...prev, ...urls.filter(Boolean)]);
    };

    const filteredAnnouncements = announcements.filter((a) => {
        if (isSecretariat) return a.is_public === true;
        if (isServiceManager) {
            if (a.is_public)
                return a.status === "APPROVED" || (a.status === "PENDING" && a.author_id === user?.id);
            else
                return (
                    a.target_class_id === user?.serviceClassID &&
                    (a.status === "APPROVED" || (a.status === "PENDING" && a.author_id === user?.id))
                );
        }
        return a.status === "APPROVED" && (a.is_public || a.target_class_id === user?.serviceClassID);
    });

    const canCreateAnn = user?.role !== "MEMBER" && user?.role !== "GUEST";

    return {
        user,
        isChairman,
        isSecretariat,
        isServiceManager,
        canCreateAnn,
        
        loading,
        filteredAnnouncements,
        
        showForm, setShowForm,
        formTitle, setFormTitle,
        formContent, setFormContent,
        formTarget, setFormTarget,
        formImageUrls, setFormImageUrls,
        formVideoUrl, setFormVideoUrl,
        formPdfUrls, setFormPdfUrls,
        submitting, formError,
        
        editingId, setEditingId,
        editTitle, setEditTitle,
        editContent, setEditContent,
        editTarget, setEditTarget,
        editImageUrls, setEditImageUrls,
        editVideoUrl, setEditVideoUrl,
        editPdfUrls, setEditPdfUrls,
        editSubmitting, editError,
        
        rejectDialogOpen, setRejectDialogOpen,
        rejectAnnouncementId, setRejectAnnouncementId,
        rejectReason, setRejectReason,
        
        lightboxOpen, setLightboxOpen,
        lightboxMedia, setLightboxMedia,
        lightboxIndex, setLightboxIndex,
        
        dropdownOpen, setDropdownOpen,
        announcementRefs,
        highlightId,
        
        handleCreate,
        handleEdit,
        handleDelete,
        startEdit,
        handleApprove,
        handleReject,
        handleReact,
        handleUploadFiles
    };
};
