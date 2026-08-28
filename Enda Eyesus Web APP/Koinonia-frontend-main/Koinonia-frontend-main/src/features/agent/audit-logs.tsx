// src/features/agent/audit-logs.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Shield, Search, Filter, Clock, User, Activity, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import chairmanApiService from "@/lib/chairmanApi";

export function AuditLogsView() {
    const { user } = useAuthStore();
    const systemRole = user?.system_role || user?.role || 'USER';
    const isChairman = systemRole === 'SECRETARIAT_CHAIRMAN';

    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [entityTypeFilter, setEntityTypeFilter] = useState('');
    const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await chairmanApiService.getAuditLogs({ limit: 100 });
                setLogs(res.data || []);
                setFilteredLogs(res.data || []);
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isChairman) {
            fetchLogs();
        }
    }, [isChairman]);

    useEffect(() => {
        let filtered = logs;

        if (searchQuery) {
            filtered = filtered.filter((log) =>
                log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (entityTypeFilter) {
            filtered = filtered.filter((log) => log.entity_type === entityTypeFilter);
        }

        setFilteredLogs(filtered);
    }, [searchQuery, entityTypeFilter, logs]);

    if (!isChairman) {
        return (
            <div className="bg-[#7A1C1C]/10 dark:bg-[#8B2C2C]/10 border border-[#7A1C1C]/30 dark:border-[#8B2C2C]/30 rounded-xl p-8 text-center">
                <Shield className="h-12 w-12 text-[#7A1C1C] dark:text-[#8B2C2C] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#7A1C1C] dark:text-[#8B2C2C] mb-2">Access Restricted</h3>
                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Only the Secretariat Chairman can access this page.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading audit logs...</div>;
    }

    const actionColors: Record<string, string> = {
        'ASSIGN_ROLE': 'bg-[#C9A227]/10 text-[#C9A227] dark:bg-[#D4AF37]/10 dark:text-[#D4AF37]',
        'REVOKE_ROLE': 'bg-[#7A1C1C]/10 text-[#7A1C1C] dark:bg-[#8B2C2C]/10 dark:text-[#8B2C2C]',
        'TRANSFER_CHAIRMAN': 'bg-[#C9A227]/20 text-[#C9A227] dark:bg-[#D4AF37]/20 dark:text-[#D4AF37]',
        'APPROVE_USER': 'bg-[#0F3D2E]/10 text-[#0F3D2E] dark:bg-[#1E4D3A]/10 dark:text-[#1E4D3A]',
        'SUSPEND_USER': 'bg-[#7A1C1C]/10 text-[#7A1C1C] dark:bg-[#8B2C2C]/10 dark:text-[#8B2C2C]',
        'CREATE_POST': 'bg-[#0E0E0F]/10 text-[#0E0E0F] dark:bg-[#252529]/10 dark:text-[#252529]',
        'DELETE_POST': 'bg-[#7A1C1C]/10 text-[#7A1C1C] dark:bg-[#8B2C2C]/10 dark:text-[#8B2C2C]',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0E0E0F]/10 dark:bg-[#252529]/10 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-[#0E0E0F] dark:text-[#252529]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">{logs.length}</p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Total Actions</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 dark:bg-[#D4AF37]/10 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-[#C9A227] dark:text-[#D4AF37]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#C9A227] dark:text-[#D4AF37]">
                                {logs.filter((l) => {
                                    const date = new Date(l.created_at);
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    return date > weekAgo;
                                }).length}
                            </p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">This Week</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#7A1C1C]/10 dark:bg-[#8B2C2C]/10 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-[#7A1C1C] dark:text-[#8B2C2C]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#7A1C1C] dark:text-[#8B2C2C]">
                                {logs.filter((l) => l.action?.includes('SUSPEND') || l.action?.includes('REVOKE') || l.action?.includes('DELETE')).length}
                            </p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Critical</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0F3D2E]/10 dark:bg-[#1E4D3A]/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-[#0F3D2E] dark:text-[#1E4D3A]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#0F3D2E] dark:text-[#1E4D3A]">
                                {new Set(logs.map((l) => l.user_id)).size}
                            </p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Active Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                    <Input
                        placeholder="Search by action or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Entity Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                        <SelectItem value="POST">Post</SelectItem>
                        <SelectItem value="LIBRARY_ITEM">Library Item</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Advanced Filter
                </Button>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8F5F0] dark:bg-[#0E0E0F] text-[#6b6b6b] dark:text-[#B0B0B0]">
                            <tr>
                                <th className="px-4 py-3 font-medium">Timestamp</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                                <th className="px-4 py-3 font-medium">User ID</th>
                                <th className="px-4 py-3 font-medium">Entity Type</th>
                                <th className="px-4 py-3 font-medium">Description</th>
                                <th className="px-4 py-3 font-medium">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ddd8d0] dark:divide-[#2a2a2d]">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors">
                                    <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0] font-mono text-xs">
                                        {log.user_id?.slice(0, 8)}...
                                    </td>
                                    <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">
                                        {log.entity_type || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-[#1a1a1a] dark:text-[#F5F5F5] max-w-xs truncate">
                                        {typeof log.new_state === 'string' ? log.new_state : JSON.stringify(log.new_state)?.substring(0, 100)}
                                    </td>
                                    <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0] font-mono text-xs">
                                        {log.ip_address || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLogs.length === 0 && (
                    <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0]">
                        No audit logs found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
