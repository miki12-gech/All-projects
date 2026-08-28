"use client";

import { Bell, Check, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./notifications.hooks";

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

export default function NotificationsView() {
    const {
        notifications,
        unreadCount,
        page, setPage,
        loading,
        totalPages,
        markAsRead,
        markAsReadOnly,
        deleteNotification,
        markAllAsRead
    } = useNotifications();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Notifications</h1>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        onClick={markAllAsRead}
                        variant="outline"
                        size="sm"
                        className="border-[#7A1C1C] text-[#7A1C1C] hover:bg-[#7A1C1C] hover:text-white dark:border-[#D4AF37] dark:text-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-[#0E0E0F]"
                    >
                        <Check className="h-4 w-4 mr-2" /> Mark all as read
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A1C1C] dark:border-[#D4AF37]" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-12 border border-[#ddd8d0] dark:border-[#2a2a2d] text-center">
                    <Bell className="h-12 w-12 text-[#6b6b6b] dark:text-[#B0B0B0] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] mb-2">No notifications</h3>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                        You&apos;re all caught up! Check back later for updates.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id, notification.target_route)}
                            className={`bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border transition-all cursor-pointer hover:shadow-md ${
                                !notification.is_read
                                    ? "border-[#7A1C1C] dark:border-[#D4AF37] bg-[#F8F5F0]/50 dark:bg-[#2a2a2d]/30"
                                    : "border-[#ddd8d0] dark:border-[#2a2a2d]"
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <Avatar className="h-12 w-12 shrink-0">
                                    <AvatarFallback className="bg-[#7A1C1C] dark:bg-[#9B2323] text-[#C9A227] dark:text-[#D4AF37] text-sm">
                                        {(notification.title || "N").slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {notification.title && (
                                                <h3 className="text-base font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mb-1">
                                                    {notification.title}
                                                </h3>
                                            )}
                                            {notification.message && (
                                                <p className="text-sm text-[#1a1a1a] dark:text-[#e0e0e0]">
                                                    {notification.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {!notification.is_read && (
                                                <Button
                                                    onClick={(e) => markAsReadOnly(notification.id, e)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-[#7A1C1C] dark:text-[#D4AF37] hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                onClick={(e) => deleteNotification(notification.id, e)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">
                                        {formatRelativeTime(notification.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        variant="outline"
                        size="sm"
                        className="border-[#ddd8d0] dark:border-[#2a2a2d]"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        variant="outline"
                        size="sm"
                        className="border-[#ddd8d0] dark:border-[#2a2a2d]"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
