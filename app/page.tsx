'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FeatureWrapper from "@/components/feature-section/FeatureWrapper";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero-section/HeroSection";
import MainSectionLayout from "@/components/main-section/MainSectionLayout";
import UsageSectionWrapper from "@/components/usage-section/UsageSectionWrapper";
import { getIsAuthenticated } from "./actions/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated } = await getIsAuthenticated();
      if (isAuthenticated) {
        router.replace('/recipes');
      }
    };
    checkAuth();
  }, [router]);

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
