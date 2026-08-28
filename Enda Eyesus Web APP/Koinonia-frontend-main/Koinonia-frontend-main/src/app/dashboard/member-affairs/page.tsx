import { Suspense } from "react";
import MemberAffairsContent from "./MemberAffairsContent";

export default function MemberAffairsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">Loading...</div>}>
        <MemberAffairsContent />
      </Suspense>
    </div>
  );
}