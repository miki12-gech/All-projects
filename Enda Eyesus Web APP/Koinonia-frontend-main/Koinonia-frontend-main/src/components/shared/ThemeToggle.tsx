"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
    const { theme, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-9 h-9 rounded-xl
        bg-[#F8F5F0] hover:bg-[#EDE9E2] border border-[#ddd8d0]
        dark:bg-[#252529] dark:hover:bg-[#2e2e33] dark:border-[#2a2a2d]
        transition-all duration-200 cursor-pointer"
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 text-[#D4AF37]" />
            ) : (
                <Moon className="h-4 w-4 text-[#7A1C1C]" />
            )}
        </button>
    );
}
