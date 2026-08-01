import React, { useEffect, useRef, useMemo } from "react";
import TopCandidateCard from "./TopCandidateCard";
import CandidateRankList from "./CandidateRankList";
import AIProcessingState from "./AIProcessingState";

export default function RecommendationModal({
  isOpen,
  onClose,
  loading,
  progress,
  error,
  results,
  skippedCandidates,
  onCancel,
  onRetry,
}) {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        
        const handleTab = (e) => {
          if (e.key !== "Tab") return;
          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        };

        window.addEventListener("keydown", handleTab);
        return () => window.removeEventListener("keydown", handleTab);
      }
    }
  }, [isOpen, loading, results, error]);

  // Calculate ATS Pool Stats
  const poolStats = useMemo(() => {
    if (!results || !Array.isArray(results.rankedCandidates) || results.rankedCandidates.length === 0) {
      return null;
    }
    const candidates = results.rankedCandidates;
    const total = candidates.length;
    // Suitable Candidates defined as Match Score >= 50%
    const suitable = candidates.filter((c) => (c.score || 0) >= 50).length;
    const highest = candidates.reduce((max, c) => Math.max(max, c.score || 0), 0);
    const lowest = candidates.reduce((min, c) => Math.min(min, c.score || 0), 100);
    const avg = Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / total);

    return { total, suitable, highest, lowest, avg };
  }, [results]);

  // Dynamic Recommendation Banner config
  const bannerConfig = useMemo(() => {
    if (!results?.best_candidate) return null;
    const score = results.best_candidate.score || 0;

    if (score >= 85) {
      return {
        title: "Excellent Candidate Found",
        classes: "bg-[#EEF4EC] text-[#3D6B36] border-[#3D6B36]/30",
        icon: "🟢",
        guidance: "A highly aligned applicant meets or exceeds all key criteria. Immediate screening recommended.",
      };
    }
    if (score >= 70) {
      return {
        title: "Strong Candidate Found",
        classes: "bg-[#EEF4EC] text-[#3D6B36] border-[#D4EFDF]",
        icon: "🟢",
        guidance: "This applicant matches required specifications well. Highly suitable for first-round interview.",
      };
    }
    if (score >= 50) {
      return {
        title: "Moderate Candidate Match",
        classes: "bg-[#FEF9E7] text-[#B37B32] border-[#F9E79F]",
        icon: "🟡",
        guidance: "Applicant matches basic competencies but displays skill or experience gaps. Screen with caution.",
      };
    }
    if (score >= 40) {
      return {
        title: "Weak Candidate Match",
        classes: "bg-[#FDF2E9] text-[#D35400] border-[#F5CBA7]",
        icon: "🟠",
        guidance: "Limited alignment with the position criteria. Retain as backup only.",
      };
    }
    return {
      title: "No Suitable Candidate Found",
      classes: "bg-[#FADBD8] text-[#922B21] border-[#E6B0AA]",
      icon: "🔴",
      guidance: "None of the applicants currently satisfy the minimum threshold criteria (40% match).",
    };
  }, [results]);

  if (!isOpen) return null;

  const bestScore = results?.best_candidate?.score || 0;
  const isNoSuitableCandidate = bestScore < 40;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div className="bg-white border border-[#E8E1D5] rounded-3xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FDFBF7] border-b border-[#E8E1D5] flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-serif font-semibold text-[#1A1A1A]">
            AI Candidate Recommendation Report
          </h2>
          {!loading && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 text-[#6B7264] hover:text-[#1A1A1A] hover:bg-[#F5F2EB] rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. Loading Phase */}
          {loading && (
            <AIProcessingState progress={progress} onCancel={onCancel} />
          )}

          {/* 2. Error Phase */}
          {!loading && error && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex p-3 bg-red-50 rounded-full text-red-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A1A]">Analysis Failed</h3>
              <p className="text-sm text-red-600 max-w-md mx-auto">{error}</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={onRetry}
                  aria-label="Retry recommendation request"
                  className="px-6 py-2 bg-[#7A8B6A] text-white font-semibold rounded-xl hover:bg-[#627054] transition-colors text-sm shadow-sm"
                >
                  Retry Analysis
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="px-6 py-2 bg-[#F5F2EB] text-[#1A1A1A] font-semibold rounded-xl hover:bg-[#E8E1D5] transition-colors text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* 3. Successful Ranking Result display */}
          {!loading && !error && results && (
            <div className="space-y-6">
              
              {/* Warnings about skipped candidates */}
              {skippedCandidates.length > 0 && (
                <div className="bg-[#FFF4E5] border border-[#B37B32]/20 text-[#B37B32] p-4 rounded-2xl text-xs space-y-1">
                  <strong>⚠ Some candidate resumes were skipped:</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {skippedCandidates.map((skipMsg, idx) => (
                      <li key={idx}>{skipMsg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pool Statistics Section */}
              {poolStats && (
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E1D5] text-center shadow-sm">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">Analyzed</div>
                    <div className="text-lg font-bold text-[#1A1A1A] mt-0.5">{poolStats.total}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#3D6B36]">Suitable</div>
                    <div className="text-lg font-bold text-[#3D6B36] mt-0.5">{poolStats.suitable}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#8C7A5D]">Avg Match</div>
                    <div className="text-lg font-bold text-[#8C7A5D] mt-0.5">{poolStats.avg}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#7A8B6A]">Highest Match</div>
                    <div className="text-lg font-bold text-[#7A8B6A] mt-0.5">{poolStats.highest}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">Lowest Match</div>
                    <div className="text-lg font-bold text-[#6B7264] mt-0.5">{poolStats.lowest}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">Status</div>
                    <div className="text-xs font-semibold text-[#3D6B36] mt-1 bg-[#EEF4EC] py-0.5 rounded-md border border-[#3D6B36]/10">Completed</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#6B7264]">AI Engine</div>
                    <div className="text-[10px] text-[#6B7264] mt-1.5 font-mono">v3.5-Flash</div>
                  </div>
                </div>
              )}

              {/* Dynamic recommendation banners */}
              {bannerConfig && (
                <div className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center gap-3 justify-between ${bannerConfig.classes}`}>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-xl" role="img" aria-label="Status icon">{bannerConfig.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm">{bannerConfig.title}</h4>
                      <p className="text-xs mt-0.5 opacity-90">{bannerConfig.guidance}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty Ranking result State check */}
              {(!results.rankedCandidates || results.rankedCandidates.length === 0) ? (
                <div className="py-8 text-center space-y-4">
                  <p className="text-[#6B7264]">AI service returned no ranking results.</p>
                  <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-[#7A8B6A] text-white font-semibold rounded-xl hover:bg-[#627054] text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Warning: No suitable candidate found banner & actions */}
                  {isNoSuitableCandidate ? (
                    <div className="bg-[#FFF4E5] border border-[#B37B32]/30 p-5 rounded-2xl space-y-4 text-sm">
                      <div className="flex items-center gap-2 text-[#B37B32] font-bold">
                        <span>🔴</span>
                        <span>No Suitable Candidate Found</span>
                      </div>
                      <p className="text-[#6B7264] italic">
                        "None of the applicants currently satisfy the required technical skills. Consider reopening the vacancy or relaxing mandatory requirements."
                      </p>
                      <div className="text-xs text-[#1A1A1A] space-y-1">
                        <strong className="block text-[#6B7264]">Closest Applicant:</strong>
                        <p>
                          {results.best_candidate.candidateName} with a compatibility score of <strong>{bestScore}%</strong>.
                        </p>
                      </div>
                      <div className="text-xs space-y-2 border-t border-[#E8E1D5] pt-3">
                        <strong className="text-[#6B7264] block">Recommended Recruiter Actions:</strong>
                        <ul className="list-disc pl-4 space-y-1 text-[#6B7264]">
                          <li>Relax mandatory required skills or technical credentials.</li>
                          <li>Repost the vacancy with relaxed experience levels.</li>
                          <li>Search additional candidate sourcing pools or candidate databases.</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Render Best Candidate Card Highlight ONLY if match score is >= 40% */
                    results.best_candidate && (
                      <TopCandidateCard candidate={results.best_candidate} />
                    )
                  )}

                  {/* Remainder candidates list */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#6B7264] uppercase tracking-wider mb-3">
                      All Applicants Ranked
                    </h3>
                    <CandidateRankList candidates={results.rankedCandidates} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-4 bg-[#FDFBF7] border-t border-[#E8E1D5] flex justify-end gap-3">
            <button
              onClick={onClose}
              aria-label="Close recommendation modal"
              className="px-6 py-2.5 bg-[#F5F2EB] hover:bg-[#E8E1D5] text-[#1A1A1A] text-sm font-semibold rounded-xl transition-colors"
            >
              Close Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
