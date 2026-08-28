"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore, AuthUser } from "@/store/authStore";
import apiClient from "@/api";
import { Post, Comment, ReactionType } from "@/lib/types";
import { Heart, MessageCircle, Trash2, Pin, ThumbsUp, ThumbsDown, Send, ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

function timeAgo(date: string): string {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function PostCard({ post, currentUser, onDelete, onReact, onPin, onCommentCountChange }: {
    post: Post;
    currentUser: AuthUser | null;
    onDelete: (id: string) => void;
    onReact: (id: string, type: ReactionType) => void;
    onPin: (id: string) => void;
    onCommentCountChange: (id: string, delta: number) => void;
}) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    const isAuthor = post.authorID === currentUser?.id;
    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
    const isClassLeader = currentUser?.role === "CLASS_LEADER" && post.serviceClassID === currentUser.classLeaderOf;

    const canDelete = isAuthor || isSuperAdmin || isClassLeader;

    const loadComments = async () => {
        setLoadingComments(true);
        try {
            const res = await apiClient.instance.get<{ data: Comment[] }>(`/posts/${post.id}/comments`);
            setComments(res.data.data);
        } catch { /* ignore */ }
        finally { setLoadingComments(false); }
    };

    const submitComment = async () => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            const payload = { content: commentText, ...(replyTo ? { parentCommentID: replyTo.id } : {}) };
            const res = await apiClient.instance.post<{ data: Comment }>(`/posts/${post.id}/comments`, payload);

            // Pessimistic UI: Update state only after success
            setComments((prev) => [...prev, res.data.data]);
            onCommentCountChange(post.id, 1);
            setCommentText("");
            setReplyTo(null);
        } catch {
            // Handle error logic if needed, e.g., toast notification
        }
        finally { setSubmittingComment(false); }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await apiClient.instance.delete(`/posts/${post.id}/comments/${commentId}`);

            // Pessimistic UI: Update state only after success
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            onCommentCountChange(post.id, -1);
        } catch {
            // Handle error logic if needed
        }
    };

    const toggleComments = () => {
        if (!showComments) loadComments();
        setShowComments(!showComments);
    };

    return (
        <div className={`bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-sm border dark:border-[#2a2a2d] transition-shadow hover:shadow-md ${post.isPinned ? "border-[#C9A227] dark:border-[#D4AF37]" : "border-[#ddd8d0]"}`}>
            {post.isPinned && (
                <div className="px-5 pt-3 pb-0 flex items-center gap-1.5">
                    <Pin className="h-3 w-3 text-[#C9A227] dark:text-[#D4AF37]" />
                    <span className="text-[10px] font-bold text-[#C9A227] dark:text-[#D4AF37] uppercase tracking-wider">Pinned Post</span>
                </div>
            )}

            <div className="p-5">
                {/* Author */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#C9A227]/20 flex items-center justify-center text-[#C9A227] font-bold text-sm flex-shrink-0">
                            {post.author.profileImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={`${API_BASE}${post.author.profileImage}`} alt="" className="w-full h-full object-cover rounded-full" />
                            ) : post.author.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">{post.author.fullName}</p>
                            <p className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0]">{timeAgo(post.createdAt)} · <span className={`font-medium ${post.targetType === "GLOBAL" ? "text-[#C9A227]" : "text-[#7A1C1C] dark:text-[#7ac9a8]"}`}>{post.targetType}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {isSuperAdmin && (
                            <button onClick={() => onPin(post.id)} className="p-1.5 rounded-lg hover:bg-[#C9A227]/10 text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#C9A227] transition-colors" title="Pin">
                                <Pin className="h-4 w-4" />
                            </button>
                        )}
                        {canDelete && (
                            <button onClick={() => onDelete(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mb-1.5">{post.title}</h3>
                <p className="text-sm text-[#4a4a4a] dark:text-[#B0B0B0] leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Image */}
                {post.imageURL && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${API_BASE}${post.imageURL}`} alt="Post image" className="w-full max-h-96 object-cover" />
                    </div>
                )}

                {/* Reactions row */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#f0ece4] dark:border-[#2a2a2d]">
                    <button onClick={() => onReact(post.id, "LIKE")}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors">
                        <ThumbsUp className="h-4 w-4" /> {post._count?.reactions ?? 0}
                    </button>
                    <button onClick={() => onReact(post.id, "DISLIKE")}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-red-500 transition-colors">
                        <ThumbsDown className="h-4 w-4" />
                    </button>
                    <button onClick={toggleComments}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors ml-auto">
                        <MessageCircle className="h-4 w-4" /> {post._count?.comments ?? 0} comments
                    </button>
                </div>

                {/* Comments section */}
                {showComments && (
                    <div className="mt-4 space-y-3">
                        {loadingComments && <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Loading comments...</p>}
                        {comments.filter(c => !c.parentCommentID).map((c) => (
                            <div key={c.id} className="mb-3">
                                {/* Root comment */}
                                <div className="flex gap-2.5 group">
                                    <div className="w-7 h-7 rounded-full bg-[#7A1C1C]/10 flex items-center justify-center text-[#7A1C1C] dark:text-[#D4AF37] text-xs font-bold flex-shrink-0">
                                        {c.user.fullName?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 bg-[#F8F5F0] dark:bg-[#252529] rounded-xl px-3 py-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">{c.user.fullName}</span>
                                                <span className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] ml-2">{timeAgo(c.createdAt)}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5] mt-0.5">{c.content}</p>
                                        <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setReplyTo({ id: c.id, name: c.user.fullName })} className="text-[10px] font-medium text-[#6b6b6b] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]">Reply</button>
                                            {(c.userID === currentUser?.id || isSuperAdmin || isClassLeader) && (
                                                <button onClick={() => deleteComment(c.id)} className="text-[10px] font-medium text-[#6b6b6b] hover:text-red-500">Delete</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Replies */}
                                {comments.filter(r => r.parentCommentID === c.id).map((r) => (
                                    <div key={r.id} className="flex gap-2.5 group ml-9 mt-2">
                                        <div className="w-6 h-6 rounded-full bg-[#7A1C1C]/10 flex items-center justify-center text-[#7A1C1C] dark:text-[#D4AF37] text-[10px] font-bold flex-shrink-0">
                                            {r.user.fullName?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1 bg-[#F8F5F0] dark:bg-[#252529] rounded-xl px-3 py-2">
                                            <span className="text-xs font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">{r.user.fullName}</span>
                                            <span className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] ml-2">{timeAgo(r.createdAt)}</span>
                                            <p className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5] mt-0.5">{r.content}</p>
                                            <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(r.userID === currentUser?.id || isSuperAdmin || isClassLeader) && (
                                                    <button onClick={() => deleteComment(r.id)} className="text-[10px] font-medium text-[#6b6b6b] hover:text-red-500">Delete</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Add comment */}
                        <div className="flex gap-2.5 mt-2">
                            <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 flex items-center justify-center text-[#C9A227] text-xs font-bold flex-shrink-0 mt-1">
                                {currentUser?.fullName?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 flex flex-col pt-1">
                                {replyTo && (
                                    <div className="flex items-center justify-between bg-[#F8F5F0] dark:bg-[#252529] border border-b-0 border-[#ddd8d0] dark:border-[#2a2a2d] px-3 py-1.5 rounded-t-xl text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">
                                        <span>Replying to <span className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">{replyTo.name}</span></span>
                                        <button onClick={() => setReplyTo(null)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}
                                        placeholder={replyTo ? "Write a reply..." : "Write a comment..."} rows={1}
                                        className={`flex-1 bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] text-sm resize-none py-2 min-h-0 ${replyTo ? 'rounded-b-xl rounded-t-none' : 'rounded-xl'}`}
                                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitComment(); } }} />
                                    <button onClick={submitComment} disabled={submittingComment || !commentText.trim()}
                                        className="p-2 rounded-xl h-10 w-10 flex items-center justify-center bg-[#7A1C1C] text-white hover:bg-[#C9A227] transition-colors disabled:opacity-50">
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CreatePostModal({ classes, currentUser, onClose, onCreated }: {
    classes: { id: string; name: string }[];
    currentUser: AuthUser | null;
    onClose: () => void;
    onCreated: (post: Post) => void;
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [targetType, setTargetType] = useState<"GLOBAL" | "CLASS">("CLASS");
    const [serviceClassID, setServiceClassID] = useState(currentUser?.classLeaderOf || currentUser?.serviceClassID || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) { setError("Title and content are required."); return; }
        if (targetType === "CLASS" && !serviceClassID) { setError("Please select a service class."); return; }
        setSubmitting(true);
        setError("");
        try {
            let imageURL: string | undefined;
            if (imageFile) {
                const fd = new FormData(); fd.append("image", imageFile);
                const upRes = await apiClient.instance.post<{ data: { imageURL: string } }>("/upload/image", fd);
                imageURL = upRes.data.data.imageURL;
            }
            const payload: any = { title, content, targetType, imageURL };
            if (targetType === "CLASS") payload.serviceClassID = serviceClassID;
            const res = await apiClient.instance.post<{ data: Post }>("/posts", payload);
            onCreated(res.data.data);
            onClose();
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors && Array.isArray(data.errors)) {
                setError(data.errors.map((e: any) => e.message).join(", "));
            } else {
                setError(data?.message || "Failed to create post.");
            }
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-2xl w-full max-w-lg" style={{ borderTop: "4px solid #C9A227" }}>
                <div className="flex items-center justify-between p-5 border-b border-[#f0ece4] dark:border-[#2a2a2d]">
                    <h2 className="font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Create Post</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F8F5F0] dark:hover:bg-[#252529] text-[#6b6b6b]"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {isSuperAdmin && (
                        <div className="flex gap-2">
                            {(["GLOBAL", "CLASS"] as const).map((t) => (
                                <button key={t} type="button" onClick={() => setTargetType(t)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${targetType === t ? "bg-[#7A1C1C] text-white border-[#7A1C1C]" : "border-[#ddd8d0] dark:border-[#2a2a2d] text-[#6b6b6b] dark:text-[#B0B0B0] hover:border-[#7A1C1C] dark:hover:border-[#D4AF37]"}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}

                    {targetType === "CLASS" && isSuperAdmin && (
                        <select value={serviceClassID} onChange={(e) => setServiceClassID(e.target.value)}
                            className="w-full h-10 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-sm px-3 dark:text-[#F5F5F5]">
                            <option value="">Select class</option>
                            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    )}

                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..."
                        className="w-full h-10 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-sm px-3 dark:text-[#F5F5F5] dark:placeholder:text-[#4a4a50]" />

                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" rows={4}
                        className="bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] dark:text-[#F5F5F5] dark:placeholder:text-[#4a4a50] rounded-xl text-sm resize-none" />

                    {imagePreview && (
                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl" />
                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"><X className="h-3 w-3" /></button>
                        </div>
                    )}

                    {error && <p className="text-xs text-red-500">⚠ {error}</p>}

                    <div className="flex gap-3">
                        <label htmlFor="postImage" className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] text-xs font-medium text-[#6b6b6b] dark:text-[#B0B0B0] hover:border-[#C9A227] hover:text-[#C9A227] transition-all cursor-pointer">
                            <ImageIcon className="h-4 w-4" /> Image
                        </label>
                        <input id="postImage" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                        <Button type="submit" disabled={submitting}
                            className="flex-1 rounded-xl bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all">
                            {submitting ? "Posting..." : "Post"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PostsPage() {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const userRole = user?.system_role || user?.role || "USER";
    const canCreatePost = ["SECRETARIAT_CHAIRMAN", "SECRETARIAT_VICE", "SECRETARIAT_SECRETARY", "SERVICE_MANAGER", "SUPER_ADMIN", "CLASS_LEADER"].includes(userRole);

    const loadPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.instance.get<{ data: Post[] }>("/posts");
            setPosts(res.data.data);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        loadPosts();
        apiClient.instance.get<{ data: { id: string; name: string }[] }>("/classes").then((r) => setClasses(r.data.data)).catch(() => { });
    }, [loadPosts]);

    const handleDelete = async (postId: string) => {
        try {
            await apiClient.instance.delete(`/posts/${postId}`);
            setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch { /* ignore */ }
    };

    const handleReact = async (postId: string, type: ReactionType) => {
        try {
            const res = await apiClient.instance.post<{ data: { counts: { likes: number, dislikes: number } } }>(`/posts/${postId}/react`, { reactionType: type });

            // Pessimistic UI: Update state only after success
            const totalReactions = res.data.data.counts.likes + res.data.data.counts.dislikes;
            setPosts((prev) => prev.map(p => p.id === postId ? { ...p, _count: { ...p._count!, reactions: totalReactions } } : p));
        } catch {
            // Handle error logic if needed
        }
    };

    const handleCommentCountChange = (postId: string, delta: number) => {
        setPosts((prev) => prev.map(p =>
            p.id === postId
                ? { ...p, _count: { ...p._count!, comments: Math.max(0, (p._count?.comments || 0) + delta) } }
                : p
        ));
    };

    const handlePin = async (postId: string) => {
        try {
            await apiClient.instance.patch(`/posts/${postId}/pin`);
            loadPosts();
        } catch { /* ignore */ }
    };

    if (user?.status === "PENDING") {
        return (
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Fellowship Posts</h1>
                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-0.5">Updates from your community</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d] text-center shadow-sm">
                    <div className="w-12 h-12 bg-[#C9A227]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-[#C9A227]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-2">Account Pending Approval</h2>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                        You will be able to view and interact with fellowship posts once an administrator approves your account.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Fellowship Posts</h1>
                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-0.5">Updates from your community</p>
                </div>
                {canCreatePost && (
                    <Button onClick={() => setShowCreate(true)}
                        className="rounded-xl bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all flex items-center gap-2">
                        <Plus className="h-4 w-4" /> New Post
                    </Button>
                )}
            </div>

            {/* Posts */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-5 border border-[#ddd8d0] dark:border-[#2a2a2d] animate-pulse">
                            <div className="flex gap-3 mb-4">
                                <div className="w-9 h-9 rounded-full bg-[#EDE9E2] dark:bg-[#252529]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-[#EDE9E2] dark:bg-[#252529] rounded w-1/3" />
                                    <div className="h-2.5 bg-[#EDE9E2] dark:bg-[#252529] rounded w-1/4" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-[#EDE9E2] dark:bg-[#252529] rounded w-2/3" />
                                <div className="h-3 bg-[#EDE9E2] dark:bg-[#252529] rounded" />
                                <div className="h-3 bg-[#EDE9E2] dark:bg-[#252529] rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && posts.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#7A1C1C]/10 dark:bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-7 w-7 text-[#7A1C1C]/40 dark:text-[#D4AF37]/40" />
                    </div>
                    <p className="text-sm font-medium text-[#6b6b6b] dark:text-[#B0B0B0]">No posts yet</p>
                    <p className="text-xs text-[#6b6b6b]/60 dark:text-[#B0B0B0]/60 mt-1">Check back soon for fellowship updates</p>
                </div>
            )}

            {!loading && posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user}
                    onDelete={handleDelete} onReact={handleReact} onPin={handlePin}
                    onCommentCountChange={handleCommentCountChange} />
            ))}

            {/* Create post modal */}
            {showCreate && (
                <CreatePostModal classes={classes} currentUser={user}
                    onClose={() => setShowCreate(false)}
                    onCreated={(p) => setPosts((prev) => [p, ...prev])} />
            )}
        </div>
    );
}
