"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoaderIcon, MapPinIcon, BriefcaseIcon, UsersIcon } from "@/components/dashboard/icons";
import { getMyJobs } from "@/lib/api";

export default function ApplicantsOverviewPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
        Error loading jobs: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Applicants Overview</h1>
        <p className="text-[#6B7264]">Select a job posting below to manage and review its applicants.</p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-[#E8E1D5] rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#FDFBF7] rounded-full border border-[#E8E1D5] flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-[#A3AEA0]" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-2">No active jobs</h3>
          <p className="text-[#6B7264] mb-6">You haven't posted any jobs yet.</p>
          <Link href="/dashboard/recruiter" className="text-[#7A8B6A] font-medium hover:underline">
            Go to Dashboard to post a job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-1 group-hover:text-[#7A8B6A] transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[#6B7264]">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="w-4 h-4 text-[#A3AEA0]" /> {job.jobType?.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${
                  job.status === "OPEN" 
                    ? "bg-[#EEF4EC] text-[#3D6B36] border-[#C2D9BE]" 
                    : "bg-[#F5F2EB] text-[#8C7A5D] border-[#E8E1D5]"
                }`}>
                  {job.status}
                </span>
              </div>
              
              <div className="mt-auto pt-6 border-t border-[#E8E1D5]/50 flex justify-end">
                <Link 
                  href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#7A8B6A] text-white text-sm font-medium rounded-xl hover:bg-[#6A7B5C] transition-colors shadow-sm"
                >
                  <UsersIcon className="w-4 h-4" />
                  View Applicants
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}