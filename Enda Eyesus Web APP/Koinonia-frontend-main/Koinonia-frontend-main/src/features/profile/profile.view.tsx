"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit2, X, Upload, User, Mail, Phone, MapPin, GraduationCap, BookOpen, Home, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "./profile.hooks";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:8080";

const roleBadge = (role?: string) => {
    switch (role) {
        case "SECRETARIAT_CHAIRMAN": return "Chairman";
        case "SECRETARIAT_VICE": return "Vice Chairman";
        case "SECRETARIAT_SECRETARY": return "Secretary";
        case "SERVICE_MANAGER": return "Service Manager";
        case "SUPER_ADMIN": return "Super Admin";
        case "TEACHER": return "Teacher";
        case "CLASS_LEADER": return "Class Leader";
        case "MEMBER": return "Member";
        default: return "Registered User";
    }
};

export default function ProfileView() {
    const {
        loading,
        saving,
        isEditing,
        setIsEditing,
        formData,
        handleChange,
        handleImageUpload,
        handleSave,
        cancelEdit,
        handleLogout,
    } = useProfile();

    if (loading) return <div className="p-8 text-center text-[#6b6b6b]">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">My Profile</h1>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0]">View and manage your personal information</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="border-[#7A1C1C] text-[#7A1C1C] hover:bg-[#7A1C1C] hover:text-white">
                        <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={cancelEdit} variant="outline" className="border-gray-300">
                            <X className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-[#7A1C1C] hover:bg-[#C9A227] text-white">
                            <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden shadow-sm">
                {/* Cover / Avatar Section */}
                <div className="relative bg-gradient-to-r from-[#7A1C1C] to-[#9B2323] h-28">
                    <div className="absolute -bottom-10 left-6 flex items-end gap-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-[#1C1C1F] shadow-lg">
                                <AvatarImage src={formData.profile_image_url ? (formData.profile_image_url.startsWith("http") ? formData.profile_image_url : `${API_BASE}${formData.profile_image_url}`) : "/assets/avatar.png"} alt={formData.full_name_three_parts} />
                                <AvatarFallback className="bg-[#7A1C1C] text-[#C9A227] text-2xl">
                                    {formData.full_name_three_parts?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-[#7A1C1C] rounded-full p-1 cursor-pointer border-2 border-white">
                                    <Upload className="h-3 w-3 text-white" />
                                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            await handleImageUpload(file);
                                        }
                                    }} />
                                </label>
                            )}
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold text-white">{formData.full_name_three_parts || "Guest"}</h2>
                            <Badge className="bg-[#C9A227] text-[#0E0E0F] text-xs">{roleBadge(formData.system_role)}</Badge>
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] border-b border-[#ddd8d0] pb-2">Personal Information</h3>
                            
                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Full Name</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <User className="h-4 w-4 text-[#6b6b6b]" />
                                    <span className="text-sm font-medium">{formData.full_name_three_parts || "—"}</span>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Email</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4 text-[#6b6b6b]" />
                                    <span className="text-sm font-medium">{formData.email || "—"}</span>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Phone Number</Label>
                                {isEditing ? (
                                    <Input value={formData.phone_number || ""} onChange={(e) => handleChange("phone_number", e.target.value)} placeholder="09XXXXXXXX" className="mt-1" />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4 text-[#6b6b6b]" />
                                        <span className="text-sm font-medium">{formData.phone_number || "—"}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Sex</Label>
                                {isEditing ? (
                                    <Select value={formData.sex || ""} onValueChange={(val) => handleChange("sex", val)}>
                                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <User className="h-4 w-4 text-[#6b6b6b]" />
                                        <span className="text-sm font-medium">{formData.sex === "MALE" ? "Male" : formData.sex === "FEMALE" ? "Female" : "—"}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Clerical Rank</Label>
                                {isEditing ? (
                                    <Select value={formData.clerical_rank || "NONE"} onValueChange={(val) => handleChange("clerical_rank", val)}>
                                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NONE">None</SelectItem>
                                            <SelectItem value="DEACON">Deacon</SelectItem>
                                            <SelectItem value="PRIEST">Priest</SelectItem>
                                            <SelectItem value="LECTOR">Lector</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Info className="h-4 w-4 text-[#6b6b6b]" />
                                        <span className="text-sm font-medium">{formData.clerical_rank || "None"}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Bio</Label>
                                {isEditing ? (
                                    <Textarea value={formData.bio || ""} onChange={(e) => handleChange("bio", e.target.value)} placeholder="Tell about yourself..." rows={3} className="mt-1" />
                                ) : (
                                    <p className="text-sm mt-1 italic text-[#6b6b6b]">{formData.bio || "No bio provided"}</p>
                                )}
                            </div>
                        </div>

                        {/* Academic & Dorm Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[#7A1C1C] dark:text-[#D4AF37] border-b border-[#ddd8d0] pb-2">Academic & Residence</h3>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Academic Department</Label>
                                {isEditing ? (
                                    <Input value={formData.academic_dept || ""} onChange={(e) => handleChange("academic_dept", e.target.value)} placeholder="e.g., Computer Science" className="mt-1" />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <GraduationCap className="h-4 w-4 text-[#6b6b6b]" />
                                        <span className="text-sm font-medium">{formData.academic_dept || "—"}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-[#6b6b6b]">Academic Year</Label>
                                {isEditing ? (
                                    <Input value={formData.academic_year || ""} onChange={(e) => handleChange("academic_year", parseInt(e.target.value) || undefined)} type="number" min={1} max={5} className="mt-1" />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <BookOpen className="h-4 w-4 text-[#6b6b6b]" />
                                        <span className="text-sm font-medium">{formData.academic_year ? `Year ${formData.academic_year}` : "—"}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label className="text-xs text-[#6b6b6b]">Dorm Block</Label>
                                    {isEditing ? (
                                        <Input value={formData.dorm_block || ""} onChange={(e) => handleChange("dorm_block", e.target.value)} placeholder="A" className="mt-1" />
                                    ) : (
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="h-4 w-4 text-[#6b6b6b]" />
                                            <span className="text-sm font-medium">{formData.dorm_block || "—"}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-[#6b6b6b]">Dorm Room</Label>
                                    {isEditing ? (
                                        <Input value={formData.dorm_room || ""} onChange={(e) => handleChange("dorm_room", e.target.value)} placeholder="101" className="mt-1" />
                                    ) : (
                                        <div className="flex items-center gap-2 mt-1">
                                            <Home className="h-4 w-4 text-[#6b6b6b]" />
                                            <span className="text-sm font-medium">{formData.dorm_room || "—"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <Button variant="destructive" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
                    Log Out
                </Button>
            </div>
        </div>
    );
}
