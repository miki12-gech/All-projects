"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Clock, ChevronRight, GraduationCap, Building2, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/api";

interface ApplyMembershipModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (result: { status: string; service_class_id?: string }) => void;
}

const DEPARTMENTS = [
    "Software Engineering", "Computer Science", "Electrical Engineering",
    "Computer Engineering", "Civil Engineering", "Mechanical Engineering",
    "Architecture", "Medicine", "Nursing", "Pharmacy", "Law",
    "Management", "Accounting & Finance", "Economics", "Agriculture",
    "Natural Sciences", "Social Sciences", "Other",
];

const nativeSelectCls = "w-full h-11 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-[#1a1a1a] dark:text-[#F5F5F5] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227] dark:focus:ring-[#D4AF37] focus:border-[#C9A227] dark:focus:border-[#D4AF37] appearance-none";
const inputCls = "bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] dark:text-[#F5F5F5] dark:placeholder:text-[#6b6b6b] focus-visible:ring-[#C9A227] dark:focus-visible:ring-[#D4AF37] focus-visible:border-[#C9A227] dark:focus-visible:border-[#D4AF37] rounded-xl h-11 text-sm";

export default function ApplyMembershipModal({ open, onClose, onSuccess }: ApplyMembershipModalProps) {
    const { user, updateUser } = useAuthStore();

    const [step, setStep] = useState<"form" | "orientation" | "success" | "pending" | "class_pending">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form fields — pre-fill from profile
    const [universityId, setUniversityId] = useState("");
    const [academicDept, setAcademicDept] = useState(user?.department || "");
    const [academicYear, setAcademicYear] = useState<number>(1);
    const [dormBlock, setDormBlock] = useState("");
    const [dormRoom, setDormRoom] = useState("");
    const [preferredClassId, setPreferredClassId] = useState("");
    const [result, setResult] = useState<{ status?: string; service_class_id?: string; orientation_checklist?: any } | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const formatDepartmentName = (val: string): string => {
        return val
            .split(" ")
            .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "")
            .join(" ");
    };

    const [serviceClasses, setServiceClasses] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        apiClient.classes.listServiceClasses({ is_public_registration: true })
            .then(res => {
                const classes = (res.data || []).map((cls: any) => ({
                    id: cls.id || "",
                    name: cls.name || ""
                }));
                setServiceClasses(classes);
            })
            .catch(console.error);
    }, []);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!universityId.trim()) { setError("University ID is required."); return; }
        if (!academicDept) { setError("Academic department is required."); return; }
        if (!dormBlock.trim()) { setError("Dorm block is required."); return; }
        if (!dormRoom.trim()) { setError("Dorm room is required."); return; }

        setIsSubmitting(true);

        try {
            const res = await apiClient.membership.applyMembership({
                university_id: universityId,
                academic_dept: formatDepartmentName(academicDept).trim(),
                academic_year: academicYear,
                dorm_block: dormBlock,
                dorm_room: dormRoom,
                preferred_class_id: preferredClassId || undefined
            } as any);

            setResult(res.data);

            const status = (res.data as any)?.status;
            if (status === "MEMBER_UPGRADED_CLASS_PENDING") {
                // Graduate: upgraded to member, but class still needs confirmation
                setStep("class_pending");
            } else if (status === "APPLICATION_PENDING_REVIEW") {
                // Non-graduate: full review needed
                setStep("pending");
            } else {
                setStep("pending");
            }
        } catch (err: any) {
            const d = err.response?.data;
            setError(d?.detail || d?.message || "Failed to submit membership application.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAcknowledgeOrientation = async () => {
        // Refetch profile so JWT role update reflects in UI
        try {
            const profileRes = await apiClient.auth.getCurrentUser();
            updateUser({ role: profileRes.data.system_role as any, serviceClassID: profileRes.data.service_class_id || undefined });
            setStep("class_pending");
        } catch (err) {
            console.error(err);
            setStep("class_pending");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-2xl dark:shadow-[0_0_40px_rgba(212,175,55,0.12)] border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden"
                style={{ borderTop: "4px solid #C9A227" }}
                role="dialog"
                aria-modal="true"
                aria-label="Apply for Membership"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#1a1a1a] dark:hover:text-[#F5F5F5] hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors z-10"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="px-7 pt-7 pb-7">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-[#7A1C1C] dark:bg-[#9B2323] flex items-center justify-center flex-shrink-0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <rect x="8.5" y="1" width="3" height="18" rx="1" fill="#C9A227" />
                                <rect x="2" y="6" width="16" height="3" rx="1" fill="#C9A227" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#7A1C1C] dark:text-[#D4AF37] leading-tight">
                                Apply for Membership
                            </h2>
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-0.5">
                                Enda Eyesus Fellowship · Full Member
                            </p>
                        </div>
                    </div>

                    {/* ── Form Step ── */}
                    {step === "form" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] bg-[#F8F5F0] dark:bg-[#252529] rounded-xl px-3 py-2.5 leading-relaxed">
                                Complete the fields below to apply for full membership. If your university
                                department and year match a service class, you may be upgraded instantly.
                                Otherwise, your application will be reviewed by the Secretariat.
                            </p>

                            {/* University ID */}
                            <div className="space-y-1.5">
                                <Label htmlFor="mem-uid" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                    University ID <span className="text-[#7A1C1C] dark:text-[#ff6b6b] ml-0.5">*</span>
                                </Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="mem-uid"
                                        value={universityId}
                                        onChange={(e) => setUniversityId(e.target.value)}
                                        placeholder="e.g. MU/ETS/0123/14"
                                        required
                                        className={`${inputCls} pl-10`}
                                    />
                                </div>
                            </div>

                            {/* Academic Dept + Year */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="mem-dept" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                        Department <span className="text-[#7A1C1C] dark:text-[#ff6b6b] ml-0.5">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0] pointer-events-none z-10" />
                                        <Input
                                            id="mem-dept"
                                            value={academicDept}
                                            onChange={(e) => setAcademicDept(e.target.value)}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={() => {
                                                setAcademicDept(prev => formatDepartmentName(prev).trim());
                                                setTimeout(() => setShowSuggestions(false), 200);
                                            }}
                                            placeholder="e.g. Computer Science"
                                            required
                                            className={`${inputCls} pl-10`}
                                            autoComplete="off"
                                        />
                                        {showSuggestions && (
                                            <ul className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-[#1C1C1F] border border-[#ddd8d0] dark:border-[#2a2a2d] rounded-xl shadow-lg text-sm">
                                                {(academicDept.trim()
                                                    ? DEPARTMENTS.filter(d => d.toLowerCase().includes(academicDept.toLowerCase()) && d.toLowerCase() !== academicDept.toLowerCase().trim())
                                                    : DEPARTMENTS
                                                ).map((d) => (
                                                    <li
                                                        key={d}
                                                        onMouseDown={() => {
                                                            setAcademicDept(d);
                                                            setShowSuggestions(false);
                                                        }}
                                                        className="px-3 py-2 hover:bg-[#F8F5F0] dark:hover:bg-[#252529] cursor-pointer text-[#1a1a1a] dark:text-[#F5F5F5] transition-colors"
                                                    >
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="mem-year" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                        Year <span className="text-[#7A1C1C] dark:text-[#ff6b6b] ml-0.5">*</span>
                                    </Label>
                                    <select
                                        id="mem-year"
                                        value={academicYear}
                                        onChange={(e) => setAcademicYear(Number(e.target.value))}
                                        className={nativeSelectCls}
                                    >
                                        {[1, 2, 3, 4, 5].map((y) => (
                                            <option key={y} value={y}>Year {y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Dorm Block + Room */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="mem-block" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                        Dorm Block <span className="text-[#7A1C1C] dark:text-[#ff6b6b] ml-0.5">*</span>
                                    </Label>
                                    <div className="relative">
                                        <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                        <Input
                                            id="mem-block"
                                            value={dormBlock}
                                            onChange={(e) => setDormBlock(e.target.value)}
                                            placeholder="e.g. Block A"
                                            required
                                            className={`${inputCls} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="mem-room" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                        Room No. <span className="text-[#7A1C1C] dark:text-[#ff6b6b] ml-0.5">*</span>
                                    </Label>
                                    <Input
                                        id="mem-room"
                                        value={dormRoom}
                                        onChange={(e) => setDormRoom(e.target.value)}
                                        placeholder="e.g. 204"
                                        required
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Preferred Service Class */}
                            <div className="space-y-1.5 mt-4">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="mem-class" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                                        Preferred Service Class (Optional)
                                    </Label>
                                    <a href="#" className="text-xs text-[#7A1C1C] dark:text-[#D4AF37] hover:underline">Learn about classes</a>
                                </div>
                                <select
                                    id="mem-class"
                                    value={preferredClassId}
                                    onChange={(e) => setPreferredClassId(e.target.value)}
                                    className={nativeSelectCls}
                                >
                                    <option value="">-- No preference --</option>
                                    {serviceClasses.map((cls) => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <p className="text-xs text-[#7A1C1C] dark:text-[#ff6b6b] bg-[#7A1C1C]/8 dark:bg-[#ff6b6b]/10 rounded-lg px-3 py-2 mt-4">
                                    ⚠ {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all duration-200 text-sm flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <>Submit Application <ChevronRight className="h-4 w-4" /></>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* ── Class Assignment Pending (graduate path) ── */}
                    {step === "class_pending" && (
                        <div className="text-center py-4 space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-16 w-16 text-[#C9A227] dark:text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Welcome, Member!</h3>
                                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-2 leading-relaxed">
                                    Your membership has been activated! You are now a full member of Enda Eyesus Fellowship.
                                </p>
                                <div className="mt-3 bg-[#C9A227]/10 dark:bg-[#D4AF37]/10 rounded-xl p-3 border border-[#C9A227]/30 dark:border-[#D4AF37]/30">
                                    <p className="text-xs font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">
                                        ⏳ Service Class Assignment Pending
                                    </p>
                                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-1">
                                        Your preferred class request has been sent to the Member Affairs manager.
                                        You will receive a notification once your class assignment is confirmed.
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={() => { onSuccess?.({ status: "MEMBER_UPGRADED_CLASS_PENDING" }); onClose(); }}
                                className="w-full h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all duration-200"
                            >
                                Continue to Dashboard
                            </Button>
                        </div>
                    )}

                    {/* ── Success (kept for backwards compat) ── */}
                    {step === "success" && (
                        <div className="text-center py-4 space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-16 w-16 text-[#7A1C1C] dark:text-[#7ac9a8]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Welcome, Member!</h3>
                                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-2 leading-relaxed">
                                    Your membership has been activated. Your class assignment will be confirmed soon.
                                </p>
                            </div>
                            <Button
                                onClick={onClose}
                                className="w-full h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all duration-200"
                            >
                                Continue to Dashboard
                            </Button>
                        </div>
                    )}

                    {/* ── Pending Review (non-graduate path) ── */}
                    {step === "pending" && (
                        <div className="text-center py-4 space-y-4">
                            <div className="flex justify-center">
                                <Clock className="h-16 w-16 text-[#C9A227] dark:text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Application Submitted</h3>
                                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-2 leading-relaxed">
                                    Your application is pending review by the Member Affairs manager.
                                    You will be notified once a decision has been made.
                                </p>
                                <div className="mt-3 bg-[#F8F5F0] dark:bg-[#252529] rounded-xl p-3 border border-[#ddd8d0] dark:border-[#2a2a2d] text-left space-y-1">
                                    <p className="text-xs font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">What happens next?</p>
                                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">1. Member Affairs reviews your application</p>
                                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">2. You receive a notification with the decision</p>
                                    <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">3. If approved, your class assignment is confirmed separately</p>
                                </div>
                            </div>
                            <Button
                                onClick={onClose}
                                className="w-full h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all duration-200"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
