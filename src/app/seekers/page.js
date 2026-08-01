"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import TopCompaniesSection from "@/components/sections/TopCompaniesSection";
import ResumeScannerGate from "@/components/profile/ResumeScannerGate";
import { getToken } from "@/lib/api";

export default function SeekersLanding() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fileInputRef = useRef(null);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token && role === "CANDIDATE");
    setUserRole(role);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      handleUpload(selected);
    } else {
      setError("Please upload a valid PDF document.");
    }
  };

  const handleUpload = async (selectedFile) => {
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errData;
        try {
          errData = await res.json();
        } catch (e) {}
        throw new Error(errData?.error || "Failed to analyze resume");
      }

      const data = await res.json();

      // Artificial delay to build anticipation
      setTimeout(() => {
        setAnalysisResult(data);
        setIsAnalyzing(false);
      }, 2000);

    } catch (err) {
      setError(err.message || "Our AI is currently taking a breather. Please try again in a moment.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white pb-0">
      
      {/* ───── SECTION 1: THE HERO HOOK ───── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[#FDFBF7]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E8E1D5]/20 rounded-bl-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-2 rounded-full bg-white border border-[#E8E1D5] text-[#7A8B6A] font-medium text-xs tracking-wider uppercase mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            For Ambitious Professionals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-medium text-[#1C1F1A] leading-[1.1] mb-6 tracking-tight"
          >
            Stop applying blindly. <br />
            <span className="text-[#7A8B6A] italic">Get matched directly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#6B7264] mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Evaluate your true industry relevance instantly. Let our AI map your technical expertise, diagnose missing keywords, and surface your profile to top-tier hiring pipelines.
          </motion.p>

        </div>
      </section>

      {/* ───── SECTION 2: HOW IT WORKS (THE 3-STEP PROCESS) ───── */}
      <section className="py-20 bg-[#7A8B6A] border-y border-[#E8E1D5] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">
              Audit your career value in under 60 seconds
            </h2>
            <p className="text-[#FDFBF7] max-w-xl mx-auto font-light">
              No lengthy forms, no manual inputting. Our analyzer does the heavy lifting in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EEF4EC] text-[#7A8B6A] border border-[#C2D9BE] flex items-center justify-center font-bold text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-serif font-medium mb-3">Upload Securely</h3>
              <p className="text-sm text-[#6B7264] leading-relaxed">
                Drop in your CV as a PDF file to begin the secure parsing pipeline immediately.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#FEF9EC] text-[#C8A96E] border border-[#F0DDA0] flex items-center justify-center font-bold text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-serif font-medium mb-3">Analyze Fit</h3>
              <p className="text-sm text-[#6B7264] leading-relaxed">
                Our AI inspects domain structures, extracts competencies, and builds your profile score.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] text-[#D67373] border-[#FECACA] flex items-center justify-center font-bold text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-serif font-medium mb-3">Align Opportunities</h3>
              <p className="text-sm text-[#6B7264] leading-relaxed">
                Identify critical keyword deficiencies and unlock matches with premium hiring platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION 3: THE VALUE PROPOSITION ───── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-[#1C1F1A] mb-4">
              Engineered to bypass the resume black hole
            </h2>
            <p className="text-[#6B7264] max-w-xl mx-auto font-light">
              Stop guessing why applications fail. Get data-driven clarity on your career relevance.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-[#E8E1D5]">
              <div className="w-14 h-14 bg-[#EEF4EC] text-[#7A8B6A] rounded-2xl flex items-center justify-center shrink-0 border border-[#C2D9BE]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium text-[#1C1F1A] mb-2">Real-time Profile Scoring</h3>
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  Get a quantified score showing exactly how your experience ranks against modern corporate filters and job description benchmarks.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-[#E8E1D5]">
              <div className="w-14 h-14 bg-[#FEF9EC] text-[#C8A96E] rounded-2xl flex items-center justify-center shrink-0 border border-[#F0DDA0]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium text-[#1C1F1A] mb-2">Keyword Deficit Diagnostic</h3>
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  Expose missing industry keywords, critical toolings, and methodology gaps that cause automated recruitment algorithms to filter out your resume.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-14 h-14 bg-[#FEF2F2] text-[#D67373] rounded-2xl flex items-center justify-center shrink-0 border border-[#FECACA]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-medium text-[#1C1F1A] mb-2">Immediate Pipelines Integration</h3>
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  Link your analyzed qualifications to verified corporate managers looking for your profile, cutting out generic job portals completely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── SECTION 4: THE LOCKED SCANNER GATE ───── */}
      <ResumeScannerGate
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        error={error}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
      />

      {/* ───── SECTION 5: SOCIAL PROOF & TRUST ───── */}
      <TopCompaniesSection 
        title="Backed by Top Hiring Pipelines" 
        subtitle="Ambitious talent using our analyzer are matching with verified hiring divisions across these leading organizations." 
      />
    </div>
  );
}