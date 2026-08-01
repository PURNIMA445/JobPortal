import React, { useState } from "react";

export default function JobSkillsSelector({ skills, jobForm, onToggleSkill }) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  // Get unique categories from skills and sort them
  const categories = ["ALL", ...new Set(skills.map(s => s.category).filter(Boolean))].sort();

  // Filter skills by category
  const filteredSkills = activeCategory === "ALL"
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">Required Skills</label>
      <p className="text-xs text-gray-500 mb-3">Filter by category to find skills faster.</p>

      {/* Category Pills/Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-100 pb-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 border ${
                isActive
                  ? "bg-[#7C9070] border-[#7C9070] text-white shadow-sm"
                  : "bg-[#F9F8F4] border-[#E5E5E0] text-[#6B7264] hover:text-[#1A1A1A] hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filtered Skills List */}
      <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-[#F9F8F4] border border-[#E5E5E0] rounded-2xl">
        {filteredSkills.map((skill) => {
          const isSelected = jobForm.requiredSkillIds.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => onToggleSkill(skill.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? "bg-[#7C9070] border-[#7C9070] text-white shadow-sm"
                  : "bg-white border-[#E5E5E0] text-[#6B7264] hover:bg-[#FDFBF7]"
              }`}
            >
              {skill.name}
            </button>
          );
        })}
        {filteredSkills.length === 0 && (
          <span className="text-sm text-gray-400 italic">No skills available in this category.</span>
        )}
      </div>
    </div>
  );
}
