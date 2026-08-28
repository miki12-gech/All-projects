import api from '@/lib/api';

export const announcementApi = {
    // List current user's announcements (all statuses)
    listMy: () => api.get('/announcements/my'),

    // Resubmit a rejected announcement
    resubmit: (id: string, data: any) => api.patch(`/announcements/${id}/resubmit`, data),

    // Delete an announcement (creator only)
    delete: (id: string) => api.delete(`/announcements/${id}`),

    // List all approved announcements (main feed)
    listApproved: () => api.get('/announcements'),

    // List pending announcements (secretariat only)
    listPending: () => api.get('/announcements/pending'),

    // Approve an announcement (secretariat only)
    approve: (id: string) => api.patch(`/announcements/${id}/approve`),

    // Reject an announcement (secretariat only)
    reject: (id: string, reason: string) => api.patch(`/announcements/${id}/reject`, { reason }),
};