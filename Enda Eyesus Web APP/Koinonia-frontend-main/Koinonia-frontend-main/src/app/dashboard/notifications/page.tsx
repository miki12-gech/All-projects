import NotificationsView from "@/features/notifications/notifications.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notifications — Enda Eyesus Fellowship",
    description: "Notifications for Koinonia",
};

export default function NotificationsPage() {
    return <NotificationsView />;
}
