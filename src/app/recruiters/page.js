"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRecruitersLanding } from "@/hooks/useRecruitersLanding";
import CalibrationTeaser from "@/components/recruiters/CalibrationTeaser";
import CandidateTeaserSection from "@/components/recruiters/CandidateTeaserSection";

export default function RecruitersLanding() {
  const {
    candidates,
    loading,
    isScanning,
    selectedRole,
    setSelectedRole,
    prioritizeExp,
    setPrioritizeExp,
    prioritizeTech,
    setPrioritizeTech,
    mockCandidates,
    userRole,
    handleCalibration
  } = useRecruitersLanding();

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white pb-20">
      
      {/* ───── HERO SECTION ───── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 bg-[#FDFBF7] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#7A8B6A]/10 rounded-bl-[120px] blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#C8A96E]/10 rounded-tr-[120px] blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 rounded-full bg-white border border-[#E8E1D5] text-[#7A8B6A] font-medium text-xs tracking-wider uppercase mb-8 shadow-sm"
          >
            For Enterprise Hiring Teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-medium text-[#1C1F1A] leading-[1.1] tracking-tight mb-6"
          >
            Hire 10x faster with <br className="hidden md:block" />
            <span className="text-[#7A8B6A] italic">AI-powered screening.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#6B7264] max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Stop reading hundreds of unqualified resumes. Our intelligent ATS instantly ranks candidates based on skill gaps, exact experience matches, and deep domain expertise.
          </motion.p>
        </div>
      </section>

      {/* ───── THE HOOK: SMART SCREENING TEASER ───── */}
      <CalibrationTeaser
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        prioritizeExp={prioritizeExp}
        setPrioritizeExp={setPrioritizeExp}
        prioritizeTech={prioritizeTech}
        setPrioritizeTech={setPrioritizeTech}
        handleCalibration={handleCalibration}
        isScanning={isScanning}
        mockCandidates={mockCandidates}
      />

      {/* ───── THE DIRECTORY: VETTED TALENT ───── */}
      <CandidateTeaserSection
        userRole={userRole}
        loading={loading}
        candidates={candidates}
      />

      {/* ───── ADDITIONAL PLANS OR FOOTER CALL-TO-ACTION ───── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-t border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-medium text-[#1C1F1A] mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-[#6B7264] mb-8 max-w-lg mx-auto">Create your employer account today and instantly start finding vetted candidates.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/get-started/recruiter">
              <button className="px-8 py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-md">
                Get Started
              </button>
            </Link>
            <Link href="/jobs">
              <button className="px-8 py-4 bg-white border border-[#E8E1D5] hover:bg-[#FAF8F5] text-[#1C1F1A] font-medium rounded-xl transition-all shadow-sm">
                Explore Jobs
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}