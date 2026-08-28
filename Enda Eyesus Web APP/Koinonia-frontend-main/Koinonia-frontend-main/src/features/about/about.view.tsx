"use client";

import { Info, Users, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GeneralTab from "./GeneralTab";
import ServiceTab from "./ServiceTab";
import LawTab from "./LawTab";
import { useAbout } from "./about.hooks";

export default function AboutView() {
    const { activeTab, setActiveTab } = useAbout();

    const tabs = [
        { id: "general", label: "ጠቅላላ", icon: Info },
        { id: "service", label: "የአገልግሎት ክፍሎች", icon: Users },
        { id: "law", label: "የውስጠ ደንብ", icon: FileCheck },
    ];

    return (
        <div className="relative w-full bg-[#faf8f5] dark:bg-[#0E0E0F] min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 md:py-20 overflow-clip text-[#1a1a1a] dark:text-gray-100 transition-colors duration-300">
            {/* Subtle Background Architectural Element */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-[#C9A227]/5 dark:bg-[#C9A227]/10 pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[#7A1C1C]/5 dark:bg-[#7A1C1C]/10 pointer-events-none" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Page Header */}
                <motion.div 
                    className="text-center mb-8 md:mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="text-[#C9A227] text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-2 md:mb-4">ስለ እኛ</h2>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a] dark:text-white">
                        ማንነታችንና <span className="text-[#7A1C1C] dark:text-[#D4AF37]">ሥርዓታችን</span>
                    </h1>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div 
                    className="sticky top-16 md:top-20 z-40 bg-white/80 dark:bg-[#1C1C1F]/80 backdrop-blur-md rounded-full border border-[#ddd8d0] dark:border-[#2a2a2d] p-1 md:p-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] mx-auto max-w-[95%] md:max-w-fit mb-8 md:mb-12 transition-colors duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex flex-nowrap justify-start md:justify-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide px-1 md:px-0">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-6 md:py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap text-xs md:text-sm ${
                                        isActive
                                            ? "text-white dark:text-[#0E0E0F] shadow-lg"
                                            : "text-[#6b6b6b] dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#252529]"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-tab-indicator"
                                            className="absolute inset-0 bg-[#1a1a1a] dark:bg-[#C9A227] rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                                        <tab.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isActive ? "text-[#C9A227] dark:text-[#0E0E0F]" : ""}`} />
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Tab Content Container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full relative"
                    >
                        {activeTab === "general" && <GeneralTab />}
                        {activeTab === "service" && <ServiceTab />}
                        {activeTab === "law" && <LawTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
