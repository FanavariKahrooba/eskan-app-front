import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import TrustBar from "./TrustBar";
import DualExperienceSection from "./DualExperienceSection";
import OrderJourneySection from "./OrderJourneySection";
import LiveDashboardSection from "./LiveDashboardSection";
import DigitalMenuSection from "./DigitalMenuSection";
import KitchenSection from "./KitchenSection";
import BeforeAfterSection from "./BeforeAfterSection";
import BusinessTypesSection from "./BusinessTypesSection";
import FinalCTA from "./FinalCTA";
import HeroSection2 from "./new/HeroSection2";
import FeatureCardView from "./new/FeatureCardView";
import FAQSectionView from "./new/FAQSectionView";

export default function HomePage() {
  return (
    <main
      className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white"
      dir="rtl"
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute right-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] h-[380px] w-[380px] rounded-full bg-orange-700/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff12,transparent_35%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection2 />
        <HeroSection />
        <TrustBar />
        <DualExperienceSection />
        <OrderJourneySection />
        <LiveDashboardSection />
        <DigitalMenuSection />
        <KitchenSection />
        <BeforeAfterSection />
        <FeatureCardView />
        <BusinessTypesSection />
        <FAQSectionView />
        <FinalCTA />
      </div>
    </main>
  );
}
