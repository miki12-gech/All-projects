"use client";

import { useAgentData } from "./agent.hooks";
import { CheckCircle, Ban } from "lucide-react";

export function AccessControlTab() {
  const { permissions, loading } = useAgentData();

  if (loading) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading permissions...</div>;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37]">Role Permissions Matrix</h3>
      <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Define what different administrative roles can access within the control center.</p>

      <div className="overflow-x-auto rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F5F0] dark:bg-[#0E0E0F] text-[#6b6b6b] dark:text-[#B0B0B0]">
            <tr>
              <th className="px-4 py-3 font-medium capitalize">Permission</th>
              {permissions.map(p => (
                <th key={p.role} className="px-4 py-3 font-bold text-[#0F3D2E] dark:text-[#D4AF37] capitalize text-center">
                  {p.role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ddd8d0] dark:divide-[#2a2a2d]">
            {["manageUsers", "manageApprovals", "manageRoles", "manageAnnouncements", "viewLogs"].map(key => (
              <tr key={key} className="hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors">
                <td className="px-4 py-4 font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                {permissions.map(p => (
                  <td key={p.role} className="px-4 py-4 text-center">
                    {(p as any)[key] ? (
                      <CheckCircle className="h-5 w-5 text-[#0F3D2E] dark:text-[#1E4D3A] mx-auto" />
                    ) : (
                      <Ban className="h-4 w-4 text-[#6b6b6b]/40 dark:text-[#B0B0B0]/30 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}