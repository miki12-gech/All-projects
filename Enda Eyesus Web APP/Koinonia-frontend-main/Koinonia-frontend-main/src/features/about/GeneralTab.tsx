"use client";

import { Church, Globe, Calendar, Users, Target, Award } from "lucide-react";
import { motion, Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function GeneralTab() {
  return (
    <motion.div 
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Introduction */}
      <motion.div variants={fadeInUp} className="relative bg-white dark:bg-[#1C1C1F] p-8 md:p-10 border-l-4 border-[#7A1C1C] dark:border-[#D4AF37] shadow-md rounded-r-4xl transition-colors duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#7A1C1C]/5 dark:bg-[#D4AF37]/5 rounded-bl-full" />
        <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-6 flex items-center gap-3">
          <Church className="h-8 w-8 text-[#C9A227]" /> 
          መግቢያ
        </h2>
        <p className="text-[#6b6b6b] dark:text-gray-300 text-lg leading-relaxed md:pr-10">
          የቤተ ክርስቲያናችን ተስፋ የሆኑት የከፍተኛ ትምህርት ተቋማት ተማሪዎች በግቢ ቆይታቸው መንፈሳዊ ዕውቀትን እንዲጨብጡና ሥርዓተ ቤተ ክርስቲያንን እንዲያውቁ የግቢ ጉባኤያት ሚና የጎላ ነው። በእንዳ ኢየሱስ ግቢ ጉባኤ የሚከናወኑ ማናቸውም መንፈሳዊ፣ ማኅበራዊና አስተዳደራዊ አገልግሎቶች ወጥ በሆነ መንገድ ይመሩ ዘንድ ይህ የውስጠ ደንብ ተዘጋጅቷል።
        </p>
      </motion.div>

      {/* What is Enda Eyesus */}
      <motion.div variants={fadeInUp} className="group bg-[#1a1a1a] dark:bg-[#252529] text-white rounded-4xl p-8 md:p-12 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(201,162,39,0.2)]">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#7A1C1C] dark:bg-[#D4AF37] rounded-full opacity-50 dark:opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6 relative z-10 flex items-center gap-4">
          <span className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
            <Church className="h-6 w-6 text-[#C9A227]" />
          </span>
          የእንዳ ኢየሱስ ግቢ ጉባኤ ምንድነት ነው?
        </h3>
        <p className="text-white/80 dark:text-gray-300 text-xl leading-relaxed relative z-10 font-light max-w-4xl">
          የእንዳ ኢየሱስ ግቢ ጉባኤ በከፍተኛ ትምህርት ተቋማት የሚገኙ የኦርቶዶክስ ተዋሕዶ እምነት ተከታዮች ተማሪዎች መንፈሳዊ ዕውቀትን እንዲጨብጡና ሥርዓተ ቤተ ክርስቲያንን እንዲያውቁ የሚያግዝ ማዕከላዊ መድረክ ነው።
        </p>
      </motion.div>

      {/* Where and When Grid */}
      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d] hover:border-[#1a1a1a] dark:hover:border-[#C9A227] hover:shadow-xl transition-all duration-300 group">
          <div className="w-14 h-14 bg-[#faf8f5] dark:bg-[#0E0E0F] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] dark:group-hover:bg-[#C9A227] transition-colors">
            <Globe className="h-6 w-6 text-[#7A1C1C] dark:text-[#D4AF37] group-hover:text-white dark:group-hover:text-[#0E0E0F]" />
          </div>
          <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-4">የትኛው ቦታ ነው?</h3>
          <p className="text-[#6b6b6b] dark:text-gray-400 leading-relaxed">
            በከፍተኛ ትምህርት ተቋማት ውስጥ በሀገረ ስብከቱ እውቅና በተሰጠው የኦርቶዶክስ ተዋሕዶ እምነት ተከታዮች ተማሪዎች መንፈሳዊ አገልግሎትን ለማገኘት የሚመደብበት ቦታ ነው።
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d] hover:border-[#1a1a1a] dark:hover:border-[#C9A227] hover:shadow-xl transition-all duration-300 group">
          <div className="w-14 h-14 bg-[#faf8f5] dark:bg-[#0E0E0F] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] dark:group-hover:bg-[#C9A227] transition-colors">
            <Calendar className="h-6 w-6 text-[#C9A227] group-hover:text-white dark:group-hover:text-[#0E0E0F]" />
          </div>
          <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white mb-4">መቼ ተጀመረ?</h3>
          <p className="text-[#6b6b6b] dark:text-gray-400 leading-relaxed">
            በከፍተኛ ትምህርት ተቋማት ውስጥ የሚገኙ ተማሪዎች መንፈሳዊ አገልግሎትን ለማገኘት በሀገረ ስብከቱ እውቅና ተጀምሯል። ከተማሪዎች ትውልድ ጋር በተያያዘ የሚለዋወጥ ሲሆን መንፈሳዊ ትምህርትና አገልግሎት በቀጣይነት እየተሰጠ ይገኛል።
          </p>
        </motion.div>
      </motion.div>

      {/* Vision and Objectives Grid */}
      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp} className="bg-white dark:bg-[#1C1C1F] rounded-3xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d] hover:border-[#7A1C1C] dark:hover:border-[#D4AF37] transition-all duration-300">
          <h3 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-6 flex items-center gap-3">
            <Target className="h-6 w-6 text-[#7A1C1C] dark:text-[#D4AF37]" /> ራዕይ
          </h3>
          <p className="text-[#6b6b6b] dark:text-gray-400 leading-relaxed text-lg">
            በኦርቶዶክሳዊ እምነት መሠረት የሚመራ፣ ወጣት ተማሪዎች ለቤተ ክርስቲያን አገልግሎት የሚዘጋጁበት፣ በሀገረ ስብከቱ እውቅና ያለው ምሳሌያዊ የግቢ ጉባኤ መሆን።
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-[#faf8f5] dark:bg-[#252529] rounded-3xl p-8 border border-[#ddd8d0] dark:border-[#2a2a2d]">
          <h3 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-6 flex items-center gap-3">
            <Award className="h-6 w-6 text-[#C9A227]" /> አላማዎች
          </h3>
          <ul className="space-y-4 text-[#6b6b6b] dark:text-gray-400">
            {[
              "በግቢ ቆይታቸው ተማሪዎች መንፈሳዊ ዕውቀትን እንዲጨብጡና ሥርዓተ ቤተ ክርስቲያንን እንዲያውቁ ማገዝ",
              "ከቤተ ክርስቲያን ትምህርት ጋር የሚስማሙ አገልጋዮችን ማፍራት",
              "በፍቅርና በአንድነት አብረው እንዲሠሩ ማድረግ",
              "የቤተ ክርስቲያን ትውፊትና ዶግማ እንዲጠበቅ ማድረግ"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A1C1C] dark:bg-[#C9A227] mt-2 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}