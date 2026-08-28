import AnnouncementsView from "@/features/announcements/announcements.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Announcements — Enda Eyesus Fellowship",
    description: "View fellowship announcements and updates.",
};

export default function AnnouncementsPage() {
    return <AnnouncementsView />;
}