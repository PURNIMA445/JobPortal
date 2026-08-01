"use client";

import { BookmarkIcon } from "@/components/dashboard/icons";

export default function CandidateRecommendedJobRow({ job, isSaved, onSave, onApply }) {
  if (!job) return null;

  return (
    <div className="bg-white border border-[#E8E1D5] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-[#E8E1D5] flex items-center justify-center font-serif text-lg text-[#7A8B6A]">
          {job.company?.name?.charAt(0) || "C"}
        </div>
        <div>
          <h4 className="font-medium text-[#1A1A1A]">{job.title}</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7264] mt-1">
            <span>{job.company?.name}</span>
            <span className="w-1 h-1 rounded-full bg-[#E8E1D5]" />
            <span>{job.location}</span>
            <span className="w-1 h-1 rounded-full bg-[#E8E1D5]" />
            <span>{job.jobType?.replace("_", " ")}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {job.matchScore && (
          <span className="text-xs font-bold text-[#7A8B6A] bg-[#EEF4EC] px-2.5 py-1 rounded-md">
            {job.matchScore}% Match
          </span>
        )}
        <button
          onClick={() => onSave(job.id)}
          className={`p-2 rounded-full border transition-colors ${
            isSaved
              ? "bg-black text-white border-black"
              : "bg-white text-[#A3AEA0] border-[#E8E1D5] hover:text-[#7A8B6A]"
          }`}
        >
          <BookmarkIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onApply(job.id)}
          className="px-4 py-2 bg-white border border-[#E8E1D5] hover:bg-[#7A8B6A] hover:text-white hover:border-[#7A8B6A] text-sm font-medium text-[#1A1A1A] rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
