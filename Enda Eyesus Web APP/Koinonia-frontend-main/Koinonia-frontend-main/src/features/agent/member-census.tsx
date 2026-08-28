// src/features/agent/member-census.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Shield, Users, Search, Download, Filter, MapPin, Phone, GraduationCap, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import chairmanApiService from "@/lib/chairmanApi";

export function MemberCensusView() {
    const { user } = useAuthStore();
    const systemRole = user?.system_role || user?.role || 'USER';
    const isChairman = systemRole === 'SECRETARIAT_CHAIRMAN';
    const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const res = await chairmanApiService.getMemberCensus();
                setMembers(res.data || []);
                setFilteredMembers(res.data || []);
            } catch (error) {
                console.error('Failed to fetch member census:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isChairman) {
            fetchMembers();
        }
    }, [isChairman]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredMembers(members);
            return;
        }

        const filtered = members.filter((m) =>
            m.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.role?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMembers(filtered);
    }, [searchQuery, members]);

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
        return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading member census...</div>;
    }

    const roleColors: Record<string, string> = {
        'SECRETARIAT_CHAIRMAN': 'bg-[#C9A227] text-[#0E0E0F]',
        'SECRETARIAT_VICE': 'bg-[#D4AF37] text-[#0E0E0F]',
        'SECRETARIAT_SECRETARY': 'bg-[#D4AF37] text-[#0E0E0F]',
        'SERVICE_MANAGER': 'bg-[#0F3D2E] text-white',
        'TEACHER': 'bg-[#7A1C1C] text-white',
        'MEMBER': 'bg-[#0E0E0F] text-white',
        'USER': 'bg-[#6b6b6b] text-white',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#7A1C1C]/10 dark:bg-[#8B2C2C]/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#7A1C1C] dark:text-[#8B2C2C]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">{members.length}</p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Total Members</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0F3D2E]/10 dark:bg-[#1E4D3A]/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-[#0F3D2E] dark:text-[#1E4D3A]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#0F3D2E] dark:text-[#D4AF37]">
                                {members.filter(m => ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'].includes(m.role)).length}
                            </p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Secretariat</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 dark:bg-[#D4AF37]/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#C9A227] dark:text-[#D4AF37]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#C9A227] dark:text-[#D4AF37]">
                                {members.filter(m => m.role === 'MEMBER').length}
                            </p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Active Members</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl p-4 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#6b6b6b]/10 dark:bg-[#B0B0B0]/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#6b6b6b] dark:text-[#B0B0B0]">
                                {members.filter(m => m.role === 'USER').length}
                            </p>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                    <Input
                        placeholder="Search by name, email, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Members Table */}
            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8F5F0] dark:bg-[#0E0E0F] text-[#6b6b6b] dark:text-[#B0B0B0]">
                            <tr>
                                <th className="px-4 py-3 font-medium">Profile</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Class</th>
                                <th className="px-4 py-3 font-medium">Phone</th>
                                <th className="px-4 py-3 font-medium">Dept</th>
                                <th className="px-4 py-3 font-medium">Dorm</th>
                                <th className="px-4 py-3 font-medium">Sex</th>
                                <th className="px-4 py-3 font-medium">Rank</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ddd8d0] dark:divide-[#2a2a2d]">
                            {filteredMembers.map((member) => {
                                const initials = member.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
                                return (
                                    <tr 
                                        key={member.id} 
                                        className="hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedMember(member)}
                                    >
                                        <td className="px-4 py-4">
                                            <Avatar className="h-10 w-10">
                                                {member.profileImage && (
                                                    <AvatarImage
                                                        src={member.profileImage.startsWith("http") ? member.profileImage : `${API_BASE}${member.profileImage}`}
                                                        alt={member.fullName}
                                                    />
                                                )}
                                                <AvatarFallback className="text-xs font-bold bg-[#7A1C1C] dark:bg-[#9B2323] text-[#C9A227] dark:text-[#D4AF37]">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{member.fullName}</p>
                                        </td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.email}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[member.role] || 'bg-gray-500 text-white'}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.serviceClassName || '-'}</td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.phoneNumber || '-'}</td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.academicDepartment || '-'}</td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">
                                            {member.dormBlock && member.dormRoom ? `${member.dormBlock}-${member.dormRoom}` : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.sex === 'MALE' ? 'M' : member.sex === 'FEMALE' ? 'F' : '-'}</td>
                                        <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.clericalRank || '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredMembers.length === 0 && (
                    <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0]">
                        No members found matching your search.
                    </div>
                )}
            </div>

            {/* Member Detail Sheet */}
            {selectedMember && (
                <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
                    <SheetContent className="w-full sm:w-[500px] overflow-y-auto p-0">
                        {/* Gradient Header */}
                        <div className="bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A] p-6 pb-16">
                            <SheetHeader className="mb-4">
                                <SheetTitle className="text-white dark:text-[#0E0E0F]">Member Details</SheetTitle>
                            </SheetHeader>
                        </div>
                        
                        <div className="px-6 -mt-12 space-y-6">
                            {/* Profile Header */}
                            <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-lg p-6 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Avatar className="h-24 w-24 border-4 border-white dark:border-[#1C1C1F] shadow-md">
                                        {selectedMember.profileImage && (
                                            <AvatarImage
                                                src={selectedMember.profileImage.startsWith("http") ? selectedMember.profileImage : `${API_BASE}${selectedMember.profileImage}`}
                                                alt={selectedMember.fullName}
                                            />
                                        )}
                                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A] text-white dark:text-[#0E0E0F]">
                                            {selectedMember.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">{selectedMember.fullName}</h3>
                                        <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">{selectedMember.email}</p>
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${roleColors[selectedMember.role] || 'bg-gray-500 text-white'}`}>
                                            {selectedMember.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Sex</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.sex === 'MALE' ? 'Male' : selectedMember.sex === 'FEMALE' ? 'Female' : 'Not specified'}</p>
                                    </div>
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Clerical Rank</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.clericalRank || 'None'}</p>
                                    </div>
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Phone</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.phoneNumber || 'Not provided'}</p>
                                    </div>
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Dormitory</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                                            {selectedMember.dormBlock && selectedMember.dormRoom ? `${selectedMember.dormBlock} Block, Room ${selectedMember.dormRoom}` : 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    Academic Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Department</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.academicDepartment || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Academic Year</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.academicYear || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Service Class */}
                            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Service Class
                                </h4>
                                <div className="bg-gradient-to-r from-[#7A1C1C]/10 to-[#C9A227]/10 dark:from-[#D4AF37]/10 dark:to-[#1E4D3A]/10 rounded-lg p-4">
                                    <p className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">{selectedMember.serviceClassName || 'Not assigned'}</p>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Account Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Status</p>
                                        <p className="text-sm font-medium text-[#0F3D2E] dark:text-[#D4AF37]">{selectedMember.status || 'Active'}</p>
                                    </div>
                                    <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Joined Date</p>
                                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{new Date(selectedMember.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedMember.bio && (
                                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                    <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4">Bio</h4>
                                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] italic leading-relaxed">{selectedMember.bio}</p>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}
