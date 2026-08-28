// src/components/dashboard/NotificationDropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import apiClient from "@/api";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

type NotificationItem = {
    id: string;
    title?: string;
    message?: string;
    target_route?: string | null;
    is_read: boolean;
    created_at: string;
};

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

// ✅ Fix incorrect notification routes
function getCorrectRoute(target_route: string | null): string {
    if (!target_route) return "/dashboard";

    // ✅ Handle announcement notifications
    // Matches routes like "/announcements/abc-123" or "/dashboard/announcements/abc-123"
    const announcementMatch = target_route.match(/\/(?:dashboard\/)?announcements\/([a-f0-9-]+)/i);
    if (announcementMatch && announcementMatch[1]) {
        return `/dashboard/announcements?announcementId=${announcementMatch[1]}`;
    }

    // If it's exactly "/announcements" or "/dashboard/announcements" without an ID
    if (target_route.match(/\/(?:dashboard\/)?announcements\/?$/i)) {
        return "/dashboard/announcements";
    }

    // If already starts with /dashboard, keep it
    if (target_route.startsWith("/dashboard")) {
        return target_route;
    }

    // Handle old /member-affairs paths
    if (target_route.startsWith("/member-affairs")) {
        if (target_route.includes("/documents")) {
            return "/dashboard/member-affairs?tab=documents";
        }
        if (target_route.includes("/pending")) {
            return "/dashboard/member-affairs?tab=pending";
        }
        if (target_route.includes("/census")) {
            return "/dashboard/member-affairs?tab=census";
        }
        const queryIndex = target_route.indexOf("?");
        if (queryIndex !== -1) {
            const path = target_route.substring(0, queryIndex);
            const query = target_route.substring(queryIndex);
            return `/dashboard${path}${query}`;
        }
        return `/dashboard${target_route}`;
    }

    // For any other path, just prefix with /dashboard
    return `/dashboard${target_route}`;
}

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const res = await api.get("/notifications/unread-count");
            const data = res.data as any;
            setUnreadCount(typeof data?.unreadCount === "number" ? data.unreadCount : 0);
        } catch (e: any) {
            if (e.response?.status !== 403) {
                console.error("Failed to fetch unread count", e);
            }
        }
    };

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await apiClient.notifications.listNotifications({
                unread_only: false,
                limit: 5,
                offset: 0,
            });
            const data = res.data as any;
            setNotifications(data?.items || data || []);
            setUnreadCount(typeof data?.unreadCount === "number" ? data.unreadCount : 0);
        } catch (e: any) {
            if (e.response?.status !== 403) {
                console.error("Failed to fetch notifications", e);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
        intervalRef.current = setInterval(fetchUnreadCount, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [user]);

    const markAsRead = async (id: string, linkTarget?: string | null) => {
        try {
            await api.patch(`/notifications/${id}/read`);
        } catch (e) {
            console.error(e);
        }
        setNotifications((p) => p.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
        setUnreadCount((p) => Math.max(0, p - 1));
        setIsOpen(false);
        const correctedRoute = getCorrectRoute(linkTarget || null);
        router.push(correctedRoute);
    };

    const markAsReadOnly = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications((p) => p.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((p) => Math.max(0, p - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications((p) => p.filter((n) => n.id !== id));
            if (!notifications.find((n) => n.id === id)?.is_read) {
                setUnreadCount((p) => Math.max(0, p - 1));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.notifications.markAllRead();
            setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="relative p-2 rounded-xl hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#7A1C1C] dark:bg-[#8B2C2C] text-white text-[10px] font-bold">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-90 p-0 shadow-lg border-[#ddd8d0] dark:border-[#2a2a2d] bg-white dark:bg-[#1C1C1F]"
            >
                <div className="flex items-center justify-between p-4 border-b border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <h3 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#6b6b6b] hover:text-[#7A1C1C] dark:text-[#B0B0B0] dark:hover:text-[#D4AF37] flex items-center gap-1"
                        >
                            <Check className="w-3 h-3" /> Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-100 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id, notification.target_route)}
                                    className={`flex items-start gap-3 p-4 border-b border-[#ddd8d0] dark:border-[#2a2a2d] cursor-pointer hover:bg-[#F8F5F0] dark:hover:bg-[#2a2a2d] transition-colors ${
                                        !notification.is_read ? "bg-[#F8F5F0]/50 dark:bg-[#2a2a2d]/30" : ""
                                    }`}
                                >
                                    <Avatar className="h-10 w-10 shrink-0">
                                        <AvatarFallback className="bg-[#7A1C1C] dark:bg-[#9B2323] text-[#C9A227] dark:text-[#D4AF37] text-xs">
                                            {(notification.title || "N").slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        {notification.title && (
                                            <p className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37] truncate">
                                                {notification.title}
                                            </p>
                                        )}
                                        <p className="text-sm text-[#1a1a1a] dark:text-[#e0e0e0] line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">
                                            {formatRelativeTime(notification.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!notification.is_read && (
                                            <button
                                                onClick={(e: React.MouseEvent) => markAsReadOnly(notification.id, e)}
                                                className="p-1 hover:bg-[#F8F5F0] dark:hover:bg-[#252529] rounded transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e: React.MouseEvent) => deleteNotification(notification.id, e)}
                                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="w-2 h-2 rounded-full bg-[#7A1C1C] dark:bg-[#8B2C2C] shrink-0 mt-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <Link
                        href="/dashboard/notifications"
                        className="block text-center text-sm text-[#7A1C1C] dark:text-[#D4AF37] hover:underline"
                        onClick={() => setIsOpen(false)}
                    >
                        View all notifications
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}