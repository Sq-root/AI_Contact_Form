import Ticker  from "@/components/ui/Ticker";
import Header  from "@/components/layout/Header";
import Footer  from "@/components/layout/Footer";
import Hero    from "@/components/sections/Hero";
import Stats   from "@/components/sections/Stats";
import About   from "@/components/sections/About";
import Pillars from "@/components/sections/Pillars";
import Marquee from "@/components/sections/Marquee";
import Gallery from "@/components/sections/Gallery";
import Closing from "@/components/sections/Closing";

export default function HomePage() {
  return (
    <div className="bg-apl-page min-h-screen">
      {/* Sticky ticker banner */}
      <Ticker />

      {/* Sticky nav (stacks below ticker) */}
      <Header />

      <main>
        <Hero />
        <Stats />
        <About />
        <Pillars />
        <Marquee />
        <Gallery />
        <Closing />
      </main>

      <Footer />
    </div>
  );
}
