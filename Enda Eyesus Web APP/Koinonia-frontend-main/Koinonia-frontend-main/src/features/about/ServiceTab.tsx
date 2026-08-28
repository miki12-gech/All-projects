"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  type LucideIcon,
  Users,
  FileText,
  GraduationCap,
  Music,
  HandHeart,
  DollarSign,
  UserCheck,
  Briefcase,
  Filter,
  Eye,
  ChevronDown,
} from "lucide-react";

// ─── DATA ───
// id/title/icon drive both the nav (sidebar + mobile select) and the
// scroll-spy. `accent` is a purely visual cue cycling through the brand's
// three colors, mirroring how the home page rotates color across its cards.
const PALETTE = ["#7A1C1C", "#C9A227", "#1a1a1a"];

const serviceSections: { id: string; title: string; icon: LucideIcon; accent: string }[] = [
  { id: "general-assembly", title: "ጠቅላላ ጉባኤ", icon: Users, accent: PALETTE[0] },
  { id: "executive-committee", title: "ሥራ አስፈጻሚ ጉባኤ", icon: Users, accent: PALETTE[1] },
  { id: "secretariat", title: "ጽሕፈት ቤት", icon: FileText, accent: PALETTE[2] },
  { id: "education", title: "ትምህርት ክፍል", icon: GraduationCap, accent: PALETTE[0] },
  { id: "psalm", title: "መዝሙርና ሥነ-ጥበባት", icon: Music, accent: PALETTE[1] },
  { id: "development", title: "ልማት ክፍል", icon: HandHeart, accent: PALETTE[2] },
  { id: "finance", title: "ሒሳብና ንብረት", icon: DollarSign, accent: PALETTE[0] },
  { id: "member-affairs", title: "አባላት ጉዳይ", icon: UserCheck, accent: PALETTE[1] },
  { id: "batch", title: "ባች/ዲፓርትመንት ማስተባበሪያ", icon: Users, accent: PALETTE[2] },
  { id: "professional", title: "ሞያ አገልግሎት", icon: Briefcase, accent: PALETTE[0] },
  { id: "censorship", title: "ሳንሱርና መርሐ ግብር", icon: Filter, accent: PALETTE[1] },
  { id: "audit", title: "ኦዲትና ኢንስፔክሽን", icon: Eye, accent: PALETTE[2] },
];

