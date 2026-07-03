"use client";

import { motion } from "framer-motion";
import { BuildingIcon, MapPinIcon, ChevronRightIcon } from "@/components/dashboard/icons";

/**
 * "Recommended Jobs" panel for the Candidate Dashboard.
 * Shows the 5 most recent jobs with a link to the full jobs page.
 *
 * Props:
 *   jobs    — array of job objects from getAllJobs()
 *   onView  — (jobId) => void — navigate to job detail page
 *   onViewAll — () => void — navigate to /jobs
 */
export default function RecommendedJobs({ jobs, onView, onViewAll }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A] m-0">Recommended Jobs</h2>
        <button
          onClick={onViewAll}
          className="text-sm text-[#7C9070] font-medium hover:text-[#5C7356] transition-colors flex items-center gap-1"
        >
          View All <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-[#6B7264] text-sm">
            No jobs available right now.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E0]">
            {jobs.slice(0, 5).map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-[#F9F8F4] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-lg font-medium text-[#1A1A1A] mb-1">{job.title}</p>
                  <p className="text-sm text-[#6B7264] flex items-center gap-x-3">
                    <span className="flex items-center gap-1">
                      <BuildingIcon className="w-4 h-4 text-[#A3AEA0]" />
                      {job.company.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4 text-[#A3AEA0]" />
                      {job.location}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => onView(job.id)}
                  className="px-5 py-2 text-sm bg-white border border-[#E5E5E0] text-[#1A1A1A] rounded-lg hover:bg-[#7C9070] hover:text-white hover:border-[#7C9070] transition-colors shadow-sm whitespace-nowrap"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
