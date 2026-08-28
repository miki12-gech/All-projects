"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { memberAffairsApi } from "@/features/member-affairs/memberAffairsApi";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  Users,
  User,
  GraduationCap,
  Shield,
  MapPin,
  Phone,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------- Sacred Background ----------
const SacredBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[#F8F5F0]/90 via-[#FFF9F0]/70 to-[#EDE5D8]/90 dark:from-[#0E0E0F] dark:via-[#1A1816] dark:to-[#0A0A0B]" />
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.08]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="crossPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path
            d="M50 15 L52 48 L85 50 L52 52 L50 85 L48 52 L15 50 L48 48 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[#C9A227]"
          />
          <circle cx="50" cy="50" r="4" fill="currentColor" className="text-[#7A1C1C]" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7A1C1C]/10 rounded-full blur-3xl animate-pulse delay-700" />
  </div>
);

// ---------- Types ----------
interface ServiceClass {
  id: string;
  class_name_amharic: string;
}

interface Member {
  id: string;
  full_name_three_parts: string;
  email: string;
  role: string;
  profile_image?: string;
  phone_number?: string;
  academic_dept?: string;
  academic_year?: number;
  dorm_block?: string;
  dorm_room?: string;
  sex?: string;
  clerical_rank?: string;
  service_classes?: ServiceClass;
  status?: string;
  createdAt: string;
  bio?: string;
  university_id?: string;
  spiritual_father?: { full_name_three_parts: string };
  spiritual_mother?: { full_name_three_parts: string };
  repentance_father?: { full_name_three_parts: string };
  repentance_deacon?: { full_name_three_parts: string };
  is_active?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

const roleColors: Record<string, string> = {
  'SECRETARIAT_CHAIRMAN': 'bg-[#C9A227] text-[#0E0E0F]',
  'SECRETARIAT_VICE': 'bg-[#D4AF37] text-[#0E0E0F]',
  'SECRETARIAT_SECRETARY': 'bg-[#D4AF37] text-[#0E0E0F]',
  'SERVICE_MANAGER': 'bg-[#0F3D2E] text-white',
  'TEACHER': 'bg-[#7A1C1C] text-white',
  'MEMBER': 'bg-[#0E0E0F] text-white',
  'USER': 'bg-[#6b6b6b] text-white',
};

export default function MyClassPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubClassId, setSelectedSubClassId] = useState("");

  const classId = user?.service_class_id;
  const className = user?.serviceClassName || "የአገልግሎት ክፍል";
  const isServiceManager = user?.system_role === "SERVICE_MANAGER";
  const canView = isServiceManager && classId;

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["my-class", "members", classId],
    enabled: !!classId,
    queryFn: async () => {
      const res = await memberAffairsApi.listMembers({ serviceClassId: classId! });
      return res.data;
    },
  });

  const { data: subClasses } = useQuery({
    queryKey: ["my-class", "sub-classes", classId],
    queryFn: async () => {
      const res = await memberAffairsApi.getSubClasses(classId!);
      return res.data;
    },
    enabled: dialogOpen && !!classId,
  });

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((member: Member) => {
      const fullName = member.full_name_three_parts?.toLowerCase() || "";
      const email = member.email?.toLowerCase() || "";
      const universityId = member.university_id?.toLowerCase() || "";
      const term = searchTerm.toLowerCase();
      return fullName.includes(term) || email.includes(term) || universityId.includes(term);
    });
  }, [members, searchTerm]);

  const handleAssignClick = (member: Member) => {
    setSelectedMember(member);
    setSelectedSubClassId("");
    setDialogOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedSubClassId || !selectedMember) return;
    fetch(`/api/v1/member-affairs/sub-classes/${selectedSubClassId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId: selectedMember.id }),
    })
      .then((res) => {
        if (res.ok) {
          alert(`✅ ${selectedMember.full_name_three_parts} በስኬት ተመድቧል።`);
          setDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["my-class", "members", classId] });
        } else {
          alert("❌ ምደባው አልተሳካም። እባክዎ ይሞክሩ።");
        }
      })
      .catch(() => alert("❌ የኔትዎርክ ስህተት።"));
  };

  const exportCsv = () => {
    if (!filteredMembers) return;
    const headers = ["Full Name", "Email", "University ID", "Department", "Year", "Service Class", "Phone", "Dorm", "Sex", "Rank"];
    const rows = filteredMembers.map((m: Member) => [
      m.full_name_three_parts,
      m.email,
      m.university_id || "",
      m.academic_dept || "",
      m.academic_year || "",
      m.service_classes?.class_name_amharic || className,
      m.phone_number || "",
      m.dorm_block && m.dorm_room ? `${m.dorm_block}-${m.dorm_room}` : "",
      m.sex || "",
      m.clerical_rank || "",
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-class-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-[#7A1C1C] dark:text-[#8B2C2C] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Access Denied</h2>
          <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0] animate-pulse">Loading members...</div>;
  }

  const totalMembers = filteredMembers?.length || 0;
  const totalSecretariat = filteredMembers?.filter((m: Member) => ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY'].includes(m.role)).length || 0;
  const totalActive = filteredMembers?.filter((m: Member) => m.role === 'MEMBER').length || 0;
  const totalPending = filteredMembers?.filter((m: Member) => m.role === 'USER').length || 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SacredBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">


        {/* Search & Actions */}
        <div className="flex flex-wrap gap-2 items-center bg-white dark:bg-[#1C1C1F] p-3 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" /> Export
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
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ddd8d0] dark:divide-[#2a2a2d]">
                {filteredMembers?.map((member: Member) => {
                  const initials = member.full_name_three_parts?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
                  const role = member.role || 'USER';
                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[#F8F5F0]/50 dark:hover:bg-[#252529]/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="px-4 py-4">
                        <Avatar className="h-10 w-10">
                          {member.profile_image && (
                            <AvatarImage
                              src={member.profile_image.startsWith("http") ? member.profile_image : `${API_BASE}${member.profile_image}`}
                              alt={member.full_name_three_parts}
                            />
                          )}
                          <AvatarFallback className="text-xs font-bold bg-[#7A1C1C] dark:bg-[#9B2323] text-[#C9A227] dark:text-[#D4AF37]">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{member.full_name_three_parts}</p>
                      </td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-500 text-white'}`}>
                          {role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.service_classes?.class_name_amharic || className}</td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.phone_number || '-'}</td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.academic_dept || '-'}</td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">
                        {member.dorm_block && member.dorm_room ? `${member.dorm_block}-${member.dorm_room}` : '-'}
                      </td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.sex === 'MALE' ? 'M' : member.sex === 'FEMALE' ? 'F' : '-'}</td>
                      <td className="px-4 py-4 text-[#6b6b6b] dark:text-[#B0B0B0]">{member.clerical_rank || '-'}</td>
                      <td className="px-4 py-4">
                        <Button
                          size="sm"
                          className="bg-[#C9A227] hover:bg-[#B8911A] text-white shadow-sm"
                          onClick={(e) => { e.stopPropagation(); handleAssignClick(member); }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" /> መድብ
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredMembers?.length === 0 && (
            <div className="p-8 text-center text-[#6b6b6b] dark:text-[#B0B0B0]">
              No members found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Sheet (same as MemberCensus) */}
      {selectedMember && (
        <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <SheetContent className="w-full sm:w-[500px] overflow-y-auto p-0">
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
                    {selectedMember.profile_image && (
                      <AvatarImage
                        src={selectedMember.profile_image.startsWith("http") ? selectedMember.profile_image : `${API_BASE}${selectedMember.profile_image}`}
                        alt={selectedMember.full_name_three_parts}
                      />
                    )}
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#7A1C1C] to-[#C9A227] dark:from-[#D4AF37] dark:to-[#1E4D3A] text-white dark:text-[#0E0E0F]">
                      {selectedMember.full_name_three_parts?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">{selectedMember.full_name_three_parts}</h3>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">{selectedMember.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${roleColors[selectedMember.role] || 'bg-gray-500 text-white'}`}>
                      {selectedMember.role || 'USER'}
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
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.clerical_rank || 'None'}</p>
                  </div>
                  <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Phone</p>
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.phone_number || 'Not provided'}</p>
                  </div>
                  <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Dormitory</p>
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                      {selectedMember.dorm_block && selectedMember.dorm_room ? `${selectedMember.dorm_block} Block, Room ${selectedMember.dorm_room}` : 'Not provided'}
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
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.academic_dept || 'Not specified'}</p>
                  </div>
                  <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Academic Year</p>
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.academic_year || 'Not specified'}</p>
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
                  <p className="text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]">{selectedMember.service_classes?.class_name_amharic || className}</p>
                </div>
              </div>

              {/* Spiritual & Additional Info */}
              {(selectedMember.spiritual_father || selectedMember.spiritual_mother || selectedMember.repentance_father || selectedMember.repentance_deacon) && (
                <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                  <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Spiritual Guidance
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedMember.spiritual_father && (
                      <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Spiritual Father</p>
                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.spiritual_father.full_name_three_parts}</p>
                      </div>
                    )}
                    {selectedMember.spiritual_mother && (
                      <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Spiritual Mother</p>
                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.spiritual_mother.full_name_three_parts}</p>
                      </div>
                    )}
                    {selectedMember.repentance_father && (
                      <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Repentance Father</p>
                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.repentance_father.full_name_three_parts}</p>
                      </div>
                    )}
                    {selectedMember.repentance_deacon && (
                      <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                        <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Repentance Deacon</p>
                        <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{selectedMember.repentance_deacon.full_name_three_parts}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="bg-white dark:bg-[#1C1C1F] rounded-xl shadow-md p-5 border border-[#ddd8d0] dark:border-[#2a2a2d]">
                <h4 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Status</p>
                    <p className="text-sm font-medium text-[#0F3D2E] dark:text-[#D4AF37]">{selectedMember.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-lg p-3">
                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] uppercase mb-1">Joined Date</p>
                    <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">{new Date(selectedMember.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

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

      {/* Assignment Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1C1C1F] border border-[#C9A227]/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#7A1C1C] dark:text-[#D4AF37]">
              <UserPlus className="h-5 w-5" /> ወደ ንዑስ ክፍል መድብ
            </DialogTitle>
            <DialogDescription>
              አባል <strong>{selectedMember?.full_name_three_parts}</strong> ን የሚመደቡበትን ንዑስ ክፍል ይምረጡ።
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedSubClassId} onValueChange={setSelectedSubClassId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ንዑስ ክፍል ይምረጡ" />
              </SelectTrigger>
              <SelectContent>
                {subClasses?.map((sub: any) => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.sub_class_name}</SelectItem>
                ))}
                {(!subClasses || subClasses.length === 0) && (
                  <div className="p-2 text-sm text-muted-foreground">ምንም ንዑስ ክፍል የለም</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ሰርዝ</Button>
            <Button
              onClick={handleConfirmAssign}
              disabled={!selectedSubClassId}
              className="bg-[#C9A227] hover:bg-[#B8911A] text-white"
            >
              መድብ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}