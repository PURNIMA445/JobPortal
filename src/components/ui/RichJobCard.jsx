"use client";

import { motion } from "framer-motion";
import { useSavedJobs } from "@/context/SavedJobsContext";

// ─── Rich variant helpers ──────────────────────────────────────────────────

const RICH_ACCENT_COLORS = ["bg-[#E5ECE4]", "bg-[#FBEBE5]", "bg-[#FDF4D4]"];
const RICH_LOGO_COLORS = [
  "bg-[#E3EFFF] text-[#3B82F6]",
  "bg-[#111111] text-white",
  "bg-[#FFC107] text-white",
];

function MapPinIcon(props) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BookmarkIcon({ isSaved, ...props }) {
  return (
    <svg fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function formatJobType(jobType) {
  return jobType
    ? jobType.replace(/_/g, "-").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
    : "Full-time";
}

function formatWorkMode(workMode) {
  return workMode ? workMode.charAt(0).toUpperCase() + workMode.slice(1).toLowerCase() : "";
}

/**
 * Rich variant: visually dense card used on the homepage "Latest
 * Opportunities" section. Expects a full `job` object (as returned by the
 * jobs API) rather than flattened scalar props.
 */
export default function RichJobCard({ job, idx = 0, onClick }) {
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const saved = isSaved(job.id);

  const handleSave = async (e) => {
    e.stopPropagation();
    await toggleSaveJob(job.id);
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="relative p-8 bg-white border border-[#E8E1D5] rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-xl rounded-bl-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group overflow-hidden"
    >
      {/* Subtle top accent bar */}
      <div className={`absolute top-0 left-0 w-full h-2 ${RICH_ACCENT_COLORS[idx % 3]}`}></div>

      <div className="flex justify-between items-start mb-6 mt-2">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300 ${RICH_LOGO_COLORS[idx % 3]}`}>
          {job.company?.logoUrl ? (
            <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
          ) : (
            job.company?.name ? job.company.name.charAt(0) : "W"
          )}
        </div>
        <button
        onClick={handleSave}
        className="text-gray-400 hover:text-[#7A8B6A] transition-colors p-2 bg-gray-50 rounded-full group-hover:bg-[#F5F2EB]"
      >
        <BookmarkIcon className="w-5 h-5" isSaved={saved} />
      </button>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#7A8B6A] transition-colors">
        {job.title}
      </h2>
      <p className="text-gray-600 text-sm mb-5 font-medium">
        {job.company?.name || "Acme Inc."}
      </p>

      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 font-medium">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F5F2EB] text-[#7A8B6A]">
          <MapPinIcon className="w-3.5 h-3.5" />
        </div>
        <span className="truncate">{job.location}</span>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
          {formatJobType(job.jobType)}
        </span>
        {job.workMode && (
          <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
            {formatWorkMode(job.workMode)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
