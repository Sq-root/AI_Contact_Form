import type { Metadata } from "next";
import Ticker from "@/components/ui/Ticker";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExternalAdminConsole from "@/components/sections/ExternalAdminConsole";

export const metadata: Metadata = {
  title: "Admin",
  description:
    "External registration admin panel for APL Season 3 — review registrations, payment claims, and WhatsApp exports."
};

export default function AdminPage() {
  return (
    <div className="bg-apl-page min-h-screen">
      <Ticker />
      <Header />
      <main>
        <ExternalAdminConsole />
      </main>
      <Footer />
    </div>
  );
}
