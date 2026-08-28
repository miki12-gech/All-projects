import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { NotificationItem } from "./notifications.types";
import {
    listNotifications,
    markAsRead as markAsReadService,
    deleteNotification as deleteNotificationService,
    markAllRead as markAllReadService
} from "./notifications.service";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const pageSize = 20;

    const fetchNotifications = async (currentPage: number = page) => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await listNotifications({
                unread_only: false,
                limit: pageSize,
                offset: currentPage * pageSize,
            });
            const data = res.data as { items?: NotificationItem[], total?: number, unreadCount?: number };
            setNotifications(data?.items || []);
            setTotal(data?.total || 0);
            setUnreadCount(typeof data?.unreadCount === "number" ? data.unreadCount : 0);
        } catch (err: unknown) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, page]);

    const markAsRead = async (id: string, linkTarget?: string | null) => {
        try {
            await markAsReadService(id);
            setNotifications((p) => p.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((p) => Math.max(0, p - 1));
            if (linkTarget) router.push(linkTarget);
        } catch (e) {
            console.error(e);
        }
    };

    const markAsReadOnly = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await markAsReadService(id);
            setNotifications((p) => p.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((p) => Math.max(0, p - 1));
        } catch (e) {
            console.error(e);
        }
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteNotificationService(id);
            setNotifications((p) => p.filter((n) => n.id !== id));
            setTotal((p) => Math.max(0, p - 1));
            if (!notifications.find((n) => n.id === id)?.is_read) {
                setUnreadCount((p) => Math.max(0, p - 1));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllReadService();
            setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error(e);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return {
        notifications,
        unreadCount,
        page, setPage,
        loading,
        totalPages,
        markAsRead,
        markAsReadOnly,
        deleteNotification,
        markAllAsRead
    };
};
