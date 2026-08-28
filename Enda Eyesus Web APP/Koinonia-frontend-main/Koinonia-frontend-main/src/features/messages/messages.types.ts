export interface UserInfo {
    id: string;
    fullName: string;
    username: string;
    profileImage: string | null;
    role: string;
}

export interface Message {
    id: string;
    senderID: string;
    receiverID: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

export interface Conversation {
    user: UserInfo;
    lastMessage: Message;
    unreadCount: number;
}
