import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExternalAdminConsole from "@/components/sections/ExternalAdminConsole";
import { APL_SEASON } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin",
  description: `External registration admin panel for ${APL_SEASON.leagueName} — review registrations, payment claims, and WhatsApp exports.`,
};

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-apl-ink">
      <Header />
      <main className="flex-1 pt-[72px] md:pt-[80px]">
        <ExternalAdminConsole />
      </main>
      <Footer />
    </div>
  );
}
