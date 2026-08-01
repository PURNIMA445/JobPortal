"use client";

import { useState, useEffect } from "react";
import { getAllJobs } from "@/lib/api";
import useAuth from "@/hooks/useAuth";

import HeroSection from "@/components/sections/HeroSection";
import LatestOpportunitiesSection from "@/components/sections/LatestOpportunitiesSection";
import FeatureSection from "@/components/sections/FeatureSection";
import TopCompaniesSection from "@/components/sections/TopCompaniesSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const { isLoggedIn, userRole } = useAuth();

  useEffect(() => {

    // Fetch jobs for dynamic count and latest opportunities section
    getAllJobs()
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data.reverse()); // Reverse to show latest first (assuming ID order)
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-hidden selection:bg-[#7A8B6A] selection:text-white">

      {/* ───── HERO & FEATURE SECTION ───── */}
      <div className="relative">
        <HeroSection jobsCount={jobs.length} isLoggedIn={isLoggedIn} userRole={userRole} />

        {/* ───── FEATURES SECTION ───── */}
        <FeatureSection />

        {/* Pulls up slightly to share visual space with the hero section */}
        <div className="relative -mt-16 pb-20 md:pb-32 px-6 z-10">
          <LatestOpportunitiesSection jobs={jobs} />
        </div>
      </div>

      {/* ───── TOP COMPANIES SECTION ───── */}
      <TopCompaniesSection />

      {/* ───── DUAL-PATH CTA SECTION ───── */}
      <CTASection isLoggedIn={isLoggedIn} userRole={userRole} />

    </div>
  );
}