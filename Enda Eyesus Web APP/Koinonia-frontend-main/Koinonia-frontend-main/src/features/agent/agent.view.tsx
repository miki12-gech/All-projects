// src/features/agent/agent.view.tsx
"use client";

import { useState, useEffect } from "react";
import { useAgentDashboard, useAgentUsers, useAgentApprovals, useAgentData, useMembershipReview, useSubClasses } from "./agent.hooks";
import { User, ShieldCheck, CheckCircle, Ban, Search, Shield, Users, Activity, Settings, Bell, CircleCheck, CircleX, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuthStore } from "@/store/authStore";

type TabType = "dashboard" | "users" | "approvals" | "roles" | "subclasses" | "subclass-approvals";

export function AgentControlView() {
    const { user } = useAuthStore();
    const systemRole = user?.system_role || user?.role || 'USER';
    const isServiceManager = systemRole === 'SERVICE_MANAGER';
    const isMemberAffairs = user?.serviceClassName === 'አባላት ጉዳይ ክፍል';
    const isChairman = systemRole === 'SECRETARIAT_CHAIRMAN';
    const isVice = systemRole === 'SECRETARIAT_VICE';
    const isSecretary = systemRole === 'SECRETARIAT_SECRETARY';
    const isSecretariat = isChairman || isVice || isSecretary;

    // Default tab based on role
    const [activeTab, setActiveTab] = useState<TabType>(isServiceManager ? "users" : "dashboard");

    const tabs = [
        { id: "dashboard", label: "Overview", icon: Activity, show: !isServiceManager },
        { id: "approvals", label: "Pending Approvals", icon: CheckCircle, show: isMemberAffairs },
        { id: "subclass-approvals", label: "Sub-Class Approvals", icon: Layers, show: isChairman },
        { id: "roles", label: "Access Control", icon: ShieldCheck, show: isSecretariat },
    ].filter(t => t.show);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Vertical Sidebar Navigation for Agent Control */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="mb-6 px-4">
                        <h2 className="text-xl font-bold text-[#0F3D2E] dark:text-[#D4AF37] flex items-center gap-2">
                            <Shield className="h-6 w-6 text-[#C9A227] dark:text-[#D4AF37]" />
                            {isServiceManager ? "Class Manager" : "Agent Control"}
                        </h2>
                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-1">
                            {isServiceManager ? `${user?.serviceClassName || 'Department'} Management` : 'Management & Administration'}
                        </p>
                    </div>

                    <div className="space-y-1 px-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] text-white dark:from-[#D4AF37] dark:to-[#1E4D3A] dark:text-[#0E0E0F] shadow-md"
                                        : "text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]"
                                }`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "opacity-100" : "opacity-60"}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] shadow-sm min-h-[600px] overflow-hidden">
                    <div className="h-full">
                        {activeTab === "dashboard" && !isServiceManager && <DashboardTab />}
                        {activeTab === "approvals" && isMemberAffairs && <ApprovalsTab />}
                        {activeTab === "subclass-approvals" && isChairman && <SubClassApprovalsTab />}
                        {activeTab === "roles" && isSecretariat && <RolesTab />}
                    </div>
                </div>

            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS (TABS)
// ----------------------------------------------------------------------

function DashboardTab() {
    const { metrics, loading } = useAgentDashboard();

    if (loading || !metrics) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading core metrics...</div>;

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
                {/* Gender Chart */}
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

                {/* Academic Year Chart */}
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

function UsersTab() {
    const { users, loading, changeStatus, changeRole } = useAgentUsers();

    if (loading) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading users...</div>;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37]">User Management</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b]" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 bg-[#F8F5F0] dark:bg-[#0E0E0F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8F5F0] dark:bg-[#0E0E0F] text-[#6b6b6b] dark:text-[#B0B0B0]">
                        <tr>
                            <th className="px-4 py-3 font-medium">Member</th>
                            <th className="px-4 py-3 font-medium">Department</th>
                            <th className="px-4 py-3 font-medium">Service Class</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ddd8d0] dark:divide-[#2a2a2d]">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#0F3D2E] dark:bg-[#1E4D3A] flex items-center justify-center text-xs font-bold text-[#C9A227] dark:text-[#D4AF37]">
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">{u.fullName}</p>
                                            <p className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0]">@{u.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[#6b6b6b] dark:text-[#B0B0B0]">{u.department}</td>
                                <td className="px-4 py-3 text-[#6b6b6b] dark:text-[#B0B0B0]">{u.serviceClass}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.status === 'active' ? 'bg-[#0F3D2E]/10 text-[#0F3D2E] dark:bg-[#1E4D3A]/30 dark:text-[#4ade80]' :
                                        u.status === 'pending' ? 'bg-[#C9A227]/10 text-[#C9A227] dark:bg-[#D4AF37]/20 dark:text-[#D4AF37]' :
                                            'bg-[#7A1C1C]/10 text-[#7A1C1C] dark:bg-[#8B2C2C]/30 dark:text-[#f87171]'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-[#6b6b6b] dark:text-[#B0B0B0]">
                                    <select
                                        className="bg-transparent text-xs font-medium border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-md px-2 py-1 w-24"
                                        value={u.role || "viewer"}
                                        onChange={(e) => changeRole(u.id, e.target.value)}
                                    >
                                        <option value="viewer">Member</option>
                                        <option value="moderator">Class Leader</option>
                                        <option value="admin">Super Admin</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <select
                                        className="bg-transparent text-xs font-medium border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-md px-2 py-1 text-[#6b6b6b] dark:text-[#B0B0B0]"
                                        value={u.status}
                                        onChange={(e) => changeStatus(u.id, e.target.value as any)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="suspended">Suspend</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ApprovalsTab() {
    const { approvals, loading, handleRequest } = useAgentApprovals();

    if (loading) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading approvals queue...</div>;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37]">Pending Approvals ({approvals.length})</h3>

            {approvals.length === 0 ? (
                <div className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-8 text-center border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <CheckCircle className="h-8 w-8 text-[#0F3D2E] dark:text-[#1E4D3A] mx-auto mb-3 opacity-50" />
                    <p className="text-[#6b6b6b] dark:text-[#B0B0B0] font-medium">All caught up! No pending approvals.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {approvals.map(req => (
                        <div key={req.id} className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-5 border border-[#ddd8d0] dark:border-[#2a2a2d] flex flex-col justify-between" style={{ borderLeft: "3px solid #C9A227" }}>
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{req.fullName}</h4>
                                    <span className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0]">{req.requestDate}</span>
                                </div>
                                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mb-1">Requested to join:</p>
                                <p className="text-sm font-semibold text-[#0F3D2E] dark:text-[#D4AF37] mb-5">{req.serviceClass}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleRequest(req.id, "approved")}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#0F3D2E] dark:bg-[#1E4D3A] text-[#C9A227] dark:text-[#D4AF37] py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
                                >
                                    <CircleCheck className="h-4 w-4" /> Approve
                                </button>
                                <button
                                    onClick={() => handleRequest(req.id, "rejected")}
                                    className="flex-1 flex items-center justify-center gap-2 border border-[#7A1C1C]/30 text-[#7A1C1C] dark:text-[#f87171] py-2 rounded-lg text-xs font-bold hover:bg-[#7A1C1C]/10 transition-all"
                                >
                                    <CircleX className="h-4 w-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function RolesTab() {
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

function SubClassesTab() {
    const { subClasses, loading, createSubClass, updateRoles } = useSubClasses();
    const { users } = useAgentUsers(); // Need users to select sub-roles
    const [newSubClassName, setNewSubClassName] = useState('');
    const [creating, setCreating] = useState(false);

    if (loading) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading sub-classes...</div>;

    const handleCreate = async () => {
        if (!newSubClassName.trim()) return;
        setCreating(true);
        await createSubClass(newSubClassName);
        setNewSubClassName('');
        setCreating(false);
    };

    const handleRoleUpdate = async (subClassId: string, roleType: 'sub_chair_id' | 'sub_vice_id' | 'sub_secretary_id', userId: string) => {
        await updateRoles(subClassId, { [roleType]: userId || null });
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37]">Sub-Class Management</h3>
            <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Manage sub-classes and assign sub-chair, sub-vice, and sub-secretary roles.</p>

            <div className="bg-[#F8F5F0] dark:bg-[#0E0E0F] p-4 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] flex items-center gap-4">
                <input 
                    type="text" 
                    placeholder="New sub-class name..." 
                    className="flex-1 bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#D4AF37]"
                    value={newSubClassName}
                    onChange={(e) => setNewSubClassName(e.target.value)}
                />
                <button 
                    onClick={handleCreate}
                    disabled={creating || !newSubClassName.trim()}
                    className="bg-[#0F3D2E] text-[#C9A227] dark:bg-[#1E4D3A] dark:text-[#D4AF37] px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                    Create Sub-Class
                </button>
            </div>

            <div className="space-y-4 mt-6">
                {subClasses.map(sc => (
                    <div key={sc.id} className="bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl p-5 shadow-sm">
                        <h4 className="text-md font-bold text-[#1a1a1a] dark:text-[#F5F5F5] mb-4">{sc.sub_class_name}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { key: 'sub_chair_id', label: 'Sub-Chair', user: sc.users_sub_classes_sub_chair_idTousers },
                                { key: 'sub_vice_id', label: 'Sub-Vice', user: sc.users_sub_classes_sub_vice_idTousers },
                                { key: 'sub_secretary_id', label: 'Sub-Secretary', user: sc.users_sub_classes_sub_secretary_idTousers },
                            ].map(role => (
                                <div key={role.key} className="space-y-1">
                                    <label className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">{role.label}</label>
                                    <select 
                                        className="w-full bg-[#F8F5F0] dark:bg-[#0E0E0F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F3D2E] dark:focus:border-[#D4AF37]"
                                        value={role.user?.id || ''}
                                        onChange={(e) => handleRoleUpdate(sc.id, role.key as any, e.target.value)}
                                    >
                                        <option value="">-- Unassigned --</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.fullName}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {subClasses.length === 0 && (
                    <div className="text-center py-8 text-[#6b6b6b] dark:text-[#B0B0B0]">
                        No sub-classes found. Create one above.
                    </div>
                )}
            </div>
        </div>
    );
}

function SubClassApprovalsTab() {
    const [approvals, setApprovals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingApprovals();
    }, []);

    const fetchPendingApprovals = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/admin/subclasses/pending-approvals', {
                credentials: 'include'
            });
            const data = await response.json();
            setApprovals(data.data || []);
        } catch (error) {
            console.error('Failed to fetch pending approvals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await fetch(`http://localhost:8080/api/v1/admin/subclasses/${id}/approve`, {
                method: 'PATCH',
                credentials: 'include'
            });
            fetchPendingApprovals();
        } catch (error) {
            console.error('Failed to approve subclass:', error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await fetch(`http://localhost:8080/api/v1/admin/subclasses/${id}/reject`, {
                method: 'PATCH',
                credentials: 'include'
            });
            fetchPendingApprovals();
        } catch (error) {
            console.error('Failed to reject subclass:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading pending approvals...</div>;

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold text-[#0F3D2E] dark:text-[#D4AF37]">Sub-Class Approvals ({approvals.length})</h3>
            <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Review and approve or reject pending sub-class creation and leadership changes.</p>

            {approvals.length === 0 ? (
                <div className="bg-[#F8F5F0] dark:bg-[#0E0E0F] rounded-xl p-8 text-center border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <CheckCircle className="h-8 w-8 text-[#0F3D2E] dark:text-[#1E4D3A] mx-auto mb-3 opacity-50" />
                    <p className="text-[#6b6b6b] dark:text-[#B0B0B0] font-medium">No pending sub-class approvals.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {approvals.map(approval => (
                        <div key={approval.id} className="bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-md font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.sub_class_name}</h4>
                                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Class: {approval.service_classes?.class_name_amharic || 'N/A'}</p>
                                </div>
                                <span className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0]">
                                    {new Date(approval.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {approval.users_sub_classes_sub_chair_idTousers && (
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">Sub-Chair: </span>
                                    <span className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.users_sub_classes_sub_chair_idTousers.full_name_three_parts}</span>
                                </div>
                            )}
                            {approval.users_sub_classes_sub_vice_idTousers && (
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">Sub-Vice: </span>
                                    <span className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.users_sub_classes_sub_vice_idTousers.full_name_three_parts}</span>
                                </div>
                            )}
                            {approval.users_sub_classes_sub_secretary_idTousers && (
                                <div className="mb-4">
                                    <span className="text-xs font-semibold text-[#6b6b6b] dark:text-[#B0B0B0]">Sub-Secretary: </span>
                                    <span className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5]">{approval.users_sub_classes_sub_secretary_idTousers.full_name_three_parts}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleApprove(approval.id)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#0F3D2E] dark:bg-[#1E4D3A] text-[#C9A227] dark:text-[#D4AF37] py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
                                >
                                    <CircleCheck className="h-4 w-4" /> Approve
                                </button>
                                <button
                                    onClick={() => handleReject(approval.id)}
                                    className="flex-1 flex items-center justify-center gap-2 border border-[#7A1C1C]/30 text-[#7A1C1C] dark:text-[#f87171] py-2 rounded-lg text-xs font-bold hover:bg-[#7A1C1C]/10 transition-all"
                                >
                                    <CircleX className="h-4 w-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
