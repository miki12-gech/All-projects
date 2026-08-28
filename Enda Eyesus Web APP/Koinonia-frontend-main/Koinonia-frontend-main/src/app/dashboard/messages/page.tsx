import MessagesView from "@/features/messages/messages.view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Messages — Enda Eyesus Fellowship",
    description: "Messages for Koinonia",
};

export default function MessagesPage() {
    return <MessagesView />;
}
