"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardFooter } from "@/components/layout/dashboard-footer";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0E0E0F] text-[#1a1a1a] dark:text-gray-100 transition-colors duration-500 flex flex-col relative">
      
      {/* Fine-line Architectural Top Border Highlight */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-[#7A1C1C] via-[#C9A227] to-[#1a1a1a] z-[60]" />

      {/* Smooth Sidebar Drawer System */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Blended Backdrop Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out Panel Wrapper */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-[#1C1C1F] z-50 shadow-2xl border-r border-gray-200 dark:border-[#2a2a2d]"
            >
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Topbar is already 'fixed' inside its own component, 
        so we just render it directly here.
      */}
      <Topbar onMenuOpen={() => setSidebarOpen(true)} />

      {/* Global Framework Container 
        FIX: Added pt-16 lg:pt-24 to offset the exact height of the fixed Topbar 
      */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto relative pt-6 lg:pt-12">
        
        {/* Dynamic Inner Stage Container */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#faf8f5] dark:bg-[#0E0E0F] transition-colors duration-500">
          
          {/* Viewport Animation Wrapping Node */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-4 sm:p-6 lg:p-10 flex-1 w-full"
          >
            {children}
          </motion.div>
          
          {/* Micro-bordered Layout Footer */}
          <div className="border-t border-gray-200/40 dark:border-[#2a2a2d]/40 bg-white/50 dark:bg-[#1C1C1F]/30 backdrop-blur-sm mt-auto">
            <DashboardFooter />
          </div>
        </main>

      </div>
    </div>
  );
}