export type AgentRole = "admin" | "moderator" | "viewer";

export interface DashboardMetrics {
    totalUsers: number;
    pendingApprovals: number;
    activeClasses: number;
    suspendedUsers: number;
    genderData: { name: string; value: number }[];
    academicYearData: { name: string; value: number }[];
}

export interface AgentUser {
    id: string;
    fullName: string;
    username: string;
    department: string;
    serviceClass: string;
    status: "active" | "pending" | "suspended";
    profileImageUrl: string | null;
    role?: AgentRole;
}

export interface ApprovalRequest {
    id: string;
    userId: string;
    fullName: string;
    serviceClass: string;
    requestDate: string;
    status: "pending" | "approved" | "rejected";
}

export interface ActivityLog {
    id: string;
    action: string;
    performedBy: string;
    targetUser?: string;
    timestamp: string;
    status: "success" | "failed";
}

export interface RolePermission {
    role: AgentRole;
    manageUsers: boolean;
    manageApprovals: boolean;
    manageRoles: boolean;
    manageAnnouncements: boolean;
    viewLogs: boolean;
}
