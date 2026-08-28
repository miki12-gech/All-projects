import Link from "next/link";
import { Send } from "lucide-react";

export function MainFooter() {
    return (
        <footer className="bg-white dark:bg-[#1C1C1F] border-t-4 border-[#C9A227] dark:border-[#D4AF37] pt-16 pb-8 shadow-lg relative overflow-hidden">
            {/* Subtle cross watermark */}
            <div className="absolute -bottom-24 -right-24 opacity-5 pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                    <rect x="180" y="20" width="40" height="360" rx="8" fill="#C9A227" />
                    <rect x="40" y="120" width="320" height="40" rx="8" fill="#C9A227" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Col */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#7A1C1C] dark:bg-[#D4AF37] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <rect x="8.5" y="1" width="3" height="18" rx="1" fill="white" />
                                    <rect x="2" y="6" width="16" height="3" rx="1" fill="white" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] font-serif">እንዳ ኢየሱስ</h2>
                        </div>
                        <p className="text-[#6b6b6b] dark:text-[#B0B0B0] text-sm leading-relaxed max-w-md">
                            የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የተማሪዎች ማኅበር በመቀሌ ዩኒቨርሲቲ። ተማሪዎችን በእምነት፣ በአገልግሎትና በትምህርት ከ1986 ዓ.ም (ታሕሳስ 29) ጀምሮ ያስተሳስራል።
                        </p>
                        <a
                            href="https://t.me/endaeyesusgbigubae"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37] hover:text-[#C9A227] dark:hover:text-[#C9A227] transition-colors bg-[#F8F5F0] dark:bg-[#252529] px-4 py-2.5 rounded-full border border-[#ddd8d0] dark:border-[#2a2a2d] text-sm font-medium mt-4 shadow-sm hover:shadow-md"
                        >
                            <Send className="w-4 h-4 text-[#C9A227]" />
                            የቴሌግራም ገፃችንን ይቀላቀሉ
                        </a>
                    </div>

                    {/* Fellowship Links */}
                    <div>
                        <h3 className="text-[#1a1a1a] dark:text-[#F5F5F5] font-bold mb-4 text-lg">የማኅበር</h3>
                        <ul className="space-y-3 text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                            <li><Link href="/register" className="hover:text-[#C9A227] transition-colors">አባል ይሁኑ</Link></li>
                            <li><Link href="/login" className="hover:text-[#C9A227] transition-colors">ይግቡ</Link></li>
                            <li><span className="cursor-not-allowed opacity-50">የቅዳሴ መርሐግብር</span></li>
                            <li><span className="cursor-not-allowed opacity-50">መዝሙር ክፍል</span></li>
                        </ul>
                    </div>

                    {/* About Links */}
                    <div>
                        <h3 className="text-[#1a1a1a] dark:text-[#F5F5F5] font-bold mb-4 text-lg">ስለ እንዳ ኢየሱስ</h3>
                        <ul className="space-y-3 text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">
                            <li><span className="cursor-not-allowed opacity-50">ታሪካችን</span></li>
                            <li><span className="cursor-not-allowed opacity-50">ሥራ አስፈጻሚ ጉባኤ</span></li>
                            <li><span className="cursor-not-allowed opacity-50">ያግኙን</span></li>
                            <li><span className="cursor-not-allowed opacity-50">ድጋፍ / ልገሳ</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#ddd8d0] dark:border-[#2a2a2d] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#6b6b6b] dark:text-[#B0B0B0] text-xs">
                        © {new Date().getFullYear()} እንዳ ኢየሱስ ግቢ ጉባኤ · መቀሌ ዩኒቨርሲቲ
                    </p>
                    <p className="text-[#C9A227] dark:text-[#D4AF37] text-xs font-serif uppercase tracking-widest">
                        ረድኤተ እግዚአብሔር አይለየን አሜን!
                    </p>
                </div>
            </div>
        </footer>
    );
}