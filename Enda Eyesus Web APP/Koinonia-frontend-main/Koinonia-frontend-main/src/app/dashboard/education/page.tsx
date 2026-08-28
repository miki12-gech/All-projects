"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// Import components
import BatchList from "@/features/education/BatchList";
import SubjectManager from "@/features/education/SubjectManager";
import PendingRegistrations from "@/features/education/PendingRegistrations";
import StudentResults from "@/features/education/StudentResults";
import SubClassManager from "@/features/member-affairs/SubClassManager";
import DepartmentAnnouncements from "@/features/member-affairs/DepartmentAnnouncements";
import PlanReportMatrix from "@/features/member-affairs/PlanReportMatrix";
import GraduationList from "@/features/education/GraduationList";

const components: Record<string, React.ReactNode> = {
  batches: <BatchList />,
  subjects: <SubjectManager />,
  registrations: <PendingRegistrations />,
  results: <StudentResults />,
  subclasses: <SubClassManager />,
  announcements: <DepartmentAnnouncements />,
  plans: <PlanReportMatrix />,
  graduation: <GraduationList />,
};

function EducationContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "batches";
  const { user } = useAuthStore();

  const isEducationManager = user?.role === "SERVICE_MANAGER" && user?.serviceClassName === "የትምህርት ክፍል";
  const isSecretariat = ["SECRETARIAT_CHAIRMAN", "SECRETARIAT_VICE", "SECRETARIAT_SECRETARY", "SUPER_ADMIN"].includes(user?.role || "");

  if (!isEducationManager && !isSecretariat) {
    return <div className="text-center py-12">Access Denied</div>;
  }

  const currentComponent = components[tab] || components.batches;
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      {currentComponent}
    </div>
  );
}

export default function EducationDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <EducationContent />
    </Suspense>
  );
}