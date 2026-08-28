import ProfileView from "@/features/profile/profile.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile — Enda Eyesus Fellowship",
    description: "View and manage your personal information.",
};

export default function ProfilePage() {
    return <ProfileView />;
}