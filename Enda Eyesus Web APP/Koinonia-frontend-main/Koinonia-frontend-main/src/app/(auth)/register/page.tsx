"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ChevronRight, ChevronLeft, User, Mail, Lock, Home, Phone, Upload, X, RotateCw, ZoomIn, ZoomOut, CheckCircle, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/api";
import { mapGeneratedUserToAuthUser } from "@/lib/authHelper";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// ---------- Helper Components ----------
function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
    return (
        <Label htmlFor={htmlFor} className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex items-center gap-1 flex-row">
            {children}
            {required && (
                <span className="text-[#7A1C1C] dark:text-[#ff6b6b] ml-0.5 text-xs">*</span>
            )}
        </Label>
    );
}

function getInputClass(hasError: boolean) {
    return `bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] dark:text-[#F5F5F5] dark:placeholder:text-[#6b6b6b] focus-visible:ring-[#C9A227] dark:focus-visible:ring-[#D4AF37] focus-visible:border-[#C9A227] dark:focus-visible:border-[#D4AF37] rounded-xl h-11 text-sm pl-10 ${hasError ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500 dark:focus-visible:ring-red-500" : ""}`;
}

const inputCls = "bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] dark:text-[#F5F5F5] dark:placeholder:text-[#6b6b6b] focus-visible:ring-[#C9A227] dark:focus-visible:ring-[#D4AF37] focus-visible:border-[#C9A227] dark:focus-visible:border-[#D4AF37] rounded-xl h-11 text-sm pl-10";

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    // ---------- Step State ----------
    const [step, setStep] = useState(0);
    const totalSteps = 3;

    // ---------- Form State ----------
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sex, setSex] = useState("");
    const [clericalRank, setClericalRank] = useState("NONE");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [serviceClassId, setServiceClassId] = useState("");
    const [academicDept, setAcademicDept] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [dormBlock, setDormBlock] = useState("");
    const [dormRoom, setDormRoom] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

    // ---------- UI State ----------
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [serviceClasses, setServiceClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ---------- Validation Errors ----------
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // ---------- Image Editor State ----------
    const [showEditor, setShowEditor] = useState(false);
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 80,
        height: 80,
        x: 10,
        y: 10,
    });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // ---------- Fallback Classes ----------
    const fallbackClasses = [
        { id: "1", name: "ትምህርት ክፍል" },
        { id: "2", name: "መዝሙር ክፍል" },
        { id: "3", name: "አባላት ጉዳይ" },
        { id: "4", name: "ልማት ክፍል" },
        { id: "5", name: "ሒሳብ ክፍል" },
    ];

    // ---------- Fetch Service Classes ----------
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await apiClient.instance.get("/classes");
                const data = res.data || [];
                const normalized = data.map((item: any) => ({
                    id: item.id,
                    name: item.name || item.class_name_amharic || item.class_name || item.title || "Unnamed Class"
                }));
                setServiceClasses(normalized);
                setLoadingClasses(false);
            } catch (err) {
                console.error("Failed to load service classes:", err);
                setServiceClasses(fallbackClasses);
                setLoadingClasses(false);
            }
        };
        fetchClasses();
    }, []);

    // ---------- Image Editor ----------
    const handleFileSelect = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const src = reader.result as string;
            setImageSrc(src);
            setShowEditor(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropSave = async () => {
        if (!imgRef.current || !canvasRef.current) {
            setTimeout(() => {
                if (imgRef.current && canvasRef.current) {
                    performCrop();
                }
            }, 100);
            return;
        }
        performCrop();
    };

    const performCrop = async () => {
        const image = imgRef.current;
        const canvas = canvasRef.current;
        if (!image || !canvas) return;

        const cropData = crop;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const cropX = (cropData.x / 100) * image.naturalWidth;
        const cropY = (cropData.y / 100) * image.naturalHeight;
        const cropWidth = (cropData.width / 100) * image.naturalWidth;
        const cropHeight = (cropData.height / 100) * image.naturalHeight;

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
        );
        ctx.restore();

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
        });

        if (blob) {
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(blob));
            setShowEditor(false);
        }
    };

    // ---------- Validation Functions ----------
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (pass: string) => {
        const hasLetter = /[a-zA-Z]/.test(pass);
        const hasNumber = /\d/.test(pass);
        return pass.length >= 8 && hasLetter && hasNumber;
    };

    const validateStep0 = (): boolean => {
        const errors: Record<string, string> = {};
        if (!fullName.trim()) errors.fullName = "Full name is required";
        if (!email.trim()) errors.email = "Email is required";
        else if (!validateEmail(email)) errors.email = "Please enter a valid email address (e.g., name@domain.com)";
        if (!password) errors.password = "Password is required";
        else if (!validatePassword(password)) errors.password = "Must be at least 8 characters with a letter and a number";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
        if (!sex) errors.sex = "Please select your sex";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep1 = (): boolean => {
        // All fields are optional – no validation needed
        setFieldErrors({});
        return true;
    };

    // ---------- Navigation ----------
    const goToNextStep = () => {
        if (step === 0 && !validateStep0()) return;
        if (step === 1 && !validateStep1()) return;
        setStep(step + 1);
        setFieldErrors({});
        setError("");
    };

    const goToPrevStep = () => {
        if (step > 0) {
            setStep(step - 1);
            setFieldErrors({});
            setError("");
        }
    };

    // ---------- Submit (only called on final step) ----------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Final validation
        if (!validateStep0() || !validateStep1()) {
            setStep(0);
            return;
        }

        setIsSubmitting(true);

        try {
            let profileImageUrl = "";
            if (profileImage) {
                setUploadingImage(true);
                try {
                    const fd = new FormData();
                    fd.append("image", profileImage);
                    const uploadRes = await apiClient.instance.post<{ data: { imageURL: string } }>("/upload/image", fd, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    profileImageUrl = uploadRes.data.data.imageURL;
                } catch (uploadErr) {
                    console.error("Image upload failed:", uploadErr);
                } finally {
                    setUploadingImage(false);
                }
            }

            const regRes = await (apiClient.auth.register as any)({
                full_name_three_parts: fullName,
                email,
                password,
                sex: sex as "MALE" | "FEMALE",
                clerical_rank: clericalRank as "NONE" | "DEACON" | "PRIEST" | "LECTOR" | "OTHER",
                profile_image_url: profileImageUrl || undefined,
                phone_number: phoneNumber || undefined,
                service_class_id: serviceClassId || undefined,
                academic_dept: academicDept || undefined,
                academic_year: academicYear ? parseInt(academicYear) : undefined,
                dorm_block: dormBlock || undefined,
                dorm_room: dormRoom || undefined,
            });
            const regToken = (regRes.data as any).token || 'authenticated';

            const userProfileRes = await apiClient.auth.getCurrentUser();
            const mappedUser = mapGeneratedUserToAuthUser(userProfileRes.data);
            setAuth(mappedUser, regToken);
            
            setSuccessMessage("✅ Registration successful! Redirecting...");
            setTimeout(() => {
                router.replace("/dashboard");
            }, 1500);
        } catch (err: any) {
            const data = err.response?.data;
            let msg = data?.detail || data?.message || "Registration failed. Please check details.";
            if (data?.errors && Array.isArray(data.errors)) {
                msg = data.errors.map((e: any) => `${e.path.replace('body.', '')}: ${e.message}`).join(' | ');
            }
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ---------- Step Indicator ----------
    const renderStepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, idx) => (
                <div key={idx} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                            idx === step
                                ? "bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F]"
                                : idx < step
                                ? "bg-green-500 text-white"
                                : "bg-[#ddd8d0] dark:bg-[#2a2a2d] text-[#6b6b6b] dark:text-[#B0B0B0]"
                        }`}
                    >
                        {idx < step ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                    </div>
                    {idx < totalSteps - 1 && (
                        <div className={`w-12 h-0.5 mx-1 ${idx < step ? "bg-green-500" : "bg-[#ddd8d0] dark:bg-[#2a2a2d]"}`} />
                    )}
                </div>
            ))}
        </div>
    );

    // ---------- Render Step Content ----------
    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="fullName" required>Full Name</FieldLabel>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="First Middle Last"
                                        required
                                        className={getInputClass(!!fieldErrors.fullName)}
                                    />
                                </div>
                                {fieldErrors.fullName && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3" /> {fieldErrors.fullName}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        className={getInputClass(!!fieldErrors.email)}
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3" /> {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="password" required>Password</FieldLabel>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 chars, letter & number"
                                        required
                                        className={getInputClass(!!fieldErrors.password)}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3" /> {fieldErrors.password}
                                    </p>
                                )}
                                <p className="text-[10px] text-[#6b6b6b] dark:text-[#B0B0B0] mt-1">
                                    Must be at least 8 characters with a letter and a number
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="confirmPassword" required>Confirm Password</FieldLabel>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        required
                                        className={getInputClass(!!fieldErrors.confirmPassword)}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]">
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldErrors.confirmPassword && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3" /> {fieldErrors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Sex */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="sex" required>Sex</FieldLabel>
                                <select
                                    id="sex"
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                    className={`w-full h-11 rounded-xl border ${fieldErrors.sex ? 'border-red-500' : 'border-[#ddd8d0] dark:border-[#2a2a2d]'} bg-[#F8F5F0] dark:bg-[#252529] text-[#1a1a1a] dark:text-[#F5F5F5] px-3 text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] outline-none`}
                                    required
                                >
                                    <option value="">Select sex</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                                {fieldErrors.sex && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3 w-3" /> {fieldErrors.sex}
                                    </p>
                                )}
                            </div>

                            {/* Clerical Rank */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="clericalRank">Clerical Rank (የክህነት መዓርግ)</FieldLabel>
                                <select
                                    id="clericalRank"
                                    value={clericalRank}
                                    onChange={(e) => setClericalRank(e.target.value)}
                                    className="w-full h-11 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-[#1a1a1a] dark:text-[#F5F5F5] px-3 text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] outline-none"
                                >
                                    <option value="NONE">None</option>
                                    <option value="DEACON">Deacon</option>
                                    <option value="PRIEST">Priest</option>
                                    <option value="LECTOR">Lector</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="09XXXXXXXX"
                                        className={inputCls}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 1:
                return (
                    <>
                        <div className="space-y-4">
                            {/* Service Class */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="serviceClass">Service Class (የአገልግሎት ክፍል)</FieldLabel>
                                <select
                                    id="serviceClass"
                                    value={serviceClassId}
                                    onChange={(e) => setServiceClassId(e.target.value)}
                                    className="w-full h-11 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-[#1a1a1a] dark:text-[#F5F5F5] px-3 text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] outline-none"
                                    disabled={loadingClasses}
                                >
                                    <option value="">{loadingClasses ? "Loading classes..." : "Select your class"}</option>
                                    {serviceClasses.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Academic Department */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="academicDept">Academic Department</FieldLabel>
                                <Input
                                    id="academicDept"
                                    value={academicDept}
                                    onChange={(e) => setAcademicDept(e.target.value)}
                                    placeholder="e.g., Engineering"
                                    className={inputCls}
                                />
                            </div>

                            {/* Academic Year */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="academicYear">Academic Year</FieldLabel>
                                <select
                                    id="academicYear"
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    className="w-full h-11 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-[#1a1a1a] dark:text-[#F5F5F5] px-3 text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] outline-none"
                                >
                                    <option value="">Select year</option>
                                    <option value="1">Year 1</option>
                                    <option value="2">Year 2</option>
                                    <option value="3">Year 3</option>
                                    <option value="4">Year 4</option>
                                    <option value="5">Year 5+</option>
                                </select>
                            </div>

                            {/* Dorm Block & Room */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <FieldLabel htmlFor="dormBlock">Dorm Block</FieldLabel>
                                    <Input
                                        id="dormBlock"
                                        value={dormBlock}
                                        onChange={(e) => setDormBlock(e.target.value)}
                                        placeholder="e.g., A"
                                        className={inputCls}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel htmlFor="dormRoom">Room Number</FieldLabel>
                                    <Input
                                        id="dormRoom"
                                        value={dormRoom}
                                        onChange={(e) => setDormRoom(e.target.value)}
                                        placeholder="e.g., 101"
                                        className={inputCls}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <div className="space-y-4">
                            {/* Profile Picture */}
                            <div className="space-y-1.5">
                                <FieldLabel htmlFor="profilePicture">Profile Picture</FieldLabel>
                                <div className="relative">
                                    <input
                                        id="profilePicture"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelect(file);
                                        }}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="profilePicture"
                                        className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-dashed border-[#ddd8d0] dark:border-[#2a2a2d] hover:border-[#7A1C1C] dark:hover:border-[#D4AF37] cursor-pointer transition-colors text-sm text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {profileImagePreview ? "Change picture" : "Upload profile picture (optional)"}
                                    </label>
                                </div>
                                {profileImagePreview && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <img src={profileImagePreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A227]" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileImage(null);
                                                setProfileImagePreview(null);
                                                setImageSrc(null);
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Summary / Review */}
                            <div className="bg-[#F8F5F0] dark:bg-[#252529] rounded-xl p-4 space-y-1 text-sm">
                                <p className="font-semibold text-[#7A1C1C] dark:text-[#D4AF37]">Review Your Details</p>
                                <div className="grid grid-cols-2 gap-1 text-[#6b6b6b] dark:text-[#B0B0B0]">
                                    <span>Name:</span> <span className="font-medium text-foreground">{fullName || "—"}</span>
                                    <span>Email:</span> <span className="font-medium text-foreground">{email || "—"}</span>
                                    <span>Sex:</span> <span className="font-medium text-foreground">{sex || "—"}</span>
                                    <span>Class:</span> <span className="font-medium text-foreground">{serviceClasses.find(c => c.id === serviceClassId)?.name || "—"}</span>
                                    <span>Dept:</span> <span className="font-medium text-foreground">{academicDept || "—"}</span>
                                    <span>Year:</span> <span className="font-medium text-foreground">{academicYear || "—"}</span>
                                </div>
                            </div>

                            {/* Submit error messages */}
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {successMessage && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <span>{successMessage}</span>
                                </div>
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    // ---------- Render ----------
    return (
        <>
            <div className="flex items-center justify-center min-h-[calc(100vh-48px)] py-8">
                <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>

                <div className="w-full max-w-md px-4">
                    <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-lg border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden" style={{ borderTop: "4px solid #C9A227" }}>
                        {/* Header */}
                        <div className="px-8 pt-8 pb-2 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-14 h-14 rounded-full bg-[#7A1C1C] dark:bg-[#9B2323] flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                                        <rect x="12" y="3" width="4" height="22" rx="1" fill="#C9A227" />
                                        <rect x="4" y="9" width="20" height="4" rx="1" fill="#C9A227" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-2xl font-semibold text-[#7A1C1C] dark:text-[#D4AF37] tracking-tight">Create Account</h1>
                            <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-1 font-medium">Enda Eyesus Fellowship · Mekelle University</p>
                            <div className="mt-2 text-xs text-[#6b6b6b] dark:text-[#B0B0B0]">
                                Step {step + 1} of {totalSteps}
                            </div>
                        </div>

                        <div className="px-8 pb-8">
                            {renderStepIndicator()}

                            {/* ---------- STEP 0 & 1: No form wrapper ---------- */}
                            {step < 2 && (
                                <>
                                    <div className="space-y-4">
                                        {renderStepContent()}
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        {step > 0 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={goToPrevStep}
                                                className="flex-1 h-11 rounded-xl border-[#ddd8d0] dark:border-[#2a2a2d] text-sm font-medium hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" /> Back
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            onClick={goToNextStep}
                                            className="flex-1 h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* ---------- STEP 2: Form wrapper ---------- */}
                            {step === 2 && (
                                <form onSubmit={handleSubmit}>
                                    {renderStepContent()}

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={goToPrevStep}
                                            className="flex-1 h-11 rounded-xl border-[#ddd8d0] dark:border-[#2a2a2d] text-sm font-medium hover:bg-[#F8F5F0] dark:hover:bg-[#252529]"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" /> Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Creating...
                                                </span>
                                            ) : (
                                                <>
                                                    Register <CheckCircle className="h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-[#ddd8d0] dark:bg-[#2a2a2d]" />
                                <span className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] font-medium uppercase tracking-wider">or</span>
                                <div className="flex-1 h-px bg-[#ddd8d0] dark:bg-[#2a2a2d]" />
                            </div>

                            <div className="space-y-3">
                                <Link href="/login"
                                    className="flex items-center justify-center w-full h-11 rounded-xl border-2 border-[#7A1C1C] dark:border-[#9B2323] text-[#7A1C1C] dark:text-[#F5F5F5] text-sm font-semibold hover:bg-[#7A1C1C] dark:hover:bg-[#9B2323] hover:text-white transition-all duration-200">
                                    Sign In Instead
                                </Link>
                                <Link href="/"
                                    className="flex items-center justify-center gap-1.5 w-full h-9 text-sm text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors font-medium">
                                    <Home className="h-3.5 w-3.5" /> Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Editor Modal (unchanged) */}
            {showEditor && imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1C1C1F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#C9A227]/30">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#7A1C1C] dark:text-[#D4AF37]">Edit Profile Picture</h3>
                            <button onClick={() => setShowEditor(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#252529] rounded-lg transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative bg-[#F8F5F0] dark:bg-[#252529] rounded-xl overflow-hidden border border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} aspect={1} circularCrop>
                                    <img ref={imgRef} src={imageSrc} alt="Edit" style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }} className="w-full h-auto max-h-[400px] object-contain" />
                                </ReactCrop>
                            </div>

                            <canvas ref={canvasRef} className="hidden" />

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setRotation((prev) => prev - 15)} className="p-2 rounded-lg bg-[#F8F5F0] dark:bg-[#252529] hover:bg-[#EDE9E2] dark:hover:bg-[#2a2a2d] transition-colors">
                                        <RotateCw className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm font-medium">{rotation}°</span>
                                    <button type="button" onClick={() => setRotation((prev) => prev + 15)} className="p-2 rounded-lg bg-[#F8F5F0] dark:bg-[#252529] hover:bg-[#EDE9E2] dark:hover:bg-[#2a2a2d] transition-colors">
                                        <RotateCw className="h-4 w-4 rotate-90" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 flex-1">
                                    <ZoomOut className="h-4 w-4 text-[#6b6b6b]" />
                                    <input type="range" min="0.5" max="2" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="flex-1 h-1 bg-[#ddd8d0] dark:bg-[#2a2a2d] rounded-lg appearance-none cursor-pointer accent-[#C9A227]" />
                                    <ZoomIn className="h-4 w-4 text-[#6b6b6b]" />
                                    <span className="text-sm font-medium w-12">{Math.round(zoom * 100)}%</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-[#ddd8d0] dark:border-[#2a2a2d]">
                                <button type="button" onClick={() => { setShowEditor(false); setImageSrc(null); }} className="flex-1 py-2.5 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] text-sm font-medium hover:bg-[#F8F5F0] dark:hover:bg-[#252529] transition-colors">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleCropSave} className="flex-1 py-2.5 rounded-xl bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] transition-colors">
                                    Save & Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}