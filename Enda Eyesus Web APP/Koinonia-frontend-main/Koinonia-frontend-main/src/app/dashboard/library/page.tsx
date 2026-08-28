"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import LibraryListing from "@/features/library/LibraryListing";
import AdminLibraryManager from "@/features/library/AdminLibraryManager";
import AdminLibraryUpload from "@/features/library/AdminLibraryUpload";

function LibraryContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const { user } = useAuthStore();

  // Check if user is authorized to manage library
  const role = user?.system_role || user?.role || "USER";
  const isChairman = role === "SECRETARIAT_CHAIRMAN";
  const isEducationManager =
    role === "SERVICE_MANAGER" && user?.serviceClassName === "የትምህርት ክፍል";
  const canManage = isChairman || isEducationManager;

  const [activeTab, setActiveTab] = useState<"browse" | "manage">("browse");
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Tab switcher and Add button for managers */}
      {canManage && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white dark:bg-[#1C1C1F] p-1 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-sm">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "browse"
                  ? "bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] shadow-md"
                  : "text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Browse
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "manage"
                  ? "bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] shadow-md"
                  : "text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
              }`}
            >
              <Settings className="h-4 w-4" />
              Manage
            </button>
          </div>

          {activeTab === "manage" && (
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="gap-2 bg-[#C9A227] hover:bg-[#B8911A] text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              {showUpload ? "Cancel" : "Add New Document"}
            </Button>
          )}
        </div>
      )}

      {/* Upload Form (visible only in manage mode and when toggled) */}
      {canManage && activeTab === "manage" && showUpload && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <AdminLibraryUpload
            onSuccess={() => {
              setShowUpload(false);
              // The manager will refresh via its own refetch after mutation, but we could trigger a global refresh if needed.
            }}
          />
        </motion.div>
      )}

      {/* Main content: Listing or Manager */}
      <AnimatePresence mode="wait">
        <motion.div
          key={canManage ? activeTab : "browse"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {canManage && activeTab === "manage" ? (
            <AdminLibraryManager
              onItemDeleted={() => { /* refresh logic if needed */ }}
              onItemUpdated={() => { /* refresh logic if needed */ }}
            />
          ) : (
            <LibraryListing initialCategory={category} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading library...</div>}>
      <LibraryContent />
    </Suspense>
  );
}