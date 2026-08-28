// src/features/agent/chairman-roles.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Shield, UserPlus, UserMinus, ArrowRight, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import chairmanApiService from "@/lib/chairmanApi";

export function ChairmanRolesView() {
    const { user } = useAuthStore();
    const systemRole = user?.system_role || user?.role || 'USER';
    const isChairman = systemRole === 'SECRETARIAT_CHAIRMAN';

    const [activeSection, setActiveSection] = useState<'assign' | 'transfer'>('assign');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Assign Role State
    const [assignData, setAssignData] = useState({
        targetUserId: '',
        role: '',
        serviceClassId: ''
    });
    const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');

    // Transfer State
    const [transferData, setTransferData] = useState({
        targetUserId: ''
    });
    const [transferSearchResults, setTransferSearchResults] = useState<any[]>([]);
    const [transferSearching, setTransferSearching] = useState(false);
    const [transferSearchQuery, setTransferSearchQuery] = useState('');
    const [selectedTransferUserName, setSelectedTransferUserName] = useState('');

    // Service Classes
    const [serviceClasses, setServiceClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);

    // Current Role Assignments
    const [currentAssignments, setCurrentAssignments] = useState<any[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>('ALL');

    // Fetch service classes and current assignments on mount
    useEffect(() => {
        const fetchClasses = async () => {
            setLoadingClasses(true);
            try {
                const res = await chairmanApiService.listServiceClasses();
                setServiceClasses(res.data || res || []);
            } catch (error) {
                console.error('Failed to fetch service classes:', error);
            } finally {
                setLoadingClasses(false);
            }
        };

        const fetchAssignments = async () => {
            setLoadingAssignments(true);
            try {
                const res = await chairmanApiService.listUsers();
                const executives = (res.data || []).filter((u: any) =>
                    ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SERVICE_MANAGER'].includes(u.role)
                );
                setCurrentAssignments(executives);
            } catch (error) {
                console.error('Failed to fetch assignments:', error);
            } finally {
                setLoadingAssignments(false);
            }
        };

        fetchClasses();
        fetchAssignments();
    }, []);

    const searchUsers = async (query: string, forTransfer = false) => {
        if (!query || query.length < 2) {
            if (forTransfer) {
                setTransferSearchResults([]);
            } else {
                setUserSearchResults([]);
            }
            return;
        }

        setSearchingUsers(true);
        try {
            const res = await chairmanApiService.listUsers();
            const filtered = (res.data || []).filter((u: any) =>
                u.fullName?.toLowerCase().includes(query.toLowerCase()) ||
                u.email?.toLowerCase().includes(query.toLowerCase())
            );
            if (forTransfer) {
                setTransferSearchResults(filtered);
            } else {
                setUserSearchResults(filtered);
            }
        } catch (error) {
            console.error('Failed to search users:', error);
        } finally {
            setSearchingUsers(false);
        }
    };

    const handleAssignRole = async () => {
        if (!assignData.targetUserId || !assignData.role) {
            setMessage({ type: 'error', text: 'Please select a user and role' });
            return;
        }

        if (assignData.role === 'SERVICE_MANAGER' && !assignData.serviceClassId) {
            setMessage({ type: 'error', text: 'Please select a service class for Service Manager role' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await chairmanApiService.assignRole({
                targetUserId: assignData.targetUserId,
                role: assignData.role,
                serviceClassId: assignData.role === 'SERVICE_MANAGER' ? assignData.serviceClassId : undefined
            });
            setMessage({ type: 'success', text: 'Role assigned successfully' });
            setAssignData({ targetUserId: '', role: '', serviceClassId: '' });
            setUserSearchResults([]);
            setSelectedUserName('');
            // Refresh assignments
            const res = await chairmanApiService.listUsers();
            const executives = (res.data || []).filter((u: any) =>
                ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SERVICE_MANAGER'].includes(u.role)
            );
            setCurrentAssignments(executives);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to assign role' });
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeRole = async (userId: string) => {
        if (!confirm('Are you sure you want to revoke this user\'s executive role?')) return;

        setLoading(true);
        setMessage(null);
        try {
            await chairmanApiService.revokeRole(userId);
            setMessage({ type: 'success', text: 'Role revoked successfully' });
            // Refresh assignments
            const res = await chairmanApiService.listUsers();
            const executives = (res.data || []).filter((u: any) =>
                ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SERVICE_MANAGER'].includes(u.role)
            );
            setCurrentAssignments(executives);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to revoke role' });
        } finally {
            setLoading(false);
        }
    };

    const handleTransferChairman = async () => {
        if (!transferData.targetUserId) {
            setMessage({ type: 'error', text: 'Please select a user to transfer chairmanship to' });
            return;
        }

        if (!confirm('Are you sure you want to transfer chairmanship? This action cannot be undone. You will be logged out and become an ordinary member.')) return;

        setLoading(true);
        setMessage(null);
        try {
            await chairmanApiService.transferChairman({ targetUserId: transferData.targetUserId });
            setMessage({ type: 'success', text: 'Chairmanship transferred successfully. Logging you out...' });
            // Clear auth state and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to transfer chairmanship' });
        } finally {
            setLoading(false);
        }
    };

    if (!isChairman) {
        return (
            <div className="bg-[#7A1C1C]/10 dark:bg-[#8B2C2C]/10 border border-[#7A1C1C]/30 dark:border-[#8B2C2C]/30 rounded-xl p-8 text-center">
                <Shield className="h-12 w-12 text-[#7A1C1C] dark:text-[#8B2C2C] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#7A1C1C] dark:text-[#8B2C2C] mb-2">Access Restricted</h3>
                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">Only the Secretariat Chairman can access this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-[#ddd8d0] dark:border-[#2a2a2d] pb-4">
                <button
                    onClick={() => setActiveSection('assign')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === 'assign'
                            ? 'bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] text-white dark:from-[#D4AF37] dark:to-[#1E4D3A] dark:text-[#0E0E0F] shadow-md'
                            : 'text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]'
                    }`}
                >
                    <UserPlus className="h-4 w-4" />
                    Assign Roles
                </button>
                <button
                    onClick={() => setActiveSection('transfer')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === 'transfer'
                            ? 'bg-gradient-to-r from-[#7A1C1C] to-[#C9A227] text-white dark:from-[#D4AF37] dark:to-[#1E4D3A] dark:text-[#0E0E0F] shadow-md'
                            : 'text-[#6b6b6b] dark:text-[#B0B0B0] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]'
                    }`}
                >
                    <ArrowRight className="h-4 w-4" />
                    Transfer Chairmanship
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.type === 'success' 
                        ? 'bg-[#0F3D2E]/10 dark:bg-[#1E4D3A]/10 border border-[#0F3D2E]/30 dark:border-[#1E4D3A]/30 text-[#0F3D2E] dark:text-[#1E4D3A]'
                        : 'bg-[#7A1C1C]/10 dark:bg-[#8B2C2C]/10 border border-[#7A1C1C]/30 dark:border-[#8B2C2C]/30 text-[#7A1C1C] dark:text-[#8B2C2C]'
                }`}>
                    {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Assign Roles Section */}
            {activeSection === 'assign' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] p-6">
                        <h3 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-4">Assign Executive Role</h3>
                        
                        <div className="space-y-4">
                            {/* User Search */}
                            <div className="space-y-2">
                                <Label htmlFor="userSearch">Select User</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="userSearch"
                                        placeholder="Search by name or email..."
                                        value={assignData.targetUserId ? (selectedUserName || '') : searchQuery}
                                        onChange={(e) => {
                                            setAssignData({ ...assignData, targetUserId: '' });
                                            setSelectedUserName('');
                                            setSearchQuery(e.target.value);
                                            searchUsers(e.target.value);
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                                {userSearchResults.length > 0 && !assignData.targetUserId && (
                                    <div className="border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg max-h-48 overflow-y-auto">
                                        {userSearchResults.map((u) => (
                                            <button
                                                key={u.id}
                                                onClick={() => {
                                                    setAssignData({ ...assignData, targetUserId: u.id });
                                                    setSelectedUserName(u.fullName);
                                                    setUserSearchResults([]);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors border-b border-[#ddd8d0] dark:border-[#2a2a2d] last:border-0"
                                            >
                                                <p className="font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{u.fullName}</p>
                                                <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">{u.email}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="roleSelect">Role</Label>
                                <Select value={assignData.role} onValueChange={(value) => setAssignData({ ...assignData, role: value })}>
                                    <SelectTrigger id="roleSelect">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SECRETARIAT_VICE">Secretariat Vice Chairman</SelectItem>
                                        <SelectItem value="SECRETARIAT_SECRETARY">Secretariat Secretary</SelectItem>
                                        <SelectItem value="SERVICE_MANAGER">Service Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Service Class Selection (for Service Manager) */}
                            {assignData.role === 'SERVICE_MANAGER' && (
                                <div className="space-y-2">
                                    <Label htmlFor="classSelect">Service Class</Label>
                                    <Select 
                                        value={assignData.serviceClassId} 
                                        onValueChange={(value) => setAssignData({ ...assignData, serviceClassId: value })}
                                        disabled={loadingClasses}
                                    >
                                        <SelectTrigger id="classSelect">
                                            <SelectValue placeholder={loadingClasses ? "Loading classes..." : "Select a service class"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceClasses.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id}>
                                                    {cls.class_name_amharic}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button
                                onClick={handleAssignRole}
                                disabled={loading || !assignData.targetUserId || !assignData.role}
                                className="w-full bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F]"
                            >
                                {loading ? 'Assigning...' : 'Assign Role'}
                            </Button>
                        </div>
                    </div>

                    {/* Current Role Assignments */}
                    <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Current Executive Roles</h3>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Roles</SelectItem>
                                    <SelectItem value="SECRETARIAT_CHAIRMAN">Chairman</SelectItem>
                                    <SelectItem value="SECRETARIAT_VICE">Vice Chairman</SelectItem>
                                    <SelectItem value="SECRETARIAT_SECRETARY">Secretary</SelectItem>
                                    <SelectItem value="SERVICE_MANAGER">Service Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {loadingAssignments ? (
                            <div className="text-center text-[#6b6b6b] dark:text-[#B0B0B0] py-8">Loading assignments...</div>
                        ) : (
                            <div className="space-y-3">
                                {currentAssignments
                                    .filter(a => roleFilter === 'ALL' || a.role === roleFilter)
                                    .map((assignment) => (
                                    <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg bg-[#F8F5F0] dark:bg-[#252529] border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#7A1C1C]/10 dark:bg-[#9B2323]/30 flex items-center justify-center">
                                                <span className="text-sm font-bold text-[#7A1C1C] dark:text-[#D4AF37]">
                                                    {assignment.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{assignment.fullName}</p>
                                                <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">{assignment.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                assignment.role === 'SECRETARIAT_CHAIRMAN' ? 'bg-[#C9A227] text-[#0E0E0F]' :
                                                assignment.role === 'SECRETARIAT_VICE' ? 'bg-[#D4AF37] text-[#0E0E0F]' :
                                                assignment.role === 'SECRETARIAT_SECRETARY' ? 'bg-[#D4AF37] text-[#0E0E0F]' :
                                                'bg-[#0F3D2E] text-white'
                                            }`}>
                                                {assignment.role === 'SECRETARIAT_CHAIRMAN' ? 'Chairman' :
                                                 assignment.role === 'SECRETARIAT_VICE' ? 'Vice Chair' :
                                                 assignment.role === 'SECRETARIAT_SECRETARY' ? 'Secretary' :
                                                 'Service Manager'}
                                            </span>
                                            {assignment.role !== 'SECRETARIAT_CHAIRMAN' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRevokeRole(assignment.id)}
                                                    className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20"
                                                >
                                                    <UserMinus className="h-3 w-3 mr-1" /> Revoke
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {currentAssignments.filter(a => roleFilter === 'ALL' || a.role === roleFilter).length === 0 && (
                                    <div className="text-center text-[#6b6b6b] dark:text-[#B0B0B0] py-8">
                                        No role assignments found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Transfer Chairmanship Section */}
            {activeSection === 'transfer' && (
                <div className="space-y-6">
                    <div className="bg-[#7A1C1C]/10 dark:bg-[#8B2C2C]/10 border border-[#7A1C1C]/30 dark:border-[#8B2C2C]/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-[#7A1C1C] dark:text-[#8B2C2C] mb-2">⚠️ Transfer Chairmanship</h3>
                        <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mb-4">
                            This will transfer your SECRETARIAT_CHAIRMAN role to another user. You will receive their previous role. This action cannot be undone.
                        </p>
                        
                        <div className="space-y-4">
                            {/* User Search */}
                            <div className="space-y-2">
                                <Label htmlFor="transferSearch">Select Successor</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="transferSearch"
                                        placeholder="Search by name or email..."
                                        value={transferData.targetUserId ? (selectedTransferUserName || '') : transferSearchQuery}
                                        onChange={(e) => {
                                            setTransferData({ ...transferData, targetUserId: '' });
                                            setSelectedTransferUserName('');
                                            setTransferSearchQuery(e.target.value);
                                            searchUsers(e.target.value, true);
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                                {transferSearchResults.length > 0 && !transferData.targetUserId && (
                                    <div className="border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-lg max-h-48 overflow-y-auto">
                                        {transferSearchResults.map((u) => (
                                            <button
                                                key={u.id}
                                                onClick={() => {
                                                    setTransferData({ ...transferData, targetUserId: u.id });
                                                    setSelectedTransferUserName(u.fullName);
                                                    setTransferSearchResults([]);
                                                    setTransferSearchQuery('');
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors border-b border-[#ddd8d0] dark:border-[#2a2a2d] last:border-0"
                                            >
                                                <p className="font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{u.fullName}</p>
                                                <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">{u.email} • {u.role}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleTransferChairman}
                                disabled={loading || !transferData.targetUserId}
                                className="w-full bg-[#7A1C1C] text-white dark:bg-[#8B2C2C] dark:text-white"
                            >
                                {loading ? 'Transferring...' : 'Transfer Chairmanship'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
