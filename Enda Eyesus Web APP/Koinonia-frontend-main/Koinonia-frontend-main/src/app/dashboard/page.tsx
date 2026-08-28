import DashboardHomeView from "@/features/dashboard-home/dashboard-home.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard — Enda Eyesus Fellowship",
    description: "Welcome to the Koinonia Dashboard.",
};

export default function DashboardPage() {
    return <DashboardHomeView />;
}