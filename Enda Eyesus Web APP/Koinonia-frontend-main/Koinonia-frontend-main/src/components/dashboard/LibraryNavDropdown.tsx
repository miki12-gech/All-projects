//src/components/dashboard/LibraryNavDropdown.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "All Resources", slug: "", query: "" },
  { name: "Spiritual", slug: "spiritual", query: "category=SPIRITUAL" },
  { name: "Academic", slug: "academic", query: "category=ACADEMIC" },
  { name: "Other", slug: "other", query: "category=OTHER" },
];

export function LibraryNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          isOpen
            ? "bg-[#F8F5F0] dark:bg-[#252529] text-[#C9A227] dark:text-[#D4AF37]"
            : "text-[#7A1C1C] dark:text-[#F5F5F5] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] hover:text-[#C9A227] dark:hover:text-[#D4AF37]"
        }`}
      >
        <BookOpen className="h-4 w-4" />
        Library
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-2xl shadow-2xl py-2 z-[60]"
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/dashboard/library${cat.query ? `?${cat.query}` : ""}`}
                className="flex items-center px-4 py-3 text-sm text-[#1a1a1a] dark:text-gray-300 hover:bg-[#F8F5F0] dark:hover:bg-[#252529] hover:text-[#C9A227] dark:hover:text-[#D4AF37] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}