'use client'

import FeatureWrapper from "@/components/feature-section/FeatureWrapper";
import HeroSection from "@/components/hero-section/HeroSection";
import MainSectionLayout from "@/components/main-section/MainSectionLayout";

export default function Home() {
  return (
    <>
      <MainSectionLayout>
        <HeroSection />
      </MainSectionLayout>
      <FeatureWrapper />
    </>
  );
}
