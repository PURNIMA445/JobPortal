"use client";

import SimpleJobCard from "@/components/ui/SimpleJobCard";

export default function PersonalizedJobsSection({ personalizedJobs, userRole, router }) {
  if (!userRole || !personalizedJobs || personalizedJobs.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mt-4 mb-20">
      <div className="flex items-center justify-between mb-8 border-b border-[#EAE5D9] pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          {userRole === "CANDIDATE" ? "Recommended For You" : "Market Competition"}
        </h2>
        <button onClick={() => router.push('/jobs')} className="text-[#7D9976] font-semibold hover:underline text-sm">
          View all matches
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personalizedJobs.map(job => (
          <SimpleJobCard
            key={job.id}
            title={job.title}
            company={job.company?.name || "Acme Inc"}
            location={job.location}
            type={job.jobType ? job.jobType.replace('_', ' ') : "FULL TIME"}
            salary={job.salaryMax ? `रू. ${job.salaryMin.toLocaleString()} - रू. ${job.salaryMax.toLocaleString()}` : null}
            onClick={() => router.push(`/jobs/${job.id}`)}
            outerClassName="bg-white"
          />
        ))}
      </div>
    </div>
  );
}
