//src/lib/chairmanApi.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';

const chairmanApi = axios.create({
    baseURL: `${API_BASE}/api/v1/admin`,
    withCredentials: true,
    timeout: 15000,
});

const announcementsApi = axios.create({
    baseURL: `${API_BASE}/api/v1/announcements`,
    withCredentials: true,
    timeout: 15000,
});

// Attach JWT token to every request
chairmanApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

announcementsApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chairmanApiService = {
    // Role Management
    assignRole: async (data: { targetUserId: string; role: string; serviceClassId?: string }) => {
        const response = await chairmanApi.post('/assign-role', data);
        return response.data;
    },

    revokeRole: async (userId: string) => {
        const response = await chairmanApi.delete(`/revoke-role/${userId}`);
        return response.data;
    },

    transferChairman: async (data: { targetUserId: string }) => {
        const response = await chairmanApi.post('/transfer-chairman', data);
        return response.data;
    },

    // Audit Logs
    getAuditLogs: async (params?: { entityType?: string; userId?: string; limit?: number; offset?: number }) => {
        const response = await chairmanApi.get('/audit-logs', { params });
        return response.data;
    },

    // Member Census
    getMemberCensus: async () => {
        const response = await chairmanApi.get('/member-census');
        return response.data;
    },

    // List users (for search)
    listUsers: async () => {
        const response = await chairmanApi.get('/users');
        return response.data;
    },

    // Service Classes
    listServiceClasses: async () => {
        const response = await axios.get(`${API_BASE}/api/v1/classes`, { withCredentials: true });
        return response.data;
    },

    // Announcements CRUD for Chairman
    updateAnnouncement: async (id: string, data: any) => {
        const response = await announcementsApi.patch(`/${id}`, data);
        return response.data;
    },

    deleteAnnouncement: async (id: string) => {
        const response = await announcementsApi.delete(`/${id}`);
        return response.data;
    },
};

export default chairmanApiService;
