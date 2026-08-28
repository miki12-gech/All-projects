"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  Cross as CrossIcon,
  X,
  Users,
  UserCheck,
  Shield,
  FileText,
  Layers,
  UserPlus,
  Activity,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationDropdown } from "./NotificationDropdown";
import { MessagesSlideover } from "./MessagesSlideover";
import { GraduationCap, BookOpen, User } from "lucide-react";
import { NavigationDropdown } from "./NavigationDropdown";
import { LibraryNavDropdown } from "./LibraryNavDropdown";
import { useState, useRef, useEffect } from "react";

const ADMIN_ROLES = [
  "SECRETARIAT_CHAIRMAN",
  "SECRETARIAT_VICE",
  "SECRETARIAT_SECRETARY",
  "SUPER_ADMIN",
  "SERVICE_MANAGER",
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Home",
  "/dashboard/posts": "Posts",
  "/dashboard/my-class": "My Class",
  "/dashboard/messages": "Messages",
  "/dashboard/announcements": "እንዳ ኢየሱስ ግቢ ጉባኤ",
  "/dashboard/profile": "Profile",
  "/dashboard/agent/roles": "Role Management",
  "/dashboard/agent/members": "Member Census",
  "/dashboard/agent/audit-logs": "Audit Logs",
  "/dashboard/agent/overview": "Overview",
  "/dashboard/agent/pending-approvals": "Pending Approvals",
  "/dashboard/agent/subclass-approvals": "Sub‑Class Approvals",
  "/dashboard/agent/access-control": "Access Control",
  "/dashboard/education": "Education Manager",
};

interface TopbarProps {
  onMenuOpen: () => void;
}

