"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecommendedJobs } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { motion } from "framer-motion";

export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getRecommendedJobs()
      .then((recJobs) => {
        setJobs(recJobs || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSaveJob(jobId);
  };

  const handleApply = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#E8E1D5] border-t-[#7A8B6A] rounded-full"
        />
        <p className="text-[#6B7264] mt-4 text-sm font-medium">Matching your skills with active opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-xl mx-auto my-12">
        <h3 className="text-rose-800 font-serif text-xl font-medium mb-2">Failed to retrieve matches</h3>
        <p className="text-rose-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium text-gray-900 mb-2">Recommended Jobs</h1>
          <p className="text-sm text-[#6B7264]">AI-curated opportunities aligned with your profile skills.</p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-[#E8E1D5] rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl border border-[#E8E1D5] flex items-center justify-center mx-auto mb-6 text-[#7A8B6A]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl font-medium text-[#1C1F1A] mb-2">No recommended matches found</h3>
          <p className="text-[#6B7264] max-w-md mx-auto mb-8 text-sm leading-relaxed">
            We couldn&apos;t find matching roles. Update the technical skills and domain fields in your profile settings to align with active postings.
          </p>
          <Link href="/profile/setup">
            <button className="px-6 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium text-sm rounded-xl transition-all shadow-sm">
              Update Profile Skills
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleApply(job.id)}
              className="bg-white border border-[#E8E1D5] hover:border-[#7A8B6A] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#EEF4EC] text-[#5C7356] text-xs font-bold px-3 py-1 rounded-full border border-[#D5E4D1]">
                    {job.jobType}
                  </span>
                  <span className="text-xs text-[#A3AEA0] font-medium">{job.location}</span>
                </div>
                
                <h3 className="text-xl font-serif font-medium text-gray-900 group-hover:text-[#7A8B6A] transition-colors mb-2 line-clamp-1">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7264] mb-4">
                  <span className="font-semibold">{job.company?.name}</span>
                  <span className="text-[#E8E1D5]">•</span>
                  <span>{job.experienceLevel}</span>
                  {job.salaryMin && (
                    <>
                      <span className="text-[#E8E1D5]">•</span>
                      <span>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                    </>
                  )}
                </div>

                {job.requiredSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s.id} className="bg-gray-50 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-gray-100">
                        {s.name}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-gray-400 text-[11px] font-semibold px-2 py-1">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={(e) => handleSave(e, job.id)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                    isSaved(job.id)
                      ? "bg-gray-50 border-gray-200 text-gray-800"
                      : "bg-white border-[#E8E1D5] text-[#7A8B6A] hover:bg-[#FDFBF7]"
                  }`}
                  title={isSaved(job.id) ? "Unsave Job" : "Save Job"}
                >
                  <svg className={`w-5 h-5 ${isSaved(job.id) ? "fill-current" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleApply(job.id)}
                  className="px-6 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-sm text-sm"
                >
                  View details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}