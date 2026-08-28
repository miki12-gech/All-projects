"use client";

import { useAuthStore } from "@/store/authStore";
import PlanReportMatrix from "@/features/member-affairs/PlanReportMatrix";

export default function PlansReportsPage() {
  const { user } = useAuthStore();
  const isServiceManager = user?.system_role === "SERVICE_MANAGER";
  const isSecretariat = ["SECRETARIAT_CHAIRMAN", "SECRETARIAT_VICE", "SECRETARIAT_SECRETARY", "SUPER_ADMIN"].includes(user?.system_role || "");

  if (!isServiceManager && !isSecretariat) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Access Denied</h2>
          <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <PlanReportMatrix />;
}