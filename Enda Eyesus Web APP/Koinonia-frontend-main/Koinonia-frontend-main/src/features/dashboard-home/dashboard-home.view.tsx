"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useDashboardHome } from "./dashboard-home.hooks";

export default function DashboardHomeView() {
    useDashboardHome();

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#0E0E0F] overflow-hidden transition-colors duration-500">
            {/* Background Graphic Patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.15] dark:opacity-[0.05]" />
            
            {/* Cinematic Ambient Glow */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-125 h-125 bg-linear-to-tr from-[#7A1C1C]/10 to-[#C9A227]/10 dark:from-[#7A1C1C]/5 dark:to-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" 
            />

            {/* Centerpiece Animation Group */}
            <div className="relative flex items-center justify-center w-80 h-80">
                {/* Outer Fine-Line Astrolabe Ring 1 */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-[#7A1C1C]/20 dark:border-[#D4AF37]/20 rounded-full"
                />

                {/* Middle Intersecting Axis Rings */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-6 border border-[#C9A227]/30 dark:border-[#C9A227]/20 rounded-full flex items-center justify-center"
                >
                    {/* Internal Crosshairs */}
                    <div className="absolute w-full h-px bg-linear-to-r from-transparent via-[#C9A227]/40 to-transparent" />
                    <div className="absolute h-full w-px bg-linear-to-b from-transparent via-[#C9A227]/40 to-transparent" />
                </motion.div>

                {/* Rapid Pulse Wave Effect */}
                <motion.div 
                    animate={{ scale: [0.8, 1.4], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-32 h-32 rounded-full bg-linear-to-r from-[#7A1C1C]/20 to-[#C9A227]/20 blur-sm"
                />

                {/* Sacred Core Icon Container */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="relative z-10 w-24 h-24 bg-white dark:bg-[#1C1C1F] rounded-3xl shadow-[0_20px_50px_rgba(122,28,28,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#ddd8d0] dark:border-[#2a2a2d] flex items-center justify-center group"
                >
                    <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Shield className="w-10 h-10 text-[#7A1C1C] dark:text-[#D4AF37]" />
                    </motion.div>

                    {/* Corner Decors */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#C9A227]" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#C9A227]" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#C9A227]" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#C9A227]" />
                </motion.div>
            </div>
            
            {/* Cinematic Staggered Text Release */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-2 mt-2 text-center"
            >
                <p className="text-[#1a1a1a] dark:text-gray-100 font-serif text-lg font-bold tracking-widest">
                    ወደ ማዕከል በመግባት ላይ
                </p>
                <div className="w-12 h-0.5 bg-linear-to-r from-[#7A1C1C] to-[#C9A227] rounded-full overflow-hidden relative">
                    <motion.div 
                        animate={{ x: [-50, 50] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-0 bottom-0 w-6 bg-white"
                    />
                </div>
            </motion.div>
        </div>
    );
}
