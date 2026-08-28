import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { Conversation, Message, UserInfo } from "./messages.types";
import {
    getConversations,
    getMessages,
    searchUsers as searchUsersService,
    sendMessage as sendMessageService
} from "./messages.service";

export const useMessages = () => {
    const { user: currentUser } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConvos, setLoadingConvos] = useState(true);

    const [activeUser, setActiveUser] = useState<UserInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadConversations = async () => {
        setLoadingConvos(true);
        try {
            const res = await getConversations();
            setConversations(res.data.data);
        } catch (err) {
            console.error("Failed to load conversations");
        } finally {
            setLoadingConvos(false);
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadChat = async (targetUser: UserInfo) => {
        setActiveUser(targetUser);
        setLoadingMessages(true);
        try {
            const res = await getMessages(targetUser.id);
            setMessages(res.data.data);
            loadConversations();
        } catch (err) {
            console.error("Failed to load chat");
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await searchUsersService(query);
            setSearchResults(res.data.data);
        } catch (err) {
            console.error("Search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeUser || isSending) return;

        setIsSending(true);
        try {
            const res = await sendMessageService(activeUser.id, messageInput);
            setMessages(prev => [...prev, res.data.data]);
            setMessageInput("");
            loadConversations();
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setIsSending(false);
        }
    };

    return {
        currentUser,
        conversations,
        loadingConvos,
        activeUser, setActiveUser,
        messages,
        loadingMessages,
        searchQuery, setSearchQuery,
        searchResults, setSearchResults,
        isSearching,
        messageInput, setMessageInput,
        isSending,
        messagesEndRef,
        loadChat,
        handleSearch,
        sendMessage
    };
};
