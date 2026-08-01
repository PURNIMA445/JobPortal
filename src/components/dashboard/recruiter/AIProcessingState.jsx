import React from "react";

export default function AIProcessingState({ progress, onCancel }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6" aria-live="polite">
      <div className="w-16 h-16 border-4 border-[#7A8B6A]/20 border-t-[#7A8B6A] rounded-full animate-spin" />
      <div className="space-y-2 w-full max-w-md">
        <h3 className="font-semibold text-lg text-[#1A1A1A]">
          {progress.phase === "fetching"
            ? "Downloading Resumes..."
            : progress.phase === "parsing"
            ? "Analyzing Experience & Skills..."
            : progress.phase === "ranking"
            ? "Ranking Candidates..."
            : "Processing..."}
        </h3>
        {progress.name && (
          <p className="text-sm text-[#6B7264] truncate">
            Currently processing: <strong className="text-[#1A1A1A]">{progress.name}</strong>
          </p>
        )}
        <div className="w-full bg-[#F5F2EB] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#7A8B6A] h-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="text-xs text-[#6B7264] font-medium">{progress.percent}% Completed</p>
      </div>

      <button
        onClick={onCancel}
        aria-label="Cancel AI ranking"
        className="px-6 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all"
      >
        Cancel Analysis
      </button>
    </div>
  );
}
