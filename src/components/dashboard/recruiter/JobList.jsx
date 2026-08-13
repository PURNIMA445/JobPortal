"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BriefcaseIcon, MapPinIcon, StarIcon, DollarSignIcon, UsersIcon, ArchiveIcon } from "@/components/dashboard/icons";

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    OPEN: "bg-[#EEF4EC] text-[#3D6B36] border-[#C2D9BE]",   // clear green — actively hiring
    CLOSED: "bg-[#F4F5F2] text-[#8A9080] border-[#E0E2DC]", // muted — no longer active
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] ?? styles.CLOSED}`}>
      {status}
    </span>
  );
}

// ─── Single job row ───────────────────────────────────────────────────────────

function JobRow({ job, idx, onView, onClose, profile }) {
  const isOwner = job.recruiterName === profile?.fullName;
  const isAdmin = profile?.companyRole === "ADMIN";
  const canModify = isOwner || isAdmin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white border border-[#E5E5E0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-serif font-medium text-[#1A1A1A] m-0">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B7264]">
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4 text-[#A3AEA0]" />
            {job.location || "Location not specified"}
          </span>
          <span className="flex items-center gap-1.5">
            <BriefcaseIcon className="w-4 h-4 text-[#A3AEA0]" />
            {job.jobType.replace("_", " ")}
          </span>
          <span className="flex items-center gap-1.5">
            <StarIcon className="w-4 h-4 text-[#A3AEA0]" />
            {job.experienceLevel}
          </span>
          {job.salaryMin && (
            <span className="flex items-center gap-1 text-[#5C7356] font-medium text-sm">
              <span className="font-semibold">रू.</span>
              {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}
            </span>
          )}
        </div>
        {!isOwner && (
          <div className="mt-3 text-xs text-gray-500 font-medium">
            Posted by <span className="text-gray-700">{job.recruiterName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <button
          onClick={() => onView(job.id)}
          className="px-4 py-2 bg-[#F9F8F4] hover:bg-[#EAE8E1] text-[#1A1A1A] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <UsersIcon className="w-4 h-4" />
          View Applicants
        </button>
        {job.status === "OPEN" && canModify && (
          <>
            <Link
              href={`/dashboard/recruiter/jobs/${job.id}/edit`}
              className="px-4 py-2 bg-white border border-[#E5E5E0] hover:bg-[#F9F8F4] text-[#7C9070] hover:text-[#687A5D] rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={() => onClose(job.id)}
              className="p-2 text-[#A3AEA0] hover:bg-[#FFF0F0] hover:text-[#D67373] rounded-lg transition-colors"
              title="Close Job"
            >
              <ArchiveIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyJobList({ onPost }) {
  return (
    <div className="bg-white border border-[#E5E5E0] rounded-2xl p-10 text-center shadow-sm">
      <div className="w-16 h-16 bg-[#F4F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
        <BriefcaseIcon className="w-8 h-8 text-[#A3AEA0]" />
      </div>
      <h3 className="font-serif text-xl mb-2 text-[#1A1A1A]">No jobs posted yet</h3>
      <p className="text-[#6B7264] text-sm mb-6">
        Create your first listing to start receiving applications.
      </p>
      <button
        onClick={onPost}
        className="px-5 py-2.5 bg-[#7C9070] hover:bg-[#687A5D] text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
      >
        + Post your first job
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Renders the "My Posted Jobs" panel.
 *
 * Props:
 *   jobs       — array of job objects
 *   onView     — (jobId) => void — navigate to applicants page
 *   onClose    — (jobId) => void — close/archive a job
 *   onPost     — () => void — open the PostJobForm (used by empty state CTA)
 */
export default function JobList({ jobs, profile, onView, onClose, onPost }) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-4 text-[#1A1A1A]">Company Jobs</h2>
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <EmptyJobList onPost={onPost} />
        ) : (
          jobs.map((job, idx) => (
            <JobRow
              key={job.id}
              job={job}
              idx={idx}
              profile={profile}
              onView={onView}
              onClose={onClose}
            />
          ))
        )}
      </div>
    </div>
  );
}
