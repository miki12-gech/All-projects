import apiClient from "@/api";
import api from "@/lib/api";

export const listNotifications = async (payload: { unread_only: boolean, limit: number, offset: number }) => {
    return apiClient.notifications.listNotifications(payload);
};

export const markAsRead = async (id: string) => {
    return api.patch(`/notifications/${id}/read`);
};

export const deleteNotification = async (id: string) => {
    return api.delete(`/notifications/${id}`);
};

export const markAllRead = async () => {
    return apiClient.notifications.markAllRead();
};
