import { Navbar } from "@/components/layout/navbar";
import { MainFooter } from "@/components/layout/main-footer";
import { HomeView } from "@/features/home/home.view";

export const metadata = {
  title: "እንዳ ኢየሱስ ግቢ ጉባኤ",
  description: "Official Ethiopian Orthodox Tewahedo Church Student Fellowship at Mekelle University. Uniting students in faith, service, and academic excellence.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0E0E0F]">
      <Navbar />
      <main>
        <HomeView />
      </main>
      <MainFooter />
    </div>
  );
}
