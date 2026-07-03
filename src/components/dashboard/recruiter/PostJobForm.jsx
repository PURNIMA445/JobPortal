"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseIcon, MapPinIcon, DollarSignIcon,
  ChevronDownIcon, AlertCircleIcon, LoaderIcon,
} from "@/components/dashboard/icons";

/**
 * Collapsible "Post a Job" form panel.
 * All state and handlers are owned by the parent page — this component is
 * purely presentational and controlled via props.
 *
 * Props:
 *   visible      — whether the form is expanded
 *   jobForm      — current form values (controlled)
 *   skills       — full list of available skills from API
 *   posting      — true while the API call is in-flight
 *   error        — error message string or null
 *   onChange     — (field, value) => void — update a single field
 *   onToggleSkill — (skillId) => void — toggle a skill in requiredSkillIds
 *   onSubmit     — () => void — called when "Publish" is clicked
 */
export default function PostJobForm({
  visible,
  jobForm,
  skills,
  posting,
  error,
  onChange,
  onToggleSkill,
  onSubmit,
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.98 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.98 }}
          className="overflow-hidden mb-10"
        >
          <div className="bg-white border border-[#E5E5E0] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-serif text-3xl mb-2 text-[#1A1A1A]">Create a new listing</h2>
            <p className="text-[#6B7264] mb-8 text-sm">Find the talent that truly fits your team.</p>

            <div className="space-y-6">

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
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSignIcon className="h-4 w-4 text-gray-400" />
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
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <DollarSignIcon className="h-4 w-4 text-gray-400" />
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
                  placeholder="Describe the role, responsibilities, and ideal candidate..."
                  value={jobForm.description}
                  onChange={(e) => onChange("description", e.target.value)}
                />
              </div>

              {/* ── Row 6: Skills ─────────────────────────────────── */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Required Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => {
                    const isSelected = jobForm.requiredSkillIds.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => onToggleSkill(skill.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                          isSelected
                            ? "bg-[#7C9070] border-[#7C9070] text-white shadow-sm"
                            : "bg-white border-[#E5E5E0] text-[#6B7264] hover:bg-[#F9F8F4]"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Error banner ─────────────────────────────────── */}
              {error && (
                <div className="p-4 bg-[#FFF0F0] text-[#D67373] text-sm rounded-xl border border-[#FAD4D4] flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {/* ── Submit ───────────────────────────────────────── */}
              <div className="pt-4 border-t border-[#E5E5E0]">
                <button
                  onClick={onSubmit}
                  disabled={posting}
                  className="w-full py-3.5 bg-[#7C9070] hover:bg-[#687A5D] text-white rounded-xl font-medium transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                >
                  {posting && <LoaderIcon className="w-5 h-5 animate-spin" />}
                  {posting ? "Publishing listing..." : "Publish Job Listing"}
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
