export function DashboardFooter() {
    return (
        <footer className="mt-8 py-6 border-t border-[#ddd8d0] dark:border-[#2a2a2d] text-center">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">
                <p>© {new Date().getFullYear()} እንዳ ኢየሱስ ግቢጉባኤ . All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors">Terms of Service</a>
                    <a href="https://t.me/endaeyesusgbigubae" target="_blank" rel="noreferrer" className="hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors font-medium text-[#7A1C1C] dark:text-[#D4AF37]">Telegram Channel</a>
                </div>
            </div>
        </footer>
    );
}
