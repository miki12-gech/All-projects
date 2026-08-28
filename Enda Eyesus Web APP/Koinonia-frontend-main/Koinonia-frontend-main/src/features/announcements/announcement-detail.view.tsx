// src/app/dashboard/announcements/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    User,
    MessageCircle,
    Trash2,
    Edit2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useAnnouncementDetail } from "./announcement-detail.hooks";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
    "http://localhost:8080";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function AnnouncementDetailView() {
    const {
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
    } = useAnnouncementDetail();

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-[#EDE9E2] dark:bg-[#252529] rounded w-1/4" />
                    <div className="h-64 bg-[#EDE9E2] dark:bg-[#252529] rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !announcement) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Link
                    href="/dashboard/announcements"
                    className="inline-flex items-center gap-2 text-sm text-[#7A1C1C] dark:text-[#D4AF37] hover:underline mb-4"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Announcements
                </Link>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d] text-center">
                    <p className="text-[#6b6b6b] dark:text-[#B0B0B0]">
                        {error || "Announcement not found"}
                    </p>
                </div>
            </div>
        );
    }

    const imageUrls = announcement.image_url
        ? Array.isArray(announcement.image_url)
            ? announcement.image_url
            : JSON.parse(announcement.image_url || "[]")
        : [];
    const videoUrls = announcement.video_url
        ? Array.isArray(announcement.video_url)
            ? announcement.video_url
            : JSON.parse(announcement.video_url || "[]")
        : [];
    const pdfUrls = announcement.pdf_url
        ? Array.isArray(announcement.pdf_url)
            ? announcement.pdf_url
            : JSON.parse(announcement.pdf_url || "[]")
        : [];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Link
                href="/dashboard/announcements"
                className="inline-flex items-center gap-2 text-sm text-[#7A1C1C] dark:text-[#D4AF37] hover:underline"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Announcements
            </Link>

            <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-6 border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-sm">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-linear-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A]">
                        {announcement.author?.profileImageUrl ? (
                            <img
                                src={
                                    announcement.author.profileImageUrl.startsWith(
                                        "http"
                                    )
                                        ? announcement.author.profileImageUrl
                                        : `${API_BASE}${announcement.author.profileImageUrl}`
                                }
                                alt={announcement.author.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : announcement.author?.fullName ? (
                            <span className="text-xl font-bold text-white">
                                {announcement.author.fullName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </span>
                        ) : (
                            <span className="text-xl font-bold text-white">?</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-2">
                                    {announcement.title}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        <span>
                                            {announcement.author?.fullName ||
                                                "Anonymous"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {formatDate(
                                                announcement.published_at ||
                                                    new Date().toISOString()
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {(canEditAnnouncement ||
                                canDeleteAnnouncement) && (
                                <div className="flex gap-2">
                                    {canEditAnnouncement && (
                                        <button className="p-2 text-[#7A1C1C] dark:text-[#D4AF37] hover:bg-[#EDE9E2] dark:hover:bg-[#252529] rounded-lg transition-colors">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                    )}
                                    {canDeleteAnnouncement && (
                                        <button
                                            onClick={
                                                handleDeleteAnnouncement
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none mb-6">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: announcement.content,
                        }}
                    />
                </div>

                {/* Media Attachments */}
                {(imageUrls.length > 0 ||
                    videoUrls.length > 0 ||
                    pdfUrls.length > 0) && (
                    <div className="space-y-6 pt-6 border-t border-[#ddd8d0] dark:border-[#2a2a2d]">
                        {imageUrls.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mb-3">
                                    Images
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {imageUrls.map(
                                        (url: string, idx: number) => (
                                            <img
                                                key={idx}
                                                src={
                                                    url.startsWith("http")
                                                        ? url
                                                        : `${API_BASE}${url}`
                                                }
                                                alt={`Attachment ${idx + 1}`}
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {videoUrls.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mb-3">
                                    Videos
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {videoUrls.map(
                                        (url: string, idx: number) => (
                                            <video
                                                key={idx}
                                                src={
                                                    url.startsWith("http")
                                                        ? url
                                                        : `${API_BASE}${url}`
                                                }
                                                controls
                                                className="w-full h-64 rounded-lg"
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {pdfUrls.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mb-3">
                                    Documents
                                </h3>
                                <div className="space-y-2">
                                    {pdfUrls.map(
                                        (url: string, idx: number) => (
                                            <a
                                                key={idx}
                                                href={
                                                    url.startsWith("http")
                                                        ? url
                                                        : `${API_BASE}${url}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-[#F8F5F0] dark:bg-[#252529] rounded-lg hover:bg-[#EDE9E2] dark:hover:bg-[#2a2a2d] transition-colors"
                                            >
                                                <span className="text-2xl">
                                                    📄
                                                </span>
                                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                                                    Document {idx + 1}
                                                </span>
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Comments Section */}
                <div className="pt-6 border-t border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <h2 className="text-lg font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mb-4 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Comments
                    </h2>

                    {/* Comments List */}
                    <div className="space-y-4 mb-6">
                        {announcement.comments &&
                            announcement.comments.map((comment: any) => (
                                <div
                                    key={comment.id}
                                    className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-4 space-y-3"
                                >
                                    {/* Reply To Quote */}
                                    {comment.replyTo && (
                                        <div className="bg-[#EDE9E2] dark:bg-[#2a2a2d] rounded p-3 border-l-2 border-[#7A1C1C] dark:border-[#D4AF37]">
                                            <p className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0] mb-1">
                                                Reply to{" "}
                                                {comment.replyTo.authorName}
                                            </p>
                                            <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] italic line-clamp-2">
                                                "{comment.replyTo.content}"
                                            </p>
                                        </div>
                                    )}

                                    {editingComment === comment.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editCommentContent}
                                                onChange={(e) =>
                                                    setEditCommentContent(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded text-sm text-[#1a1a1a] dark:text-[#F5F5F5]"
                                                rows={3}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditComment(
                                                            comment.id
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-[#7A1C1C] text-white rounded text-sm hover:bg-[#5a1010] transition-colors"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditingComment(null)
                                                    }
                                                    className="px-3 py-1 bg-[#ddd8d0] dark:bg-[#3a3a3d] text-[#1a1a1a] dark:text-[#F5F5F5] rounded text-sm hover:bg-[#ccc] transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-linear-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A]">
                                                        {comment.author
                                                            ?.profileImageUrl ? (
                                                            <img
                                                                src={
                                                                    comment.author.profileImageUrl.startsWith(
                                                                        "http"
                                                                    )
                                                                        ? comment.author
                                                                              .profileImageUrl
                                                                        : `${API_BASE}${comment.author.profileImageUrl}`
                                                                }
                                                                alt={
                                                                    comment.author
                                                                        .fullName
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-white">
                                                                {comment.author?.fullName
                                                                    ?.split(" ")
                                                                    .map(
                                                                        (
                                                                            n: string
                                                                        ) => n[0]
                                                                    )
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase() ||
                                                                    "?"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">
                                                            {comment.author
                                                                ?.fullName ||
                                                                "Anonymous"}
                                                        </div>
                                                        <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-1">
                                                            {comment.content}
                                                        </p>
                                                        <div className="text-xs text-[#999] dark:text-[#777] mt-2">
                                                            {formatDate(
                                                                comment.created_at
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Comment Actions */}
                                                {comment.author?.id ===
                                                    user?.id ||
                                                user?.id ===
                                                    comment.author_id ? (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingComment(
                                                                    comment.id
                                                                );
                                                                setEditCommentContent(
                                                                    comment.content
                                                                );
                                                            }}
                                                            className="p-1.5 text-[#7A1C1C] dark:text-[#D4AF37] hover:bg-[#ddd8d0] dark:hover:bg-[#3a3a3d] rounded transition-colors"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id
                                                                )
                                                            }
                                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>

                                            {/* Reply Button */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        setReplyingTo(
                                                            comment.id
                                                        )
                                                    }
                                                    className="text-xs text-[#7A1C1C] dark:text-[#D4AF37] hover:underline"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Add Comment Form */}
                    <div className="space-y-3">
                        {replyingTo && (
                            <div className="bg-[#EDE9E2] dark:bg-[#252529] rounded p-3 flex items-center justify-between">
                                <span className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                                    Replying to comment...
                                </span>
                                <button
                                    onClick={() => setReplyingTo(null)}
                                    className="text-[#7A1C1C] dark:text-[#D4AF37] hover:bg-[#ddd8d0] dark:hover:bg-[#3a3a3d] p-1 rounded"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <textarea
                                value={newComment}
                                onChange={(e) =>
                                    setNewComment(e.target.value)
                                }
                                placeholder="Add a comment..."
                                className="flex-1 p-3 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg text-sm text-[#1a1a1a] dark:text-[#F5F5F5] placeholder-[#999]"
                                rows={2}
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-4 py-3 bg-[#7A1C1C] text-white rounded-lg font-medium hover:bg-[#5a1010] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}