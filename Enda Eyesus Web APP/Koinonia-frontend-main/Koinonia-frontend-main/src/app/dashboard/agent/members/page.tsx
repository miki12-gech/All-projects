import { MemberCensusView } from "@/features/agent/member-census";

export const metadata = {
    title: "Member Census - Enda Eyesus",
    description: "Complete member directory and census data for the Secretariat Chairman.",
};

export default function MemberCensusPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Member Census</h1>
                <p className="text-[#6b6b6b] dark:text-[#B0B0B0] mt-1 text-sm">Complete directory of all fellowship members.</p>
            </div>
            <MemberCensusView />
        </div>
    );
}
