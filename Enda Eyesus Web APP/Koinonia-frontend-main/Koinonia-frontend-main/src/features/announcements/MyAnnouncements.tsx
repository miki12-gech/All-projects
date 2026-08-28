"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementApi } from './announcementApi';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { useState, type CSSProperties } from 'react';
import {
    Edit, Trash2, RefreshCw, File, X, Clock, CheckCircle2,
    XCircle, Globe, Lock, Stamp, ScrollText, Image as ImageIcon,
    Link2, PenLine,
} from 'lucide-react';
import api from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

interface Announcement {
    id: string;
    title: string;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT';
    is_public: boolean;
    rejection_reason?: string | null;
    created_at?: string;
    published_at?: string;
    image_url?: string | string[] | null;
    video_url?: string | string[] | null;
    pdf_url?: string | string[] | null;
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

// Each status gets a fixed ink color and a fixed stamp tilt — not randomized,
// so the "impressed on paper" feel stays stable across re-renders.
const STATUS_CONFIG = {
    PENDING:  { label: 'Pending Review', short: 'PENDING',  icon: Clock,        ink: '#9A6B0C', paper: '#FBF1D9', rotate: -7 },
    APPROVED: { label: 'Approved',       short: 'APPROVED', icon: CheckCircle2, ink: '#1E4D3A', paper: '#E4EFE8', rotate: 4 },
    REJECTED: { label: 'Rejected',       short: 'REJECTED', icon: XCircle,      ink: '#9A2A2A', paper: '#F8E6E6', rotate: -4 },
    DRAFT:    { label: 'Draft',          short: 'DRAFT',    icon: PenLine,      ink: '#5B5750', paper: '#EEEBE3', rotate: 6 },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;
const FILTERS: Array<{ key: 'ALL' | StatusKey; label: string }> = [
    { key: 'ALL', label: 'All notices' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
];

function StampBadge({ status }: { status: StatusKey }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <div
            className="stamp-badge shrink-0 select-none"
            style={{
                '--stamp-ink': cfg.ink,
                '--stamp-paper': cfg.paper,
                '--stamp-rotate': `${cfg.rotate}deg`,
            } as CSSProperties}
            aria-label={`Status: ${cfg.label}`}
        >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
            <span>{cfg.short}</span>
        </div>
    );
}

export default function MyAnnouncements() {
    const queryClient = useQueryClient();
    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
    const [editVideoUrl, setEditVideoUrl] = useState<string>('');
    const [editPdfUrls, setEditPdfUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState<'ALL' | StatusKey>('ALL');

    const { data: myData, isLoading, refetch } = useQuery({
        queryKey: ['my-announcements'],
        queryFn: announcementApi.listMy,
    });
    const announcements: Announcement[] = myData?.data?.data || [];
    const visible = filter === 'ALL' ? announcements : announcements.filter(a => a.status === filter);

    const uploadFiles = async (files: FileList, type: "image" | "pdf"): Promise<string[]> => {
        const uploadPromises = Array.from(files).map(async (file: File) => {
            const fd = new FormData();
            fd.append(type, file);
            const res = await api.post(`/upload/${type}`, fd);
            return res.data.data?.[`${type}URL`] || res.data.url;
        });
        return Promise.all(uploadPromises);
    };

    const resubmitMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return announcementApi.resubmit(id, {
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrls?.length > 0 ? data.imageUrls : null,
                videoUrl: data.videoUrl ? [data.videoUrl] : null,
                pdfUrl: data.pdfUrls?.length > 0 ? data.pdfUrls : null,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-announcements'] });
            setEditId(null);
            resetEditForm();
            refetch();
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to resubmit announcement');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => announcementApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-announcements'] });
            refetch();
        },
    });

    const resetEditForm = () => {
        setEditTitle('');
        setEditContent('');
        setEditImageUrls([]);
        setEditVideoUrl('');
        setEditPdfUrls([]);
        setIsSubmitting(false);
    };

    const openEditDialog = (announcement: Announcement) => {
        setEditId(announcement.id);
        setEditTitle(announcement.title);
        setEditContent(announcement.content);
        const parseMedia = (field: any) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try { return JSON.parse(field); } catch { return []; }
        };
        setEditImageUrls(parseMedia(announcement.image_url));
        const videoUrls = parseMedia(announcement.video_url);
        setEditVideoUrl(videoUrls.length > 0 ? videoUrls[0] : '');
        setEditPdfUrls(parseMedia(announcement.pdf_url));
    };

    const handleResubmit = async () => {
        if (!editTitle.trim() || !editContent.trim()) {
            alert('Title and content are required.');
            return;
        }
        setIsSubmitting(true);
        try {
            await resubmitMutation.mutateAsync({
                id: editId!,
                data: { title: editTitle, content: editContent, imageUrls: editImageUrls, videoUrl: editVideoUrl, pdfUrls: editPdfUrls },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const editingAnnouncement = announcements.find(a => a.id === editId) || null;

    // Rejection note shown once at the top of the resubmit form.
    const renderRejectionNote = (ann: Announcement) => {
        if (ann.status !== 'REJECTED' || !ann.rejection_reason) return null;
        return (
            <div className="flex gap-2.5 items-start border-l-2 border-[#C0433F] bg-[#FBF0EE] dark:bg-red-900/10 rounded-r-lg px-3 py-2.5 -mt-1">
                <XCircle className="h-3.5 w-3.5 text-[#C0433F] shrink-0 mt-0.5" />
                <div className="min-w-0">
                    <span className="font-mono-label text-[10px] tracking-wide uppercase text-[#C0433F] block mb-0.5">
                        Why it was rejected
                    </span>
                    <span className="text-[13px] italic font-display text-[#7A3B38] dark:text-red-300 break-words">
                        {ann.rejection_reason}
                    </span>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="notice-board flex items-center justify-center min-h-[280px] rounded-2xl">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-9 w-9 rounded-full border-[3px] border-[#7A1C1C]/25 border-t-[#7A1C1C] dark:border-[#D4AF37]/25 dark:border-t-[#D4AF37] animate-spin motion-reduce:animate-none" />
                    <span className="font-mono text-[11px] tracking-widest uppercase text-[#8C8578] dark:text-[#8C8578]">
                        Retrieving notices…
                    </span>
                </div>
            </div>
        );
    }

    const pendingCount = announcements.filter((a: Announcement) => a.status === 'PENDING').length;

    return (
        <div className="notice-board w-full space-y-6 rounded-2xl p-1">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
            `}</style>
            <style jsx>{`
                .notice-board {
                    background-color: #FAF6EE;
                    background-image:
                        radial-gradient(circle at 100% 0%, rgba(122,28,28,0.04), transparent 45%),
                        radial-gradient(circle at 0% 100%, rgba(201,162,39,0.06), transparent 45%);
                }
                :global(.dark) .notice-board {
                    background-color: #17151A;
                    background-image:
                        radial-gradient(circle at 100% 0%, rgba(212,175,55,0.05), transparent 45%),
                        radial-gradient(circle at 0% 100%, rgba(30,77,58,0.10), transparent 45%);
                }
                .font-display { font-family: 'Fraunces', Georgia, serif; }
                .font-mono-label { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

                .stamp-badge {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 10px 5px 9px;
                    border-radius: 9999px;
                    border: 1.5px dashed var(--stamp-ink);
                    color: var(--stamp-ink);
                    background: color-mix(in srgb, var(--stamp-paper) 88%, transparent);
                    font-family: 'IBM Plex Mono', ui-monospace, monospace;
                    font-size: 10.5px;
                    letter-spacing: 0.06em;
                    font-weight: 500;
                    transform: rotate(var(--stamp-rotate));
                    animation: stamp-in 380ms cubic-bezier(.2,1.4,.4,1) both;
                }
                :global(.dark) .stamp-badge {
                    background: color-mix(in srgb, var(--stamp-paper) 16%, #1C1C1F 84%);
                }
                @keyframes stamp-in {
                    0% { transform: rotate(var(--stamp-rotate)) scale(1.7); opacity: 0; }
                    60% { transform: rotate(var(--stamp-rotate)) scale(0.94); opacity: 1; }
                    100% { transform: rotate(var(--stamp-rotate)) scale(1); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .stamp-badge { animation: none; }
                }

                .notice-card {
                    animation: notice-drop 420ms cubic-bezier(.2,.8,.3,1) both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .notice-card { animation: none; }
                }
                @keyframes notice-drop {
                    0% { opacity: 0; transform: translateY(10px) rotate(-0.4deg); }
                    100% { opacity: 1; transform: translateY(0) rotate(0deg); }
                }

                .torn-edge {
                    background-image: linear-gradient(115deg, transparent 49%, currentColor 49% 51%, transparent 51%),
                                       linear-gradient(65deg, transparent 49%, currentColor 49% 51%, transparent 51%);
                    background-size: 14px 6px;
                    background-position: top left;
                    background-repeat: repeat-x;
                    height: 6px;
                    color: #EADFC4;
                }
                :global(.dark) .torn-edge { color: #2a2a2d; }

                .ledger-input {
                    border: none;
                    border-bottom: 1.5px solid #DCD3BE;
                    border-radius: 0;
                    background: transparent;
                    padding: 6px 2px;
                }
                :global(.dark) .ledger-input { border-bottom-color: #35333a; }
                .ledger-input:focus {
                    outline: none;
                    border-bottom-color: #C9A227;
                }
            `}</style>

            {/* ── MASTHEAD ── */}
            <div className="flex flex-col gap-4 px-3 pt-2">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <span className="font-mono-label text-[10px] tracking-[0.2em] uppercase text-[#8C8578] dark:text-[#8C8578]">
                            Bulletin · Personal Board
                        </span>
                        <h2 className="font-display text-2xl sm:text-[28px] font-semibold text-[#3A1414] dark:text-[#F0E6C8] leading-tight mt-0.5">
                            My Announcements
                        </h2>
                    </div>
                    {pendingCount > 0 && (
                        <div className="shrink-0 flex items-center gap-1.5 font-mono-label text-[11px] text-[#9A6B0C] dark:text-[#D9B45A] pt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {pendingCount} awaiting review
                        </div>
                    )}
                </div>

                {/* Folder-tab filters */}
                <div className="flex items-center gap-1 border-b border-[#ddd8d0] dark:border-[#2a2a2d]">
                    {FILTERS.map(f => {
                        const active = filter === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`relative font-mono-label text-[11px] tracking-wide uppercase px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-1 rounded-t-md ${
                                    active
                                        ? 'text-[#7A1C1C] dark:text-[#D4AF37]'
                                        : 'text-[#9b9b9b] hover:text-[#6b6b6b] dark:hover:text-[#B0B0B0]'
                                }`}
                            >
                                {f.label}
                                {active && (
                                    <span className="absolute left-2 right-2 -bottom-[1.5px] h-[2px] bg-[#7A1C1C] dark:bg-[#D4AF37] rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── EMPTY STATE ── */}
            {visible.length === 0 ? (
                <div className="w-full text-center py-16 px-6 border-2 border-dashed border-[#ddd8d0] dark:border-[#2a2a2d] rounded-2xl mx-1">
                    <ScrollText className="h-7 w-7 mx-auto text-[#C9A227] dark:text-[#D4AF37] mb-3" strokeWidth={1.5} />
                    <p className="font-display text-lg text-[#3A1414] dark:text-[#F0E6C8] mb-1">
                        {filter === 'ALL' ? 'The board is empty' : `No ${filter.toLowerCase()} notices`}
                    </p>
                    <p className="text-[#8C8578] text-sm">
                        {filter === 'ALL' ? 'Post an announcement and it will appear here.' : 'Try a different filter above.'}
                    </p>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
                    {visible.map((ann: Announcement, idx: number) => {
                        const cfg = STATUS_CONFIG[ann.status] ?? STATUS_CONFIG.DRAFT;
                        const isRejected = ann.status === 'REJECTED';
                        const isApproved = ann.status === 'APPROVED';

                        return (
                            <div
                                key={ann.id}
                                className="notice-card group relative bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#EADFC4] dark:border-[#2a2a2d] shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_20px_-12px_rgba(58,20,20,0.25)] overflow-visible"
                                style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}
                            >
                                <div className="torn-edge rounded-t-2xl" />

                                {/* Stamp overlapping top-right corner */}
                                <div className="absolute -top-3 -right-2 z-10">
                                    <StampBadge status={(ann.status in STATUS_CONFIG ? ann.status : 'DRAFT') as StatusKey} />
                                </div>

                                <div className="p-4 sm:p-5 pt-5">
                                    <h3 className="font-display font-semibold text-base sm:text-lg text-[#221D1A] dark:text-[#F5F5F5] pr-16 break-words leading-snug">
                                        {ann.title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                        <span className={`inline-flex items-center gap-1 font-mono-label text-[10px] tracking-wide px-2 py-0.5 rounded-full ${
                                            ann.is_public
                                                ? 'bg-[#EAF1F6] text-[#2C5A78] dark:bg-blue-900/20 dark:text-blue-300'
                                                : 'bg-[#F1EAF6] text-[#6B3A78] dark:bg-purple-900/20 dark:text-purple-300'
                                        }`}>
                                            {ann.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                            {ann.is_public ? 'Public' : 'Class only'}
                                        </span>
                                        <span className="font-mono-label text-[10px] text-[#9b9b9b] dark:text-[#6b6b6b]">
                                            {new Date(ann.created_at || ann.published_at || Date.now()).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div
                                        className="mt-3 w-full overflow-hidden text-[13.5px] leading-relaxed text-[#6b645a] dark:text-[#B0B0B0] line-clamp-2 [&>*]:max-w-full [&_img]:max-w-full [&_table]:max-w-full [&_table]:table-fixed"
                                        dangerouslySetInnerHTML={{ __html: ann.content }}
                                    />

                                    {isRejected && ann.rejection_reason && (
                                        <div className="mt-3 w-full flex gap-2.5 items-start border-l-2 border-[#C0433F] bg-[#FBF0EE] dark:bg-red-900/10 rounded-r-lg px-3 py-2.5">
                                            <XCircle className="h-3.5 w-3.5 text-[#C0433F] shrink-0 mt-0.5" />
                                            <div className="min-w-0">
                                                <span className="font-mono-label text-[10px] tracking-wide uppercase text-[#C0433F] block mb-0.5">
                                                    Reviewer's note
                                                </span>
                                                <span className="text-[13px] italic font-display text-[#7A3B38] dark:text-red-300 break-words">
                                                    {ann.rejection_reason}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {(isRejected || !isApproved) && (
                                        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#F0EBDD] dark:border-[#2a2a2d]">
                                            {isRejected && (
                                                <button
                                                    onClick={() => openEditDialog(ann)}
                                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#9A6B0C] hover:bg-[#7f590a] active:scale-[0.97] text-white text-xs h-9 px-4 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Edit &amp; resubmit
                                                </button>
                                            )}
                                            {!isApproved && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this announcement?')) {
                                                            deleteMutation.mutate(ann.id);
                                                        }
                                                    }}
                                                    className={`${isRejected ? '' : 'flex-1 sm:flex-none'} inline-flex items-center justify-center gap-1.5 text-[#A32638] hover:bg-[#FBF0EE] active:scale-[0.97] dark:text-red-400 dark:hover:bg-red-900/20 h-9 px-4 rounded-xl text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2`}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── EDIT & RESUBMIT — "official form" dialog ── */}
            {editId && editingAnnouncement && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#221D1A]/50 backdrop-blur-[2px] p-0 sm:p-4"
                    onClick={() => setEditId(null)}
                >
                    <div
                        className="w-full sm:max-w-2xl max-h-[94dvh] sm:max-h-[90vh] overflow-y-auto bg-[#FDFBF6] dark:bg-[#1C1C1F] rounded-t-2xl sm:rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Masthead */}
                        <div className="relative p-5 sm:p-6 bg-[#3A1414] dark:bg-[#151317] rounded-t-2xl overflow-hidden">
                            <div className="absolute -right-4 -top-6 opacity-15">
                                <Stamp className="h-28 w-28 text-[#D4AF37]" strokeWidth={1} />
                            </div>
                            <span className="font-mono-label text-[10px] tracking-[0.2em] uppercase text-[#D9B45A]">
                                Resubmission form
                            </span>
                            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F5EFDD] mt-1">
                                Edit &amp; resubmit
                            </h3>
                            <p className="text-[#D9CBAE] text-xs sm:text-sm mt-1 max-w-md">
                                Revise the notice below. It re-enters the review queue once submitted.
                            </p>
                        </div>

                        <div className="p-5 sm:p-6 space-y-6">
                            {renderRejectionNote(editingAnnouncement)}

                            {/* Title — ledger line */}
                            <div>
                                <label className="font-mono-label text-[10px] tracking-wide uppercase text-[#8C8578] block mb-1">
                                    Title <span className="text-[#A32638]">*</span>
                                </label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Enter announcement title…"
                                    className="ledger-input w-full font-display text-lg text-[#221D1A] dark:text-[#F5F5F5]"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="font-mono-label text-[10px] tracking-wide uppercase text-[#8C8578] block mb-1.5">
                                    Content <span className="text-[#A32638]">*</span>
                                </label>
                                <RichTextEditor
                                    content={editContent}
                                    onChange={setEditContent}
                                    placeholder="Write your announcement content…"
                                />
                            </div>

                            {/* Attachments — images */}
                            <div>
                                <label className="font-mono-label text-[10px] tracking-wide uppercase text-[#8C8578] flex items-center gap-1.5 mb-1.5">
                                    <ImageIcon className="h-3 w-3" /> Images
                                </label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={async (e) => {
                                            if (e.target.files?.length) {
                                                try {
                                                    const urls = await uploadFiles(e.target.files, 'image');
                                                    setEditImageUrls((prev: string[]) => [...prev, ...urls]);
                                                } catch (err) {
                                                    alert('Image upload failed. Please check file size and format.');
                                                    console.error(err);
                                                }
                                            }
                                        }}
                                        className="w-full text-sm text-[#8C8578] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#7A1C1C] file:text-white hover:file:bg-[#9A6B0C] dark:file:bg-[#D4AF37] dark:file:text-[#0E0E0F]"
                                    />
                                    {editImageUrls.length > 0 && (
                                        <button type="button" onClick={() => setEditImageUrls([])} className="shrink-0 text-sm text-[#A32638] hover:underline font-medium">
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                {editImageUrls.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                                        {editImageUrls.map((url: string, idx: number) => (
                                            <div key={idx} className="relative aspect-square">
                                                <img
                                                    src={url.startsWith('http') ? url : `${API_BASE}${url}`}
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-lg border border-[#EADFC4] dark:border-[#2a2a2d]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditImageUrls((prev: string[]) => prev.filter((_: string, i: number) => i !== idx))}
                                                    className="absolute -top-1.5 -right-1.5 bg-[#A32638] text-white rounded-full w-5 h-5 text-xs font-bold shadow hover:bg-[#8a1f2e] flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Media link */}
                            <div>
                                <label className="font-mono-label text-[10px] tracking-wide uppercase text-[#8C8578] flex items-center gap-1.5 mb-1.5">
                                    <Link2 className="h-3 w-3" /> Media link
                                    <span className="normal-case font-normal text-[#B0A88F]">· YouTube · TikTok · Vimeo · Drive · Telegram</span>
                                </label>
                                <input
                                    type="url"
                                    value={editVideoUrl}
                                    onChange={(e) => setEditVideoUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=…"
                                    className="ledger-input w-full text-sm text-[#221D1A] dark:text-[#F5F5F5]"
                                />
                                {editVideoUrl && getEmbedUrl(editVideoUrl) && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-[#EADFC4] dark:border-[#2a2a2d] shadow-sm">
                                        <iframe src={getEmbedUrl(editVideoUrl)!} className="w-full aspect-video" allowFullScreen title="Media preview" />
                                        <div className="p-2 bg-[#F8F5F0] dark:bg-[#252529] font-mono-label text-[10px] text-[#8C8578] flex items-center gap-2">
                                            <span>{getPlatformInfo(editVideoUrl).icon}</span>
                                            <span>{getPlatformInfo(editVideoUrl).label}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PDFs */}
                            <div>
                                <label className="font-mono-label text-[10px] tracking-wide uppercase text-[#8C8578] flex items-center gap-1.5 mb-1.5">
                                    <File className="h-3 w-3" /> PDFs
                                </label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        onChange={async (e) => {
                                            if (e.target.files?.length) {
                                                try {
                                                    const urls = await uploadFiles(e.target.files, 'pdf');
                                                    setEditPdfUrls((prev: string[]) => [...prev, ...urls]);
                                                } catch (err) {
                                                    alert('PDF upload failed. Please check file size and format.');
                                                    console.error(err);
                                                }
                                            }
                                        }}
                                        className="w-full text-sm text-[#8C8578] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#7A1C1C] file:text-white hover:file:bg-[#9A6B0C] dark:file:bg-[#D4AF37] dark:file:text-[#0E0E0F]"
                                    />
                                    {editPdfUrls.length > 0 && (
                                        <button type="button" onClick={() => setEditPdfUrls([])} className="shrink-0 text-sm text-[#A32638] hover:underline font-medium">
                                            Clear all
                                        </button>
                                    )}
                                </div>
                                {editPdfUrls.length > 0 && (
                                    <div className="flex flex-col gap-2 mt-3">
                                        {editPdfUrls.map((url: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 bg-[#F8F5F0] dark:bg-[#252529] px-4 py-3 rounded-xl border border-[#EADFC4] dark:border-[#2a2a2d]">
                                                <File className="h-4 w-4 text-[#7A1C1C] dark:text-[#D4AF37] shrink-0" />
                                                <a
                                                    href={url.startsWith('http') ? url : `${API_BASE}${url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 min-w-0 text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37] hover:underline truncate"
                                                >
                                                    Attachment {idx + 1}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditPdfUrls((prev: string[]) => prev.filter((_: string, i: number) => i !== idx))}
                                                    className="shrink-0 text-[#A32638] hover:text-[#8a1f2e]"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-6 border-t border-[#EADFC4] dark:border-[#2a2a2d] bg-[#F8F3E6] dark:bg-[#0E0E0F] rounded-b-2xl">
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between w-full gap-3">
                                <button
                                    onClick={() => setEditId(null)}
                                    className="w-full sm:w-auto px-6 h-11 rounded-xl border border-[#EADFC4] dark:border-[#2a2a2d] text-[#8C8578] hover:bg-[#F1EADA] dark:hover:bg-[#252529] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResubmit}
                                    disabled={isSubmitting || !editTitle.trim() || !editContent.trim()}
                                    className="w-full sm:w-auto px-8 h-11 rounded-xl bg-[#7A1C1C] hover:bg-[#5f1515] dark:bg-[#D4AF37] dark:hover:bg-[#c2a032] text-white dark:text-[#0E0E0F] font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" />
                                            Submitting…
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <RefreshCw className="h-4 w-4" />
                                            Resubmit for approval
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}