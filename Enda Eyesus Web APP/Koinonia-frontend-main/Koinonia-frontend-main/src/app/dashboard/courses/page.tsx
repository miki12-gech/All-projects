//src/app/dashboard/courses/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CoursesPage from "@/features/education/CoursesPage";

function CoursesContent() {
  const searchParams = useSearchParams();
  const phase = searchParams.get("phase") || "";
  return <CoursesPage preselectedPhase={phase} />;
}

export default function CoursesRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CoursesContent />
    </Suspense>
  );
}