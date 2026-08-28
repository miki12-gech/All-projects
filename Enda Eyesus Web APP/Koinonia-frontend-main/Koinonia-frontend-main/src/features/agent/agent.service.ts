import apiClient from "@/api";
import { AdminStats, User } from "@/lib/types";

// All agent service functions use the real backend API
export const agentService = {
    // ── Stats ──────────────────────────────────────────────────────
    getMetrics: async (): Promise<AdminStats> => {
        const res = await apiClient.instance.get<{ data: AdminStats }>("/admin/dashboard-stats");
        return res.data.data;
    },

    // ── Users ──────────────────────────────────────────────────────
    getUsers: async (): Promise<User[]> => {
        const res = await apiClient.instance.get<{ data: User[] }>("/admin/users");
        return res.data.data;
    },

    approveUser: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/approve`);
        return true;
    },

    rejectUser: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/reject`);
        return true;
    },

    suspendUser: async (userId: string, reason: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/suspend`, { reason });
        return true;
    },

    promoteRole: async (userId: string, role: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/promote-role`, { role });
        return true;
    },

    changeClass: async (userId: string, serviceClassID: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/change-class`, { serviceClassID });
        return true;
    },

    // ── Leader Management ─────────────────────────────────────────
    promoteLeader: async (userId: string, classID: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/promote-leader`, { classID });
        return true;
    },

    demoteLeader: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/users/${userId}/demote-leader`);
        return true;
    },

    // ── Office (ፅሕፈት ቤት) ─────────────────────────────────────────
    getOffice: async () => {
        const res = await apiClient.instance.get<{ data: { officeMembers: User[]; unassignedMembers: User[] } }>("/admin/office");
        return res.data.data;
    },

    getPendingOffice: async (): Promise<User[]> => {
        const res = await apiClient.instance.get<{ data: User[] }>("/admin/office/pending");
        return res.data.data;
    },

    approveOffice: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/office/${userId}/approve`);
        return true;
    },

    disapproveOffice: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/office/${userId}/disapprove`);
        return true;
    },

    // ── Membership Review ──────────────────────────────────────────
    getPendingMemberships: async (): Promise<any[]> => {
        const res = await apiClient.instance.get<{ data: any[] }>("/membership/pending");
        return res.data.data;
    },

    getPendingClassAssignments: async (): Promise<any[]> => {
        const res = await apiClient.instance.get<{ data: any[] }>("/membership/pending-class");
        return res.data.data;
    },

    approveMembership: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/membership/${userId}/approve`);
        return true;
    },

    rejectMembership: async (userId: string, reason?: string): Promise<boolean> => {
        await apiClient.instance.patch(`/membership/${userId}/reject`, { reason });
        return true;
    },

    confirmClass: async (userId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/membership/${userId}/confirm-class`);
        return true;
    },

    rejectClass: async (userId: string, reason?: string): Promise<boolean> => {
        await apiClient.instance.patch(`/membership/${userId}/reject-class`, { reason });
        return true;
    },

    // ── Sub-Classes ────────────────────────────────────────────────
    getSubClasses: async (): Promise<any[]> => {
        const res = await apiClient.instance.get("/admin/subclasses");
        return res.data.data;
    },

    createSubClass: async (name: string): Promise<any> => {
        const res = await apiClient.instance.post("/admin/subclasses", { name });
        return res.data.data;
    },

    updateSubClassRoles: async (subClassId: string, roles: any): Promise<any> => {
        const res = await apiClient.instance.patch(`/admin/subclasses/${subClassId}/roles`, roles);
        return res.data.data;
    },

    // ── Sub-Class Approvals ─────────────────────────────────────────
    getPendingSubClassApprovals: async (): Promise<any[]> => {
        const res = await apiClient.instance.get<{ data: any[] }>("/admin/subclasses/pending-approvals");
        return res.data.data;
    },

    approveSubClass: async (subClassId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/subclasses/${subClassId}/approve`);
        return true;
    },

    rejectSubClass: async (subClassId: string): Promise<boolean> => {
        await apiClient.instance.patch(`/admin/subclasses/${subClassId}/reject`);
        return true;
    }
};
