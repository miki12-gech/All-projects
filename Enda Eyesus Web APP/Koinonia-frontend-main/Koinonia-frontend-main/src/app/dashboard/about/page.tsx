import AboutView from "@/features/about/about.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us — Enda Eyesus Fellowship",
    description: "Learn about our identity, services, and rules.",
};

export default function AboutPage() {
    return <AboutView />;
}