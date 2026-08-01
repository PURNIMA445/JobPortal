"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useSavedJobs } from "@/context/SavedJobsContext";
import CandidateFeaturedJobCard from "./CandidateFeaturedJobCard";
import CandidateRecommendedJobRow from "./CandidateRecommendedJobRow";

export default function CenterContent({ profile, recommendedJobs = [], recentActivity = [] }) {

  const featuredJob = recommendedJobs.length > 0 ? recommendedJobs[0] : null;
  const otherJobs = recommendedJobs.length > 1 ? recommendedJobs.slice(1, 4) : [];

  const { isSaved, toggleSaveJob } = useSavedJobs();
  const router = useRouter();

  const handleApply = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1A1A1A] mb-2">
          Good Morning, {profile?.fullName?.split(' ')[0] || "Candidate"}
        </h1>
        <p className="text-lg text-[#6B7264]">
          Your next opportunity is closer than you think.
        </p>
      </div>

      {/* Featured Job */}
      <CandidateFeaturedJobCard
        job={featuredJob}
        isSaved={featuredJob ? isSaved(featuredJob.id) : false}
        onSave={toggleSaveJob}
        onApply={handleApply}
      />

      {/* Recommended Jobs List */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-serif text-2xl text-[#1A1A1A]">Recommended Jobs</h3>
          <button className="text-sm text-[#7A8B6A] font-medium hover:underline">View All</button>
        </div>

        <div className="space-y-4">
          {otherJobs.map((job, idx) => (
            <CandidateRecommendedJobRow
              key={job.id || idx}
              job={job}
              isSaved={isSaved(job.id)}
              onSave={toggleSaveJob}
              onApply={handleApply}
            />
          ))}
          {otherJobs.length === 0 && !featuredJob && (
            <div className="bg-white border border-[#E8E1D5] rounded-3xl p-8 text-center shadow-sm">
              <p className="text-[#6B7264]">No recommendations yet. Complete your profile to get matched.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
