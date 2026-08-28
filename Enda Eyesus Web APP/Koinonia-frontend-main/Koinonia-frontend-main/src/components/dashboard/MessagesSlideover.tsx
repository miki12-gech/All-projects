"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import apiClient from "@/api";
import { Message, User } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MessagesSlideover() {
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<{ user: Pick<User, 'id' | 'fullName' | 'profileImage' | 'role'>, latest: Message }[]>([]);
    const [activeChat, setActiveChat] = useState<{ id: string, name: string, role: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);

    const currentUser = useAuthStore((s) => s.user);

    useEffect(() => {
        if (isOpen && currentUser) {
            loadConversations();
        }
    }, [isOpen, currentUser]);

    useEffect(() => {
        if (activeChat) {
            loadChatHistory(activeChat.id);
            // Polling for active chat
            const interval = setInterval(() => loadChatHistory(activeChat.id), 10000);
            return () => clearInterval(interval);
        }
    }, [activeChat]);

    const loadConversations = async () => {
        try {
            const res = await apiClient.instance.get<{ data: any }>('/messages/conversations');
            setConversations(res.data.data);
        } catch (e) { console.error(e); }
    };

    const loadChatHistory = async (userId: string) => {
        setLoading(true);
        try {
            const res = await apiClient.instance.get<{ data: Message[] }>(`/messages/${userId}`);
            setMessages(res.data.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || !activeChat) return;
        const text = inputText;
        setInputText("");

        // Optimistic UI
        const tempMsg: Message = {
            id: 'temp-' + Date.now(),
            content: text,
            senderID: currentUser!.id,
            receiverID: activeChat.id,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [tempMsg, ...prev]);

        try {
            const res = await apiClient.instance.post<{ data: Message }>(`/messages/${activeChat.id}`, { content: text });
            setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.data.data : m));
            loadConversations(); // Update side list preview
        } catch (e) {
            console.error("Failed to send message", e);
            // Revert on fail
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className="relative p-2 rounded-xl hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors"
                    aria-label="Messages"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-5 w-5 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                </button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:max-w-md p-0 flex flex-col border-l border-[#ddd8d0] dark:border-[#2a2a2d] bg-white dark:bg-[#1C1C1F]">
                <SheetHeader className="p-4 border-b border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <SheetTitle className="text-[#7A1C1C] dark:text-[#D4AF37] flex items-center gap-2">
                        {activeChat ? (
                            <button onClick={() => setActiveChat(null)} className="hover:bg-[#F8F5F0] dark:hover:bg-[#252529] p-1 rounded-md text-xs font-medium text-[#6b6b6b]">
                                ← Back
                            </button>
                        ) : "Direct Messages"}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {!activeChat ? (
                        // Conversations List
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {conversations.length === 0 ? (
                                <p className="text-center text-sm text-[#6b6b6b] mt-10">No messages yet.</p>
                            ) : (
                                conversations.map(conv => (
                                    <div
                                        key={conv.user.id}
                                        onClick={() => setActiveChat({ id: conv.user.id, name: conv.user.fullName, role: conv.user.role })}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F5F0] dark:hover:bg-[#252529] cursor-pointer transition-colors border border-transparent hover:border-[#ddd8d0] dark:hover:border-[#2a2a2d]"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-[#7A1C1C] text-white text-xs">
                                                {conv.user.fullName.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] truncate">{conv.user.fullName}</p>
                                            </div>
                                            <p className={`text-xs truncate ${!conv.latest.isRead && conv.latest.receiverID === currentUser?.id ? 'text-[#7A1C1C] dark:text-[#D4AF37] font-semibold' : 'text-[#6b6b6b] dark:text-[#B0B0B0]'}`}>
                                                {conv.latest.senderID === currentUser?.id ? 'You: ' : ''}{conv.latest.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        // Chat Window
                        <div className="flex flex-col h-full">
                            <div className="p-3 bg-[#F8F5F0] dark:bg-[#252529] border-b border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <p className="font-semibold text-sm text-[#7A1C1C] dark:text-[#D4AF37]">{activeChat.name}</p>
                                <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">{activeChat.role.replace('_', ' ')}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                                {messages.map(msg => {
                                    const isMe = msg.senderID === currentUser?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-[#7A1C1C] text-white rounded-br-none' : 'bg-[#F8F5F0] dark:bg-[#2a2a2d] text-[#1a1a1a] dark:text-[#F5F5F5] rounded-bl-none border border-[#ddd8d0] dark:border-[#3a3a3d]'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-[#ddd8d0] dark:border-[#2a2a2d] bg-white dark:bg-[#1C1C1F]">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-[#F8F5F0] dark:bg-[#252529] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-full px-4 py-2 text-sm outline-none focus:border-[#C9A227] transition-colors"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!inputText.trim()}
                                        className="p-2 rounded-full bg-[#7A1C1C] text-white hover:bg-[#C9A227] transition-colors disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
