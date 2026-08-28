import api from "@/lib/api";
import apiClient from "@/api";
import chairmanApiService from "@/lib/chairmanApi";

export const getAnnouncements = async () => {
    const res = await apiClient.announcements.listAnnouncements();
    return res.data;
};

export const approveAnnouncement = async (id: string) => {
    const res = await api.patch(`/announcements/${id}/approve`);
    return res.data;
};

export const rejectAnnouncement = async (id: string, reason: string) => {
    const res = await api.patch(`/announcements/${id}/reject`, { reason });
    return res.data;
};

export const reactToAnnouncement = async (id: string, type: "LIKE" | "STAR") => {
    const res = await apiClient.announcements.reactToAnnouncement(id, { type });
    return res.data;
};

export const updateAnnouncement = async (id: string, payload: any) => {
    const res = await chairmanApiService.updateAnnouncement(id, payload);
    return res.data || res;
};

export const deleteAnnouncement = async (id: string) => {
    const res = await chairmanApiService.deleteAnnouncement(id);
    return res.data || res;
};

export const createAnnouncement = async (payload: any) => {
    const res = await apiClient.announcements.createAnnouncement(payload as any);
    return res.data;
};

export const uploadMedia = async (type: "image" | "pdf", file: File) => {
    const fd = new FormData();
    fd.append(type, file);
    const res = await api.post(`/upload/${type}`, fd);
    return res.data.data?.[`${type}URL`] || res.data.url;
};
