import apiClient from "@/api";
import { Conversation, Message, UserInfo } from "./messages.types";

export const getConversations = async () => {
    return apiClient.instance.get<{ data: Conversation[] }>("/messages/conversations");
};

export const getMessages = async (userId: string) => {
    return apiClient.instance.get<{ data: Message[] }>(`/messages/${userId}`);
};

export const searchUsers = async (query: string) => {
    return apiClient.instance.get<{ data: UserInfo[] }>(`/messages/search-users?q=${encodeURIComponent(query)}`);
};

export const sendMessage = async (userId: string, content: string) => {
    return apiClient.instance.post<{ data: Message }>(`/messages/${userId}`, { content });
};
