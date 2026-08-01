"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSavedJobs } from "@/lib/api";
import { useSavedJobs } from "@/context/SavedJobsContext";
import { LoaderIcon, MapPinIcon, BriefcaseIcon, BookmarkIcon } from "@/components/dashboard/icons";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleSaveJob, savedJobIds } = useSavedJobs();

  useEffect(() => {
    getSavedJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    await toggleSaveJob(jobId);
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
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
        Error loading saved jobs: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Saved Jobs</h1>
        <p className="text-[#6B7264]">Jobs you have bookmarked for later.</p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-3xl p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full border border-[#E8E1D5] flex items-center justify-center mb-6">
            <BookmarkIcon className="w-8 h-8 text-[#A3AEA0]" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-2">No saved jobs</h3>
          <p className="text-[#6B7264] mb-6">You haven't bookmarked any jobs yet.</p>
          <Link href="/jobs" className="px-6 py-2.5 bg-[#7A8B6A] text-white font-medium rounded-xl hover:bg-[#687A5D] transition-colors shadow-sm">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#E8E1D5] flex items-center justify-center shrink-0">
                    <span className="text-xl font-serif text-[#7A8B6A]">
                      {job.company?.name ? job.company.name.charAt(0).toUpperCase() : "C"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-1 group-hover:text-[#7A8B6A] transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-[#6B7264]">{job.company?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#8C9883] mb-6">
                <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-2.5 py-1 rounded-lg border border-[#E8E1D5]">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#A3AEA0]" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-2.5 py-1 rounded-lg border border-[#E8E1D5]">
                  <BriefcaseIcon className="w-3.5 h-3.5 text-[#A3AEA0]" /> {job.jobType?.replace("_", " ")}
                </span>
              </div>

              <div className="mt-auto flex items-center gap-3 pt-4 border-t border-[#E8E1D5]/50">
                <Link 
                  href={`/jobs/${job.id}`}
                  className="flex-1 text-center px-4 py-2.5 bg-[#7A8B6A] text-white text-sm font-medium rounded-xl hover:bg-[#687A5D] transition-colors shadow-sm"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleUnsave(job.id)}
                  className="px-4 py-2.5 bg-[#F5F2EB] hover:bg-[#E8E1D5] text-[#8C7A5D] hover:text-[#5c4f3c] text-sm font-medium rounded-xl transition-colors shrink-0"
                  title="Unsave Job"
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}