"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import JobCard from "@/components/ui/JobCard";

export default function LatestOpportunitiesSection({ jobs = [] }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-24 max-w-6xl mx-auto relative z-10"
    >
      <div className="flex items-center justify-between mb-8 px-2 md:px-0">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Latest Opportunities</h2>
        <Link href="/jobs" className="text-[#7D9976] font-semibold text-sm hover:underline">View all</Link>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0">
          {jobs.slice(0, 3).map((job, idx) => (
            <JobCard
              key={job.id}
              variant="rich"
              job={job}
              idx={idx}
              onClick={() => router.push(`/jobs/${job.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-white/50 backdrop-blur-md rounded-4xl border border-[#E8E1D5] shadow-sm">
          <p className="font-medium">Discovering latest roles...</p>
        </div>
      )}
    </motion.div>
  );
}