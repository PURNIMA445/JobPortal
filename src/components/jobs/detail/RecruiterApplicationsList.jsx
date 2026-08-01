"use client";

import React from "react";

export default function RecruiterApplicationsList({
  applications,
  handleStatusUpdate,
  handleViewCv,
  cvLoadingId,
  cvErrorId,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "REVIEWED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "SHORTLISTED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-medium text-gray-900">
          Applications ({applications.length})
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {applications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No applications received yet.
          </p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="border border-[#E8E1D5] rounded-2xl p-5 hover:border-[#7A8B6A]/30 transition-colors bg-[#FDFBF7]"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.candidateName}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase border ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end bg-white border border-[#E8E1D5] px-4 py-2 rounded-xl shadow-sm">
                  {app.matchScore ? (
                    <div className="text-[#7A8B6A] font-bold text-lg flex items-center gap-1.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {app.matchScore}% Match
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm font-medium">
                      Score pending
                    </div>
                  )}
                  {app.rankScore && (
                    <div className="text-xs text-gray-500 font-medium mt-1">
                      Rank: {app.rankScore.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>

              {app.coverLetter && (
                <div className="bg-white border border-[#E8E1D5] rounded-xl p-4 mb-5 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Cover Letter
                  </h4>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{app.coverLetter}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E8E1D5]">
                <span className="text-sm font-semibold text-gray-500 mr-2">
                  Update Status:
                </span>
                {["REVIEWED", "SHORTLISTED", "REJECTED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(app.id, s)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                      app.status === s
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-white text-gray-600 border border-[#E8E1D5] hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {s === "REVIEWED" && "👀 Review"}
                    {s === "SHORTLISTED" && "✨ Shortlist"}
                    {s === "REJECTED" && "❌ Reject"}
                  </button>
                ))}

                <div className="flex-1 min-w-[200px] flex justify-end">
                  <button
                    onClick={() => handleViewCv(app.id)}
                    disabled={cvLoadingId === app.id}
                    className="flex items-center gap-2 px-5 py-2 bg-[#7A8B6A] hover:bg-[#687A5D] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm"
                  >
                    {cvLoadingId === app.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        View CV
                      </>
                    )}
                  </button>
                </div>
              </div>

              {cvErrorId?.id === app.id && (
                <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {cvErrorId.message}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
