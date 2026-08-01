"use client";

import { motion } from "framer-motion";

export default function IndustryGridSection({ dynamicIndustries, handleTagClick }) {
  if (!dynamicIndustries || dynamicIndustries.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-10 mb-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Explore Industries
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dynamicIndustries.map((ind, idx) => (
          <motion.div
            key={ind.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleTagClick(ind.name)}
            className={`relative p-8 rounded-4xl ${ind.color} group cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-black/5`}
          >
            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <span className="text-9xl">{ind.icon}</span>
            </div>
            <div className={`w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-3xl mb-16 backdrop-blur-sm border border-white/40 shadow-sm ${ind.text}`}>
              {ind.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{ind.name}</h3>
            <p className="text-gray-700 font-medium relative z-10 max-w-[80%]">{ind.desc}</p>
            
            <div className="mt-8 flex items-center text-gray-900 font-semibold group-hover:translate-x-2 transition-transform">
              Explore roles 
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
