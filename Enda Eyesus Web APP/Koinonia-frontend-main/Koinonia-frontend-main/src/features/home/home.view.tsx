"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Music,
  Users,
  Shield,
  GraduationCap,
  ChevronDown,
  CrossIcon,
  FileText,
  HandHeart,
  DollarSign,
  UserCheck,
  Briefcase,
  Filter,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceClassFeature, TimelineEvent, Testimonial } from "./home.types";

// ─── DATA ───
const serviceClasses: ServiceClassFeature[] = [
  { id: "1", title: "ጽሕፈት ቤት (ሰብሳቢ፣ ምክትል፣ ጸሐፊ)", description: "የግቢ ጉባኤውን ሥራ በበላይነት ይመራል፣ ስብሰባዎችን ያዘጋጃል፣ የውጭ ግንኙነትን ያስተዳድራል።", icon: Shield, color: "#C9A227" },
  { id: "2", title: "ትምህርት ክፍል", description: "መደበኛና መደበኛ ያልሆኑ ትምህርቶችን ያስተባብራል፣ መምህራንን ይመድባል፣ የአብነት ትምህርትን ያስተዳድራል።", icon: GraduationCap, color: "#7A1C1C" },
  { id: "3", title: "መዝሙርና ሥነ ጥበባት", description: "የመዝሙር ትምህርትን ያስተምራል፣ ሥነ ጽሑፍና ሥነ ምስል ተሰጥኦዎችን ያጎለብታል፣ መንፈሳዊ ጭውውቶችን ያዘጋጃል።", icon: Music, color: "#D4AF37" },
  { id: "4", title: "ልማት ክፍል", description: "የገቢ ማስገኛ መርሐግብሮችን ያዘጋጃል፣ ቋሚ የልማት ተቋማትን ያስተዳድራል (በረከት ሱቅ፣ ንጻሬ ሕትመት ቤት)።", icon: HandHeart, color: "#C9A227" },
  { id: "5", title: "ሒሳብና ንብረት", description: "የግቢ ጉባኤውን ገቢና ወጪ ይቆጣጠራል፣ ንብረቶችን ይመዘግባል፣ ዓመታዊ የሒሳብ ሪፖርት ያቀርባል።", icon: DollarSign, color: "#7A1C1C" },
  { id: "6", title: "አባላት ጉዳይ", description: "አባላትን ይመዘግባል፣ ወደ ክፍላት ይመድባል፣ የምክር አገልግሎት ያስተባብራል፣ የሟሟያ ጽሑፎችን ያስተዳድራል።", icon: UserCheck, color: "#D4AF37" },
  { id: "7", title: "ባች/ዲፓርትመንት ማስተባበሪያ", description: "ተማሪዎችን በዲፓርትመንት ያደራጃል፣ ለትምህርቶች ጥሪ ያደርጋል፣ የማስታወቂያ ስርጭትን ያስተባብራል።", icon: Users, color: "#7A1C1C" },
  { id: "8", title: "ሞያ አገልግሎት", description: "ተማሪዎችን በትምህርታቸው ያጠነክራል፣ በሙያቸው ለቤተ ክርስቲያን አገልግሎት ያዘጋጃል፣ የበጎ አድራጎት ሥራዎችን ያስተባብራል።", icon: Briefcase, color: "#C9A227" },
  { id: "9", title: "ሳንሱርና መርሐ ግብር", description: "የግቢ ጉባኤው መርሐግብሮችን ያዘጋጃል፣ የሚቀርቡ ጽሑፎችን፣ መዝሙሮችን ይመረምራል፣ አዳራሾችን ያስተዳድራል።", icon: Filter, color: "#7A1C1C" },
  { id: "10", title: "ኦዲትና ኢንስፔክሽን", description: "የግቢ ጉባኤውን የሒሳብ ሪፖርት ይመረምራል፣ ንብረቶችን ይቆጣጠራል፣ የአገልግሎት ክፍሎችን እንቅስቃሴ ይገመግማል።", icon: Eye, color: "#D4AF37" },
];

const timelineEvents: TimelineEvent[] = [
  { year: "1986 ዓ.ም (ታሕሳስ 29)", title: "መሠረት", description: "የግቢ ጉባኤው ምስረታ" },
  { year: "2005 ዓ.ም", title: "የመጀመሪያ ታላቅ ጉባኤ", description: "ለሦስት ቀናት በተካሄደው ጉባኤ ከ5,000 በላይ ተማሪዎች ተሳትፈዋል።" },
  { year: "2018 ዓ.ም", title: "ጉባኤ ሐዋርያት", description: "በሐዋርያትም ትምህርትና በኅብረት እንጀራውንም በመቍረስ በየጸሎቱም ይተጉ ነበር።" },
];

// ─── VARIANTS ───
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export function HomeView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#C9A227] selection:text-[#1a1a1a] overflow-x-hidden">

