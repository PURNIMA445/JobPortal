"use client";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { MapPinIcon, BriefcaseIcon, BookmarkIcon } from "@/components/dashboard/icons";
import { saveJob, unsaveJob, getSavedJobs } from "@/lib/api";
export default function CenterContent({ profile, recommendedJobs = [], recentActivity = [] }) {

  const featuredJob = recommendedJobs.length > 0 ? recommendedJobs[0] : null;
  const otherJobs = recommendedJobs.length > 1 ? recommendedJobs.slice(1, 4) : [];

  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const router = useRouter();
  useEffect(() => {
    getSavedJobs()
      .then((saved) => setSavedJobIds(new Set(saved.map((j) => j.id))))
      .catch(() => { });
  }, []);

  const handleSave = async (jobId) => {
    try {
      if (savedJobIds.has(jobId)) {
        await unsaveJob(jobId);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await saveJob(jobId);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      alert(err.message);
    }
  };
  // const handleApply = async (jobId) => {
  //   try {
  //     await applyToJob(jobId);
  //     alert("Application submitted");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };
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
      {featuredJob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7A8B6A]/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              {/* Logo placeholder */}
              <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] border border-[#E8E1D5] flex items-center justify-center font-serif text-2xl text-[#7A8B6A] shadow-sm">
                {featuredJob.company?.name?.charAt(0) || "C"}
              </div>
              <div>
                <h2 className="text-2xl font-serif font-medium text-[#1A1A1A] leading-tight">
                  {featuredJob.title}
                </h2>
                <p className="text-[#6B7264]">{featuredJob.company?.name}</p>
              </div>
            </div>

            {featuredJob.matchScore && (
              <div className="bg-[#EEF4EC] text-[#3D6B36] border border-[#C2D9BE] px-3 py-1.5 rounded-lg text-sm font-medium flex flex-col items-center">
                <span className="text-lg leading-none">{featuredJob.matchScore}%</span>
                <span className="text-[10px] uppercase tracking-wider">Match</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-[#1A1A1A] font-medium mb-8">
            <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5]">
              <MapPinIcon className="w-4 h-4 text-[#A3AEA0]" /> {featuredJob.location}
            </span>
            <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5]">
              <BriefcaseIcon className="w-4 h-4 text-[#A3AEA0]" /> {featuredJob.jobType?.replace("_", " ")}
            </span>
            {featuredJob.salaryMin && (
              <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1.5 rounded-lg border border-[#E8E1D5] text-[#5C7356]">
                ${featuredJob.salaryMin.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleApply(featuredJob.id)}
              className="flex-1 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Apply Now
            </button>
            <button
              onClick={() => handleSave(featuredJob.id)}
              className={`px-4 py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center border ${savedJobIds.has(featuredJob.id)
                ? "bg-black text-white border-black"
                : "bg-white text-[#1A1A1A] border-[#E8E1D5] hover:bg-[#FDFBF7]"
                }`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Recommended Jobs List */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-serif text-2xl text-[#1A1A1A]">Recommended Jobs</h3>
          <button className="text-sm text-[#7A8B6A] font-medium hover:underline">View All</button>
        </div>

        <div className="space-y-4">
          {otherJobs.map((job, idx) => (
            <div key={job.id || idx} className="bg-white border border-[#E8E1D5] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-[#E8E1D5] flex items-center justify-center font-serif text-lg text-[#7A8B6A]">
                  {job.company?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <h4 className="font-medium text-[#1A1A1A]">{job.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7264] mt-1">
                    <span>{job.company?.name}</span>
                    <span className="w-1 h-1 rounded-full bg-[#E8E1D5]" />
                    <span>{job.location}</span>
                    <span className="w-1 h-1 rounded-full bg-[#E8E1D5]" />
                    <span>{job.jobType?.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {job.matchScore && (
                  <span className="text-xs font-bold text-[#7A8B6A] bg-[#EEF4EC] px-2.5 py-1 rounded-md">
                    {job.matchScore}% Match
                  </span>
                )}
                <button
  onClick={() => handleSave(job.id)}
  className={`p-2 rounded-full border transition-colors ${
    savedJobIds.has(job.id)
      ? "bg-black text-white border-black"
      : "bg-white text-[#A3AEA0] border-[#E8E1D5] hover:text-[#7A8B6A]"
  }`}
>
  <BookmarkIcon className="w-5 h-5" />
</button>
                <button
                  onClick={() => handleApply(job.id)}
                  className="px-4 py-2 bg-white border border-[#E8E1D5] hover:bg-[#7A8B6A] hover:text-white hover:border-[#7A8B6A] text-sm font-medium text-[#1A1A1A] rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
          {otherJobs.length === 0 && !featuredJob && (
            <div className="bg-white border border-[#E8E1D5] rounded-3xl p-8 text-center shadow-sm">
              <p className="text-[#6B7264]">No recommendations yet. Complete your profile to get matched.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-serif text-2xl text-[#1A1A1A] mb-6">Recent Activity</h3>
        <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm">
          {recentActivity.length > 0 ? (
            <div className="relative border-l-2 border-[#E8E1D5] ml-3 space-y-8 py-2">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-white border-4 border-[#7A8B6A]" />
                  <p className="font-medium text-[#1A1A1A]">{activity.type}</p>
                  <p className="text-sm text-[#6B7264] mt-1">{activity.description}</p>
                  <p className="text-xs text-[#A3AEA0] mt-2">{activity.timestamp}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7264] text-center">No recent activity.</p>
          )}
        </div>
      </div>

    </div>
  );
}
