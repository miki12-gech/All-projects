import apiClient from "@/api";

export const getAnnouncement = async (id: string) => {
    const res = await apiClient.announcements.listAnnouncements();
    const data = res.data;
    const items = Array.isArray(data) ? data : (data as any)?.items || [];
    const found = items.find((a: any) => a.id === id);
    if (!found) throw new Error("Announcement not found");
    return found;
};

export const commentOnAnnouncement = async (id: string, payload: any) => {
    return apiClient.announcements.commentOnAnnouncement(id, payload);
};

export const editComment = async (announcementId: string, commentId: string, payload: any) => {
    return apiClient.announcements.editComment(announcementId, commentId, payload);
};

export const deleteComment = async (announcementId: string, commentId: string) => {
    return apiClient.announcements.deleteComment(announcementId, commentId);
};

export const deleteAnnouncement = async (id: string) => {
    return apiClient.announcements.deleteAnnouncement(id);
};
