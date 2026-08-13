import React from "react";
import { getHiringBadge, getRiskBadge } from "@/lib/utils/candidateUtils";

export default function CandidateRankRow({
  candidate,
  isExpanded,
  isSelected,
  onToggleSelect,
  onToggleExpand,
}) {
  const c = candidate;
  const score = c.score || 0;
  const matchedCount = Array.isArray(c.matchedRequiredSkills) ? c.matchedRequiredSkills.length : 0;
  const missingCount = Array.isArray(c.missingRequiredSkills) ? c.missingRequiredSkills.length : 0;
  
  const hiringBadge = getHiringBadge(score);
  const riskBadge = getRiskBadge(score, missingCount);

  const scoreColor =
    score >= 75
      ? "bg-[#EEF4EC] text-[#3D6B36] border-[#3D6B36]/20"
      : score >= 50
      ? "bg-[#FEF9E7] text-[#B37B32] border-[#F9E79F]"
      : "bg-[#FADBD8] text-[#922B21] border-[#E6B0AA]";

  return (
    <React.Fragment>
      <tr className="hover:bg-[#FDFBF7]/40 transition-colors">
        {/* Checkbox */}
        <td className="px-4 py-3 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded border-[#E8E1D5] text-[#7A8B6A] focus:ring-[#7A8B6A] cursor-pointer"
            aria-label={`Select ${c.candidateName} for comparison`}
          />
        </td>

        {/* Rank */}
        <td className="px-4 py-3 text-center font-bold text-[#6B7264]">
          #{c.rank || c.originalIndex + 1}
        </td>

        {/* Candidate Name */}
        <td className="px-6 py-3 font-semibold text-[#1A1A1A]">
          {c.candidateName}
        </td>

        {/* Match Score */}
        <td className="px-4 py-3 text-center">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${scoreColor}`}>
            {score}%
          </span>
        </td>

        {/* Experience */}
        <td className="px-4 py-3 text-center text-[#6B7264]">
          {c.resumeYears != null ? `${c.resumeYears} yrs` : "—"}
        </td>

        {/* Matched Count */}
        <td className="px-4 py-3 text-center font-semibold text-[#3D6B36]">
          {matchedCount}
        </td>

        {/* Missing Count */}
        <td className="px-4 py-3 text-center font-semibold text-[#B37B32]">
          {missingCount}
        </td>

        {/* Risk Rating */}
        <td className="px-4 py-3 text-center">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskBadge.classes}`}>
            <span>{riskBadge.bullet}</span>
            <span>{riskBadge.text}</span>
          </span>
        </td>

        {/* Decision */}
        <td className="px-4 py-3 text-center">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${hiringBadge.classes}`}>
            {hiringBadge.text}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <a 
              href={`/dashboard/recruiter/candidate/${c.id}`} 
              target="_blank"
              rel="noreferrer"
              className="text-[#7A8B6A] hover:text-[#3D6B36] font-semibold text-xs"
              aria-label={`View full profile for ${c.candidateName}`}
            >
              View Profile
            </a>
            <button
              onClick={onToggleExpand}
              className="p-1 hover:bg-[#F5F2EB] rounded-full text-[#6B7264] hover:text-[#1A1A1A] transition-colors"
              aria-expanded={isExpanded}
              aria-label={`Toggle details for ${c.candidateName}`}
            >
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {/* Expandable row details block */}
      {isExpanded && (
        <tr>
          <td colSpan="10" className="bg-[#FDFBF7]/60 p-4 border-t border-[#E8E1D5]/40">
            <div className="space-y-4 max-w-4xl text-xs">
              <div>
                <h5 className="font-bold text-[#6B7264] uppercase tracking-wider mb-1">
                  AI Explanation
                </h5>
                <p className="text-sm text-[#1A1A1A] leading-relaxed bg-white p-3 rounded-xl border border-[#E8E1D5]">
                  {c.explanation || "No explanation provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-[#3D6B36] uppercase tracking-wider mb-1">
                    ✓ Matched Skills
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(c.matchedRequiredSkills) && c.matchedRequiredSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#EEF4EC] text-[#3D6B36] rounded border border-[#3D6B36]/10">
                        {s}
                      </span>
                    ))}
                    {matchedCount === 0 && <span className="text-[#A3AEA0]">None mapped.</span>}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-[#B37B32] uppercase tracking-wider mb-1">
                    Missing Required Skills
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(c.missingRequiredSkills) && c.missingRequiredSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#FFF4E5] text-[#B37B32] rounded border border-[#B37B32]/10">
                        {s}
                      </span>
                    ))}
                    {missingCount === 0 && <span className="text-[#3D6B36] font-semibold">Meets all requirements.</span>}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}
