"use client";

import { Search, Send, MessageSquare, ArrowLeft } from "lucide-react";
import { UserInfo } from "./messages.types";
import { useMessages } from "./messages.hooks";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

function timeAgo(date: string): string {
    const d = new Date(date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return d.toLocaleDateString();
}

function UserAvatar({ user, size = "md" }: { user: UserInfo, size?: "sm" | "md" | "lg" }) {
    const s = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-lg" : "w-10 h-10 text-sm";
    return (
        <div className={`${s} rounded-full bg-[#C9A227]/20 flex items-center justify-center text-[#C9A227] font-bold flex-shrink-0`}>
            {user.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${API_BASE}${user.profileImage}`} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
                user.fullName?.[0]?.toUpperCase()
            )}
        </div>
    );
}

export default function MessagesView() {
    const {
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
    } = useMessages();

    return (
        <div className="h-[calc(100vh-80px)] -mx-4 -mb-4 flex bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-t-3xl overflow-hidden shadow-sm">

            {/* Sidebar (Conversations & Search) */}
            <div className={`w-full md:w-80 border-r border-[#f0ece4] dark:border-[#2a2a2d] flex flex-col ${activeUser ? 'hidden md:flex' : 'flex'}`}>
                {/* Header & Search */}
                <div className="p-4 border-b border-[#f0ece4] dark:border-[#2a2a2d]">
                    <h2 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#F8F5F0] dark:bg-[#252529] border-none text-sm text-[#1a1a1a] dark:text-[#F5F5F5] placeholder:text-[#6b6b6b] dark:placeholder:text-[#B0B0B0] focus:ring-1 focus:ring-[#C9A227] outline-none"
                        />
                    </div>
                </div>

                {/* List Area */}
                <div className="flex-1 overflow-y-auto hidden-scrollbar">
                    {searchQuery.trim().length >= 2 ? (
                        /* Search Results */
                        <div className="p-2 space-y-1">
                            <p className="px-3 py-2 text-xs font-semibold uppercase text-[#6b6b6b] dark:text-[#B0B0B0] tracking-wider">Search Results</p>
                            {isSearching ? (
                                <p className="px-3 text-sm text-[#6b6b6b]">Searching...</p>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(su => (
                                    <button
                                        key={su.id}
                                        onClick={() => {
                                            loadChat(su);
                                            setSearchQuery("");
                                            setSearchResults([]);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors text-left"
                                    >
                                        <UserAvatar user={su} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] truncate">{su.fullName}</p>
                                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] truncate">@{su.username} &middot; {su.role}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="px-3 text-sm text-[#6b6b6b]">No users found.</p>
                            )}
                        </div>
                    ) : (
                        /* Existing Conversations */
                        <div className="p-2 space-y-1">
                            {loadingConvos ? (
                                <p className="p-4 text-sm text-[#6b6b6b] text-center">Loading...</p>
                            ) : conversations.length > 0 ? (
                                conversations.map(c => {
                                    const isUnread = c.unreadCount > 0;
                                    const isActive = activeUser?.id === c.user.id;
                                    return (
                                        <button
                                            key={c.user.id}
                                            onClick={() => loadChat(c.user)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${isActive ? 'bg-[#7A1C1C]/5 dark:bg-[#D4AF37]/10' : 'hover:bg-[#F8F5F0] dark:hover:bg-[#252529]'}`}
                                        >
                                            <UserAvatar user={c.user} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <p className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-[#1a1a1a] dark:text-white' : 'font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]'}`}>
                                                        {c.user.fullName}
                                                    </p>
                                                    <span className={`text-[10px] whitespace-nowrap ${isUnread ? 'text-[#C9A227] dark:text-[#D4AF37] font-bold' : 'text-[#6b6b6b] dark:text-[#B0B0B0]'}`}>
                                                        {timeAgo(c.lastMessage.createdAt)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center gap-2">
                                                    <p className={`text-xs truncate ${isUnread ? 'text-[#1a1a1a] dark:text-[#F5F5F5] font-semibold' : 'text-[#6b6b6b] dark:text-[#B0B0B0]'}`}>
                                                        {c.lastMessage.senderID === currentUser?.id ? "You: " : ""}{c.lastMessage.content}
                                                    </p>
                                                    {isUnread && (
                                                        <span className="w-4 h-4 rounded-full bg-[#C9A227] dark:bg-[#D4AF37] flex items-center justify-center text-[9px] font-bold text-white dark:text-[#0E0E0F]">
                                                            {c.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-3 text-[#6b6b6b]/30" />
                                    <p className="text-sm font-medium text-[#6b6b6b] dark:text-[#B0B0B0]">No active chats</p>
                                    <p className="text-xs text-[#6b6b6b]/60 dark:text-[#B0B0B0]/60 mt-1">Search for a user to start messaging</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex col flex-col bg-[#F8F5F0] dark:bg-[#0E0E0F] ${!activeUser ? 'hidden md:flex' : 'flex'}`}>
                {activeUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 px-4 bg-white dark:bg-[#1C1C1F] border-b border-[#f0ece4] dark:border-[#2a2a2d] flex items-center gap-3 flex-shrink-0">
                            <button onClick={() => setActiveUser(null)} className="md:hidden p-2 -ml-2 text-[#4a4a4a] dark:text-[#B0B0B0]">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <UserAvatar user={activeUser} size="sm" />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-[#7A1C1C] dark:text-[#D4AF37]">{activeUser.fullName}</h3>
                                <p className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0]">@{activeUser.username}</p>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 hidden-scrollbar relative">
                            {loadingMessages ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-sm text-[#6b6b6b]">Loading messages...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <p className="text-sm font-medium text-[#6b6b6b] dark:text-[#B0B0B0]">Begin your conversation</p>
                                    <p className="text-xs text-[#6b6b6b]/60 dark:text-[#B0B0B0]/60 mt-1">Type a message below to say hello.</p>
                                </div>
                            ) : (
                                messages.map((m, idx) => {
                                    const isMe = m.senderID === currentUser?.id;
                                    const showTime = idx === 0 || (new Date(m.createdAt).getTime() - new Date(messages[idx - 1].createdAt).getTime() > 1800000); // 30 mins
                                    return (
                                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {showTime && (
                                                <span className="text-[10px] text-[#6b6b6b]/60 dark:text-[#B0B0B0]/60 my-2 block">
                                                    {new Date(m.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                </span>
                                            )}
                                            <div className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl ${isMe
                                                    ? 'bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] rounded-br-[4px]'
                                                    : 'bg-white text-[#1a1a1a] dark:bg-[#1C1C1F] dark:text-[#F5F5F5] border border-[#f0ece4] dark:border-[#2a2a2d] shadow-sm rounded-bl-[4px]'
                                                }`}>
                                                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-3 bg-white dark:bg-[#1C1C1F] border-t border-[#f0ece4] dark:border-[#2a2a2d]">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 h-10 px-4 rounded-full bg-[#F8F5F0] dark:bg-[#252529] border border-[#ddd8d0] dark:border-[#2a2a2d] text-sm text-[#1a1a1a] dark:text-[#F5F5F5] focus:outline-none focus:border-[#C9A227] dark:focus:border-[#D4AF37]"
                                    disabled={isSending}
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim() || isSending}
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] transition-all hover:bg-[#C9A227] dark:hover:bg-[#e0c040] disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#F8F5F0]/50 dark:bg-[#0E0E0F]">
                        <div className="w-16 h-16 bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#f0ece4] dark:border-[#2a2a2d] shadow-sm flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8 text-[#C9A227]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-2">Your Messages</h3>
                        <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] max-w-sm">
                            Select a conversation from the sidebar or search for someone to start messaging.
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}
