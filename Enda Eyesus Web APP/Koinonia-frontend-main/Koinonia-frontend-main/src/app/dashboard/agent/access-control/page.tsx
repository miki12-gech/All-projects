import { AccessControlTab } from "@/features/agent/access-control-tab";

export const metadata = {
  title: "Access Control",
  description: "Role permissions matrix",
};

export default function AccessControlPage() {
  return <AccessControlTab />;
}