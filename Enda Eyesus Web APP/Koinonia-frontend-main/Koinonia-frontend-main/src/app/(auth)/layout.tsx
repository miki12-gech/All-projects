import { CrossWatermark } from "@/components/shared/CrossWatermark";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#0E0E0F] px-4 py-12 transition-colors duration-300">
            <CrossWatermark />
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
}
