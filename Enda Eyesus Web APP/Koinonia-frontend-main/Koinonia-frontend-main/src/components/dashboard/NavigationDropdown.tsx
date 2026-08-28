"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavigationDropdownProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>; // ✅ now optional
  items: NavItem[];
  isActive?: boolean;
}

export function NavigationDropdown({
  label,
  icon: Icon,
  items,
  isActive,
}: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isAnyItemActive = items.some((item) => pathname === item.href);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
          isAnyItemActive || isActive
            ? "bg-[#F8F5F0] dark:bg-[#252529] text-[#C9A227] dark:text-[#D4AF37]"
            : "text-[#7A1C1C] dark:text-[#F5F5F5] hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg shadow-lg py-1 z-[100]">
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-[#F8F5F0] dark:bg-[#252529] text-[#C9A227] dark:text-[#D4AF37]"
                    : "text-[#7A1C1C] dark:text-[#F5F5F5] hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
                )}
                onClick={() => setIsOpen(false)}
              >
                {ItemIcon && <ItemIcon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}