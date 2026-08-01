"use client";

import { motion } from "framer-motion";
import { MapPinIcon, BriefcaseIcon, BookmarkIcon } from "@/components/dashboard/icons";

export default function CandidateFeaturedJobCard({ job, isSaved, onSave, onApply }) {
  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A8B6A]/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
          {/* Logo placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] border border-[#E8E1D5] flex items-center justify-center font-serif text-2xl text-[#7A8B6A] shadow-sm">
            {job.company?.name?.charAt(0) || "C"}
          </div>
          <div>
            <h2 className="text-2xl font-serif font-medium text-[#1A1A1A] leading-tight">
              {job.title}
            </h2>
            <p className="text-[#6B7264]">{job.company?.name}</p>
          </div>
        </div>

        {job.matchScore && (
          <div className="bg-[#EEF4EC] text-[#3D6B36] border border-[#C2D9BE] px-3 py-1.5 rounded-lg text-sm font-medium flex flex-col items-center">
            <span className="text-lg leading-none">{job.matchScore}%</span>
            <span className="text-[10px] uppercase tracking-wider">Match</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[#1A1A1A] font-medium mb-8">
        <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5]">
          <MapPinIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.location}
        </span>
        <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5]">
          <BriefcaseIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.jobType?.replace("_", " ")}
        </span>
        {job.salaryMin && (
          <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5] text-[#5C7356]">
            ${job.salaryMin.toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onApply(job.id)}
          className="flex-1 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          Apply Now
        </button>
        <button
          onClick={() => onSave(job.id)}
          className={`px-4 py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center border ${
            isSaved
              ? "bg-black text-white border-black"
              : "bg-white text-[#1A1A1A] border-[#E8E1D5] hover:bg-[#FDFBF7]"
          }`}
        >
          <BookmarkIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