export function Topbar({ onMenuOpen }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = PAGE_TITLES[pathname] ?? "እንዳ ኢየሱስ ግቢ ጉባኤ";
  const user = useAuthStore((s) => s.user);
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
    "http://localhost:8080";

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const role = user?.system_role || user?.role || "USER";
  const isAdmin = ADMIN_ROLES.includes(role);
  const isChairman = role === "SECRETARIAT_CHAIRMAN";
  const isMemberAffairsManager =
    role === "SERVICE_MANAGER" && user?.serviceClassName === "የአባልነት ጉዳይ ክፍል";
  const isEducationManager =
    role === "SERVICE_MANAGER" && user?.serviceClassName === "የትምህርት ክፍል";
  const isSecretariat = [
    "SECRETARIAT_CHAIRMAN",
    "SECRETARIAT_VICE",
    "SECRETARIAT_SECRETARY",
    "SUPER_ADMIN",
  ].includes(role);
  const isServiceManager = role === "SERVICE_MANAGER";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const coursesDropdownItems = [
    {
      href: "/dashboard/courses?phase=GUBAE_ABEW",
      label: "ጉባኤ አበው",
      icon: GraduationCap,
    },
    {
      href: "/dashboard/courses?phase=GUBAE_HAWARYAT",
      label: "ጉባኤ ሐዋርያት",
      icon: GraduationCap,
    },
    {
      href: "/dashboard/courses?phase=GUBAE_ECCLESIAE",
      label: "ጉባኤ ኤቅሌስያ",
      icon: GraduationCap,
    },
  ];

  const regularNavItems = [
    {
      href: "/dashboard/announcements",
      label: "Announcements",
      icon: Bell,
      show: true,
    },
    { href: "/dashboard/about", label: "About", icon: User, show: true },
  ].filter((item) => item.show);

  // Admin dropdown (Secretariat only)
  const adminDropdownItems = [
    ...(!isServiceManager
      ? [{ href: "/dashboard/agent/overview", label: "Overview", icon: Activity }]
      : []),
    ...(isMemberAffairsManager
      ? [
          {
            href: "/dashboard/agent/pending-approvals",
            label: "Pending Approvals",
            icon: CheckCircle,
          },
        ]
      : []),
    ...(isChairman
      ? [
          {
            href: "/dashboard/agent/subclass-approvals",
            label: "Sub‑Class Approvals",
            icon: Layers,
          },
        ]
      : []),
    ...(isSecretariat
      ? [
          {
            href: "/dashboard/agent/access-control",
            label: "Access Control",
            icon: ShieldCheck,
          },
        ]
      : []),
    ...(isChairman
      ? [
          {
            href: "/dashboard/agent/roles",
            label: "Role Management",
            icon: Shield,
          },
          {
            href: "/dashboard/agent/members",
            label: "Member Census",
            icon: Users,
          },
          {
            href: "/dashboard/agent/audit-logs",
            label: "Audit Logs",
            icon: Activity,
          },
        ]
      : []),
    ...(isSecretariat
      ? [
          {
            href: "/dashboard/member-affairs?tab=documents",
            label: "Plans & Reports",
            icon: FileText,
          },
        ]
      : []),
  ];

  const showAdminDropdown = isSecretariat;

  // ✅ Class dropdown for other service managers (excludes Member Affairs & Education)
  const classDropdownItems = [
    {
      href: "/dashboard/my-class",
      label: "My Class",
      icon: Users,
    },
    {
      href: "/dashboard/member-affairs?tab=documents",
      label: "Plans & Reports",
      icon: FileText,
    },
    {
      href: "/dashboard/member-affairs?tab=subclasses",
      label: "Sub‑Classes",
      icon: Layers,
    },
  ];

  const showClassDropdown =
    isServiceManager &&
    !isMemberAffairsManager &&
    !isEducationManager &&
    !!user?.serviceClassName;

  // ✅ Member Affairs dropdown – only for Member Affairs manager
  const memberAffairsItems = [
    {
      href: "/dashboard/member-affairs?tab=pending",
      label: "Pending Approvals",
      icon: UserCheck,
    },
    {
      href: "/dashboard/my-class",
      label: "My Class",
      icon: Users,
    },
    {
      href: "/dashboard/member-affairs?tab=spiritual",
      label: "Spiritual Care",
      icon: Shield,
    },
    {
      href: "/dashboard/member-affairs?tab=subclasses",
      label: "Sub‑Classes",
      icon: Layers,
    },
    {
      href: "/dashboard/member-affairs?tab=documents",
      label: "Plans & Reports",
      icon: FileText,
    },
    {
      href: "/dashboard/member-affairs?tab=batch",
      label: "Batch Assign",
      icon: UserPlus,
    },
  ];

  // ✅ Education dropdown – only for Education manager
  const educationItems = [
    {
      href: "/dashboard/education?tab=batches",
      label: "Batches",
      icon: Layers,
    },
    {
      href: "/dashboard/education?tab=subjects",
      label: "Subjects & Lessons",
      icon: BookOpen,
    },
    {
      href: "/dashboard/education?tab=registrations",
      label: "Registration Approvals",
      icon: UserCheck,
    },
    {
      href: "/dashboard/education?tab=results",
      label: "Student Results",
      icon: FileText,
    },
    {
      href: "/dashboard/education?tab=subclasses",
      label: "Sub‑Classes",
      icon: Layers,
    },
    {
      href: "/dashboard/education?tab=announcements",
      label: "Announcements",
      icon: Bell,
    },
    {
      href: "/dashboard/education?tab=plans",
      label: "Plans & Reports",
      icon: FileText,
    },
    {
      href: "/dashboard/education?tab=graduation",
      label: "Graduation",
      icon: GraduationCap,
    },
    {
      href: "/dashboard/my-class",
      label: "My Class",
      icon: Users,
    },
  ];

  // ✅ FIXED: only show to respective service managers, not secretariat
  const showMemberAffairs = !isChairman && isMemberAffairsManager;
  const showEducation = !isChairman && isEducationManager;

  return (
    <header className="h-16 lg:h-20 bg-white dark:bg-[#1C1C1F] border-b border-[#ddd8d0] dark:border-[#2a2a2d] flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 z-50 shadow-md transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#C9A227] to-transparent dark:via-[#D4AF37]" />

      {/* Left section – responsive title */}
      <div className="flex items-center gap-2 min-w-0 flex-1 lg:flex-initial lg:w-1/4">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-full hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-[#7A1C1C] dark:text-[#D4AF37]" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#7A1C1C]/10 dark:bg-[#D4AF37]/10 shrink-0">
            <CrossIcon className="h-4 w-4 text-[#7A1C1C] dark:text-[#D4AF37]" />
          </div>
          <div className="truncate">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight bg-linear-to-r from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#F5F5F5] bg-clip-text text-transparent truncate max-w-45 sm:max-w-62.5 lg:max-w-none">
              {title}
            </h2>
            <p className="hidden sm:block text-[10px] lg:text-xs text-muted-foreground">
              Enda Eyesus Gbi Gubae
            </p>
          </div>
        </div>
      </div>

      {/* Middle navigation – hidden on mobile */}
      <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center px-6">
        {regularNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "bg-linear-to-r from-[#7A1C1C]/10 to-[#C9A227]/10 dark:from-[#D4AF37]/10 dark:to-[#F5F5F5]/5 text-[#C9A227] dark:text-[#D4AF37] shadow-sm"
                  : "text-[#7A1C1C] dark:text-[#F5F5F5] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] hover:text-[#C9A227] dark:hover:text-[#D4AF37]"
              }`}
            >
              <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C9A227] dark:bg-[#D4AF37] rounded-full" />
              )}
            </Link>
          );
        })}

        <NavigationDropdown
          label="Courses"
          icon={GraduationCap}
          items={coursesDropdownItems}
        />
        <LibraryNavDropdown />

        {showMemberAffairs && (
          <NavigationDropdown
            label="Member Affairs"
            icon={Users}
            items={memberAffairsItems}
          />
        )}
        {showEducation && (
          <NavigationDropdown
            label="Education"
            icon={GraduationCap}
            items={educationItems}
          />
        )}
        {showClassDropdown && (
          <NavigationDropdown
            label={user?.serviceClassName || "Class"}
            icon={Users}
            items={classDropdownItems}
          />
        )}
        {showAdminDropdown && (
          <NavigationDropdown label="Admin" icon={Shield} items={adminDropdownItems} />
        )}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center gap-2 lg:gap-4 justify-end lg:w-1/4">
        <ThemeToggle />
        <MessagesSlideover />
        <NotificationDropdown />

        <Link href="/dashboard/profile" className="relative shrink-0">
          <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-[#C9A227] dark:border-[#D4AF37] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            {user?.profileImage && (
              <AvatarImage
                src={`${API_BASE}${user.profileImage}`}
                alt={user.fullName}
              />
            )}
            <AvatarFallback className="bg-linear-to-br from-[#7A1C1C] to-[#9B2323] dark:from-[#D4AF37] dark:to-[#B8860B] text-white dark:text-[#0E0E0F] font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#1C1C1F]" />
        </Link>
      </div>
    </header>
  );
}