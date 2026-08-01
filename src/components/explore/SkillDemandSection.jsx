"use client";

import { motion } from "framer-motion";

export default function SkillDemandSection({ dynamicSkills, handleTagClick, router }) {
  if (!dynamicSkills || dynamicSkills.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mb-24">
      <div className="bg-white rounded-3xl p-10 md:p-12 border border-[#EAE5D9] shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Market Demand by Skill
            </h2>
            <p className="text-gray-500">
              Discover which technical and soft skills are currently trending among top employers based on live job posts.
            </p>
          </div>
          <button onClick={() => router.push('/jobs')} className="text-[#7D9976] font-semibold hover:underline">
            View all insights
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dynamicSkills.map((skill, idx) => (
            <motion.div 
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleTagClick(skill.name)}
              className="flex items-center justify-between p-4 rounded-2xl border border-[#EAE5D9] hover:border-[#7D9976] bg-[#FCFBF8] hover:bg-white transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{skill.icon}</span>
                <span className="font-bold text-gray-800 capitalize">{skill.name}</span>
              </div>
              {skill.trend === "High Demand" && (
                <span className="bg-[#E5ECE4] text-[#7A8B6A] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  High Demand
                </span>
              )}
              {skill.trend === "Trending" && (
                <span className="bg-[#FBEBE5] text-[#D67C47] text-xs font-bold px-2.5 py-1 rounded-full group-hover:scale-105 transition-transform">
                  Trending
                </span>
              )}
              {skill.trend === "Stable" && (
                <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full group-hover:scale-105 transition-transform">
                  Stable
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
