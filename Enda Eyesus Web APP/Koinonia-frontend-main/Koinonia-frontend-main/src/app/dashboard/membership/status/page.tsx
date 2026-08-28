"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Suspense } from "react";

function MembershipStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    
    const approved = searchParams.get("approved");
    const rejected = searchParams.get("rejected");

    useEffect(() => {
        // If user is already a member, redirect to profile
        if (user?.system_role === "MEMBER" || user?.system_role === "TEACHER" || user?.system_role === "SERVICE_MANAGER") {
            router.replace("/dashboard/profile");
        }
    }, [user, router]);

    const getStatusInfo = () => {
        if (approved === "true") {
            return {
                icon: <CheckCircle className="h-16 w-16 text-green-600" />,
                title: "Membership Approved!",
                message: "Congratulations! Your membership application has been approved. Welcome to the Enda Eyesus Student Fellowship.",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                borderColor: "border-green-200 dark:border-green-800",
                textColor: "text-green-800 dark:text-green-200"
            };
        }
        
        if (rejected === "true") {
            return {
                icon: <XCircle className="h-16 w-16 text-red-600" />,
                title: "Membership Application Reviewed",
                message: "Your membership application has been reviewed. Please contact the Member Affairs office for more details about the decision.",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                borderColor: "border-red-200 dark:border-red-800",
                textColor: "text-red-800 dark:text-red-200"
            };
        }

        // Default: pending status
        return {
            icon: <Clock className="h-16 w-16 text-[#C9A227]" />,
            title: "Membership Pending Review",
            message: "Your membership application is currently being reviewed by the Member Affairs team. You will be notified once a decision has been made.",
            bgColor: "bg-[#F8F5F0] dark:bg-[#252529]",
            borderColor: "border-[#C9A227] dark:border-[#D4AF37]",
            textColor: "text-[#7A1C1C] dark:text-[#D4AF37]"
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#7A1C1C] dark:text-[#D4AF37] hover:underline">
                ← Back to Dashboard
            </Link>

            <div className={`${statusInfo.bgColor} rounded-2xl p-8 border ${statusInfo.borderColor} shadow-sm text-center`}>
                <div className="flex justify-center mb-6">
                    {statusInfo.icon}
                </div>
                <h1 className={`text-2xl font-bold ${statusInfo.textColor} mb-4`}>
                    {statusInfo.title}
                </h1>
                <p className={`text-sm ${statusInfo.textColor} mb-6 leading-relaxed`}>
                    {statusInfo.message}
                </p>

                {/* User Info */}
                {user && (
                    <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d] text-left">
                        <div className="flex items-center gap-3 mb-3">
                            <User className="h-5 w-5 text-[#7A1C1C] dark:text-[#D4AF37]" />
                            <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">Applicant Information</span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#6b6b6b] dark:text-[#B0B0B0]">Name:</span>
                                <span className="text-[#1a1a1a] dark:text-[#F5F5F5] font-medium">{user.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6b6b6b] dark:text-[#B0B0B0]">Email:</span>
                                <span className="text-[#1a1a1a] dark:text-[#F5F5F5] font-medium">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6b6b6b] dark:text-[#B0B0B0]">Current Role:</span>
                                <span className="text-[#1a1a1a] dark:text-[#F5F5F5] font-medium">{user.system_role || user.role || "USER"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6b6b6b] dark:text-[#B0B0B0]">Applied On:</span>
                                <span className="text-[#1a1a1a] dark:text-[#F5F5F5] font-medium flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center mt-6">
                    <Link
                        href="/dashboard/profile"
                        className="px-6 py-2 rounded-xl text-sm font-semibold bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] hover:bg-[#C9A227] dark:hover:bg-[#e0c040] transition-all"
                    >
                        View Profile
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2 rounded-xl text-sm font-semibold border border-[#ddd8d0] dark:border-[#2a2a2d] text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl p-6 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                <h2 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-4">About Membership</h2>
                <div className="space-y-3 text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                    <p>
                        Membership in the Enda Eyesus Student Fellowship grants you access to all fellowship activities, 
                        including educational programs, service opportunities, and community events.
                    </p>
                    <p>
                        If you have any questions about your membership status, please contact the Member Affairs 
                        Secretariat or the Secretariat Chairman.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function MembershipStatusPage() {
    return (
        <Suspense fallback={<div className="max-w-2xl mx-auto p-6">Loading...</div>}>
            <MembershipStatusContent />
        </Suspense>
    );
}
