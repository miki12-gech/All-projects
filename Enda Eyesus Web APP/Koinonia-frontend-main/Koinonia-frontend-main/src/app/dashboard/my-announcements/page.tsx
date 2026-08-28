"use client";

import { useAuthStore } from "@/store/authStore";
import MyAnnouncements from "@/features/announcements/MyAnnouncements";

export default function MyAnnouncementsPage() {
    const { user } = useAuthStore();
    const userRole = user?.system_role || user?.role || "USER";
    const isServiceManager = userRole === "SERVICE_MANAGER";

    if (!isServiceManager) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Access Denied</h2>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Only service managers can view this page.</p>
                </div>
            </div>
        );
    }

    return <MyAnnouncements />;
}