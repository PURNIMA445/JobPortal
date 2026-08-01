"use client";

import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobSearch } from "@/hooks/useJobSearch";
import { useSavedJobs } from "@/context/SavedJobsContext";

import JobHeroBanner from "@/components/jobs/list/JobHeroBanner";
import JobSearchForm from "@/components/jobs/list/JobSearchForm";
import JobCard from "@/components/jobs/list/JobCard";

function LoaderIcon(props) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function JobsPageContent() {
  const {
    keyword,
    setKeyword,
    location,
    setLocation,
    selectedJobType,
    setSelectedJobType,
    selectedExperience,
    setSelectedExperience,
    loading,
    greeting,
    filteredJobs,
    handleSearch,
  } = useJobSearch();

  const { isSaved, toggleSaveJob } = useSavedJobs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <LoaderIcon className="w-10 h-10 text-[#7D9976]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-900 pb-20 overflow-x-hidden relative">
      <JobHeroBanner greeting={greeting} setKeyword={setKeyword} />

      <JobSearchForm
        keyword={keyword}
        setKeyword={setKeyword}
        location={location}
        setLocation={setLocation}
        selectedJobType={selectedJobType}
        setSelectedJobType={setSelectedJobType}
        selectedExperience={selectedExperience}
        setSelectedExperience={setSelectedExperience}
        handleSearch={handleSearch}
      />

      {/* JOBS SECTION */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-4">
        <div className="flex items-center justify-between mb-10 border-t border-[#EAE5D9] pt-10">
          <h2 className="text-xl font-bold text-gray-900">
            Featured Opportunities{" "}
            <span className="text-gray-400 text-sm ml-2 font-normal">
              ({filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
              found)
            </span>
          </h2>
          <a href="#" className="text-[#7D9976] font-semibold text-sm hover:underline">
            View all
          </a>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium bg-white/50 rounded-3xl border border-[#EAE5D9]">
            No jobs found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredJobs.map((job, idx) => (
                <JobCard
                  key={job.id}
                  job={job}
                  idx={idx}
                  isSaved={isSaved(job.id)}
                  handleSave={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
          <LoaderIcon className="w-10 h-10 text-[#7D9976] animate-[spin_1.5s_linear_infinite]" />
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
