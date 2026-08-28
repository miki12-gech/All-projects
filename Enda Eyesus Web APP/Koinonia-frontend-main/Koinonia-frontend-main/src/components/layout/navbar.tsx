"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CrossIcon, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1C1C1F]/95 backdrop-blur-lg border-b border-[#ddd8d0] dark:border-[#2a2a2d] shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">

                    {/* Logo & Title */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-[#7A1C1C] dark:bg-[#D4AF37] flex items-center justify-center shrink-0 group-hover:bg-[#C9A227] dark:group-hover:bg-[#C9A227] transition-all duration-300 shadow-md">
                            <CrossIcon className="h-5 w-5 text-white dark:text-[#0E0E0F] transition-transform group-hover:scale-110" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-[#7A1C1C] dark:text-[#D4AF37] font-bold text-xl leading-tight tracking-wide font-serif group-hover:text-[#C9A227] dark:group-hover:text-[#D4AF37] transition-colors">
                                እንዳ ኢየሱስ ግቢ ጉባኤ
                            </h1>
                            <p className="text-[#6b6b6b] dark:text-[#B0B0B0] text-[10px] uppercase font-medium tracking-widest">
                                EndaEyesus Gbi Gubae
                            </p>
                        </div>
                        {/* Mobile short title */}
                        <div className="sm:hidden">
                            <h1 className="text-[#7A1C1C] dark:text-[#D4AF37] font-bold text-lg leading-tight tracking-wide font-serif">
                                እንዳ ኢየሱስ
                            </h1>
                            <p className="text-[#6b6b6b] dark:text-[#B0B0B0] text-[8px] uppercase font-medium tracking-wider">
                                EndaEyesus
                            </p>
                        </div>
                    </Link>

                    {/* Actions – Login & Register only */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href="/login"
                            className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] hover:text-[#C9A227] dark:hover:text-[#D4AF37] transition-colors whitespace-nowrap"
                        >
                            <LogIn className="h-4 w-4" />
                            <span className="hidden sm:inline">መግቢያ</span>
                        </Link>
                        <Button
                            asChild
                            className="bg-[#7A1C1C] hover:bg-[#C9A227] dark:bg-[#D4AF37] dark:hover:bg-[#C9A227] text-white dark:text-[#0E0E0F] font-bold border-none rounded-full px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm transition-all hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            <Link href="/register" className="flex items-center gap-1.5">
                                <UserPlus className="h-4 w-4 sm:h-4 sm:w-4" />
                                <span className="hidden xs:inline">አባል ይሁኑ</span>
                                <span className="xs:hidden">Join</span>
                            </Link>
                        </Button>
                    </div>

                </div>
            </div>
        </nav>
    );
}