{/* ─── HERO SECTION: ARCHITECTURAL SLASHES ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-24 bg-white">
        
        {/* Astonishing Background Layers */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div className="absolute top-0 right-0 w-screen md:w-[60vw] h-[80vh] bg-[#7A1C1C] origin-right" style={{ clipPath: 'polygon(100% 0, 20% 0, 100% 100%)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="absolute top-0 right-0 w-screen md:w-[50vw] h-[60vh] bg-[#1a1a1a] origin-right" style={{ clipPath: 'polygon(100% 0, 50% 0, 100% 80%)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="absolute bottom-0 left-0 w-[80vw] md:w-[40vw] h-[50vh] bg-[#1a1a1a] origin-left" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_35%,rgba(255,255,255,0.7)_60%,rgba(255,255,255,0)_100%)] z-10" />
        </div>

        {/* ─── NEW: BOUNDED CIRCLE CONTAINER ─── */}
        {/* This container ensures the circle never exceeds screen width (95vw) */}
        <div className="relative z-20 flex flex-col items-center justify-center w-[95vw] sm:w-[80vw] max-w-175 aspect-square mx-auto mt-10 sm:mt-0">
          
          {/* Rotating Concentric Circular Rings - Locked perfectly to the container's edges */}
          <div className="absolute inset-0 z-0 opacity-30 flex items-center justify-center pointer-events-none">
            {/* Outer ring perfectly matches the container */}
            <motion.div 
              className="absolute w-full h-full rounded-full border border-[#1a1a1a]" 
              animate={{ rotate: 360 }} 
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }} 
            />
            {/* Inner ring is 80% of the container size */}
            <motion.div 
              className="absolute w-[80%] h-[80%] rounded-full border-2 border-[#C9A227] border-dashed" 
              animate={{ rotate: -360 }} 
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }} 
            />
          </div>

          {/* Hero Content - Scaled down to fit INSIDE the circle */}
          <motion.div className="relative z-10 flex flex-col items-center justify-center space-y-3 sm:space-y-6 w-full px-6 sm:px-12" initial="hidden" animate="visible" variants={fadeInUp}>
            
            <motion.div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-white border border-[#C9A227]/50 text-[#7A1C1C] text-[10px] sm:text-sm font-bold tracking-widest shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C9A227] animate-pulse shadow-[0_0_10px_#C9A227]" />
              መቐለ ዩኒቨርሲቲ
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[#1a1a1a] leading-[1.1]"
              style={{ fontFamily: "serif" }}
              variants={fadeInUp}
            >
              እንዳ <span className="text-[#7A1C1C]">ኢየሱስ</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#C9A227] to-[#D4AF37]">ግቢ ጉባኤ</span>
            </motion.h1>

            <motion.p
              className="text-xs sm:text-base md:text-xl text-[#1a1a1a]/80 max-w-[90%] sm:max-w-md md:max-w-lg mx-auto font-medium leading-relaxed"
              variants={fadeInUp}
            >
              የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ተከታዮች ተማሪዎችን በእምነት፣ በአገልግሎትና በትምህርት የሚያስተሳስር መንፈሳዊ ቤት።
            </motion.p>

            <motion.div className="flex flex-row items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-6" variants={fadeInUp}>
              <Button asChild className="bg-[#1a1a1a] hover:bg-[#C9A227] text-white hover:text-[#1a1a1a] font-bold rounded-full px-4 h-10 sm:px-8 sm:h-14 text-xs sm:text-lg shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Link href="/register">አባል ይሁኑ</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-full px-4 h-10 sm:px-8 sm:h-14 text-xs sm:text-lg transition-all duration-300 bg-white shadow-md">
                <Link href="/login">ይግቡ</Link>
              </Button>
            </motion.div>

          </motion.div>

          {/* The bounce arrow is placed outside the bottom edge of the circle */}
          <motion.div className="absolute -bottom-10 sm:-bottom-16 left-1/2 -translate-x-1/2 animate-bounce text-[#7A1C1C]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <ChevronDown className="w-6 h-6 sm:w-10 sm:h-10" />
          </motion.div>

        </div>
      </section>

      {/* ─── SECTION 3: OVERLAPPING SERVICE CLASSES (FIXED HOVER) ─── */}
      <section className="py-32 bg-white relative z-10">
        <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div className="text-center max-w-3xl mx-auto mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
            <h2 className="text-[#C9A227] text-base font-bold uppercase tracking-[0.3em] mb-4">የአገልግሎት ክፍሎች</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a] mb-6">9 መዋቅራዊ ክፍሎች</h3>
            <p className="text-[#6b6b6b] text-xl">
              ግቢ ጉባኤው በአሥሩ የአገልግሎት ክፍሎች አማካኝነት መንፈሳዊ፣ ማኅበራዊና አስተዳደራዊ አገልግሎቶችን ያስተባብራል።
            </p>
          </motion.div>

          {/* Overlapping Horizontal Scroll Container */}
          <div className="relative w-full overflow-x-auto pb-24 pt-10 scrollbar-hide px-10 -mx-4 flex items-center" style={{ minHeight: '550px' }}>
            {serviceClasses.map((cls, idx) => (
              <motion.div
                key={cls.id}
                className="relative shrink-0 w-[320px] md:w-95 transition-all duration-300 ease-out group"
                style={{
                  marginLeft: idx === 0 ? '0' : '-5rem', // Overlap
                  zIndex: 10 + idx, // Default stacking order
                }}
                /* THE FIX: zIndex 50 pulls the hovered card completely to the front! */
                whileHover={{ 
                  scale: 1.1, 
                  y: -30, 
                  rotate: 0, // Snaps straight up from its messy initial rotation
                  zIndex: 50 
                }}
                /* Starts slightly rotated like holding a hand of cards */
                initial={{ opacity: 0, x: 100, rotate: idx % 2 === 0 ? 3 : -3 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white h-105 rounded-4xl p-10 border border-[#ddd8d0] shadow-[0_15px_40px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_rgba(201,162,39,0.3)] group-hover:border-[#C9A227] flex flex-col justify-between relative overflow-hidden transition-colors duration-500">
                  
                  {/* Decorative background angle inside card */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-[2.5]" style={{ backgroundColor: cls.color }} />

                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110" style={{ backgroundColor: `${cls.color}15` }}>
                      <cls.icon className="w-10 h-10" style={{ color: cls.color }} />
                    </div>
                    <h4 className="text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight group-hover:text-[#C9A227] transition-colors">
                      {cls.title}
                    </h4>
                  </div>
                  <p className="text-[#6b6b6b] text-base leading-relaxed relative z-10 group-hover:text-[#1a1a1a] transition-colors">{cls.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-2 text-[#1a1a1a]/40 animate-pulse tracking-widest uppercase text-sm font-bold">
            ← ወደ ጎን ያንሸራትቱ →
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: ANGLED TIMELINE ─── */}
      <div 
        className="relative bg-white pt-40 pb-32 -mt-20 z-0"
        style={{ 
          clipPath: 'polygon(0 8vw, 100% 0, 100% calc(100% - 8vw), 0 100%)',
          backgroundColor: '#faf8f5'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-24" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-[#7A1C1C] text-base font-bold uppercase tracking-widest mb-4">ታሪካችን</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a]">የእምነት ጉዞ</h3>
          </motion.div>

          <div className="relative border-l-4 border-[#1a1a1a]/10 ml-4 md:mx-auto md:w-3/4">
            {timelineEvents.map((evt, idx) => (
              <motion.div
                key={idx}
                className="mb-16 ml-10 relative group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="absolute -left-13.5 top-0 w-8 h-8 rounded-full bg-[#1a1a1a] border-4 border-white shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:bg-[#C9A227] group-hover:scale-125 transition-all duration-300 flex items-center justify-center" />
                
                <div className="bg-white p-8 rounded-3xl border border-[#ddd8d0]/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#1a1a1a]/20 relative overflow-hidden">
                  <span className="inline-block px-4 py-1 rounded-full bg-[#7A1C1C]/10 text-[#7A1C1C] font-bold text-sm tracking-widest mb-4 group-hover:bg-[#C9A227]/10 group-hover:text-[#C9A227] transition-colors">{evt.year}</span>
                  <h4 className="text-2xl font-bold text-[#1a1a1a] mb-3">{evt.title}</h4>
                  <p className="text-[#6b6b6b] text-base leading-relaxed">{evt.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-24" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Button
              asChild
              size="lg"
              className="relative group overflow-hidden bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] h-16 px-10 rounded-full transition-all duration-500 hover:shadow-[0_0_40px_rgba(26,26,26,0.2)] hover:-translate-y-1"
            >
              <Link href="/about" className="flex items-center">
                <span className="absolute inset-0 w-full h-full bg-[#1a1a1a] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative font-serif text-xl tracking-wide flex items-center z-10 group-hover:text-white transition-colors duration-500">
                  <BookOpen className="w-6 h-6 mr-3 text-[#7A1C1C] group-hover:text-[#C9A227] transition-colors" />
                  ታሪካችንን ይመልከቱ
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-3 transition-transform duration-300" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ─── CTA SECTION: DRAMATIC RED SLASH ─── */}
      <section 
        className="relative pt-40 pb-32 overflow-hidden -mt-16"
        style={{ clipPath: 'polygon(0 10vw, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#7A1C1C] via-[#5a1313] to-[#1a1a1a]" />
        
        {/* Dynamic geometric overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="crossPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect x="35" y="0" width="10" height="80" rx="5" fill="white"/>
              <rect x="0" y="35" width="80" height="10" rx="5" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#crossPattern)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
              ለማገልገል <span className="text-[#C9A227] italic">ዝግጁ</span> ነዎት?
            </h2>
            <p className="text-white/80 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              በመቀሌ ዩኒቨርሲቲ መንፈሳዊ ቤተሰባቸውን ካገኙ በሺዎች ከሚቆጠሩ የኢትዮጵያ ኦርቶዶክስ ተማሪዎች ጋር ይቀላቀሉ።
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#C9A227] hover:bg-white text-[#1a1a1a] hover:text-[#7A1C1C] font-bold rounded-full px-12 h-20 text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-110 group"
            >
              <Link href="/register">
                አባል ይሁኑ 
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-3 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}