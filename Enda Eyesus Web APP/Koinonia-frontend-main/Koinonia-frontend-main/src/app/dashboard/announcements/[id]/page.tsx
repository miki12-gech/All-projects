import AnnouncementDetailView from "@/features/announcements/announcement-detail.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Announcement Detail — Enda Eyesus Fellowship",
    description: "Announcement detail for Koinonia",
};

export default function AnnouncementDetailPage() {
    return <AnnouncementDetailView />;
}