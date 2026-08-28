// src/lib/types.ts
// Shared TypeScript types matching the backend exactly

export type Role = 'SUPER_ADMIN' | 'CLASS_LEADER' | 'MEMBER' | 'USER' | 'TEACHER' | 'SERVICE_MANAGER' | 'SECRETARIAT_SECRETARY' | 'SECRETARIAT_VICE' | 'SECRETARIAT_CHAIRMAN';
export type Status = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'PENDING_OFFICE_APPROVAL';
export type Sex = 'MALE' | 'FEMALE';
export type ClericalRank = 'NONE' | 'DEACON' | 'PRIEST' | 'LECTOR' | 'OTHER';
export type PostTargetType = 'GLOBAL' | 'CLASS';
export type ReactionType = 'LIKE' | 'DISLIKE';
export type AcademicYear =
    | 'YEAR_1' | 'YEAR_2' | 'YEAR_3' | 'YEAR_4'
    | 'YEAR_5' | 'YEAR_6' | 'YEAR_7' | 'YEAR_8'
    | 'POST_GRADUATE' | 'GRADUATED';

export interface ServiceClass {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    leaderID?: string | null;
    createdAt: string;
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    sex: Sex;
    clericalRank: ClericalRank;
    department: string;
    serviceClassID: string;
    classLeaderOf: string | null;
    email: string;
    phoneNumber: string;
    academicYear: AcademicYear;
    dormBlock?: string;
    dormRoom?: string;
    role: Role;
    status: Status;
    profileImage?: string | null;
    bio?: string | null;
    birthDate?: string | null;
    birthPlace?: string | null;
    createdAt: string;
    updatedAt: string;
    serviceClass?: { name: string };
}

export interface Post {
    id: string;
    authorID: string;
    author: Pick<User, 'id' | 'username' | 'fullName' | 'profileImage'>;
    title: string;
    content: string;
    imageURL?: string | null;
    targetType: PostTargetType;
    serviceClassID?: string | null;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: { reactions: number; comments: number };
}

export interface PostReaction {
    id: string;
    postID: string;
    userID: string;
    reactionType: ReactionType;
    createdAt: string;
}

export interface Comment {
    id: string;
    postID: string;
    userID: string;
    user: Pick<User, 'id' | 'username' | 'fullName' | 'profileImage'>;
    content: string;
    parentCommentID?: string | null;
    createdAt: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    targetType: 'ALL' | 'CLASS' | 'LEADERS';
    targetClassID?: string | null;
    createdBy: string;
    isPinned: boolean;
    scheduledAt?: string | null;
    createdAt: string;
    author?: Pick<User, 'id' | 'username' | 'fullName'>;
}

export interface AdminStats {
    totalUsers: number;
    byStatus: { status: Status; _count: { id: number } }[];
    byClass: { serviceClassID: string; _count: { id: number } }[];
    bySex: { sex: Sex; _count: { id: number } }[];
    byAcademicYear: { academicYear: AcademicYear; _count: { id: number } }[];
}

export type NotificationType = 'POST' | 'ANNOUNCEMENT' | 'REPLY' | 'MESSAGE';

export interface Notification {
    id: string;
    userID: string;
    actorID: string;
    actor: Pick<User, 'id' | 'fullName' | 'profileImage'>;
    type: NotificationType;
    content: string;
    linkTarget?: string | null;
    isRead: boolean;
    createdAt: string;
}

export interface Message {
    id: string;
    senderID: string;
    receiverID: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender?: Pick<User, 'id' | 'fullName' | 'profileImage' | 'username' | 'role'>;
    receiver?: Pick<User, 'id' | 'fullName' | 'profileImage' | 'username' | 'role'>;
}

export interface ApiResponse<T> {
    status: 'success' | 'fail' | 'error';
    data: T;
    message?: string;
}
