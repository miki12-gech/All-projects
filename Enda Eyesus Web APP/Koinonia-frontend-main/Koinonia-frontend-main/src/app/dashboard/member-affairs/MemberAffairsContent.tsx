"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PendingApprovals from "../../../features/member-affairs/PendingApprovals";
import MemberCensus from "../../../features/member-affairs/MemberCensus";
import SpiritualAssignments from "../../../features/member-affairs/SpiritualAssignments";
import SubClassManager from "../../../features/member-affairs/SubClassManager";
import PlanReportMatrix from "../../../features/member-affairs/PlanReportMatrix";
import BatchAssign from "../../../features/member-affairs/BatchAssign";

const components: Record<string, React.ReactNode> = {
  pending: <PendingApprovals />,
  census: <MemberCensus />,
  spiritual: <SpiritualAssignments />,
  subclasses: <SubClassManager />,
  documents: <PlanReportMatrix />,
  batch: <BatchAssign />,
};

export default function MemberAffairsContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = Object.keys(components);
  const activeTab = tabParam && validTabs.includes(tabParam) ? tabParam : "pending";

  // Permission check
  const isMemberAffairsManager = user?.role === "SERVICE_MANAGER" && user?.serviceClassName === "የአባልነት ጉዳይ ክፍል";
  const isSecretariat = ["SECRETARIAT_CHAIRMAN", "SECRETARIAT_VICE", "SECRETARIAT_SECRETARY", "SUPER_ADMIN"].includes(user?.role || "");

  if (!isMemberAffairsManager && !isSecretariat) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <div className="space-y-6">{components[activeTab]}</div>;
}