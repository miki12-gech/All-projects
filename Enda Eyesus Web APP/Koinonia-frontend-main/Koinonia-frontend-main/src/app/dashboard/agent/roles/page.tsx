import { ChairmanRolesView } from "@/features/agent/chairman-roles";

export const metadata = {
    title: "Chairman Role Management - Enda Eyesus",
    description: "Executive role assignment and management for the Secretariat Chairman.",
};

export default function ChairmanRolesPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Chairman Role Management</h1>
                <p className="text-[#6b6b6b] dark:text-[#B0B0B0] mt-1 text-sm">Assign, revoke, and transfer executive roles.</p>
            </div>
            <ChairmanRolesView />
        </div>
    );
}
