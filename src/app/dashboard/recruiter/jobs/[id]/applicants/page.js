"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getJobApplications, updateApplicationStatus, getApplicationCv } from "@/lib/api";
import { LoaderIcon, ArrowLeftIcon, DocumentIcon } from "@/components/dashboard/icons";
import { useAIRecommendation } from "@/hooks/useAIRecommendation";
import RecommendationModal from "@/components/dashboard/recruiter/RecommendationModal";

const STATUS_OPTIONS = ["APPLIED", "REVIEWED", "SHORTLISTED", "REJECTED"];

export default function JobApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    recommend,
    loading: aiLoading,
    progress: aiProgress,
    error: aiError,
    results: aiResults,
    showModal,
    setShowModal,
    skippedCandidates,
    cancel: cancelAi,
  } = useAIRecommendation(id, applications);

  useEffect(() => {
    getJobApplications(id)
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updated = await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updated : app))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewCv = async (applicationId) => {
    try {
      const blob = await getApplicationCv(applicationId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <LoaderIcon className="w-8 h-8 text-[#7A8B6A]" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
        Error loading applicants: {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#6B7264] hover:text-[#1A1A1A] transition-colors mb-6 font-medium text-sm"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Applicants Overview
      </button>

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Applicants</h1>
          <p className="text-[#6B7264]">Review and manage candidates for this position.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={recommend}
            disabled={applications.length === 0 || aiLoading}
            aria-label="Generate AI Candidate Recommendations"
            className="flex items-center gap-2 px-4 py-2 bg-[#7A8B6A] hover:bg-[#627054] disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-sm text-sm"
          >
            ✧ AI Recommendation
          </button>
          <div className="bg-[#FDFBF7] px-4 py-2 rounded-xl border border-[#E8E1D5] text-[#1A1A1A] font-medium shadow-sm">
            {applications.length} Total Applicants
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-[#E8E1D5] rounded-3xl p-12 text-center shadow-sm">
          <p className="text-[#6B7264]">No applicants yet for this job.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E1D5] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFBF7] border-b border-[#E8E1D5] text-sm text-[#6B7264]">
                  <th className="px-6 py-4 font-medium">Candidate</th>
                  <th className="px-6 py-4 font-medium">Match Score</th>
                  <th className="px-6 py-4 font-medium">Applied On</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D5]/50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#7A8B6A] text-white flex items-center justify-center font-medium text-sm shadow-sm">
                           {app.candidateName?.charAt(0) || "C"}
                        </div>
                        <span className="font-medium text-[#1A1A1A]">{app.candidateName}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {app.matchScore != null ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.matchScore >= 80 ? 'bg-[#EEF4EC] text-[#3D6B36]' :
                          app.matchScore >= 50 ? 'bg-[#FFF4E5] text-[#B37B32]' :
                          'bg-[#F5F2EB] text-[#8C7A5D]'
                        }`}>
                          {app.matchScore}%
                        </span>
                      ) : (
                        <span className="text-[#A3AEA0]">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#6B7264]">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="appearance-none bg-white border border-[#E8E1D5] text-sm font-medium text-[#1A1A1A] rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] cursor-pointer shadow-sm transition-all"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.replace("_", " ")}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6B7264]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewCv(app.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F2EB] hover:bg-[#E8E1D5] text-[#1A1A1A] text-sm font-medium rounded-xl transition-colors"
                      >
                        <DocumentIcon className="w-4 h-4 text-[#8C7A5D]" />
                        View CV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <RecommendationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        loading={aiLoading}
        progress={aiProgress}
        error={aiError}
        results={aiResults}
        skippedCandidates={skippedCandidates}
        onCancel={cancelAi}
        onRetry={recommend}
      />
    </div>
  );
}