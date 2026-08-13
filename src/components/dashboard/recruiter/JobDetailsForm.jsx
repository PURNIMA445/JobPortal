import React, { useRef, useEffect } from "react";
import {
  BriefcaseIcon, MapPinIcon, ChevronDownIcon
} from "@/components/dashboard/icons";

const BulletTextArea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const currentVal = value || "";

      // If empty, start first bullet
      if (currentVal.trim() === "") {
        onChange("• ");
        return;
      }
      
      const newValue = currentVal.substring(0, start) + "\n• " + currentVal.substring(end);
      onChange(newValue);
      
      // Move cursor after the inserted bullet
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 3;
          textareaRef.current.selectionEnd = start + 3;
        }
      }, 0);
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    
    // Auto start with bullet if they type the first char
    if ((!value || value === "") && val.length === 1 && val !== "\n" && val !== "•") {
      val = "• " + val;
    }
    
    onChange(val);
  };

  return (
    <textarea
      ref={textareaRef}
      className={className}
      placeholder={placeholder}
      value={value || ""}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

export default function JobDetailsForm({ jobForm, onChange }) {
  return (
    <>
      {/* ── Row 1: Title ─────────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Title</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A]"
            placeholder="e.g. Senior Frontend Developer"
            value={jobForm.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>
      </div>

      {/* ── Row 2: Location ──────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Location</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A]"
            placeholder="e.g. Remote, Kathmandu, etc."
            value={jobForm.location}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </div>
      </div>

      {/* ── Row 3: Type & Experience (side by side) ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Type</label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] appearance-none text-[#1A1A1A]"
              value={jobForm.jobType}
              onChange={(e) => onChange("jobType", e.target.value)}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Experience Level</label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] appearance-none text-[#1A1A1A]"
              value={jobForm.experienceLevel}
              onChange={(e) => onChange("experienceLevel", e.target.value)}
            >
              <option value="INTERN">Intern</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid-Level</option>
              <option value="SENIOR">Senior</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Salary range (side by side) ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Min Salary <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-semibold text-sm">
              रू.
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400"
              type="number"
              placeholder="0"
              value={jobForm.salaryMin}
              onChange={(e) => onChange("salaryMin", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Max Salary <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-semibold text-sm">
              रू.
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400"
              type="number"
              placeholder="0"
              value={jobForm.salaryMax}
              onChange={(e) => onChange("salaryMax", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Row 5: Description ───────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Description</label>
        <textarea
          className="w-full px-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A] min-h-30 resize-y"
          placeholder="Describe the role, overall summary, etc."
          value={jobForm.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      {/* ── Row 5b: Responsibilities ────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Key Responsibilities <span className="text-gray-400 font-normal">(optional)</span></label>
        <BulletTextArea
          className="w-full px-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A] min-h-30 resize-y"
          value={jobForm.responsibilities}
          onChange={(val) => onChange("responsibilities", val)}
        />
      </div>

      {/* ── Row 5c: Requirements ────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Requirements / Qualifications <span className="text-gray-400 font-normal">(optional)</span></label>
        <BulletTextArea
          className="w-full px-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A] min-h-30 resize-y" 
          placeholder="• 3+ years of React experience..."
          value={jobForm.requirements}
          onChange={(val) => onChange("requirements", val)}
        />
      </div>

      {/* ── Row 5d: Benefits ────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Benefits & Perks <span className="text-gray-400 font-normal">(optional)</span></label>
        <BulletTextArea
          className="w-full px-4 py-3 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:border-[#7C9070] focus:ring-1 focus:ring-[#7C9070] transition-colors placeholder-gray-400 text-[#1A1A1A] min-h-30 resize-y"
          placeholder="• Comprehensive health insurance..."
          value={jobForm.benefits}
          onChange={(val) => onChange("benefits", val)}
        />
      </div>
    </>
  );
}
