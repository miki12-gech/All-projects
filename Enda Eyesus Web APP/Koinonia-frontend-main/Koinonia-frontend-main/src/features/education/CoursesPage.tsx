"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "@/features/education/educationApi";
import CourseViewer from "@/features/education/CourseViewer";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import apiClient from "@/api";

// Define phases (used only to determine the first phase)
const PHASES = [
  { value: "GUBAE_ABEW", label: "ጉባኤ አበው" },
  { value: "GUBAE_HAWARYAT", label: "ጉባኤ ሐዋርያት" },
  { value: "GUBAE_ECCLESIAE", label: "ጉባኤ ኤቅሌስያ" },
];

interface CoursesPageProps {
  preselectedPhase?: string;
}

export default function CoursesPage({ preselectedPhase = "" }: CoursesPageProps) {
  // Use the provided phase, or default to the first phase
  const [selectedPhase, setSelectedPhase] = useState(preselectedPhase || PHASES[0].value);
  const queryClient = useQueryClient();

  // Fetch current user data (for graduated_phases and enrollment status)
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await apiClient.instance.get("/auth/me");
      return res.data;
    },
  });

  // Parse graduated_phases (used to check prerequisites, but we don't lock navigation)
  let graduatedPhases: string[] = [];
  if (user?.graduated_phases) {
    try {
      const raw = user.graduated_phases;
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) graduatedPhases = parsed;
      } else if (Array.isArray(raw)) {
        graduatedPhases = raw;
      }
    } catch (e) {
      console.error("Failed to parse graduated_phases", e);
    }
  }

  // Fetch enrollment for the selected phase
  const { data: enrollmentResp, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["education", "my-enrollment", selectedPhase, user?.id],
    queryFn: () => educationApi.getMyEnrollment(selectedPhase),
    enabled: !!selectedPhase && !!user,
  });
  const enrollment = enrollmentResp?.data;

  // Fetch batches for the selected phase
  const { data: batchesResp, isLoading: batchesLoading } = useQuery({
    queryKey: ["education", "batches", selectedPhase],
    queryFn: () => educationApi.listBatches(selectedPhase),
    enabled: !!selectedPhase,
  });
  const batches = batchesResp?.data;
  const activeBatch = batches?.[0];

  // Request registration mutation
  const requestRegistration = useMutation({
    mutationFn: () => educationApi.requestRegistration(selectedPhase, activeBatch?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", "my-enrollment", selectedPhase] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  // Determine if the user can register for this phase (prerequisite check)
  const canRegisterForPhase = (phase: string): boolean => {
    const phaseOrder: Record<string, number> = {
      GUBAE_ABEW: 0,
      GUBAE_HAWARYAT: 1,
      GUBAE_ECCLESIAE: 2,
    };
    const current = phaseOrder[phase];
    if (current === 0) return true;
    const prevPhaseKey = Object.keys(phaseOrder).find(p => phaseOrder[p] === current - 1);
    if (!prevPhaseKey) return false;
    const graduatedUpper = graduatedPhases.map(p => p.toUpperCase());
    return graduatedUpper.includes(prevPhaseKey);
  };

  if (userLoading) {
    return (
      <div className="text-center p-8">
        <Loader2 className="animate-spin inline-block mr-2" /> Loading user data...
      </div>
    );
  }

  if (!selectedPhase) {
    // If somehow no phase is selected, show a placeholder
    return <div className="text-center p-8">No course phase available.</div>;
  }

  // If the user cannot register for this phase (prerequisite not met)
  if (!canRegisterForPhase(selectedPhase)) {
    const prevPhaseLabel = PHASES.find(p => p.value === selectedPhase)?.label || "previous phase";
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Prerequisite Not Met</h2>
          <p className="text-yellow-700">
            You must complete <strong>{prevPhaseLabel}</strong> before accessing this course.
          </p>
        </div>
      </div>
    );
  }

  if (enrollmentLoading || batchesLoading) {
    return (
      <div className="text-center p-8">
        <Loader2 className="animate-spin inline-block mr-2" /> Loading course data...
      </div>
    );
  }

  // If no enrollment, show registration request
  if (!enrollment) {
    if (!activeBatch) {
      return (
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="bg-gray-100 rounded-lg p-6">
            <p className="text-gray-700">
              No active batch available for {PHASES.find(p => p.value === selectedPhase)?.label}. Please check back later.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Not Registered</h2>
          <p className="text-blue-700 mb-4">
            You are not registered for <strong>{PHASES.find(p => p.value === selectedPhase)?.label}</strong>.
          </p>
          <Button onClick={() => requestRegistration.mutate()} disabled={requestRegistration.isPending}>
            {requestRegistration.isPending ? "Requesting..." : "Request Registration"}
          </Button>
        </div>
      </div>
    );
  }

  if (enrollment.status === "PENDING") {
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Registration Pending</h2>
          <p className="text-yellow-700">
            Your registration request is waiting for approval by the Education Manager.
          </p>
        </div>
      </div>
    );
  }

  if (enrollment.status === "REJECTED") {
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Registration Denied</h2>
          <p className="text-red-700">
            Your registration request was denied. Please contact the Education Manager.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Enrollment is APPROVED – render the CourseViewer
  return <CourseViewer phase={selectedPhase} />;
}