import { AuditLogsView } from "@/features/agent/audit-logs";

export const metadata = {
    title: "Audit Logs - Enda Eyesus",
    description: "Complete system audit trail for the Secretariat Chairman.",
};

export default function AuditLogsPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Audit Logs</h1>
                <p className="text-[#6b6b6b] dark:text-[#B0B0B0] mt-1 text-sm">Complete system activity and security audit trail.</p>
            </div>
            <AuditLogsView />
        </div>
    );
}
