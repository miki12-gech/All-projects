"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#0E0E0F] p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#1C1C1F] rounded-2xl p-8 border border-[#C9A227] dark:border-[#D4AF37] shadow-lg">
                <Link href="/login" className="flex items-center gap-2 text-[#6b6b6b] dark:text-[#B0B0B0] hover:text-[#7A1C1C] dark:hover:text-[#D4AF37] mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">Back to Login</span>
                </Link>

                <h1 className="text-2xl font-bold text-[#7A1C1C] dark:text-[#D4AF37] mb-2">Forgot Password</h1>
                <p className="text-sm text-[#6b6b6b] dark:text-[#B0B0B0] mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#6b6b6b] dark:text-[#B0B0B0] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full h-10 rounded-xl border border-[#ddd8d0] dark:border-[#2a2a2d] bg-[#F8F5F0] dark:bg-[#252529] text-sm px-3 dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C] dark:focus:ring-[#D4AF37]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-[#7A1C1C] dark:bg-[#D4AF37] text-white dark:text-[#0E0E0F] text-sm font-semibold hover:bg-[#C9A227] dark:hover:bg-[#e0c040] hover:text-[#7A1C1C] transition-all"
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="text-xs text-[#6b6b6b] dark:text-[#B0B0B0] mt-6 text-center">
                    Remember your password?{" "}
                    <Link href="/login" className="text-[#7A1C1C] dark:text-[#D4AF37] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