// ─── SECTION CARD ───
// Wraps every department's content in a consistent manuscript card: a thin
// gradient rule along the top, a faint oversized icon watermark, and a
// scroll-reveal animation — the same visual grammar as the home page.
function SectionCard({
  icon: Icon,
  accent,
  children,
}: {
  icon: LucideIcon;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-[#faf8f5] dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] transition-shadow duration-500 overflow-hidden"
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <Icon
        className="absolute -right-6 -top-6 w-32 h-32 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none"
        style={{ color: accent }}
      />
      <div className="relative z-10 p-6 md:p-8">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-inner"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="h-6 w-6" style={{ color: accent }} />
        </div>
        {children}
      </div>
    </motion.div>
  );
}

export default function ServiceTab() {
  const [activeSection, setActiveSection] = useState("general-assembly");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Intersection Observer to update active section on scroll (desktop)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setActiveSection(id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-80px 0px -80px 0px" }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const activeMeta = serviceSections.find((s) => s.id === activeSection) ?? serviceSections[0];
  const ActiveIcon = activeMeta.icon;

  return (
    <div className="space-y-6">
      {/* Section eyebrow */}
      <div className="flex items-center gap-3 mb-2">
        <span className="h-px flex-1 bg-linear-to-r from-[#C9A227]/0 via-[#C9A227]/60 to-[#C9A227]/0" />
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A227] whitespace-nowrap">
          ፲፪ የአገልግሎት ክፍሎች
        </span>
        <span className="h-px flex-1 bg-linear-to-r from-[#C9A227]/0 via-[#C9A227]/60 to-[#C9A227]/0" />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8">
        {/* Mobile: Dropdown Navigation */}
        <div className="lg:hidden sticky top-24 z-20">
          <div className="relative flex items-center gap-3 bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-md p-3">
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
              style={{ backgroundColor: `${activeMeta.accent}15` }}
            >
              <ActiveIcon className="h-4.5 w-4.5" style={{ color: activeMeta.accent }} />
            </span>
            <select
              value={activeSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full bg-transparent text-gray-800 dark:text-gray-200 font-semibold focus:outline-none appearance-none pr-6"
            >
              {serviceSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 h-4 w-4 text-[#C9A227] pointer-events-none" />
          </div>
        </div>

        {/* Desktop Sidebar */}
<aside className="hidden lg:block lg:sticky top-24 h-[calc(100vh-6rem)] w-72 shrink-0">
  <div className="h-full overflow-y-auto bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-lg">
    <div className="p-4 border-b border-[#ddd8d0] dark:border-[#2a2a2d] sticky top-0 bg-white dark:bg-[#1C1C1F] z-20 rounded-t-2xl">
      <h3 className="font-bold text-lg text-[#7A1C1C] dark:text-[#D4AF37] font-serif">
        የክፍሎች ዝርዝር
      </h3>
    </div>
    <nav className="relative p-3 pl-5 space-y-1">
      <span className="absolute left-[1.65rem] top-3 bottom-3 w-px bg-linear-to-b from-[#C9A227]/50 via-[#ddd8d0] dark:via-[#2a2a2d] to-transparent" />
      {serviceSections.map((section) => {
        const active = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
              active
                ? "bg-linear-to-r from-[#7A1C1C] to-[#9c2a2a] dark:from-[#D4AF37] dark:to-[#C9A227] text-white dark:text-[#0E0E0F] shadow-md translate-x-1"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252529]"
            }`}
          >
            <span
              className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-colors ${
                active ? "bg-white/20" : ""
              }`}
              style={!active ? { backgroundColor: `${section.accent}15` } : undefined}
            >
              <section.icon
                className={`h-3.5 w-3.5 ${active ? "text-white dark:text-[#0E0E0F]" : ""}`}
                style={!active ? { color: section.accent } : undefined}
              />
            </span>
            <span className="truncate">{section.title}</span>
          </button>
        );
      })}
    </nav>
  </div>
</aside>

        {/* Main content – all sections */}
        <main className="flex-1 space-y-6 pb-20">
          {/* 1. General Assembly */}
          <div
            ref={(el) => {
              sectionRefs.current["general-assembly"] = el;
            }}
            data-section-id="general-assembly"
            className="scroll-mt-24"
          >
            <SectionCard icon={Users} accent={PALETTE[0]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፩ የግቢ ጉባኤ ጠቅላላ ጉባኤ ተግባርና ሓላፊነት
              </h3>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የሥራ አስፈጻሚ ጉባኤ አባላትን እና የኦዲትና ኢንስፔክሽን አገልግሎት ክፍል ሓላፊን የሀገረ ስብከት ተወካዮች ባልቡት ይመርጣል፡</li>
                <li>የግቢ ጉባኤውን አጠቃላይ የሥራ ሂደት ይገመግማል፡</li>
                <li>በሥራ አስፈጻሚ ጉባኤውና በኦዲትና ኢንስፔክሽን አገልግሎት የቀረበለትን ሪፖርት እንዲሁም እቅድና በጀት መርምሮ ያጸድቃል፡</li>
                <li>ቢያንስ በዓመት አንድ ጊዜ ይሰበሰባል፡፡</li>
              </ul>
            </SectionCard>
          </div>

          {/* 2. Executive Committee */}
          <div
            ref={(el) => {
              sectionRefs.current["executive-committee"] = el;
            }}
            data-section-id="executive-committee"
            className="scroll-mt-24"
          >
            <SectionCard icon={Users} accent={PALETTE[1]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፪ የሥራ አስፈጻሚ ጉባኤ ተግባርና ሓላፊነት
              </h3>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የዩንቨርሲቲው ተማሪዎች ግቢ ጉባኤው በሚያዘጋጃቸው መንፈሳዊ መርሐ ግብሮች እንዲማሩና የሚጠበቅባቸውን መንፈሳዊ አገልግሎት እንዲፈጽሙ ያደርጋል::</li>
                <li>በግቢ ጉባኤው የሚገኙ አባላት በገንዘባቸው፣ በዕውቀታቸውና በሙያቸው ቤተ ክርስቲያናቸውን እንዲያገለግሉ ሁኔታዎችን ያመቻቻል፡፡</li>
                <li>በግቢ ጉባኤው ደንብ መሠረት አባላት ይመዘግባል።</li>
                <li>ከሀገረ ስብከቱ የሚመደብለትን እና የግቢ ጉባኤውን ገንዘብና ንብረት በአግባቡ ይጠቀማል።</li>
                <li>የግቢ ጉባኤው አባላት በአገልግሎት የሚሳተፉበትን ሁኔታዎች ያመቻቻል።</li>
                <li>የግቢ ጉባኤውን የሥራ ዕቅድ ያዘጋጃል፣ ለግቢ ጉባኤው ጠቅላላ ጉባኤ አቅርቦ ከተወያየ በኋላ ለሀገረ ስብከቱ እንዲጸድቅለት ይልካል፣ ሲጸድቅ ተግባራዊ ያደርጋል፡፡</li>
                <li>በየሦስት ወሩ ስለሥራው አጠቃላይ እንቅስቃሴ ሪፖርት ለሀገረ ስብከቱ ያቀርባል::</li>
                <li>ቢያንስ በአሥራ አምስት ቀን አንድ ጊዜ ስብሰባ ያደርጋል</li>
                <li>በልዩ ልዩ ምክንያት የተጓደለ የሥራ አስፈጻሚ ጉባኤ አባላትን ይተካል ይህንንም ለሀገረ ስብከቱ ያሳውቃል::</li>
                <li>በመመርያው መሰረት የክፍላት መቃቅርን ያደራጃል ። በዚህ መመርያ ያልተጠቀሰ ነገር ግን ለክፍሉ ስራ ሐላፊነት አፈጻጸም ላይ ያግዛል ተብሎ የታመነበት አዲስ ንዑስ ክፍል ሊያቋቁም ይችላል።</li>
              </ul>
            </SectionCard>
          </div>

          {/* 3. Secretariat Office */}
          <div
            ref={(el) => {
              sectionRefs.current["secretariat"] = el;
            }}
            data-section-id="secretariat"
            className="scroll-mt-24"
          >
            <SectionCard icon={FileText} accent={PALETTE[2]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፫ የሥራ አስፈጻሚ ጽ/ቤት ተግባርና ኃላፊነት
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                የግቢ ጉባኤው ጽ/ቤት የግቢ ጉባኤውን ሰብሳቢ፣ ምክትል ሰብሳቢ እና ጸሐፊ የሚያካትት ሲሆን የሚከተሉት ዋና ዋና ተግባራት ይኖሩታል፡፡
              </p>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፫፥፩ የጽሕፈት ቤት አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤውን ሥራ በበላይነት ይመራል፤ ሌሎች ክፍሎች አገልግሎታቸውን በአግባቡ እንዲወጡ ያበረታታል፤</li>
                <li>ለሥራ አስፈጻሚ ጉባኤ የስብሰባ አጀንዳዎችን ተወያይቶ ያዘጋጃል፣</li>
                <li>የግቢ ጉባኤውን የሥራ አፈፃጸም ሪፖርት አጠናክሮ ለሥራ አስፈፃሚ ጉባኤ ያቀርባል፤ ሲፀድቅም ለሀገረ ስብከቱ ይልካል፤</li>
                <li>እንደ አስፈላጊነቱ አስቸኳይ ስብሰባዎች ይጠራል፣</li>
                <li>በየ6 ወሩ የግቢውን አጠቃላይ ጉባኤ ከሚመለከታቸው ክፍሎች ጋር በመሆን ያዘጋጃል፣ ተወካይም ከሀገረ ስብከቱ ያስመድባል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፫፥፪ የሰብሳቢ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤውን ሥራ በበላይነት ይመራል፤ ክፍሎችም አገልግሎታቸውን በአግባቡ እንዲወጡ ያበረታታል።</li>
                <li>የግቢ ጉባኤውን ጠቅላላ ጉባኤና የሥራ አስፈፃሚ ጉባኤ ስብሰባዎችን ይመራል።</li>
                <li>ለግቢ ጉባኤው የተመደበውን በጀት፣ አስቸኳይ በጀት፣ ቁሳቁስ ከሒሳብና ንብረት ክፍል ኃላፊ ጋር በመሆን ይፈቅዳል፣</li>
                <li>እንደ አስፈላጊነቱ አስቸኳይ ስብሰባዎችን ይጠራል፣</li>
                <li>ሀገረ ስብከቱ በሚጠራቸው ስብሰባዎች ላይ ግቢ ጉባኤውን ወክሎ ይገኛል፣</li>
                <li>በግቢ ጉባኤው ስም የሚወጡ ደብዳቤዎችን ፈርሞ እንዲወጡ ያደርጋል፣</li>
                <li>በየሰሚስተሩ ወሩ የግቢ ጉባኤውን ጠቅላላ ጉባኤ እንዲዘጋጅ ጥሪ ያስተላልፋል፣</li>
                <li>ገቢ ደብዳቤዎችን ለሚመለከታቸው ክፍሎች ይመራል፣ ምላሽ የሚፈልጉ ደብዳቤዎች ማስታወሻ በመያዝ ከሚመለከተው ክፍል ወቅታዊ ምላሽ መስጠቱን ይከታተላል።</li>
                <li>የሲሶ ዓመት ሪፖርት ለሀገረ ስብከቱ ወቅቱን ጠብቆ መላኩን ይቆጣጠራል።</li>
                <li>የክፍል ሓላፊዎች የተሰጣቸውን ተግባርና የተጣለባቸውን ሓላፊነት በአግባቡ እየተወጡ መሆኑን ይከታተላል። መስተካከል ያለባቸው ጉዳዮች ካሉ በግልፅ ያስረዳል። በጊዜ ሂደት መሻሻል ካልታየና ሥራዎች እየተበደሉ መሆናቸው ከተረጋገጠ በምትካቸው ሌሎች ሓላፊዎች በሥራ አስፈፃሚ ውሳኔ እንዲመደቡ ለሥራ አስፈፃሚ ጉባኤ ያቀርባል።</li>
                <li>በግቢ ጉባኤው ጠቅላላ ጉባኤ የጸደቀውን ዕቅድ ለሀገረ ስብከቱ ይልካል። ሀገረ ስብከቱ ማሻሻያ አድርጎበት ከጸደቀ በኋላ በሚፈለገው መጠን ተባዝቶ ለክፍሎች መሰጠቱንና ለግቢ ጉባኤውም ቀሪ መደረጉን ያረጋግጣል፣</li>
                <li>ከምክትል ሰብሳቢውና ከጸሐፊው ጋር በመመዳደብ በክፍሎች ስብሰባዎች ላይ ይገኛል፤</li>
                <li>የሀገረ ስብከቱ ተወካዮች በመጋበዝ የሥራ አስፈፃሚ ጉባኤ የምክክር መርሐግብር እንዲዘጋጅ ያደርጋል፣</li>
                <li>የአገልግሎት ክፍሎች የዓመቱን ዕቅድና መርሐግብራት በሀገረ ስብከቱ እንዲጸድቁ ያደርጋል፣ ይቆጣጠራል፡፡</li>
              </ul>
            </SectionCard>
          </div>

          {/* 4. Education Department */}
          <div
            ref={(el) => {
              sectionRefs.current["education"] = el;
            }}
            data-section-id="education"
            className="scroll-mt-24"
          >
            <SectionCard icon={GraduationCap} accent={PALETTE[0]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፬ የትምህርት ክፍል ተግባርና ሓላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-2 mb-2">
                ፬፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በግቢ ጉባኤው የሚደረጉትን ማናቸውንም (መደበኛና መደበኛ ያልሆነ) የትምህርት መርሐግብራት ቀድሞ ለጽሕፈት ቤቱ ያቀርባል፤</li>
                <li>በተጨማሪም በመርሐግብሮቹ ላይ ከሀገረ ስብከቱ ትምህርት ክፍል ጋር በመነጋገር መምህራን እንዲመደቡ ያደርጋል!</li>
                <li>የተመደቡትንም መምህራን ሁኔታ በተመለከተ ከመርሐግብሩ (ከኮርስ ፍፃሜ) በኋላ ሪፖርት ለሀገረ ስብከት ትምህርት ክፍል ያቀርባል፤</li>
                <li>በተነደፈው ሥርዓተ ትምህርት መሠረት ለአባላት ተገቢው ትምህርት መስጠቱንና መርሐግብሮች በተያዘላቸው ሰዓት መከናወናቸውን ይቆጣጠራል፤</li>
                <li>የአብነት ትምህርትን ያስተባብራል ።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፬፥፪ የትምህርት ክፍል ሓላፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፤ ያስተባብራል ! የክፍሉን አባላት ቢያንስ በ፲፭ ቀን አንድ ጊዜ ይሰበስባል</li>
                <li>የንዑሳን ክፍሎች ሓላፊዎችን ከክፍሉ አባላት ያስመርጣል፤ ለሥራ አስፈፃሚ ጉባኤም አቅርቦ ያስጸድቃል፤</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፣ ይቆጣጠራል፣</li>
                <li>ለክፍሉ አባላት በሥራ አስፈፃሚ ጉባኤ የተወሰኑ ውሳኔዎችንና የተከናወኑ ተግባራትን አጠቃላይ መረጃ ያሳውቃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፬፥፫ የትምህርት ክፍል ጸሐፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የስብሰባ አጀንዳ ከክፍሉ ሓላፊ ጋር በመሆን ያዘጋጃል፣ ቃለ ጉባኤም ይይዛል፣</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል፣</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሦስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈፃሚ ጉባኤ ያቀርባል፣</li>
                <li>ከግቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ኃላፊዎች ይሰጣል፣</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፬፥፬ የሥርዓተ ትምህርት ክትትል ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤውን መደበኛ የሥርዓተ ትምህርት መርሐግብራትን (ኮርሶች) መዝግቦ ይይዛል፣</li>
                <li>የተመደቡ መምህራን በሰዓቱና በቦታው ተገኝተው ትምህርቱን መስጠታቸውን ተከታትሎ ለትምህርት ክፍል ሓላፊ ሪፖርት ያደርጋል፣</li>
                <li>በተነደፈው ሥርዓተ ትምህርት መሠረት ለአባላት ተገቢው ትምህርት መሰጠቱንና መርሐግብሮቹ በተያዘላቸው የጊዜ ሰሌዳ መሠረት መከናወናቸውን ይቆጣጠራል፤</li>
                <li>ሥርዓተ ትምህርቱን የተመለከቱ አጠቃላይ መረጃዎች (የባች የሥርዓተ ትምህርት መርሐግብሮችን፤ በዓመቱ የተሰጡ የትምህርት ዓይነቶችን፤ ያስተማሩ መምህራንን ስም፤ ትምህርቱ የወሰደውን ጊዜ፣ ያጋጠሙ ችግሮችን፤ ትምህርቱ የተሰጠበትን ቀንና ቦታ ወዘተ) በመያዝ በየሦስት ወሩ ለግቢ ጉባኤው ትምህርት ክፍል ሪፖርት ያደርጋል፤</li>
                <li>የአባላት የክትትል መዝገብ (attendance) በአባላት ክትትል ንዑስ ክፍል (አባላት ጉዳይ) መመዝገባቸውን ይቆጣጠራል፡፡ በየጊዜውም ከንዑስ ክፍሉ ተወካዮች ተቀብሎ መረጃዎችን ያጠናቅራል፣</li>
                <li>በተከታታይ ሦስት ጊዜና ከዚያ በላይ የቀሩ አባላትን ዝርዝር የምክር አገልግሎት እንዲያገኙ ለአባላት ጉዳይ ክፍል ያሳውቃል፤</li>
                <li>የሥርዓተ ትምህርቱን መማሪያ መጻሕፍት እንዲሟሉ ያደርጋል (ገዝቶ ለግቢ ጉባኤው ተቀማጭ ያደርጋል)!</li>
                <li>የንዑስ ክፍሉን ዓመታዊ ዕቅድና የሩብ ዓመት የዕቅድ አፈጻጸም ሪፖርት አዘጋጅቶ ለትምህርት ክፍል ያቀርባል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፬፥፭ የመምህራን ምደባ ን/ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>ከሀገረ ስብከት ጋር በመነጋገር የግቢ ጉባኤውን ዓመታዊ የትምህርት የጊዜ ሰሌዳ ያዘጋጃል!</li>
                <li>በግቢ ጉባኤው የሚደረጉ ማናቸውም (መደበኛና መደበኛ ያልሆነ) መርሐግብራትን መዝግቦ ለትምህርት ክፍል ሓላፊ ያሳውቃል !</li>
                <li>በመርሐግብሮቹ ላይ ከሀገረ ስብከቱ ትምህርት ክፍል ጋር በመነጋገር መምህራን እንዲመደቡ ያደርጋል፤ መርሐግብር መሪዎችና አወያዮችንም ይመድባል፣</li>
                <li>ለክፍሉ ጥያቄ ሲቀርብ ለሌሎች ክፍሎች አባላት በልዩ ልዩ ርዕሶች ዙሪያ ትምህርት እንዲሰጥ ያደርጋል፤</li>
                <li>በዓመቱ አጋማሽ የእረፍት ቀናት አስፈላጊ በሆኑ ጊዜያት ሁሉንም ባቾች ያሳተፈ የጋራ የትምህርት መርሐግብር ያዘጋጃል፤</li>
                <li>የተተኪ መምህራንና የመርሐግብር መሪዎች ሥልጠና እንዲሰጥ ከአባላት ጉዳይ ክፍል ጋር በመሆን አባላትን መርጦ ለሥልጠና ክፍል ያሳውቃል፤</li>
                <li>የንዑስ ክፍሉን ዓመታዊ ዕቅድና የሩብ ዓመት የዕቅድ አፈጻጸም ሪፖርት አዘጋጅቶ ለትምህርት ክፍል ያቀርባል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፬፥፮ የአብነት ትምህርት ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>ከሀገረ ስብከት እና ከአጥቢያ ሰበካ ጉባኤ ጋር በመነጋገር የግቢ ጉባኤው አባላት የአብነት ትምህርት የሚማሩበትን መንገድ ያመቻቻል፤</li>
                <li>የአብነት ትምህርት የሚማሩ አባላትን ዝርዝር መረጃ መዝግቦ ይይዛል፣ ለሀገረ ስብከቱ ያሳውቃል፤</li>
                <li>የአብነት ትምህርቱን ተምረው ክህነት ለመቀበል የሚፈልጉ አባላትን ከአባላት ጉዳይ ክፍል ጋር በመሆን ካጣራ በኋላ ከሀገረ ስብከቱ ጋር በመነጋገር ሥልጣነ ክህነት እንዲቀበሉ ሁኔታዎችን ያመቻቻል፤</li>
                <li>ለአብነት ትምህርት ቤቱ አስፈላጊ የሆኑ ቁሳቁሶችን (የመማሪያ ቦታ፣ መጻሕፍት፤ ወዘተ) ከሚመለከታቸው አካላት ጋር በመሆን እንዲሟሉ ያደርጋል፣</li>
                <li>የንዑስ ክፍሉን ዓመታዊ ዕቅድና የሩብ ዓመት የዕቅድ አፈጻጸም ሪፖርት አዘጋጅቶ ለትምህርት ክፍል ያቀርባል፣</li>
                <li>የግቢ ጉባኤ አባላት የሆኑ ዲያቆናትን በመደበኛ መርሐ ግብራት እና በቤተ መቅደስ አገልግሎት እንዲሳተፉ እና እንዲያገለግሉ ያደርጋል ፣ ያስተባብራል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፬፥፯ የትምህርታዊ ጽሑፎች ዝግጅት ን/ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>ልዩ ልዩ ትምህርታዊ የሆኑ ጽሑፎችን (የሰሌዳ መጽሔት፣ በራሪ ጽሑፎች፣ የጥያቄና መልስ ውድድሮች ፣ የውይይት ጥያቄዎች ፣ የቴሌግራም ጽሑፎች ወዘተ) እንዲደርስ ያደርጋል፣</li>
                <li>ማናቸውም የሚዘጋጁ ጽሑፎች ለአባላት ከመድረሳቸው በፊት በትምህርት ክፍል ሓላፊ እንዲገመገሙ ያደርጋል፣</li>
                <li>የግቢ ጉባኤው አባላትን ጥያቄዎችን መሠረት ያደረጉና ወቅታዊ ጉዳዮችን ያገናዘቡ በራሪ ጽሑፎች ተዘጋጅተው እንዲሰራጩ ከትምህርት ክፍል ሓላፊ ጋር ይመካከራል፤ ሥራውንም ይከታተላል፣</li>
                <li>በአጽራረ ቤተ ክርስቲያን የሚሰራጩ ጽሑፎችን በባች (ዲፓርትመንት) አስተባባሪዎችና በን/ክፍሉ አባላት አማካኝነት ሰብስቦ ለትምህርት ክፍል ያደርሳል፡፡</li>
                <li>የንዑስ ክፍሉን ዓመታዊ ዕቅድና የሩብ ዓመት የዕቅድ አፈጻጸም ሪፖርት አዘጋጅቶ ለትምህርት ክፍል ያቀርባል ።</li>
              </ul>
            </SectionCard>
          </div>

          {/* 5. Psalm and Arts Department */}
          <div
            ref={(el) => {
              sectionRefs.current["psalm"] = el;
            }}
            data-section-id="psalm"
            className="scroll-mt-24"
          >
            <SectionCard icon={Music} accent={PALETTE[1]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፭ የመዝሙርና ሥነ-ጥበባት ክፍል ተግባርና ሓላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-2 mb-2">
                ፭፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የመዝሙርና ሥነ-ጥበባት ክፍል አባላት ስለ አገልግሎቱ በቂ ግንዛቤ እንዲኖራቸው፤ ኖሯቸውም እንዲጠቀሙበት ያደርጋል፤</li>
                <li>በተለያዩ ቋንቋዎች የሚዘመሩ መዝሙራትን (ግጥምና ዜማ) አሰባስቦ በሳንሱር ክፍል እንዲገመገሙ ካደረገ በኋላ አገልግሎት ላይ እንዲውሉ ያደርጋል።</li>
                <li>ከስልጠና እና ትምህርት ክፍል ጋር በመሆን ስለ ኦርቶዶክሳዊ መዝሙራት የግንዛቤ ማስጨበጫ መርሐግብራትን ያዘጋጃል፤</li>
                <li>በግቢ ጉባኤው ቻናሎች ሊቀርቡ የሚችሉ የስነ ጽሑፍ ስራዎች በማሰባሰብ ለትምህርታዊ ጽሑፎች ንዑስ ክፍል ይልካል፤</li>
                <li>መንፈሳዊ ጭውውቶችን፣ ድራማዎችንና መጣጥፎችን እንዲያዘጋጁ አባላትን ያበረታታል፡፡ የተዘጋጁትንም ወደ ሳንሱር ክፍል በመላክ ተገምግመው ሲፈቀዱ ለዕይታ እንዲቀርቡ ያደርጋል፤</li>
                <li>ጉባኤ ሐዋርያት ላይ ተሳትፈው የተመረቁ ተሰጥኦ ያላቸውን አባላት በመመልመል ፣ ተጨማሪ የክፍሉ ስልጠናዎች እንዲወስዱ ካደረገ በኋላ በመርሐግብራት ላይ እንዲቀርቡ ያደርጋል፣</li>
                <li>የሥነ-ጽሑፍና የሥነ-ስዕል ተሰጥኦ ያላቸውን አባላት በመለየት ጽሑፎቻቸውን እና ሥዕሎቻቸውን በተለያዩ መርሐግብራት ላይ እንዲያቀርቡ ያበረታታል፣ ሁኔታዎችን ያመቻቻል ፣</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፭፥፪ የመዝሙርና ሥነ-ጥበባት ክፍል ኃላፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፣ ያስተባብራል ፤ የክፍሉን አባላት ቢያንስ በ፲፭ ቀን አንድ ጊዜ ይሰበስባል፣</li>
                <li>የንዑሳን ክፍሎች ሓላፊዎችን ከክፍሉ አባላት ያስመርጣል፣ ለሥራ አስፈጻሚ ጉባኤም አቅርቦ ያስጸድቃል፣</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፣ ይቆጣጠራል፣</li>
                <li>ለክፍሉ አባላት በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችንና የተከናወኑ ተግባራትን አጠቃላይ መረጃ ያሳውቃል፣</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፭፥፫ የመዝሙርና ስነ ጥበባት ክፍል ጸሐፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የስብሰባ አጀንዳ ከክፍሉ ሓላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤም ይይዛል ፤</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል ፤</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሦስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል ፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈጻሚ ጉባኤ ያቀርባል፤</li>
                <li>ከግቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ሓላፊዎች ይሰጣል ፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፭፥፬ የመዝሙር ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የንዑስ ክፍሉ አባላት ስለ መዝሙር አገልግሎት በቂ ግንዛቤ እንዲኖራቸው፤ ፍጹም የሆነ አንድነትም እንዲኖራቸው ያደርጋል፤</li>
                <li>በተለያዩ ቋንቋዎች ሊዘመሩ የሚችሉ አዳዲስ መዝሙራትን /ግጥምና ዜማ/ ሰብስቦ ለመዝሙር ክፍል ሐላፊ ያስረክባል፣</li>
                <li>የግቢ ጉባኤው አባላት ኦርቶዶክሳዊ መዝሙራትን የሚያውቁበትን ሁኔታ ያመቻቻል፤</li>
                <li>በተለያዩ የግቢ ጉባኤው መርሐግብራት ላይ ኦርቶዶክሳዊ መዝሙራትን የዜማ መሣሪያዎች /ከበሮ፣ ጸናጽል፣ በገና . . . ወዘተ/ እንዲቀርቡና እንዲዘመሩ ያደርጋል፤</li>
                <li>በጉባኤ ስለሚዘመሩ መዝሙራት ከክፍሉ ሓላፊ ጋር ይነጋገራል በጋራ ይሠራል፤</li>
                <li>ከስልጠና እና ትምህርት ክፍል ጋር በመሆን ስለ ኦርቶዶክሳዊ መዝሙራት የግንዛቤ ማስጨበጫ መርሐግብራትን ያዘጋጃል፤</li>
                <li>የንዑስ ክፍሉን የሥራ አፈጻጸም ሪፖርትና የሩብ ዓመት ሪፖርት ለክፍሉ ያቀርባል፤ ዓመታዊ ዕቅድም ያዘጋጃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፭፥፭ የሥነ ጽሑፍ ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የሥነ-ጽሑፍ ተሰጥኦ ያላቸው አባላት መንፈሳዊ ጭውውቶችን፣ ድራማዎችን፣ መጣጥፎችን እንዲያዘጋጁ ያበረታታል፤ በግቢ ጉባኤ ሳንሱር ክፍል ተገምግመው ተቀባይነት ካገኙ በኋላ በተለያዩ መርሐግብራት ላይ እንዲቀርቡ ያደርጋል፤</li>
                <li>በሚዲያዎች ሊቀርቡ የሚችሉ ሥነ ጽሑፎችን በማሰባሰብ ለሳንሱር ክፍል ይልካል፤</li>
                <li>የቤተ ክርስቲያንን ሀብት/ቅርሶች/ እንደ አደራ ጠብቆ የጥበብ ችሎታን፣ ሙያን፣ ከሌሎች ንዑሳን ክፍሎች ጋር በመተባበር ለአባላት በልዩ ልዩ መርሐግብራት ላይ የሚቀርብበትን ሁኔታዎችን ያመቻቻል፤</li>
                <li>የንዑስ ክፍሉን የሥራ አፈጻጸም ሪፖርት በሩብ ዓመቱ ለመዝሙርና ስነጥበባት ክፍል ያቀርባል፤ ዓመታዊ ዕቅድም ያዘጋጃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፭፥፮ ሥነ-ምስል ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>ተሰጥኦ ያላቸው አባላት ልዩ ልዩ መንፈሳዊ ሥዕላትን እንዲስሉ ያበረታታል፤ የተሰሩትንም በሳንሱር ክፍል ከተገመገሙና ተቀባይነት ካገኙ በኋላ በልዩ ልዩ መርሐግብራት ላይ እንዲቀርቡ ያደርጋል፤</li>
                <li>ከስልጠና ክፍል ጋር በመሆን ስለቤተክርስቲያን ስዕላትና የአሳሳል ዘዴ /ጥበብ/ የግንዛቤ ማስጨበጫ መርሐግብራትን ያዘጋጃል፤</li>
                <li>የቤተ ክርስቲያን ሀብት/ቅርስ/ የሆኑ ስዕላትን የአሳሳል ጥበብ ለአባላት በልዩ ልዩ መርሐግብራት የሚቀርቡበትን የሚታወቁበትን መንገድ ያመቻቻል፤</li>
                <li>የንዑስ ክፍሉን የሩብ ዓመት ዕቅድ አፈጻጸም ሪፖርትና ዓመታዊ ዕቅድ ለመዝሙርና ስነጥበባት ክፍል ያቀርባል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* 6. Development Department */}
          <div
            ref={(el) => {
              sectionRefs.current["development"] = el;
            }}
            data-section-id="development"
            className="scroll-mt-24"
          >
            <SectionCard icon={HandHeart} accent={PALETTE[2]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፮ የልማት ክፍል ተግባርና ሓላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-2 mb-2">
                ፮፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በዓመቱ ውስጥ ለሚደረጉ የግቢ ጉባኤው ዝግጅቶችና ሌሎች ተግባራትን ለማከናወን የተለያዩ የገቢ ማስገኛ መርሐግብራትን ያዘጋጃል፤ የሚገኘውንም ገቢ በሂሳብ መመሪያው መሰረት ተግባራዊ ያደርጋል፤ ስራዎችም በሙሉ ለግቢ ጉባኤው ስራ አስፈጻሚ ያሳውቃል፡፡</li>
                <li>የግቢ ጉባኤው የሕትመት ስራዎችን የሰራል ያሰራጫል።</li>
                <li>ግቢ ጉባኤው ያለበትን አካባቢ ነባራዊ ሁኔታ በማጥናት ቋሚ የልማት ፕሮጀክቶችን ያዘጋጃል ፤ በግቢ ጉባኤው ስራ አስፈጻሚ ኮሚቴ ሲፈቀድለት ተግባራዊ ያደርጋል፤</li>
                <li>የግቢ ጉባኤው ቋሚ የልማት ተቋማቱ ያንቀሳቅሳል ( በረከት ሱቅ ፣ ንጻሬ ሕትመት ቤት ፣ መዝሙር ቤት ፣ የእርጥብ ስራ ፣ የአጽዋማት ዳቦ መሰብሰብ )</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፮፥፪ የልማት ክፍል ኃላፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ስራ በበላይነት ይመራል፤ ያስተባብራል ፤ የክፍሉን አባላት ቢያንስ በ15 ቀን አንድ ጊዜ ይሰበስባል፤</li>
                <li>የንዑሳን ክፍሎች ሓላፊዎችን ከክፍሉ አባላት ያስመርጣል፤ ለሥራ አስፈጻሚ ጉባኤም አቅርቦ ያስጸድቃል፤</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፤ ይቆጣጠራል፤</li>
                <li>ለክፍሉ አባላት በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችንና የተከናወኑ ተግባራትን አጠቃላይ መረጃ ያሳውቃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፮፥፫ የልማት ክፍል ጸሐፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የስብሰባ አጀንዳ ከክፍሉ ሓላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤም ይይዛል፤</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል፤</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሶስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈጻሚ ጉባኤ ያቀርባል፤</li>
                <li>ከግቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ሓላፊዎች ይሰጣል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፮፥፬ የገቢ ማስገኛ ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>ለግቢ ጉባኤው ልዩ ልዩ ተግባራትን ለማከናወን የሚያስችል የገንዘብ ምንጭ ለማግኘት ልዩ ልዩ የገቢ ማስገኛ መርሐግብራትን ያዘጋጃል ( ለምሳሌ ሎቶሪ ፣ ፎቶ ቤት ፣ ንዋያተ ቅድሳት ሱቅ . . . . . . . . ወዘተ)፤</li>
                <li>ቋሚ የልማት ተቋማቱን የሥራ ሂደት ይከታተላል፤ ይቆጣጠራል፤</li>
                <li>የንዑስ ክፍሉን ዓመታዊ ዕቅድና የሩብ ዓመት ሪፖርት አዘጋጅቶ ለልማት ክፍል ይልካል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፮፥፭ ሕትመትና ስርጭት ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የቤተ ክርስቲያንን የኅትመት ውጤቶች በጉባኤያት ልዩ ልዩ መርሐግብራት ላይ ለአባላት እንዲደርሱ ያደርጋል፤</li>
                <li>የግቢ ጉባኤው የሕትመት ስራዎችን ያከናውናል (ፎቶ ኮፒ ፣ ፕሪንት ፣ ፎቶ ቤት)</li>
                <li>የንዑስ ክፍሉን የሩብ ዓመት ዕቅድ አፈጻጸም ሪፖርትና ዓመታዊ ዕቅድ አዘጋጅቶ ለልማት ክፍል ይልካል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፮፥፮ የሒሳብ ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በልማት ክፍል /የገቢ ማስገኛ ንዑስ ክፍል/ የሚከናወኑ የልማት ተቋማት የሒሳብ እንቅስቃሴ ይቆጣጠራል፤ ወጭና ገቢ ሰነዶችን በአግባቡ በመዝገብ ይይዛል፤</li>
                <li>ወጪዎች በተያዘላቸው ዕቅድ መሰረት መከናወናቸውን ይቆጣጠራል፤</li>
                <li>ቋሚ ንብረቶችንና አላቂ የልማት ተቋሙን ዕቃዎች በመዝገብ ይይዛል፤ በጊዜውም ይቆጣጠራል፤</li>
                <li>የሒሳብ ሪፖርትን አዘጋጅቶ ለልማት ክፍል እና/ወይም ለልማት ተቋሙ በበላይነት ለሚቆጣጠረው አካል ያቀርባል፤</li>
                <li>የልማት ተቋሙ ገንዘብ ወደ ግቢ ጉባኤው ሒሳብና ንብረት ገቢ ያደርጋል ፤</li>
                <li>የንዑስ ክፍሉን የሩብ ዓመት ዕቅድ አፈጻጸም ሪፖርትና ዓመታዊ ዕቅድ አዘጋጅቶ ለልማት ክፍል ያቀርባል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* 7. Finance and Property Department */}
          <div
            ref={(el) => {
              sectionRefs.current["finance"] = el;
            }}
            data-section-id="finance"
            className="scroll-mt-24"
          >
            <SectionCard icon={DollarSign} accent={PALETTE[0]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፯ የሒሳብና ንብረት ክፍል ተግባርና ሓላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-2 mb-2">
                ፯፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>አጠቃላይ የግቢ ጉባኤውን ገቢና ወጪ ሰነዶች በመዝገብ ይይዛል፤</li>
                <li>ወጪዎች በዕቅድ መሠረት /በተያዘላቸው በጀት/ መከናወናቸውን ይከታተላል፤ ይቆጣጠራል፤</li>
                <li>በሰብሳቢው/በምክትል ሰብሳቢው/ ፊርማ የሚወጡ ወጪዎችን ይከፍላል፤ ገንዘቡንም ደረሰኝ ከሰጠው ብር ጋር በማገናዘብ በመረከብ ይይዛል፤</li>
                <li>የግቢ ጉባኤውን ንብረት በየሰሚስተሩ አንድ ግዜ ይቆጣጠራል /ይመዘግባል /</li>
                <li>ወቅታዊና ዓመታዊ የሒሳብ ሪፖርቶችን ያዘጋጃል፤</li>
                <li>በዓመቱ መጨረሻ ላይ የግቢ ጉባኤውን ንብረት በአደራነት ለሀገረ ስብከቱ በህጋዊ ሰነድ አስረክቦ ይሄዳል፤ሲመለስ ይረከባል፤ እንዲሁም ሌሎች ሒሳብ ነክ ተግባራትን ያከናውናል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፯፥፪ የሒሳብ ንብረት ክፍል ሓላፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ስራ በበላይነት ይመራል፣ ያስተባብራል ፤ የክፍሉን አባላት ቢያንስ በ15 ቀን አንድ ጊዜ ይሰበስባል፤</li>
                <li>የንዑሳን ክፍሎች ሓላፊዎችን ከክፍሉ አባላት ያስመርጣል፤ ለሥራ አስፈጻሚ ጉባኤም አቅርቦ ያስጸድቃል፤</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፣ ይቆጣጠራል፤</li>
                <li>ለክፍሉ አባላት በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችንና የተከናወኑ ተግባራትን አጠቃላይ መረጃ ያሳውቃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፯፥፫ የሒሳብ ንብረት ክፍል ጸሐፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የሰብሰባ አጀንዳ ከክፍሉ ሓላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤም ይይዛል፤</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል፤</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሦስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈጻሚ ጉባኤ ያቀርባል፤</li>
                <li>ከግቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ሓላፊዎች ይሰጣል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፯፥፬ የሒሳብ ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>አጠቃላይ የግቢ ጉባኤውን ገቢና ወጪ ሰነዶች በአግባቡ መዝገብ ይይዛል፤</li>
                <li>ወጪዎች በተያዘላቸው ዕቅድ/በጀት/ መሰረት መከናወናቸውን ይከታተላል፣ ይቆጣጠራል፤</li>
                <li>በሰብሳቢው ፊርማ የሚታዘዙ ወጪዎችን ይከፍላል፤ ተቀብሎም ደረሰኝ ከወጣው ገንዘብ ጋር በማገናዘብ ለመረከብ ይይዛል፤</li>
                <li>ወቅታዊና ዓመታዊ የሒሳብ ሪፖርቶችን ያዘጋጃል ፤ በክፍል ሐላፊው አማካኝነት ለግቢ ጉባኤው ሥራ አስፈጻሚም ያቀርባል፤</li>
                <li>ከግቢ ጉባኤው አባላት የሚዋጡ ልዩ ልዩ አስተዋጽኦዎችን /እንደ ወርኃዊ ፣ ዓመታዊ መዋጮ ካለ/ ይሰበስባል፣ ገቢ ያደርጋል፤</li>
                <li>የንዑስ ክፍሉን ዕቅድ አፈጻጸም ሪፖርት በየሩብ ዓመቱ አዘጋጅቶ ለሒሳብ ንብረት ክፍል ያቀርባል፤ ዓመታዊ ዕቅድም ያዘጋጃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፯፥፭ የንብረት ንዑስ ክፍል ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤውን ንብረቶች /ቋሚ የገቢ ማስገኛ ተቋማትን ጨምሮ/ ይመዘግባል፤ ለተገቢው ሥራ መዋላቸውንም ይቆጣጠራል፤</li>
                <li>አዳዲስ ተገዝተው የሚገቡ ንብረቶችን ይመዘግባል፤ ለተገቢው አገልግሎት እንዲውሉ ያደርጋል፤</li>
                <li>በልዩ ልዩ ምክንያት ጉዳት የደረሰባቸው ንብረቶች ሲኖሩ አስፈላጊው ጥገና እንዲደረግላቸው ያደርጋል፤</li>
                <li>የንዑስ ክፍሉን የሩብ ዓመት ዕቅድ አፈጻጸም ሪፖርት አዘጋጅቶ ለሒሳብ ንብረት ክፍል ያቀርባል፤ ዓመታዊ ዕቅድም ያዘጋጃል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* 8. Member Affairs Department */}
          <div
            ref={(el) => {
              sectionRefs.current["member-affairs"] = el;
            }}
            data-section-id="member-affairs"
            className="scroll-mt-24"
          >
            <SectionCard icon={UserCheck} accent={PALETTE[1]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፰ የአባላት ጉዳይ ክፍል ተግባርና ሓላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-2 mb-2">
                ፰፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤ አባላት የምክር አገልግሎት የሚያገኙበትን መንገድ ከትምህርት ክፍል ጋር በመሆን ያመቻቻል፤</li>
                <li>አባላት የንስሐ አባት እንዲይዙ ሁኔታዎችን ያመቻቻል፤ በየጊዜውም ሂደቱን ይከታተላል፤</li>
                <li>የቤተክርስቲያንን ሥርዓትና እምነት በመጠበቅ የማስተማር ዕውቀት ያላቸውን አባላት በመለየት ለትምህርት ክፍል ያሳውቃል፤</li>
                <li>አባላት ስለ ቤተ ክርስቲያናቸው፣ ስለግቢ ጉባኤያቸው ከግቢ ቆይታቸው ከወጡ በኋላ ስላለው አገልግሎት በበቂ ሁኔታ መረጃ እንዲያገኙ ያደርጋል፤ እንዲሁም የሟሟያ ጽሑፋቸውን በቤተ ክርስቲያን አገልግሎት/በቤተ ክርስቲያን ዙሪያ/ እንዲያዘጋጁ ሁኔታዎችን ያመቻቻል፤</li>
                <li>አዳዲስ አባላትን ይመዘግባል ፣ በግቢ ጉባኤው ሕግና ደንብ መሰረት አባላት ወደ ክፍላት ይመድባል።</li>
                <li>አባላት እርዳታ የሚሻቸው ከሆነ /የአካል ጉዳት፣ ከአቅም በላይ የሆነ የገንዘብ ችግር፣ የጤና ችግር ወዘተ/ ለጽሕፈት ቤቱ ያሳውቃል ሂደቱንም ይከታተላል፤</li>
                <li>ወደ ገዳማትና አድባራት የሚደረጉ ጉዞዎችንና በግቢ ጉባኤው ውስጥ የሚደረጉ በዓላትን ሌሎች ክፍሎችን በማስተባበር እንዲከናወኑ ያደርጋል፡፡</li>
                <li>የግቢ ጉባኤውን አባላት ዝርዝር መዝገብ ቁጥር በመስጠት ሁኔታውን ይቆጣጠራል፤ አጠቃላይ የአባላትን መረጃም ይይዛል፤ አስፈላጊ ከሆነ ብቻ ከግቢ ጉባኤው ጽ/ቤት ጋር በመነጋገር ለጠያቂ አካላት መረጃ ይሰጣል፤</li>
                <li>የምረቃ መጽሔት ላይ የሚወጡ ተማሪዎችን ባለው መረጃ መሠረት ግምገማና ከ ሰ/ት/ቤት መረጃ ጋር አገናዝቦ በስራ አስፈጻሚ ጉባኤ አስጸድቆ ለሀገረ ስብከቱ ግቢ ጉባኤያት ማስተባበሪያ ኮሚቴ ይልካል፤</li>
                <li>የግቢ ጉባኤው አባላት መንፈሳዊ ህይወት እንዲጠነክር ከትምህርት ክፍል ጋር በመተባበር በተለያዩ ርዕሶች ዙሪያ ውይይት እንዲዘጋጅ ያደርጋል ፣</li>
                <li>የግቢ ጉባኤው ተማሪዎች ከተመረቁ በኋላ በአገልግሎት ላይ እንዲሳተፉና የቤተ ክርስቲያንን ዓላማ ከዳር ለማድረስ የሚችሉ አባላትን ለማፍራት የተለያየ ሥራዎችን ይሠራል፤ የተመረቁትንም ሙሉ መረጃ /አድራሻ/ በፋይል በመሰነድ ያስቀምጣል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፰፥፪ የአባላት ጉዳይ ክፍል ሓላፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፤ ያስተባብራል ፤ የክፍሉን አባላት ቢያንስ በ15 ቀን አንድ ጊዜ ይሰበስባል፤</li>
                <li>የንዑሳን ክፍሎች ሓላፊዎችን ከክፍሉ አባላት ያስመርጣል፤ ለሥራ አስፈጻሚ ጉባኤም አቅርቦ ያስጸድቃል፤</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፣ ይቆጣጠራል፤</li>
                <li>ለክፍሉ አባላት በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችንና የተከናወኑ ተግባራትን አጠቃላይ መረጃ ያሳውቃል፤</li>
                <li>በጽሕፈት ቤቱ ፈቃድ በሀገረ ስብከቱ ስብሰባ ላይ የአባላት ጉዳይ ክፍል ወክሎ ይገኛል፡፡</li>
                <li>በጽሕፈት ቤቱ የሚሰጠው የአባላት ጉዳይ ማጣራት ሓላፊነት በግልጽነትና ታማኝነት ይፈጽማል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፰፥፫ የአባላት ጉዳይ ክፍል ጸሐፊ ተግባርና ሓላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የስብሰባ አጀንዳ ከክፍሉ ሓላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤም ይይዛል፤</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል፤</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሦስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈጻሚ ጉባኤ ያቀርባል፤</li>
                <li>ከግቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ኃላፊዎች ይሰጣል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* 9. Batch Coordination Department */}
          <div
            ref={(el) => {
              sectionRefs.current["batch"] = el;
            }}
            data-section-id="batch"
            className="scroll-mt-24"
          >
            <SectionCard icon={Users} accent={PALETTE[2]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፲፪. የባች/ዲፓርትመንት ማስተባበሪያ ክፍል ተግባርና ኃላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፪፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በግቢ ጉባኤው የሚሰጡትን ትምህርቶች ተደራሽነት ለማስፋት ተማሪዎችን በዲፓርትመንት/ባች አደረጃጀት በመጠቀም ይቀሰቅሳል፣ ይጋብዛል።</li>
                <li>አዲስ ገቢ ተማሪዎችን በመቀበልና ወደ ተገቢው የትምህርት ደረጃ እንዲገቡ በማድረግ ከመንፈሳዊ ሕይወት እንዳይርቁ ያደርጋል።</li>
                <li>እንደ አስፈላጊነቱ በግቢው ውስጥ ያሉ ጠቅላላ እንቅስቃሴዎች በመያዝ ለሚመለከተው ክፍል ያቀርባል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፪፥፪ የባች ማስተባበሪያ ክፍል ኃላፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፣ ያስተባብራል፤ ንዑሳን ክፍሎችን በቅርበት ይከታተላል።</li>
                <li>የቅስቀሳና ጥሪ ሥራዎች በሁሉም ዲፓርትመንቶች ተደራሽ መሆናቸውን ያረጋግጣል።</li>
                <li>ለክፍሉ አባላትና ለዲፓርትመንት ተጠሪዎች በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችን ያስተላልፋል።</li>
                <li>ለክፍሉ የሚያስፈልጉ ንብረቶች ከንብረት ክፍል ይረከባል ፣ በአግባቡ ጥቅም ላይ መዋላቸውን ይቆጣጠራል ።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፪፥፫ የባች ማስተባበሪያ ክፍል ጸሐፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የስብሰባ አጀንዳ ከክፍሉ ኃላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤ ይይዛል።</li>
                <li>በዲፓርትመንት የተደራጁ የአባላት ዝርዝርና የመርሐ ግብር ተሳታፊዎችን መረጃ ይይዛል።</li>
                <li>የክፍሉን ዕቅድና ሪፖርት አዘጋጅቶ ለሥራ አስፈጻሚው ያቀርባል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፪፥፬ የቅስቀሳና መረጃ ንዑስ ክፍል ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በግቢው ውስጥ ያሉትን ሁሉንም ዲፓርትመንቶች በመለየት በእያንዳንዱ ዲፓርትመንት ተጠሪዎችን ይመድባል።</li>
                <li>ስለሚሰጡት የትምህርት ኮርሶችና እና ስለ ልዩ ልዩ መርሐ ግብሮች ለተማሪዎች ጥሪ ያደርጋል፣ ይቀሰቅሳል።</li>
                <li>የማስታወቂያ ቦርዶችን፣ የቴሌግራም ገጾችንና የዲፓርትመንት ግሩፖችን በመጠቀም መልዕክቶችን ያስተላልፋል።</li>
                <li>በተለይ አዲስ ለሚጀመሩ ኮርሶች ሰፊ የቅስቀሳ ዘመቻ ያካሂዳል፣</li>
                <li>ተማሪዎች በትምህርት ገበታቸው ላይ በንቃት እንዲገኙ የማንቂያ መልእክት (SMS) ይልካል።</li>
                <li>የቤተ ክርስቲያን እና የግቢ ጉባኤው ወቅታዊ መልእክቶችን ብግዜው አባሉ ጋር እንዲዳረስ ያደርጋል።</li>
                <li>የግቢ ጉባኤውን አባላት ከመናፍቃን ቅስቀሳና ከሌሎች አላስፈላጊ ድርጊቶች ለመጠበቅ በግቢው የሚደረጉ እንቅስቃሴዎችን መረጃ ይሰበስባል፤ በክፍሉ ሐላፊ በኩል ለጽሕፈት ቤቱ ያሳውቃል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* 10. Professional Services Department */}
          <div
            ref={(el) => {
              sectionRefs.current["professional"] = el;
            }}
            data-section-id="professional"
            className="scroll-mt-24"
          >
            <SectionCard icon={Briefcase} accent={PALETTE[0]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፱ የሞያ አገልግሎት ክፍል ተግባርና ኃላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-2 mb-2">
                ፱፥፩ የክፍሉ አጠቃላይ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>አባላት በቀለም ትምህርታቸው የሚጠናከሩበትን መንገድ ያመቻቻል፤ በትምህርታቸው ድክመት ያለባቸውን አባላት በዲፓርትመንታቸው በመለየት ተከታታይ የማጠናከሪያ ትምህርት ይሰጣል፤ ሁሉም በሚማሩበት ሞያ ቤተ ክርስቲያንን ማገልገል እንዲችሉ ሁኔታዎችን ያመቻቻል፤</li>
                <li>አመቺ በሆነ ቦታ፣ ቁጥርና እንቅስቃሴ ቤተ መጻሕፍት እንዲኖር ሁኔታዎችን ያመቻቻል፤</li>
                <li>የግቢ ጉባኤው አባላት ባላቸው ወይም በሚማሩበት ሞያ ጉልበት አገልግሎት ለሚፈልጉት ሰንበት ት/ቤቶች፣ ሰበካ ጉባኤ፣ ገዳማትና አድባራት አገልግሎት እንዲሰጡ ያደርጋል ፤</li>
                <li>በግቢ ውስጥ ለሚገኙ አካል ጉዳተኞችና ጡረተኞች ተማሪዎችን በመመደብ አስፈላጊውን እገዛ ያደርጋል ፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፱፥፪ የሞያ አገልግሎት ክፍል ኃላፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፤ ያስተባብራል፤ የክፍሉን አባላት ቢያንስ በ15 ቀን አንድ ጊዜ ይሰበስባል፤</li>
                <li>የንዑሳን ክፍሎች ኃላፊዎችን ከክፍሉ አባላት ያስመርጣል፤ ለሥራ አስፈጻሚ ጉባኤም አቅርቦ ያስጸድቃል፤</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፤ ይቆጣጠራል፤</li>
                <li>ለክፍሉ አባላት በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችንና አጠቃላይ መረጃ ያሳውቃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፱፥፫ የነጻ ሞያ አገልግሎት ንዑስ ክፍል ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>ለአዲስ ገቢ ተማሪዎች ስለ ግቢ ተማሪዎች ገለጻ (Orientation) በማዘጋጀት፣ የፈተና ወረቀቶችን፣ ካርታዎችን( የካፌ እና መኝታ) ከተማሪዎች በማሰባሰብ እንዲደርሳቸው በማድረግ፣ ስለ ትምህርት አሰጣጥና የጊዜ አጠቃቀም ሥልጠና በመስጠት ወይም ምክር እንዲያገኙ በማድረግ ወዘተ አባላት በቀለም ትምህርታቸው እንዲጠነክሩ ሁኔታዎችን ያመቻቻል፤</li>
                <li>አባላት በሚማሩበት የሞያ ዘርፍ ከልማት ክፍል ጋር በመተባበር ለግቢ ጉባኤው ገቢ ሊያስገኙ የሚችሉ ቴክኖሎጂዎች፣ የዕደ ጥበብ ውጤቶች እንዲያዘጋጁና እንዲያበረክቱ ሁኔታዎችን ያመቻቻል፤ ያበረታታል፤</li>
                <li>በትምህርታቸው ድክመት ያለባቸውን አባላት በየዲፓርትመንታቸው በመለየት ተከታታይ የማጠናከሪያ ትምህርትና ድጋፍ በሌሎች አባላት እንዲያገኙ ያደርጋል፤</li>
                <li>የግቢ ጉባኤው አባላት በሚማሩበት ሞያ በየአካባቢያቸው ለቤተክርስቲያን አስተዋጽኦ እንዲያበረክቱ ሁኔታዎችን ያመቻቻል፤</li>
                <li>የግቢ ጉባኤው አባላት በሚማሩበት ቤተ ክርስቲያን የማጠናከሪያ ትምህርት እንዲሰጡ ሁኔታዎችን ያመቻቻል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፱፥፬ የበጎ አድራጎት ንዑስ ክፍል ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በቅድሚያ የአካል ጉዳተኛ፣ የጤና ችግር ወይም ከአቅም በላይ የሆነ የገንዘብ ችግር ያለባቸውን የግቢ ጉባኤው አባላት ከአባላት ጉዳይ ክፍል ጋር በመተባበር አስፈላጊውን እርዳታ እንዲያገኙ ያደርጋል፤</li>
                <li>ፈቃደኛ ከሆኑ አባላት ያገለገሉ አልባሳትን፣ የገንዘብ ድጋፍ በማሰባሰብ ለነዳያን እንዲደርሱ ያደርጋል፤ እንዲሁም ነዳያን ጾም እንዲፈቱና በዓላትን እንዲያከብሩ አስተዋጽኦ ያደርጋል፤</li>
                <li>ለተቸገሩ አብያተ ክርስቲያናት መርጃ የሚውል እርዳታ (ሙዳይ) ያሰባስባል፤ ከሀገረ ስብከቱ ጋር በመተባበር የሚረዱበትን መንገድ ያመቻቻል፤</li>
                <li>የግቢ ጉባኤውን አባላት በማስተባበር በአጥቢያ ቤተክርስቲያን የሚሰሩ ሥራዎችን (ለምሳሌ የቤተ ክርስቲያኑን ግቢ ማጽዳት፣ ዛፍ መትከል፣ ልብስ ተክህኖ ማጠብ ወዘተ) እንዲያግዙ ያደርጋል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፱፥፭ የቤተ መጻሕፍት አገልግሎት ንዑስ ክፍል ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤው የቤተ መጻሕፍት አገልግሎት ይቆጣጠራል ፣ አባላት ተውሰው መጠቀም የሚችሉበትን ሁኔታ ያመቻቻል፤</li>
                <li>ከግቢ ጉባኤው አባላት መጻሕፍትን፣ መጽሔቶችን፣ ጋዜጦችን ወዘተ በስጦታ ወይም በውሰት በማሰባሰብ ቤተ መጻሕፍቱን ያጠናክራል፤</li>
                <li>የቤተ መጻሕፍቱን ንብረቶች በየጊዜው በመመዝገብ ያለውና የጠፉትን ወይም የተበላሹትን በመለየት ለአስተዳደርና ንብረት ክፍል ያሳውቃል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* 11. Censorship & Program Department */}
          <div
            ref={(el) => {
              sectionRefs.current["censorship"] = el;
            }}
            data-section-id="censorship"
            className="scroll-mt-24"
          >
            <SectionCard icon={Filter} accent={PALETTE[1]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፲፰ . የሳንሱርና የመርሐ ግብራት ዝግጅት ክፍል ተግባርና ኃላፊነት
              </h3>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                አጠቃላይ የክፍሉ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤው መደበኛ መርሐ ግብራት ላይ የሚቀርቡት ዝርዝር ፕሮግራሞችን ከክፍሎች በመሰብሰብ ይደራጃል ፣ ለመድረክ መሪው ይሰጣል፤</li>
                <li>የግቢ ጉባኤው መርሐ ግብራት ላይ የሚቀርቡ እንዲሁም ደግሞ በማሕበራዊ ድህረ ገጾች የሚለጠፉ ትምህርቶች ፣የስነጥበብ ስራዎች ፣ መዝሙሮች . . . . . ይመረምራል ፣ ተገቢ መሆናቸዉን ያረጋግጣል ፣</li>
                <li>ለመርሐ ግብሮች የሚሆኑ አዳራሾችን ይከፍታል - በወንበር ፣ projector ፣ ድምጽ ማጉያ እና ሌሎች ነገሮች በማደራጀት ምቹ ያደርጋል።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፰፥፪ የሳንሱርና መርሐ ግብር ዝግጅት ክፍል ኃላፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፣ ያስተባብራል፤ ንዑሳን ክፍሎችን በቅርበት ይከታተላል።</li>
                <li>ለመርሐ ግብሮች የሚያስፈልጉ ቁሳቁሶች (ወንበር፣ ድንኳን፣ መብራት) እንዲሟሉ ከሚመለከተው ክፍል ጋር ይሠራል።</li>
                <li>የሳንሱር እና መርሐ ግብር ዝግጀት ሥራዎች በአግባቡ መፈጸማቸው ያረጋግጣል።</li>
                <li>ለክፍሉ አባላትና በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችን ያስተላልፋል።</li>
                <li>ለክፍሉ የሚያስፈልጉ ንብረቶች ከንብረት ክፍል ይረከባል ፣ በአግባቡ ጥቅም ላይ መዋላቸውን ይቆጣጠራል ።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፰፥፫ የሳንሱርና መርሐ ግብር ዝግጅት ክፍል ጸሐፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የሰብሰባ አጀንዳ ከክፍሉ ኃላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤም ይይዛል።</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል።</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሦስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈጻሚ ጉባኤ ያቀርባል፤</li>
                <li>ከገቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ኃላፊዎች ይሰጣል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፰:፩ የሳንሱር ን/ክፍል ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>በግቢ ጉባኤው ስም የሚዘጋጁ ማናቸውም ጽሑፎች፣ ግጥሞች፣ እና የመዝሙር ግጥሞች ከኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ዶግማና ቀኖና (ትምህርተ ሃይማኖትና ሥርዓት) ጋር የማይጋጩ መሆናቸውን መመርመርና ማረጋገጥ።</li>
                <li>አዳዲስ የሚዘጋጁ መዝሙራት (ግጥምና ዜማ) ከቤተ ክርስቲያን መንፈሳዊ ለዛና የዜማ ስልት (ቅኝት) እንዳይወጡ መከታተልና ማጽደቅ።</li>
                <li>የሚዘጋጁ ድራማዎች፣ መንፈሳዊ ጭውውቶችና መጣጥፎች መልእክታቸው ወንጌልን የሚያስተምር፣ ከቤተ ክርስቲያን ታሪክ ጋር የማይጋጭና ለሥነ-ምግባር የታነጸ መሆኑን መገምገም።</li>
                <li>የሚሳሉ ሥዕላት (አይኮኖግራፊ) የቤተ ክርስቲያንን ቀለማትና የአሳሳል ሕግ የተከተሉ መሆናቸውን ማረጋገጥ።</li>
                <li>በግቢ ጉባኤው ማሕበራዊ ድህረ ገጾች ፣ በበራሪ ጽሑፎችና በመጽሔቶች ላይ የሚወጡ መረጃዎች ተዓማኒነት ያላቸውና ተገቢ መሆናቸውን ያረጋግጣል።</li>
                <li>ግድፈት ያለባቸው ሥራዎች ሲቀርቡ ደራሲያኑ ወይም አዘጋጆቹ በምን መልኩ ማስተካከል እንዳለባቸው መንፈሳዊና ሞያዊ ምክረ-ሃሳብ መስጠት።</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፰:፪ የመርሐ ግብር ዝግጅት ንዑስ ክፍል
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የመማሪያና የመርሐ ግብር አዳራሾችን ቀድሞ በመገኘት ያጸዳል፣ ወንበሮችን ያሰናዳል።</li>
                <li>የድምፅ ማጉያ (Speaker)፣ የProjector ፣ የመብራት ሲስተሞችን ከሙያና አገልግሎት ጋር በመነጋገር ያሟላል፣ ብልሽት ሲኖርም ያስጠግናል።</li>
                <li>ከመርሐ ግብር ፍጻሜ በኋላ አዳራሹን ወደ ነበረበት ይመልሳል።</li>
              </ul>
            </SectionCard>
          </div>

          {/* 12. Audit & Inspection Department */}
          <div
            ref={(el) => {
              sectionRefs.current["audit"] = el;
            }}
            data-section-id="audit"
            className="scroll-mt-24"
          >
            <SectionCard icon={Eye} accent={PALETTE[2]}>
              <h3
                className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3"
                style={{ fontFamily: "serif" }}
              >
                ፲፱. የኦዲትና ኢንስፔክሽን አገልግሎት ክፍል ተግባርና ኃላፊነት
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                የኦዲትና ኢንስፔክሽን ክፍል ተጠሪነቱ ለጠቅላላ ጉባኤ ሆኖ የሚከተሉት ተግባራትና ንዑሳን ክፍሎች ይኖሩታል።
              </p>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                አጠቃላይ የክፍሉ ተግባራት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የግቢ ጉባኤው አጠቃላይ ገቢና ወጪ ተመዝግበው በአግባቡ መያዛቸውን ይከታተላል፤</li>
                <li>የግቢ ጉባኤው አጠቃላይ ገንዘብ ከሀገረ ስብከቱ እና ከግቢ ጉባኤው ሥራ አስፈጻሚ በተመረጡ ተወካዮች በኩል በተከፈተው የሒሳብ መዝገብ (bank account) መቀመጡን ያረጋግጣል፤</li>
                <li>በትምህርት ዓመቱ መጀመሪያ ወቅት የግቢ ጉባኤው ንብረቶች አስፈላጊው መረጃ ተይዞና ተፈርሞ ለተመደበላቸው ክፍሎች መሰጠቱን ያረጋግጣል፤</li>
                <li>የትምህርት ዓመቱ ሲጠናቀቅ የግቢ ጉባኤውን ንብረቶች ከየክፍሎች በግምጃ ቤት ተቆጥረው፣ ከአገልግሎት ውጪ አለመሆናቸው ተረጋግጦ ከቋሚ የመግዛት መዝገብ ጋር ተመሳክሮ ገቢ መደረጋቸውን ያረጋግጣል፤</li>
                <li>ወጪዎች በዕቅድ ወይም በቃለ ጉባኤ ውሳኔ መሠረት መሆናቸውን ይከታተላል፤ ስህተቶች ሲታዩ አስፈላጊ ማስተካከያዎች እንዲደረጉ ያሳስባል፤</li>
                <li>የግቢ ጉባኤውን ንብረቶች በአራት ወር አንድ ጊዜ ይቆጣጠራል፣ ደህንነታቸውንም ያረጋግጣል፤</li>
                <li>የግቢ ጉባኤው የአገልግሎት ክፍሎችን እንቅስቃሴ በየወሩ ከዕቅዳቸው ጋር በማገናዘብ ይገመግማል፤ የግምገማውንም ሪፖርት በሥራ አስፈጻሚ ጉባኤ ስብሰባ ላይ ያቀርባል፤</li>
                <li>የሩብ ዓመትና ዓመታዊ ሪፖርቶችን ያዘጋጃል፣ ለሀገረ ስብከቱ ኦዲትና ኢንስፔክሽን ይልካል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፱፥፩ የኦዲትና ኢንስፔክሽን አገልግሎት ክፍል ኃላፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን ሥራ በበላይነት ይመራል፤ ያስተባብራል፤ የክፍሉን አባላት ቢያንስ በ15 ቀን አንድ ጊዜ ይሰበስባል፤</li>
                <li>የንዑሳን ክፍሎች ኃላፊዎችን ከክፍሉ አባላት ያስመርጣል፤ ለሥራ አስፈጻሚ ጉባኤም አቅርቦ ያስጸድቃል፤</li>
                <li>ንዑሳን ክፍሎች ሥራቸውን በአግባቡ መወጣታቸውን ይከታተላል፤ ይቆጣጠራል፤</li>
                <li>ለክፍሉ አባላት በሥራ አስፈጻሚ ጉባኤ የተወሰኑ ውሳኔዎችንና አጠቃላይ መረጃ ያሳውቃል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፱፥፪ የኦዲትና ኢንስፔክሽን አገልግሎት ክፍል ጸሐፊ ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የክፍሉን የሰብሰባ አጀንዳ ከክፍሉ ኃላፊ ጋር በመሆን ያዘጋጃል፤ ቃለ ጉባኤም ይይዛል፤</li>
                <li>የገቢና ወጪ ማኅደር አዘጋጅቶ ደብዳቤዎችንና ተዛማጅ መረጃዎችን በአግባቡ ያስቀምጣል፤</li>
                <li>ንዑሳን ክፍሎች ዓመታዊ ዕቅድና በየሦስት ወራት የዕቅድ አፈጻጸም ሪፖርት እንዲያዘጋጁ ያሳስባል፤ የተዘጋጁትንም አጠናቅሮ ለሥራ አስፈጻሚ ጉባኤ ያቀርባል፤</li>
                <li>ከገቢ ጉባኤው ጽ/ቤት የተሰጠውን የክፍሉን ዕቅድ አባዝቶ ለንዑሳን ክፍሎች ኃላፊዎች ይሰጣል፤</li>
              </ul>
              <h4 className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37] mt-4 mb-2">
                ፲፱፥፫ የኢንስፔክሽን ንዑስ ክፍል ተግባርና ኃላፊነት
              </h4>
              <ul className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300 marker:text-[#C9A227] marker:font-bold">
                <li>የአገልግሎት ክፍሎች በዕቅዳቸው መሠረት ሥራቸውን እያከናወኑ መሆናቸውን ይከታተላል፣ ተግባራዊ የእርማት አስተያየት በወቅቱ ይሰጣል፤ የእርማት እርምጃ የማይወሰድ ከሆነ ለሀገረ ስብከቱ የኦዲትና ኢንስፔክሽን አገልግሎት ክፍል እና ለጠቅላላ ጉባኤ ያሳውቃል፤</li>
                <li>የግቢ ጉባኤው አገልግሎቶች በግቢ ጉባኤያት የአገልግሎት መዋቅር መመሪያ መሠረት እየተከናወኑ መሆናቸውን ይቆጣጠራል፤ ስህተቶች ወይም ልዩነቶች ሲኖሩ የእርማት አስተያየት በወቅቱ ይሰጣል፤ የአርማት እርምጃ የማይወስድ ከሆነ ለሀገረ ስብከቱ ያሳውቃል፤</li>
                <li>የሥራ አስፈጻሚ ጉባኤና የአገልግሎት ክፍሎች መደበኛ ስብሰባዎች መደረጋቸውንና አባላት መገኘታቸውን ይከታተላል፤ ተጠያቂን በመመደብ በስብሰባዎቹ የሚወሰኑ ውሳኔዎች ተግባራዊነት ይከታተላል፤</li>
                <li>ወጪዎች በዕቅድ ወይም በቃለ ጉባኤ ውሳኔ መሠረት መሆናቸውን ይከታተላል፤ ስህተቶች ሲታዩ አስፈላጊ ማስተካከያዎች እንዲደረጉ ያሳስባል፤</li>
                <li>የግቢ ጉባኤው የአገልግሎት ክፍሎችን እንቅስቃሴ በየወሩ ከዕቅዳቸው ጋር በማገናዘብ ይገመግማል፤ የግምገማውንም ሪፖርት በሥራ አስፈጻሚ ጉባኤ ስብሰባ ላይ ያቀርባል፤</li>
                <li>የንዑስ ክፍሉን ዕቅድ አፈጻጸም ሪፖርት በየሩብ ዓመቱ ለክፍሉ ያቀርባል፤ ዓመታዊ ዕቅድም ያዘጋጃል፤</li>
              </ul>
            </SectionCard>
          </div>

          {/* Closing prayer */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="h-px w-16 bg-linear-to-r from-transparent to-[#C9A227]" />
            <p className="text-center text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] whitespace-nowrap">
              ረድኤተ እግዚአብሔር አይለየን አሜን!
            </p>
            <span className="h-px w-16 bg-linear-to-l from-transparent to-[#C9A227]" />
          </div>
        </main>
      </div>
    </div>
  );
}