import React from "react";
import { getHiringBadge, getRiskBadge } from "@/lib/utils/candidateUtils";

export default function CandidateComparisonModal({ candidates, onClose }) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-[#E8E1D5] rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-[#FDFBF7] border-b border-[#E8E1D5] flex items-center justify-between">
          <h3 className="text-lg font-serif font-semibold text-[#1A1A1A]">
            ATS Side-by-Side Candidate Comparison
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7264] hover:text-[#1A1A1A]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E8E1D5]/50">
          {candidates.map((cand, idx) => {
            const badge = getHiringBadge(cand.score || 0);
            const risk = getRiskBadge(cand.score || 0, cand.missingRequiredSkills?.length || 0);

            return (
              <div key={idx} className={`space-y-4 ${idx > 0 ? "md:pl-6 pt-4 md:pt-0" : ""}`}>
                <div>
                  <h4 className="text-xl font-bold text-[#1A1A1A]">{cand.candidateName}</h4>
                  <p className="text-xs text-[#6B7264]">Estimated Experience: {cand.resumeYears || "—"} Years</p>
                </div>

                <div className="flex gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">Match Score</div>
                    <div className="text-lg font-bold text-[#3D6B36]">{cand.score || 0}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">Decision</div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold mt-1 border ${badge.classes}`}>
                      {badge.text}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">Risk Rating</div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold mt-1 border ${risk.classes}`}>
                      {risk.text}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs uppercase font-bold text-[#6B7264] mb-1">AI Explanation Summary</h5>
                  <p className="text-xs text-[#1A1A1A] leading-relaxed bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E1D5]">
                    {cand.explanation || "No explanation details provided."}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs uppercase font-bold text-[#3D6B36] mb-1.5">Matched Skills ({cand.matchedRequiredSkills?.length || 0})</h5>
                  <div className="flex flex-wrap gap-1">
                    {cand.matchedRequiredSkills?.map((s, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-[#EEF4EC] text-[#3D6B36] text-[10px] rounded border border-[#3D6B36]/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs uppercase font-bold text-[#B37B32] mb-1.5">Missing Skills ({cand.missingRequiredSkills?.length || 0})</h5>
                  <div className="flex flex-wrap gap-1">
                    {cand.missingRequiredSkills?.map((s, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-[#FFF4E5] text-[#B37B32] text-[10px] rounded border border-[#B37B32]/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="px-6 py-4 bg-[#FDFBF7] border-t border-[#E8E1D5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#7A8B6A] text-white font-semibold rounded-xl hover:bg-[#627054]"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
