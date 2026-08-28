//src/app/dashboard/agent/page.tsx
import { AgentControlView } from "@/features/agent/agent.view";

export const metadata = {
    title: "Agent Control Center - Enda Eyesus",
    description: "Administrative dashboard for the Enda Eyesus fellowship.",
};

export default function AgentPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">System Administration</h1>
                <p className="text-[#6b6b6b] dark:text-[#B0B0B0] mt-1 text-sm">Manage members, approvals, formats and platform health.</p>
            </div>
            <AgentControlView />
        </div>
    );
}
