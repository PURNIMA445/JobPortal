import React, { useState, useMemo } from "react";
import CandidateRankRow from "./CandidateRankRow";
import CandidateComparisonModal from "./CandidateComparisonModal";

export default function CandidateRankList({ candidates }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("score_desc");
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Toggle expanded view
  const toggleExpand = (index) => {
    setExpandedId(expandedId === index ? null : index);
  };

  // Filter and sort memoization
  const processedCandidates = useMemo(() => {
    if (!Array.isArray(candidates)) return [];

    let result = candidates.map((c, idx) => ({ ...c, originalIndex: idx }));

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => c.candidateName?.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      if (sortBy === "score_desc") {
        return (b.score || 0) - (a.score || 0);
      }
      if (sortBy === "score_asc") {
        return (a.score || 0) - (b.score || 0);
      }
      if (sortBy === "name") {
        return (a.candidateName || "").localeCompare(b.candidateName || "");
      }
      return 0;
    });

    return result;
  }, [candidates, searchTerm, sortBy]);



  // Selection toggle
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compare candidates memoization
  const comparedCandidates = useMemo(() => {
    return candidates.filter((c, idx) => selectedIds.includes(idx));
  }, [candidates, selectedIds]);

  return (
    <div className="space-y-4">
      {/* Search & Sort Panel */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-[#F5F2EB]/50 p-4 rounded-2xl border border-[#E8E1D5]">
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search candidates"
            className="bg-white border border-[#E8E1D5] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] shadow-sm w-full sm:w-64"
          />
          <button
            onClick={() => setShowComparison(true)}
            disabled={selectedIds.length < 2}
            className="px-4 py-2 bg-[#7A8B6A] hover:bg-[#627054] disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-sm text-sm"
          >
            📊 Compare Selected ({selectedIds.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <label htmlFor="sort-candidates" className="text-xs font-semibold text-[#6B7264] whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-candidates"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#E8E1D5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] cursor-pointer shadow-sm"
          >
            <option value="score_desc">Highest Match Score</option>
            <option value="score_asc">Lowest Match Score</option>
            <option value="name">Candidate Name</option>
          </select>
        </div>
      </div>

      {/* ATS Table Layout */}
      <div className="bg-white border border-[#E8E1D5] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#FDFBF7] border-b border-[#E8E1D5] text-[#6B7264] text-xs font-semibold uppercase tracking-wider">
              <th className="px-4 py-3 text-center w-12">Select</th>
              <th className="px-4 py-3 text-center w-12">Rank</th>
              <th className="px-6 py-3">Candidate</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Experience</th>
              <th className="px-4 py-3 text-center">Matched</th>
              <th className="px-4 py-3 text-center">Missing</th>
              <th className="px-4 py-3 text-center">Risk</th>
              <th className="px-4 py-3 text-center">Recommendation</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E1D5]/50">
            {processedCandidates.map((c, index) => {
              return (
                <CandidateRankRow
                  key={c.originalIndex}
                  candidate={c}
                  isExpanded={expandedId === c.originalIndex}
                  isSelected={selectedIds.includes(c.originalIndex)}
                  onToggleSelect={() => toggleSelect(c.originalIndex)}
                  onToggleExpand={() => toggleExpand(c.originalIndex)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {showComparison && (
        <CandidateComparisonModal 
          candidates={comparedCandidates} 
          onClose={() => setShowComparison(false)} 
        />
      )}
    </div>
  );
}
