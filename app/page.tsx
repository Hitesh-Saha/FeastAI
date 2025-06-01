'use client'

import FeatureWrapper from "@/components/feature-section/FeatureWrapper";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero-section/HeroSection";
import MainSectionLayout from "@/components/main-section/MainSectionLayout";
import UsageSectionWrapper from "@/components/usage-section/UsageSectionWrapper";

export default function Home() {
  return (
    <>
      <MainSectionLayout>
        <HeroSection />
      </MainSectionLayout>
      <UsageSectionWrapper />
      <FeatureWrapper />
      <Footer />
    </>
  );
}
