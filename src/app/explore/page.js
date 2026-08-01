"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TopCompaniesSection from "@/components/sections/TopCompaniesSection";
import IndustryGridSection from "@/components/explore/IndustryGridSection";
import SkillDemandSection from "@/components/explore/SkillDemandSection";
import PersonalizedJobsSection from "@/components/explore/PersonalizedJobsSection";
import { useExplore } from "@/hooks/useExplore";

export default function ExplorePage() {
  const router = useRouter();
  const {
    keyword,
    setKeyword,
    loading,
    popularSearches,
    dynamicIndustries,
    dynamicSkills,
    personalizedJobs,
    userRole,
    handleSearch,
    handleTagClick
  } = useExplore(router);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <svg className="w-10 h-10 text-[#7D9976]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-900 pb-0">
      
      {/* ───── HERO SECTION ───── */}
      <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-[#111111] mb-6 tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Discover Your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7D9976] to-[#A7B99A] italic">Path</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Explore top industries, trending skills, and the best employers hiring right now.
        </motion.p>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto bg-white rounded-full p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EBE8E0] flex items-center"
        >
          <div className="pl-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by job title, skill, or company..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700"
          />
          <button type="submit" className="bg-[#7D9976] hover:bg-[#6A8564] text-white px-8 py-3 rounded-full font-medium transition-colors">
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-3 mt-8"
        >
          <span className="text-sm font-medium text-gray-500 mr-2">Your Recent Searches:</span>
          {popularSearches.map((tag) => (
            <button 
              key={tag} 
              onClick={() => handleTagClick(tag)} 
              className="bg-white border border-[#EAE5D9] text-gray-700 hover:bg-[#F0EBDF] px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ───── PERSONALIZED SECTION ───── */}
      <PersonalizedJobsSection
        personalizedJobs={personalizedJobs}
        userRole={userRole}
        router={router}
      />

      {/* ───── EXPLORE INDUSTRIES GRID ───── */}
      <IndustryGridSection
        dynamicIndustries={dynamicIndustries}
        handleTagClick={handleTagClick}
      />

      {/* ───── MARKET DEMAND BY SKILL ───── */}
      <SkillDemandSection
        dynamicSkills={dynamicSkills}
        handleTagClick={handleTagClick}
        router={router}
      />

      {/* ───── FEATURED EMPLOYERS FROM BACKEND ───── */}
      <div className="bg-[#F6F4EE] pt-1 pb-1">
          <TopCompaniesSection title="Featured Employers" />
      </div>

    </div>
  );
}