"use client";

import { motion, easeOut } from "framer-motion";
import { ScrollText, BookMarked, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// ─── MOTION ───
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

// ─── PART CARD ───
// Each "ክፍል" (Part) of the bylaws gets a sealed medallion bearing its own
// Ge'ez numeral — the numbering already lives in the source document, so
// this simply gives it a visual anchor instead of inventing new structure.
function Part({
  numeral,
  title,
  subtitle,
  delay = 0,
  children,
}: {
  numeral: string;
  title: string;
  subtitle?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeInUp}
      transition={{ delay }}
      className="relative bg-[#faf8f5] dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      {/* Watermark numeral */}
      <span
        className="absolute -top-4 -right-1 text-[6.5rem] font-bold leading-none select-none pointer-events-none text-[#7A1C1C]/5 dark:text-[#D4AF37]/[0.07]"
        style={{ fontFamily: "serif" }}
        aria-hidden
      >
        {numeral}
      </span>

      <div className="relative z-10 p-7 md:p-8">
        <div className="flex items-center gap-4 mb-5">
          <span
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-[#7A1C1C] to-[#9c2a2a] text-[#F4E4B0] font-bold text-xl shrink-0 shadow-[0_8px_20px_rgba(122,28,28,0.35)] border-2 border-[#C9A227]"
            style={{ fontFamily: "serif" }}
          >
            {numeral}
          </span>
          <div>
            <h3
              className="text-xl md:text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] leading-tight"
              style={{ fontFamily: "serif" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm font-semibold text-[#C9A227] tracking-wide mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div
          className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 [&_strong]:text-[#7A1C1C] [&_strong]:dark:text-[#D4AF37] [&_ul]:space-y-2 [&_li]:marker:text-[#C9A227] [&_li]:marker:font-bold"
        >
          {children}
        </div>
      </div>
    </motion.section>
  );
}

// ─── ARTICLE NOTE (standalone, not its own ክፍል) ───
function ArticleNote({
  icon: Icon,
  title,
  delay = 0,
  children,
}: {
  icon: LucideIcon;
  title: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeInUp}
      transition={{ delay }}
      className="relative bg-linear-to-br from-[#7A1C1C]/4 to-[#C9A227]/4 dark:from-[#D4AF37]/6 dark:to-[#7A1C1C]/8 rounded-2xl border border-dashed border-[#C9A227]/40 dark:border-[#D4AF37]/30 p-7 md:p-8"
    >
      <h3 className="text-lg md:text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-3 flex items-center gap-3" style={{ fontFamily: "serif" }}>
        <Icon className="h-5 w-5 shrink-0" />
        {title}
      </h3>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed [&_strong]:text-[#7A1C1C] [&_strong]:dark:text-[#D4AF37]">
        {children}
      </div>
    </motion.div>
  );
}

export default function LawTab() {
  return (
    <div className="space-y-6">
      {/* Section eyebrow */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="flex items-center gap-3 mb-2"
      >
        <span className="h-px flex-1 bg-linear-to-r from-[#C9A227]/0 via-[#C9A227]/60 to-[#C9A227]/0" />
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A227] whitespace-nowrap">
          የውስጠ ደንብ
        </span>
        <span className="h-px flex-1 bg-linear-to-r from-[#C9A227]/0 via-[#C9A227]/60 to-[#C9A227]/0" />
      </motion.div>

      {/* Preamble */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative bg-[#faf8f5] dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] p-7 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        <BookMarked className="absolute -right-5 -bottom-6 w-32 h-32 opacity-[0.05] dark:opacity-[0.08] rotate-12 text-[#7A1C1C] dark:text-[#D4AF37]" />
        <h3
          className="relative z-10 text-xl md:text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-4"
          style={{ fontFamily: "serif" }}
        >
          መግቢያ
        </h3>
        <p className="relative z-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          የቤተ ክርስቲያናችን ተስፋ የሆኑት የከፍተኛ ትምህርት ተቋማት ተማሪዎች በግቢ ቆይታቸው መንፈሳዊ ዕውቀትን እንዲጨብጡና ሥርዓተ
          ቤተ ክርስቲያንን እንዲያውቁ የግቢ ጉባኤያት ሚና የጎላ ነው። በእንዳ ኢየሱስ ግቢ ጉባኤ የሚከናወኑ ማናቸውም መንፈሳዊ፣
          ማኅበራዊና አስተዳደራዊ አገልግሎቶች ወጥ በሆነ መንገድ ይመሩ ዘንድ ይህ የውስጠ ደንብ ተዘጋጅቷል። ይህ መመሪያ የግቢ
          ጉባኤውን ነባራዊ ሁኔታ ባገናዘበ መልኩ የተመቻቸና የአገልግሎት ጥራትን ለማረጋገጥ ያለመ ነው።
        </p>
      </motion.div>

      {/* ክፍል አንድ */}
      <Part numeral="፩" title="መዋቅርና አመራር" subtitle="ክፍል አንድ" delay={0}>
        <p>
          <strong>አንቀጽ 1፦</strong> ተዋረድና የውሳኔ አሰጣጥ
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <strong>1.1. ጠቅላላ ጉባኤ፦</strong> የግቢ ጉባኤው ከፍተኛ አካል ነው። የሥራ አስፈጻሚ አባላትን ይመርጣል፣ ዓመታዊ
            ዕቅድና በጀትን ያጸድቃል።
          </li>
          <li>
            <strong>1.2. የሥራ አስፈጻሚ ጉባኤ፦</strong> የግቢ ጉባኤው የዕለት ተዕለት ውሳኔ ሰጪና አስፈጻሚ አካል ነው።
          </li>
          <li>
            <strong>1.3. የአገልግሎት ክፍሎች፦</strong> በጽሕፈት ቤቱ የሚመሩ 7 የተለዩ ዘርፎችን የያዙ የአገልግሎት ማዕከላት
            ናቸው።
          </li>
        </ul>
      </Part>

      {/* ክፍል ሁለት */}
      <Part numeral="፪" title="የስራ አስፈጻሚ ጉባኤና አወቃቀርና የስራ ሐላፊነት" subtitle="ክፍል ሁለት" delay={0.05}>
        <p>
          <strong>አንቀጽ 2፦</strong> የስራ አስፈጻሚ አወቃቀር
        </p>
        <p>
          2.1. የግቢ ጉባኤው ስራ አስፈጻሚ ጉባኤ የሚከተሉት የጽሕፈት ቤት አባላት እና 7 የአገልግሎት ክፍሎች ያካትታል።
        </p>
        <div className="grid md:grid-cols-3 gap-2 mt-3 text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>ሰብሳቢ</li>
            <li>ምክትል ሰብሳቢ</li>
            <li>ጸሐፊ</li>
            <li>ትምህርት ክፍል</li>
          </ul>
          <ul className="list-disc list-inside space-y-1">
            <li>መዝሙር ክፍል</li>
            <li>አባላት ጉዳይ ክፍል</li>
            <li>ልማት ክፍል</li>
            <li>ሒሳብና ንብረት ክፍል</li>
          </ul>
          <ul className="list-disc list-inside space-y-1">
            <li>ሞያና አገልግሎት ክፍል</li>
            <li>የባች ማስተባበሪያ ክፍል</li>
            <li>ሳንሱርና መርሐ ግብር ዝግጅት ክፍል</li>
            <li>ኦዲትና ኢንስፔክሽን ክፍል</li>
          </ul>
        </div>
        <p>
          2.2. እያንዳንዱ የአገልግሎት ክፍል ከክፍሉ ተጠሪ በተጨማሪ በሥራ አስፈጻሚው በሚጸድቁ አንድ ጸሐፊና እንደ አስፈላጊነቱ
          የንዑሳን ክፍሎች ተጠሪዎች ይመራል።
        </p>
      </Part>

      {/* Standalone Article 3 reference note */}
      <ArticleNote icon={ScrollText} title="አንቀጽ 3፦ ዝርዝር የሥራ መግለጫ" delay={0.1}>
        <p>
          3.1. የእያንዳንዱ አገልጋይና የክፍል ተጠሪ ዝርዝር ተግባርና ኃላፊነት በዚህ ደንብ አባሪ ሆኖ በቀረበው{" "}
          <strong>“የእንዳ ኢየሱስ ግቢ ጉባኤ የአገልግሎት መዋቅርና የተግባር መመሪያ”</strong> ላይ በዝርዝር ተካቷል። ሁሉም አገልጋይ
          ተግባሩን ሲያከናውን የተጠቀሰውን መመሪያና የስራ ሐላፊነት መሰረት በማድረግ ይሆናል።
        </p>
      </ArticleNote>

      {/* ክፍል ሦስት */}
      <Part numeral="፫" title="ዕቅድ፣ ሪፖርትና የመረጃ ፍሰት" subtitle="ክፍል ሦስት" delay={0}>
        <p>
          <strong>አንቀጽ 4፦</strong> የሥራ ዕቅድ ዝግጅት
        </p>
        <ul className="list-disc list-inside ml-4 mb-2">
          <li>4.1. እያንዳንዱ ክፍል የዓመቱን ዕቅድ በትምህርት ዓመቱ መጀመሪያ አዘጋጅቶ ለጽሕፈት ቤቱ ማቅረብ ይኖርበታል።</li>
          <li>4.2. የተቀናጀው የግቢ ጉባኤው ዓመታዊ ዕቅድ በሥራ አስፈጻሚው ታይቶ ለጠቅላላ ጉባኤው ቀርቦ መጽደቅ ይኖርበታል።</li>
        </ul>
        <p>
          <strong>አንቀጽ 5፦</strong> የሪፖርት አቀራረብ
        </p>
        <ul className="list-disc list-inside ml-4 mb-2">
          <li>5.1. ክፍሎች በየሦስት ወሩ (ሩብ ዓመት) የሥራ አፈጻጸም ሪፖርታቸውን ለጽሕፈት ቤቱ ማቅረብ ይኖርባቸዋል።</li>
          <li>5.2. ጽሕፈት ቤቱ የክፍሎችን ሪፖርት አጠናቅሮ በየሴሚስተሩ ለጠቅላላ ጉባኤና ለሀገረ ስብከቱ ያቀርባል።</li>
        </ul>
        <p>
          <strong>አንቀጽ 6፦</strong> የመረጃ አያያዝና ምስጢር መጠበቅ
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            6.1. የግቢ ጉባኤው ሰነዶች፣ የአባላት መረጃዎችና ቃለ-ጉባኤዎች በጽሕፈት ቤቱና በሚመለከተው ክፍል በአግባቡ ተመዝግበው
            መቀመጥ ይኖርባቸዋል።
          </li>
          <li>6.2. የአባላትን ግላዊ መረጃና የምስጢር ውይይቶችን አሳልፎ መስጠት በዲሲፕሊን የሚያስጠይቅ ከባድ ጥፋት ነው።</li>
        </ul>
      </Part>

      {/* ክፍል አራት */}
      <Part numeral="፬" title="የአባልነት ምዝገባ፣ መብትና ግዴታ" subtitle="ክፍል አራት" delay={0.05}>
        <p>
          <strong>አንቀጽ 7፦</strong> የአባልነት ምዝገባና ቅድመ ሁኔታ
        </p>
        <ul className="list-disc list-inside ml-4 mb-2">
          <li>
            7.1. ማንኛውም በዩኒቨርሲቲው የተመደበ የኦርቶዶክስ ተዋሕዶ እምነት ተከታይ ተማሪ (ተማሪ ያልሆነ አይቻልም) ጉባኤ አበው
            በአግባቡ ተከታትሎ ሲመረቅ የአባላት ጉዳይ ክፍል የሚያዘጋጀውን ቅጽ በመሙላት አባል መሆን ይችላል።
          </li>
          <li>7.2. አዲስ አባል ስለ ግቢ ጉባኤው ዓላማ፣ ሥርዓትና መመሪያ አጭር ገለጻ ይሰጣቸዋል።</li>
        </ul>
        <p>
          <strong>አንቀጽ 8፦</strong> የአባላት መብትና ግዴታ
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">8.1. መብት</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>በግቢ ጉባኤው የሚሰጡ አገልግሎቶች የማግኘት (ትምህርት፣ ዝማሬ፣ ንስሐ አባት፣ ስልጠናዎች...)</li>
              <li>እንደ ተሰጥኦውና እንደ ዝግጅቱ፣ በግቢ ጉባኤው ሕግና ደንብ መሰረት በአገልግሎት ዘርፎች የመሳተፍ።</li>
              <li>ችግር ሲገጥመው ከግቢ ጉባኤው የማማከርና መንፈሳዊ ድጋፍ የማግኘት።</li>
              <li>በግቢ ቆይታው በቤተ ክርስቲያን ስርዓት ጋብቻን ቢፈጽም የእንኳን ደስ አለህ/ሽ መልእክትና መንፈሳዊ ስጦታን
                ይበረከትለታል።</li>
              <li>የአባሉ የ1ኛ ደረጃ ቤተሰብ ሲሞት የመጽናናት አገልግሎት የማግኘት መብት አለው።</li>
              <li>ተመራቂ አባላት አስፈላጊውን ነገር አሟልተው ሲገኙ ግቢ ጉባኤው የሚያዘጋጀው መጽሔት የማግኘት መብት አላቸው።</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">8.2. ግዴታ</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>የግቢ ጉባኤውን ውስጠ ደንብና ሥርዓት ማክበር።</li>
              <li>መደበኛ ትምህርቶችንና ስብሰባዎችን በአግባቡ መከታተል።</li>
              <li>ወርሃዊ መዋጮና ሌሎች የጋራ ውሳኔዎችን በታማኝነት መፈጸም።</li>
              <li>የተመደበለትን የስራ ሐላፊነት መወጣት።</li>
            </ul>
          </div>
        </div>
      </Part>

      {/* ክፍል አምስት */}
      <Part numeral="፭" title="የአገልግሎት እርከኖችና የሥልጠና መስፈርቶች" subtitle="ክፍል አምስት" delay={0}>
        <p>
          <strong>አንቀጽ 9፦</strong> የአገልግሎት ፈቃድና ገደቦች
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <strong>9.1. ጠቅላላ አገልግሎት፦</strong> ማንኛውም የ&quot;ጉባኤ አበው&quot; ትምህርትን ያጠናቀቀ አባል በሁሉም
            ክፍላት በአባልነት ማገልገል ይችላል።
          </li>
          <li>
            <strong>9.2. ልዩ የአገልግሎት ገደቦች፦</strong> የሚከተሉት አገልግሎቶች &quot;ጉባኤ አበው&quot; ከማጠናቀቅ
            በተጨማሪ የትምህርት ዝግጅት ይጠይቃሉ፦
            <ul className="list-[circle] list-inside ml-8 mt-1">
              <li>የንዑስ ክፍል መሪዎች፦ &quot;ጉባኤ ሐዋርያት&quot; በአግባቡ ተምሮ ያጠናቀቀ።</li>
              <li>
                የመድረክ መሪነትና ተተኪ መምህርነት፦ &quot;ጉባኤ ሐዋርያት&quot; አጠናቆ &quot;ጉባኤ ኤቅሌስያ&quot; የጀመረ
                ወይም ያጠናቀቀ መሆን አለበት።
              </li>
              <li>ትምህርታዊ ጽሑፎች ዝግጅት፦ በ&quot;ጉባኤ ኤቅሌስያ&quot; በኩል የሚሰጡ ጥናታዊ ትምህርቶችን መከታተል ግዴታ
                ነው።</li>
            </ul>
          </li>
        </ul>
      </Part>

      {/* ክፍል ስድስት */}
      <Part numeral="፮" title="የአስተዳደር ምርጫ ፖሊሲ" subtitle="ክፍል ስድስት" delay={0.05}>
        <p>
          <strong>አንቀጽ 10፦</strong> የአመራር ምርጫ መስፈርቶችና ሂደት
        </p>
        <ul className="list-disc list-inside ml-4 space-y-3">
          <li>
            <strong>10.1. ምርጫ አስተባባሪ አካል፦</strong> የሀገረ ስብከቱ ተወካዮች፣ የግቢ ጉባኤው ሰብሳቢ እና ኦዲትና
            ኢንስፔክሽን ክፍል ሐላፊ ያካተተ ሲሆን ዕጩዎችን ከስራ አስፈጻሚው በመቀበል የማጣራትና የመገምገም እንዲሁም የምርጫውን
            ፕሮግራም የመምራት ኃላፊነት ይኖረዋል። ምርጫው ሲጨረስ ደግሞ፣ የምርጫ አካሄድ ሪፖርት ለሀገረ ስብከቱ ያቀርባል።
          </li>
          <li>
            <strong>10.2. ለዕጩነት የሚያበቁ መስፈርቶች</strong>
            <ul className="list-[circle] list-inside ml-8 mt-1 space-y-1">
              <li>በመንፈሳዊ ሕይወቱ (በንስሐ እና የቁርባን ሕይወቱ) የታወቀ።</li>
              <li>ቢያንስ የ&quot;ጉባኤ ሐዋርያት&quot; ትምህርትን ያጠናቀቀ።</li>
              <li>በትምህርቱ (Academic) ውጤታማና ለሌሎች አርአያ መሆን የሚችል ተማሪ።</li>
              <li>በሥራ አስፈጻሚነት ለመመረጥ ቢያንስ አንድ ዓመት በንዑስ ክፍል አስተባባሪነት ያገለገለ መሆን አለበት።</li>
              <li>በአገልግሎት ዘመኑ ለመስክ ተልእኮ ከግቢ የማይወጣ እንዲሁም ደግሞ 2ኛ ዓመት ያልሆነ መሆን አለበት።</li>
            </ul>
          </li>
          <li>
            <strong>10.3. የምርጫ ሂደት</strong>
            <ul className="list-[circle] list-inside ml-8 mt-1 space-y-1">
              <li>የሥራ አስፈጻሚ አባላት የአገልግሎት ዘመን አንድ (1) ዓመት ይሆናል።</li>
              <li>አንድ የስራ አስፈጻሚ አባል ከሁለት ግዜ በላይ ሊመረጥ አይችልም።</li>
              <li>አዲሱ የሚመረጠው የስራ አመራር ጽ/ቤት ከነባሩ ስራ አመራር አባላት ብቻ ይሆናል።</li>
              <li>
                የክፍላት ተጠሪዎች እንዲሁም የኦዲትና ኢንስፔክሽን ሐላፊ ከየክፍሉ ተመርጠው በስራ አመራሩም ተቀባይነት ያገኙ
                ዕጩዎች ወደ ጠቅላላ ጉባኤው በማቅረብ የሚመረጡ ይሆናል።
              </li>
              <li>የምርጫው ውጤት በሀገረ ስብከቱ ታውቆ ማረጋገጫ ማግኘት ይኖርበታል።</li>
            </ul>
          </li>
        </ul>
      </Part>

      {/* ክፍል ሰባት */}
      <Part numeral="፯" title="የአባላት ሥነ-ምግባርና ዲሲፕሊን" subtitle="ክፍል ሰባት" delay={0}>
        <p>
          <strong>አንቀጽ 11፦</strong> የጥፋት ደረጃዎችና የቅጣት እርምጃዎች
        </p>
        <ul className="list-disc list-inside ml-4 space-y-3">
          <li>
            <strong>11.1. ቀላል ጥፋቶች፦</strong> ያለበቂ ምክንያት ከመደበኛ ትምህርትና መርሐግብር በተደጋጋሚ መቅረት፣
            መዘግየት፣ ወርሃዊ መዋጮ እስከ 3 ወር አለመክፈል እና ሌሎች ቀላል ስሕተቶች።
            <ul className="list-[circle] list-inside ml-8 mt-1 space-y-1">
              <li>መጀመርያ ደረጃ፦ የቃል ምክር በክፍል ተጠሪው በኩል ይሰጣል።</li>
              <li>ሁለተኛ ደረጃ፦ የቃል ምክር በአባላት ጉዳይ በኩል ይሰጣል።</li>
              <li>ሶስተኛ ደረጃ፦ በክፍሉ መተዳደርያ ደንብ መሰረት የአገልግሎት እገዳ ወይም ደግሞ ሌላ አስተማሪ ቅጣት ሊጣልበት
                ይችላል።</li>
            </ul>
          </li>
          <li>
            <strong>11.2. ከባድ ጥፋቶች፦</strong> በቤተ ክርስቲያን አስተምህሮ ላይ መሳለቅ፣ ስሑት ትምህርት ማስተማር፣ በቡድን
            ተከፋፍሎ ግጭት መፍጠር፣ ምስጢር አሳልፎ መስጠት፣ በገንዘብና ንብረት ላይ ታማኝነት ማጣት።
            <ul className="list-[circle] list-inside ml-8 mt-1 space-y-1">
              <li>መጀመርያ ደረጃ፦ በሥራ አስፈጻሚው ተወስኖ በጽሑፍ ማስጠንቀቂያ መስጠት።</li>
              <li>
                ሁለተኛ ደረጃ፦ ለተወሰነ ጊዜ ከአገልግሎት ማገድ ወይም ለጠቅላላ ጉባኤ አቅርቦ እንዲሰናበት ማድረግና ለሀገረ
                ስብከቱ ማሳወቅ።
              </li>
            </ul>
          </li>
          <li>
            <strong>11.3. የእርምጃ አወሳሰድ አካሄድ፦</strong> ጥፋት በፈጸመ አባል ላይ እርምጃ ከመወሰዱ በፊት አባሉን በአካል
            አግኝቶ ነገሩን ማስረዳትና ሐሳቡን እንዲገልጽ ማድረግ ይገባል።
          </li>
          <li>
            <strong>11.4.</strong> በከፍተኛ የአገልግሎት እርከን ላይ ያለ አገልጋይ ከባድ ጥፋት ቢፈጽም፣ ከኃላፊነቱ ከመታገድ
            በተጨማሪ ለተወሰነ ጊዜ ወደ አነስተኛ የአገልግሎት እርከን ዝቅ እንዲል ሊደረግ ይችላል።
          </li>
          <li>
            <strong>11.5.</strong> በሥራ አስፈጻሚ አባል ላይ የሚወሰድ ማንኛዉም እርምጃ ለሀገረ ስብከቱ የግቢ ጉባኤ
            አስተባባሪ ኮሚቴ በደብዳቤ አሳውቆ፣ ተቀባይነት ማግኘት ይኖርበታል። ተቀባይነት የማያገኝ ከሆነ ግን የሀገረ ስብከቱ ተወካይ
            ባለበት የስራ አስፈጻሚ ስብሰባ በማድረግ ነገሩን በድጋሜ ይታያል።
          </li>
        </ul>
      </Part>

      {/* ክፍል ስምንት */}
      <Part numeral="፰" title="የስብሰባ ሥርዓትና የፋይናንስ መመሪያ" subtitle="ክፍል ስምንት" delay={0.05}>
        <p>
          <strong>አንቀጽ 12፦</strong> የስብሰባ አይነቶች
        </p>
        <ul className="list-disc list-inside ml-4 mb-2 space-y-2">
          <li>
            <strong>12.1. የሥራ አስፈጻሚ ስብሰባ፦</strong> ቢያንስ በየ15 ቀን አንድ ጊዜ ይካሄዳል። ምላዓተ ጉባኤ
            የሚሟላው ከግማሽ በላይ አባላት ሲገኙ ነው።
          </li>
          <li>
            <strong>12.2. የጠቅላላ ጉባኤ ስብሰባ፦</strong> በዓመት ሁለት ጊዜ (በየሴሚስተሩ) ይካሄዳል። ለአባሉ ሊመች ይችላል
            ተብሎ በታመነበት ቀን የሚካሄድ ሲሆን የስብሰባው ማስታወቅያ ከአንድ ሳምንት በፊት ከተነገረ በኋላ በተገኘው አባል ሊደረግ
            ይችላል።
          </li>
        </ul>
        <p>
          <strong>አንቀጽ 13፦</strong> የፋይናንስና የንብረት አያያዝ
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>
            <strong>13.1. የገንዘብ አጠቃቀም፦</strong> ማንኛውም ወጪ በሥራ አስፈጻሚው ታቅዶ በቃለ-ጉባኤ ከጸደቀ በኋላ
            በሰብሳቢውና በሒሳብ ሹሙ ፊርማ ብቻ ወጪ ይሆናል።
          </li>
          <li>13.2. ከ1,000 ብር በላይ የሆኑ ክፍያዎች በባንክ ዝውውር ወይም ደግሞ በደረሰኝ እንዲፈጸሙ ይበረታታል።</li>
          <li>
            <strong>13.3. የንብረት ኦዲት፦</strong> የኦዲት ክፍሉ በየሦስት ወሩ መደበኛ የንብረት ምርመራ በማድረግ ለሥራ
            አስፈጻሚው ሪፖርት ያቀርባል።
          </li>
        </ul>
      </Part>

      {/* ክፍል ዘጠኝ */}
      <Part numeral="፱" title="ማጠቃለያ ድንጋጌዎች" subtitle="ክፍል ዘጠኝ" delay={0}>
        <p>
          <strong>አንቀጽ 14፦</strong> መመሪያውን ስለማሻሻል
        </p>
        <p className="ml-4">14.1. ይህ መመሪያ ሊሻሻል የሚችለው በሥራ አስፈጻሚው ወደ ጠቅላላ ጉባኤው ቀርቦ 2/3ኛ ድምፅ ሲደገፍ ብቻ ነው።</p>
        <p>
          <strong>አንቀጽ 15፦</strong> መመሪያው የሚጸናበት ጊዜ
        </p>
        <p className="ml-4">
          15.1. ይህ የውስጠ ደንብና የአሠራር መመሪያ ከዛሬ ______ ቀን ______ ዓ.ም ጀምሮ የጸና ይሆናል።
        </p>
      </Part>

      {/* Closing */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="flex items-center justify-center gap-4 pt-4"
      >
        <span className="h-px w-16 bg-linear-to-r from-transparent to-[#C9A227]" />
        <p className="text-center text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] whitespace-nowrap">
          ረድኤተ እግዚአብሔር አይለየን አሜን!
        </p>
        <span className="h-px w-16 bg-linear-to-l from-transparent to-[#C9A227]" />
      </motion.div>
    </div>
  );
}