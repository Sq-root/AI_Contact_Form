import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Pillars from "@/components/sections/Pillars";
import Stats from "@/components/sections/Stats";
import Gallery from "@/components/sections/Gallery";
import Closing from "@/components/sections/Closing";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-apl-ink">
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        {/* <About /> */}
        {/* <Pillars /> */}
        {/* <Stats /> */}
        {/* <Gallery /> */}
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
