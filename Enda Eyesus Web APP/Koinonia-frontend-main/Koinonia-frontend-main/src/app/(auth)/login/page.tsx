"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Home } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/api";
import { mapGeneratedUserToAuthUser } from "@/lib/authHelper";

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        try {
            // 1. Call login endpoint
            const loginRes = await apiClient.auth.login({ email, password });
            const loginToken = (loginRes.data as any).token || 'authenticated';

            // 2. Retrieve user profile
            // Note: Ensure your global instance config in "@/api" explicitly enables credentials/cookies!
            const profileRes = await apiClient.auth.getCurrentUser();
            
            if (!profileRes || !profileRes.data) {
                throw new Error("Failed to retrieve profile data from server.");
            }

            const mappedUser = mapGeneratedUserToAuthUser(profileRes.data);

            // 3. Update application state and safely route
            setAuth(mappedUser, loginToken);
            router.replace("/dashboard");
            
        } catch (err: any) {
            console.error("Login sequence error details:", err);
            
            // Clean extraction of backend message keys
            const backendError = err.response?.data?.detail || 
                                 err.response?.data?.message || 
                                 err.message || 
                                 "Login failed. Check your credentials.";
            
            setError(backendError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)]">
            {/* Theme toggle top-right */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md px-4">
                <div
                    className="bg-white dark:bg-[#1C1C1F] rounded-2xl shadow-lg border border-[#ddd8d0] dark:border-[#2a2a2d] overflow-hidden"
                    style={{ borderTop: "4px solid var(--gold, #C9A227)" }}
                >
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 rounded-full bg-[#7A1C1C] dark:bg-[#9B2323] flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                                    <rect x="12" y="3" width="4" height="22" rx="1" fill="#C9A227" />
                                    <rect x="4" y="9" width="20" height="4" rx="1" fill="#C9A227" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl font-semibold text-[#7A1C1C] dark:text-[#D4AF37] tracking-tight">
                            Enda Eyesus
                        </h1>
                        <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mt-1 font-medium">
                            MU Student Fellowship · Sign In
                        </p>
                    </div>

                    <div className="px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                    Email Address <span className="text-[#7A1C1C] dark:text-[#8B2C2C] ml-0.5">*</span>
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        className="pl-10 bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] dark:text-[#F5F5F5] dark:placeholder:text-[#B0B0B0] focus-visible:ring-[#C9A227] dark:focus-visible:ring-[#D4AF37] focus-visible:border-[#C9A227] dark:focus-visible:border-[#D4AF37] rounded-xl h-11"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] flex flex-row">
                                    Password <span className="text-[#7A1C1C] dark:text-[#8B2C2C] ml-0.5">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b6b6b] dark:text-[#B0B0B0]" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Your password"
                                        required
                                        className="pl-10 pr-10 bg-[#F8F5F0] dark:bg-[#252529] border-[#ddd8d0] dark:border-[#2a2a2d] dark:text-[#F5F5F5] dark:placeholder:text-[#B0B0B0] focus-visible:ring-[#C9A227] dark:focus-visible:ring-[#D4AF37] rounded-xl h-11"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37]"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-[#7A1C1C] dark:text-[#ff6b6b] text-center bg-[#7A1C1C]/10 dark:bg-[#ff6b6b]/10 rounded-lg px-3 py-2">
                                    Location Error: {error}
                                </p>
                            )}

                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-[#7A1C1C] dark:text-[#8B2C2C] hover:text-[#C9A227] dark:hover:text-[#D4AF37] font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 rounded-xl bg-[#7A1C1C] text-white dark:bg-[#D4AF37] dark:text-[#0E0E0F] font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] dark:shadow-[0_0_16px_rgba(212,175,55,0.25)] dark:hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] transition-all duration-200 text-sm cursor-pointer flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/30 dark:border-[#0E0E0F]/30 border-t-white dark:border-t-[#0E0E0F] rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-[#ddd8d0] dark:bg-[#2a2a2d]" />
                            <span className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] font-medium uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-[#ddd8d0] dark:bg-[#2a2a2d]" />
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/register"
                                className="flex items-center justify-center w-full h-11 rounded-xl border-2 border-[#7A1C1C] dark:border-[#9B2323] text-[#7A1C1C] dark:text-[#F5F5F5] text-sm font-semibold hover:bg-[#7A1C1C] dark:hover:bg-[#9B2323] hover:text-white transition-all duration-200"
                            >
                                Register New Account
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-1.5 w-full h-9 text-sm text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] transition-colors font-medium"
                            >
                                <Home className="h-3.5 w-3.5" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-5">
                    By signing in, you agree to our{" "}
                    <span className="text-[#7A1C1C] dark:text-[#D4AF37] font-medium cursor-pointer hover:underline">
                        Community Guidelines
                    </span>
                </p>
            </div>
        </div>
    );
}