"use client";

import { useAgentDashboard } from "./agent.hooks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Bell, CheckCircle, Ban } from "lucide-react";

export function OverviewTab() {
  const { metrics, loading } = useAgentDashboard();

  if (loading || !metrics) {
    return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading core metrics...</div>;
  }

  const cards = [
    { label: "Total Members", value: metrics.totalUsers, icon: Users, color: "#C9A227", darkColor: "#D4AF37" },
    { label: "Pending Approvals", value: metrics.pendingApprovals, icon: Bell, color: "#7A1C1C", darkColor: "#8B2C2C" },
    { label: "Active Classes", value: metrics.activeClasses, icon: CheckCircle, color: "#0F3D2E", darkColor: "#1E4D3A" },
    { label: "Suspended", value: metrics.suspendedUsers, icon: Ban, color: "#6b6b6b", darkColor: "#B0B0B0" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37] mb-2">Platform Overview</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]" style={{ borderBottom: `3px solid ${c.darkColor}` }}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0] uppercase tracking-wider">{c.label}</p>
              <c.icon className="h-4 w-4" style={{ color: c.darkColor }} />
            </div>
            <p className="text-3xl font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
          <h4 className="text-sm font-semibold text-[#0F3D2E] dark:text-[#F5F5F5] mb-6">Demographics (Gender)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.genderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} />
                <XAxis dataKey="name" stroke="#6b6b6b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b6b6b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1C1C1F', borderColor: '#2a2a2d', color: '#F5F5F5' }} />
                <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
          <h4 className="text-sm font-semibold text-[#0F3D2E] dark:text-[#F5F5F5] mb-6">Academic Year Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.academicYearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} />
                <XAxis dataKey="name" stroke="#6b6b6b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b6b6b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1C1C1F', borderColor: '#2a2a2d', color: '#F5F5F5' }} />
                <Bar dataKey="value" fill="#1E4D3A" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}