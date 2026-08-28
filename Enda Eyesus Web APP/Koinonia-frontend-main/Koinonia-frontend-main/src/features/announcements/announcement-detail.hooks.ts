import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
    getAnnouncement,
    commentOnAnnouncement,
    editComment,
    deleteComment,
    deleteAnnouncement
} from "./announcement-detail.service";
import { Announcement } from "./announcements.types";

export const useAnnouncementDetail = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const fetchAnnouncement = async () => {
        if (!params.id) return;
        setLoading(true);
        try {
            const found = await getAnnouncement(params.id as string);
            setAnnouncement(found);
        } catch (err: any) {
            setError(err.message || "Failed to load announcement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncement();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !params.id) return;
        try {
            await commentOnAnnouncement(params.id as string, {
                content: newComment,
                parentCommentId: replyingTo || undefined,
            });
            setNewComment("");
            setReplyingTo(null);
            await fetchAnnouncement();
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (!editCommentContent.trim() || !params.id) return;
        try {
            await editComment(params.id as string, commentId, { content: editCommentContent });
            setEditingComment(null);
            setEditCommentContent("");
            await fetchAnnouncement();
        } catch (err) {
            console.error("Failed to edit comment:", err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!params.id || !confirm("Delete this comment?")) return;
        try {
            await deleteComment(params.id as string, commentId);
            await fetchAnnouncement();
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const handleDeleteAnnouncement = async () => {
        if (!params.id || !confirm("Delete this announcement?")) return;
        try {
            await deleteAnnouncement(params.id as string);
            router.push("/dashboard/announcements");
        } catch (err) {
            console.error("Failed to delete announcement:", err);
        }
    };

    const isCreator = announcement?.author?.id === user?.id || announcement?.author_id === user?.id;
    const isChairman = user?.role === "SECRETARIAT_CHAIRMAN" || user?.role === "SUPER_ADMIN";
    const canEditAnnouncement = isCreator || (isChairman && announcement?.is_public);
    const canDeleteAnnouncement = isCreator || (isChairman && announcement?.is_public);

    return {
        announcement,
        loading,
        error,
        user,
        newComment, setNewComment,
        replyingTo, setReplyingTo,
        editingComment, setEditingComment,
        editCommentContent, setEditCommentContent,
        handleAddComment,
        handleEditComment,
        handleDeleteComment,
        handleDeleteAnnouncement,
        canEditAnnouncement,
        canDeleteAnnouncement
    };
};
