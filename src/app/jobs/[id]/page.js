"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJob } from "@/lib/api";
import useAuth from "@/hooks/useAuth";

import CandidateJobView from "@/components/jobs/detail/CandidateJobView";
import RecruiterJobView from "@/components/jobs/detail/RecruiterJobView";

function JobDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { userRole } = useAuth();

  // Job Data
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FDFBF7]">
        <p className="text-gray-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#FDFBF7] gap-4">
        <h2 className="text-2xl font-serif text-gray-900">Job not found</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-xl transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Back Button Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Jobs
        </button>
      </div>

      {userRole === "RECRUITER" ? (
        <RecruiterJobView job={job} />
      ) : (
        <CandidateJobView job={job} />
      )}
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-[#FDFBF7]">
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      }
    >
      <JobDetail />
    </Suspense>
  );
}