import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export const useDashboardHome = () => {
    const router = useRouter();
    const { user, token } = useAuthStore();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token || !user) {
                router.replace("/login");
                return;
            }

            if (user.role === "SERVICE_MANAGER" && user.serviceClassName === "የአባልነት ጉዳይ ክፍል") {
                router.replace("/dashboard/member-affairs");
                return;
            }
            
            // Default fallback
            router.replace("/dashboard/announcements");
        }, 1800);

        return () => clearTimeout(timer);
    }, [user, token, router]);
    
    return {};
};
