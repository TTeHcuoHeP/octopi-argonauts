import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChartLens } from "@/components/layout/ChartLens";
import { Hero } from "@/components/sections/hero/Hero";
import { Benefits } from "@/components/sections/Benefits";
import { Coaches } from "@/components/sections/Coaches";
import { Mentor } from "@/components/sections/Mentor";
import { Quest } from "@/components/sections/Quest";
import { Rewards } from "@/components/sections/quest/Rewards";
import { Program } from "@/components/sections/Program";
import { Membership } from "@/components/sections/Membership";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <ChartLens />
      <main id="main" className="flex-1">
        <Hero />
        <Benefits />
        <Rewards />
        <Coaches />
        <Mentor />
        <Quest />
        <Program />
        <Membership />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
