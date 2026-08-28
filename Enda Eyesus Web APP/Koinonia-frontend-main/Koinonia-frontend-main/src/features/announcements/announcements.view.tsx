"use client";

import { Bell, Plus, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Share2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { memo, Suspense } from "react";
import { useAnnouncements } from "./announcements.hooks";
import { Announcement } from "./announcements.types";

import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

const TARGET_COLORS: Record<string, string> = {
    ALL: "#7A1C1C",
    CLASS: "#C9A227",
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function getEmbedUrl(url: string): string | null {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const ttMatch = url.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
    if (ttMatch) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    return null;
}

function getPlatformInfo(url: string): { icon: string; label: string } {
    if (!url) return { icon: '🔗', label: 'Link' };
    if (url.includes('youtube.com') || url.includes('youtu.be')) return { icon: '▶️', label: 'YouTube' };
    if (url.includes('tiktok.com')) return { icon: '🎵', label: 'TikTok' };
    if (url.includes('vimeo.com')) return { icon: '🎬', label: 'Vimeo' };
    if (url.includes('drive.google.com')) return { icon: '📁', label: 'Google Drive' };
    if (url.includes('t.me')) return { icon: '📨', label: 'Telegram' };
    return { icon: '🔗', label: 'Link' };
}

// ===== LIGHTBOX / GALLERY =====
interface LightboxMedia {
    type: 'image' | 'video';
    url: string;
    originalUrl?: string;
    title?: string;
}

function Lightbox({
    isOpen,
    media,
    currentIndex,
    onClose,
    onPrev,
    onNext
}: {
    isOpen: boolean;
    media: LightboxMedia[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    if (!isOpen || media.length === 0) return null;
    const item = media[currentIndex];
    const isImage = item.type === 'image';

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, onPrev, onNext]);

    return (
        <div
            className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="relative max-w-[90vw] max-h-[90vh] bg-black/20 rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    {isImage ? (
                        <img
                            src={item.url.startsWith('http') ? item.url : `${API_BASE}${item.url}`}
                            alt={item.title || 'Media'}
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                        />
                    ) : (
                        <iframe
                            src={item.url}
                            className="w-[90vw] h-[80vh] rounded-xl shadow-2xl"
                            allowFullScreen
                            title="Media"
                        />
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {media.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {media.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                                />
                            ))}
                        </div>
                        <div className="absolute bottom-6 right-6 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                            {currentIndex + 1} / {media.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ===== TYPES =====
interface AnnouncementItemProps {
    announcement: any;
    isEditing: boolean;
    editTarget: "ALL" | "CLASS";
    setEditTarget: React.Dispatch<React.SetStateAction<"ALL" | "CLASS">>;
    editTitle: string;
    setEditTitle: React.Dispatch<React.SetStateAction<string>>;
    editContent: string;
    setEditContent: React.Dispatch<React.SetStateAction<string>>;
    editImageUrls: string[];
    setEditImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
    editVideoUrl: string;
    setEditVideoUrl: React.Dispatch<React.SetStateAction<string>>;
    editPdfUrls: string[];
    setEditPdfUrls: React.Dispatch<React.SetStateAction<string[]>>;
    editSubmitting: boolean;
    editError: string;
    handleEdit: (e: React.FormEvent) => Promise<void>;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
    startEdit: (announcement: any) => void;
    handleDeleteAnnouncement: (id: string) => Promise<void>;
    handleApprove: (id: string) => Promise<void>;
    handleReact: (id: string, type: "LIKE" | "STAR") => Promise<void>;
    handleShare: (id: string) => Promise<void>;
    openLightbox: (items: LightboxMedia[], initialIndex: number) => void;
    isChairman: boolean;
    isSecretariat: boolean;
    isServiceManager: boolean;
    user: any;
    setRejectAnnouncementId: React.Dispatch<React.SetStateAction<string | null>>;
    setRejectDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDropdownOpen: React.Dispatch<React.SetStateAction<string | null>>;
    dropdownOpen: string | null;
    uploadFiles: (files: FileList, type: "image" | "pdf", setter: React.Dispatch<React.SetStateAction<string[]>>) => Promise<void>;
    API_BASE: string;
}

// ===== MEMOIZED COMPONENT =====
const AnnouncementItem = memo((props: AnnouncementItemProps) => {
    const {
        announcement,
        isEditing,
        editTarget,
        setEditTarget,
        editTitle,
        setEditTitle,
        editContent,
        setEditContent,
        editImageUrls,
        setEditImageUrls,
        editVideoUrl,
        setEditVideoUrl,
        editPdfUrls,
        setEditPdfUrls,
        editSubmitting,
        editError,
        handleEdit,
        setEditingId,
        startEdit,
        handleDeleteAnnouncement,
        handleApprove,
        handleReact,
        handleShare,
        openLightbox,
        isChairman,
        isSecretariat,
        isServiceManager,
        user,
        setRejectAnnouncementId,
        setRejectDialogOpen,
        setDropdownOpen,
        dropdownOpen,
        uploadFiles,
        API_BASE,
    } = props;

    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [showReadMore, setShowReadMore] = useState(false);

    useEffect(() => {
        if (!user) return;
        const viewKey = `announcement_view_${announcement.id}_${user.id}`;
        if (!localStorage.getItem(viewKey)) {
            localStorage.setItem(viewKey, "true");
        }
    }, [announcement.id, user]);

    useEffect(() => {
        if (contentRef.current) {
            const text = contentRef.current.innerText || "";
            setShowReadMore(text.length > 300);
        }
    }, [announcement.content]);

    const color = TARGET_COLORS[announcement.is_public ? "ALL" : "CLASS"] || "#7A1C1C";
    const isPending = announcement.status === "PENDING";
    const canApprove = isSecretariat && isPending && announcement.is_public;
    const isAuthor = announcement.author_id === user?.id;
    const canEditAnnouncement = isChairman || isAuthor;
    const canDeleteAnnouncement = isChairman || isAuthor;
    const userLiked = announcement.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === "LIKE");
    const userDisliked = announcement.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === "STAR");

    const imageUrls = announcement.image_url
        ? Array.isArray(announcement.image_url)
            ? announcement.image_url
            : JSON.parse(announcement.image_url || "[]")
        : [];
    const videoUrl = announcement.video_url
        ? Array.isArray(announcement.video_url)
            ? announcement.video_url[0]
            : JSON.parse(announcement.video_url || "[]")[0]
        : null;
    const pdfUrls = announcement.pdf_url
        ? Array.isArray(announcement.pdf_url)
            ? announcement.pdf_url
            : JSON.parse(announcement.pdf_url || "[]")
        : [];

    const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
    const platformInfo = videoUrl ? getPlatformInfo(videoUrl) : null;

    const mediaItems: LightboxMedia[] = [];
    imageUrls.forEach((url: string) => {
        mediaItems.push({ type: "image", url, title: announcement.title });
    });
    if (embedUrl) {
        mediaItems.push({
            type: "video",
            url: embedUrl,
            originalUrl: videoUrl,
            title: announcement.title,
        });
    }

    const handleMediaClick = (index: number) => {
        if (mediaItems.length > 0) {
            openLightbox(mediaItems, index);
        }
    };

    const handleShareClick = () => {
        handleShare(announcement.id);
    };

    const contentText = announcement.content?.replace(/<[^>]*>/g, "") || "";
    const isLongContent = contentText.length > 300;

    return (
        <article
            key={announcement.id}
            id={`announcement-${announcement.id}`}
            className="w-full bg-white dark:bg-[#1C1C1F] rounded-2xl p-4 sm:p-6 border shadow-md hover:shadow-lg transition-shadow duration-200 scroll-mt-24"
            style={{ borderLeft: `6px solid ${isPending ? "#F59E0B" : color}` }}
        >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-linear-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A] shadow-md mx-auto sm:mx-0">
                    {announcement.author?.profileImageUrl ? (
                        <img
                            src={
                                announcement.author.profileImageUrl.startsWith("http")
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

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#F5F5F5] truncate max-w-[120px] sm:max-w-none">
                            {announcement.author?.fullName || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0] whitespace-nowrap">
                            {formatDate(announcement.published_at || announcement.submitted_at || new Date().toISOString())}
                        </span>
                        {isPending && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                                Pending
                            </span>
                        )}
                        <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white whitespace-nowrap"
                            style={{ backgroundColor: color }}
                        >
                            {announcement.is_public ? "PUBLIC" : "CLASS"}
                        </span>
                        <span className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0] flex items-center gap-1 whitespace-nowrap">
                            👁️ {(announcement.views || 0)} views
                        </span>

                        {/* Dropdown */}
                        <div className="flex items-center gap-2 ml-auto shrink-0">
                            {!isEditing && (canEditAnnouncement || canDeleteAnnouncement) && (
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setDropdownOpen(dropdownOpen === announcement.id ? null : announcement.id)
                                        }
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <MoreVertical className="h-5 w-5 text-gray-500" />
                                    </button>
                                    {dropdownOpen === announcement.id && (
                                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#1C1C1F] shadow-xl rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] z-50 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    handleShareClick();
                                                    setDropdownOpen(null);
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors"
                                            >
                                                <Share2 className="h-4 w-4" /> Share
                                            </button>
                                            {canEditAnnouncement && (
                                                <button
                                                    onClick={() => {
                                                        startEdit(announcement);
                                                        setDropdownOpen(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" /> Edit
                                                </button>
                                            )}
                                            {canDeleteAnnouncement && (
                                                <button
                                                    onClick={() => {
                                                        handleDeleteAnnouncement(announcement.id);
                                                        setDropdownOpen(null);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleEdit} className="mb-4 space-y-3">
                            {!isChairman && (
                                <div className="flex gap-2">
                                    {(["ALL", "CLASS"] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setEditTarget(t)}
                                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                                editTarget === t
                                                    ? "bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] border-transparent"
                                                    : "border-[#ddd8d0] dark:border-[#2a2a2d] text-[#6b6b6b] dark:text-[#B0B0B0]"
                                            }`}
                                        >
                                            {t === "ALL" ? "Public" : "Class Only"}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full h-10 rounded-xl border p-2"
                            />
                            <RichTextEditor
                                content={editContent}
                                onChange={setEditContent}
                                placeholder="Content..."
                            />
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-semibold">Images:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => e.target.files && uploadFiles(e.target.files, "image", setEditImageUrls)}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {editImageUrls.map((url: string, idx: number) => (
                                            <div key={idx} className="relative">
                                                <img
                                                    src={url.startsWith("http") ? url : `${API_BASE}${url}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditImageUrls((prev) => prev.filter((_, i) => i !== idx))
                                                    }
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Media Link</label>
                                    <input
                                        type="url"
                                        value={editVideoUrl}
                                        onChange={(e) => setEditVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full h-10 rounded-xl border p-2 mt-1"
                                    />
                                    {editVideoUrl && getEmbedUrl(editVideoUrl) && (
                                        <div className="mt-2 rounded-xl overflow-hidden border shadow-sm">
                                            <iframe
                                                src={getEmbedUrl(editVideoUrl)!}
                                                className="w-full aspect-video"
                                                allowFullScreen
                                                title="Media preview"
                                            />
                                            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 flex items-center gap-2">
                                                <span>{getPlatformInfo(editVideoUrl).icon}</span>
                                                <span>{getPlatformInfo(editVideoUrl).label}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">PDFs:</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        onChange={(e) => e.target.files && uploadFiles(e.target.files, "pdf", setEditPdfUrls)}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {editPdfUrls.map((url: string, idx: number) => (
                                            <div key={idx} className="relative px-3 py-1 bg-gray-100 rounded">
                                                <a
                                                    href={url.startsWith("http") ? url : `${API_BASE}${url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    📄 PDF {idx + 1}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditPdfUrls((prev) => prev.filter((_, i) => i !== idx))
                                                    }
                                                    className="ml-2 text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {editError && <p className="text-xs text-red-500">{editError}</p>}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 py-2 rounded-xl border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editSubmitting}
                                    className="flex-2 py-2 rounded-xl bg-[#7A1C1C] text-white"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] leading-tight mb-3 break-words">
                                {announcement.title}
                            </h2>

                            {/* ─── CENTERED MEDIA SECTION ─── */}
                            <div className="mb-4 space-y-3 flex flex-col items-center">
                                {imageUrls.length > 0 && (
                                    <div
                                        className="relative group overflow-hidden rounded-xl cursor-pointer bg-[#f0f0f0] dark:bg-[#1a1a1a] aspect-[4/3] max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[400px] xl:max-h-[500px] w-full max-w-2xl mx-auto"
                                        onClick={() => handleMediaClick(0)}
                                    >
                                        <img
                                            src={imageUrls[0].startsWith("http") ? imageUrls[0] : `${API_BASE}${imageUrls[0]}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            alt={announcement.title}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/fallback-image.png';
                                            }}
                                        />
                                        {imageUrls.length > 1 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity group-hover:bg-black/70">
                                                <span className="text-white text-3xl font-bold">
                                                    +{imageUrls.length - 1}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                )}
                                {videoUrl && embedUrl && !imageUrls.length && (
                                    <div
                                        className="rounded-xl overflow-hidden border shadow-sm cursor-pointer group relative aspect-video max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-[400px] xl:max-h-[500px] w-full max-w-2xl mx-auto bg-black"
                                        onClick={() => handleMediaClick(0)}
                                    >
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full pointer-events-none"
                                            allowFullScreen
                                            title="Media"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                                                Click to view
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {pdfUrls.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {pdfUrls.map((url: string, idx: number) => (
                                            <a
                                                key={idx}
                                                href={url.startsWith("http") ? url : `${API_BASE}${url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#7A1C1C] to-[#C9A227] text-white hover:from-[#C9A227] hover:to-[#7A1C1C] transition-all shadow-md hover:shadow-lg text-sm"
                                            >
                                                <span className="text-lg">📄</span>
                                                <span className="text-xs font-semibold">PDF {idx + 1}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div
                                ref={contentRef}
                                className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] leading-relaxed prose prose-sm max-w-none break-words overflow-hidden"
                            >
                                {isLongContent ? (
                                    <>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: expanded
                                                    ? announcement.content
                                                    : announcement.content?.substring(0, 300) + "...",
                                            }}
                                        />
                                        <button
                                            onClick={() => setExpanded(!expanded)}
                                            className="text-[#C9A227] dark:text-[#D4AF37] font-medium hover:underline mt-1"
                                        >
                                            {expanded ? "Read less" : "Read more"}
                                        </button>
                                    </>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
                                )}
                            </div>

                            {canApprove && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => handleApprove(announcement.id)}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <CheckCircle className="h-4 w-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRejectAnnouncementId(announcement.id);
                                            setRejectDialogOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <XCircle className="h-4 w-4" /> Reject
                                    </button>
                                </div>
                            )}

                            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#ddd8d0] dark:border-[#2a2a2d] pt-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleReact(announcement.id, "LIKE");
                                    }}
                                    className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                                        userLiked
                                            ? "bg-blue-500 text-white shadow-md scale-105"
                                            : "bg-[#F8F5F0] dark:bg-[#252529] text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                    }`}
                                >
                                    <span className="text-lg transition-transform group-hover:scale-110">👍</span>
                                    <span className="text-xs font-bold">
                                        {announcement.reaction_counts?.likes || 0}
                                    </span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleReact(announcement.id, "STAR");
                                    }}
                                    className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                                        userDisliked
                                            ? "bg-red-500 text-white shadow-md scale-105"
                                            : "bg-[#F8F5F0] dark:bg-[#252529] text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-red-100 dark:hover:bg-red-900/30"
                                    }`}
                                >
                                    <span className="text-lg transition-transform group-hover:scale-110">👎</span>
                                    <span className="text-xs font-bold">
                                        {announcement.reaction_counts?.stars || 0}
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
});
AnnouncementItem.displayName = "AnnouncementItem";

// ===== CONTENT COMPONENT =====
export default function AnnouncementsView() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Loading announcements...</div>}>
            <AnnouncementsViewContent />
        </Suspense>
    );
}

function AnnouncementsViewContent() {
    const {
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
    } = useAnnouncements();

    const openLightbox = (media: any[], index: number) => {
        setLightboxMedia(media);
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxMedia([]);
        setLightboxIndex(0);
    };

    const goPrev = () => {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxMedia.length - 1));
    };

    const goNext = () => {
        setLightboxIndex((prev) => (prev < lightboxMedia.length - 1 ? prev + 1 : 0));
    };

    const handleShare = async (announcementId: string) => {
        const announcement = filteredAnnouncements.find((a: any) => a.id === announcementId);
        if (!announcement) return;
        const shareUrl = `${window.location.origin}/dashboard/announcements?announcementId=${announcementId}#announcement-${announcementId}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: announcement.title,
                    text: "",
                    url: shareUrl,
                });
            } catch (e) {
                if ((e as Error).name !== "AbortError") {
                    console.error("Share failed", e);
                    await navigator.clipboard.writeText(shareUrl);
                    alert("Link copied to clipboard!");
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            } catch (e) {
                const input = document.createElement("input");
                input.value = shareUrl;
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
                alert("Link copied to clipboard!");
            }
        }
    };

    if (user?.status === "PENDING") {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#7A1C1C] dark:bg-[#9B2323] flex items-center justify-center">
                            <Bell className="h-5 w-5 text-[#C9A227] dark:text-[#D4AF37]" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Announcements</h1>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Updates and notifications</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d] text-center shadow-sm">
                    <div className="w-12 h-12 bg-[#7A1C1C]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="h-6 w-6 text-[#7A1C1C] dark:text-[#D4AF37]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-2">Account Pending Approval</h2>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                        You will be able to view fellowship announcements once an administrator approves your account.
                    </p>
                </div>
            </div>
        );
    }

return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        {/* Top Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200/60 dark:border-zinc-800/60">

            {canCreateAnn && (
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="group flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#7A1C1C] to-[#992424] dark:from-[#D4AF37] dark:to-[#E5C158] text-white dark:text-zinc-950 shadow-md shadow-red-900/10 dark:shadow-yellow-500/10 hover:opacity-95 active:scale-[0.98] transition-all shrink-0 w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" /> 
                    <span>{showForm ? "Close Creator" : "New Announcement"}</span>
                </button>
            )}
        </div>

        {/* Create Form Section */}
        {showForm && (
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 shadow-xl overflow-hidden transform transition-all duration-300 ease-out animate-slide-up">
                {/* Modern Gradient Banner Header */}
                <div className="p-6 relative overflow-hidden bg-gradient-to-br from-[#7A1C1C] via-[#942222] to-[#C9A227] dark:from-[#D4AF37] dark:via-[#1E4D3A] dark:to-[#123024]">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-extrabold tracking-tight text-white dark:text-zinc-950">
                            Create Announcement
                        </h2>
                        <p className="text-white/80 dark:text-zinc-950/80 text-xs sm:text-sm mt-1 font-medium">
                            Share high-impact updates, rich media, and attachments
                        </p>
                    </div>
                </div>

                <form onSubmit={handleCreate} className="p-4 sm:p-6 space-y-6">
                    {/* Audience Selector Grid */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-zinc-300 block uppercase">
                            Target Audience
                        </label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100/80 dark:bg-zinc-950/50 rounded-xl border border-gray-200/40 dark:border-zinc-800/40">
                            {(["ALL", "CLASS"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setFormTarget(t)}
                                    className={`py-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all duration-200 ${
                                        formTarget === t
                                            ? "bg-white dark:bg-zinc-800 text-[#7A1C1C] dark:text-[#D4AF37] shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                            : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100"
                                    }`}
                                >
                                    {t === "ALL" ? "📢 Public" : "🔒 Class Only"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-zinc-300 block uppercase">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="e.g., Campus System Maintenance & Semester Upgrades"
                            className="w-full h-12 rounded-xl border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 text-sm px-4 dark:text-zinc-100 focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Editor Content Area */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-zinc-300 block uppercase">
                            Content Description <span className="text-red-500">*</span>
                        </label>
                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-[#C9A227] transition-all">
                            <RichTextEditor
                                content={formContent}
                                onChange={setFormContent}
                                placeholder="Write your announcement content here..."
                            />
                        </div>
                    </div>

                    {/* Media Attachments Dropzone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Dropzone Component */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-zinc-300 block uppercase">
                                Image Gallery
                            </label>
                            <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-[#C9A227] dark:hover:border-[#D4AF37] rounded-xl p-4 text-center transition-all bg-gray-50/30 dark:bg-zinc-950/10">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => e.target.files && uploadFiles(e.target.files, "image", setFormImageUrls)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="space-y-1 pointer-events-none">
                                    <div className="text-2xl mb-1">🖼️</div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Upload Images</p>
                                    <p className="text-[10px] text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            
                            {formImageUrls.length > 0 && (
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-400">{formImageUrls.length} image(s) uploaded</span>
                                        <button type="button" onClick={() => setFormImageUrls([])} className="text-xs text-red-500 hover:underline font-semibold">Clear gallery</button>
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                                        {formImageUrls.map((url: string, idx: number) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm group">
                                                <img src={url.startsWith("http") ? url : `${API_BASE}${url}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors shadow-md backdrop-blur-sm"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PDF Documents Dropzone */}
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-zinc-300 block uppercase">
                                PDF Attachments
                            </label>
                            <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-[#C9A227] dark:hover:border-[#D4AF37] rounded-xl p-4 text-center transition-all bg-gray-50/30 dark:bg-zinc-950/10">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    multiple
                                    onChange={(e) => e.target.files && uploadFiles(e.target.files, "pdf", setFormPdfUrls)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="space-y-1 pointer-events-none">
                                    <div className="text-2xl mb-1">📄</div>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Upload PDFs</p>
                                    <p className="text-[10px] text-gray-400">Official briefs or reference guides</p>
                                </div>
                            </div>

                            {formPdfUrls.length > 0 && (
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-400">{formPdfUrls.length} file(s) uploaded</span>
                                        <button type="button" onClick={() => setFormPdfUrls([])} className="text-xs text-red-500 hover:underline font-semibold">Clear files</button>
                                    </div>
                                    <div className="space-y-1.5 max-h-36 overflow-y-auto p-1">
                                        {formPdfUrls.map((url: string, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-950/40 px-3 py-2 rounded-lg border border-gray-100 dark:border-zinc-800/80 group">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-sm shrink-0">📄</span>
                                                    <a href={url.startsWith("http") ? url : `${API_BASE}${url}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] truncate hover:underline">
                                                        Attachment Reference #{idx + 1}
                                                    </a>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormPdfUrls((prev) => prev.filter((_, i) => i !== idx))}
                                                    className="text-gray-400 hover:text-red-500 p-0.5 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Media Link Input */}
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 dark:text-zinc-300 block uppercase">
                            Embedded Video Stream Link
                        </label>
                        <Input
                            type="url"
                            value={formVideoUrl}
                            onChange={(e) => setFormVideoUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full h-12 rounded-xl border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 text-sm px-4 dark:text-zinc-100 focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all"
                        />
                        {formVideoUrl && getEmbedUrl(formVideoUrl) && (
                            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800/80 shadow-md transform transition duration-300 hover:shadow-lg">
                                <iframe
                                    src={getEmbedUrl(formVideoUrl)!}
                                    className="w-full aspect-video"
                                    allowFullScreen
                                    title="Media preview"
                                />
                                <div className="p-2.5 bg-gray-50 dark:bg-zinc-950/50 border-t border-gray-100 dark:border-zinc-800/80 text-xs text-gray-500 flex items-center gap-2 font-medium">
                                    <span>{getPlatformInfo(formVideoUrl).icon}</span>
                                    <span>{getPlatformInfo(formVideoUrl).label} Stream Active</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error Alerts */}
                    {formError && (
                        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-xl font-medium border border-red-100 dark:border-red-950/50 flex items-center gap-2">
                            <span>⚠️</span> {formError}
                        </div>
                    )}

                    {/* Action Form Footer Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200/60 dark:border-zinc-800/60">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="w-full sm:flex-1 py-3 sm:py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs sm:text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:flex-2 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#7A1C1C] via-[#942222] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A] text-white dark:text-zinc-950 text-xs sm:text-sm font-bold shadow-lg shadow-red-900/10 dark:shadow-yellow-500/10 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 order-1 sm:order-2"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white dark:border-zinc-950/30 dark:border-t-zinc-950 rounded-full animate-spin" />
                                    <span>Publishing Update...</span>
                                </span>
                            ) : (
                                "Post Announcement"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* Loading Skeleton States */}
        {loading && (
            <div className="space-y-4">
                {[1, 2, 3].map((i: number) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200/60 dark:border-zinc-800/60 animate-pulse flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 shrink-0" />
                        <div className="flex-1 space-y-3 py-1">
                            <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-1/4" />
                            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-2/3" />
                            <div className="space-y-1.5">
                                <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-full" />
                                <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-5/6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Empty Inbox / Placeholder State */}
        {!loading && filteredAnnouncements.length === 0 && (
            <div className="text-center py-20 bg-gray-50/50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800/80 max-w-xl mx-auto px-4">
                <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-zinc-800 mx-auto mb-4 text-2xl">
                    🔔
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-tight">No notifications posted</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                    When public news feeds or target class feeds launch, logs appear directly within this view stack.
                </p>
            </div>
        )}

        {/* Primary Content Feeds Stack Component wrapper */}
        <div className="space-y-6">
            {filteredAnnouncements.map((a: any) => (
                <AnnouncementItem
                    key={a.id}
                    announcement={a}
                    isEditing={editingId === a.id}
                    editTarget={editTarget}
                    setEditTarget={setEditTarget}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    editImageUrls={editImageUrls}
                    setEditImageUrls={setEditImageUrls}
                    editVideoUrl={editVideoUrl}
                    setEditVideoUrl={setEditVideoUrl}
                    editPdfUrls={editPdfUrls}
                    setEditPdfUrls={setEditPdfUrls}
                    editSubmitting={editSubmitting}
                    editError={editError}
                    handleEdit={handleEdit}
                    setEditingId={setEditingId}
                    startEdit={startEdit}
                    handleDeleteAnnouncement={handleDeleteAnnouncement}
                    handleApprove={handleApprove}
                    handleReact={handleReact}
                    handleShare={handleShare}
                    openLightbox={openLightbox}
                    isChairman={isChairman}
                    isSecretariat={isSecretariat}
                    isServiceManager={isServiceManager}
                    user={user}
                    setRejectAnnouncementId={setRejectAnnouncementId}
                    setRejectDialogOpen={setRejectDialogOpen}
                    setDropdownOpen={setDropdownOpen}
                    dropdownOpen={dropdownOpen}
                    uploadFiles={uploadFiles}
                    API_BASE={API_BASE}
                />
            ))}
        </div>

        {/* Global Structural Core Modals (Lightbox / Dialog elements rest intact) */}
        <Lightbox
            isOpen={lightboxOpen}
            media={lightboxMedia}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
        />

        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent className="max-w-md rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-red-600 dark:text-[#D4AF37]">
                        Reject Announcement
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block">
                        Reason for rejection
                    </label>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide concrete contextual remarks for authorship modifications..."
                        className="w-full h-28 rounded-xl border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 text-sm p-3 dark:text-zinc-100 focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all resize-none"
                    />
                </div>
                <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} className="rounded-xl px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700">
                        Confirm Reject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
);
}
