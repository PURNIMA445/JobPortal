"use client";

import { motion } from "framer-motion";
import { FileTextIcon, BuildingIcon } from "@/components/dashboard/icons";

// ─── Status badge ─────────────────────────────────────────────────────────────

function ApplicationBadge({ status }) {
  const styles = {
    APPLIED:     "bg-[#F4F5F2] text-[#6B7264] border-[#E5E5E0]",
    REVIEWED:    "bg-[#FFF4E5] text-[#B37B32] border-[#F0D8BA]",
    SHORTLISTED: "bg-[#F1F4F0] text-[#5C7356] border-[#DCE4DA]",
    REJECTED:    "bg-[#FFF0F0] text-[#D67373] border-[#FAD4D4]",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${styles[status] ?? styles.APPLIED}`}>
      {status}
    </span>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyApplications() {
  return (
    <div className="p-10 text-center">
      <div className="w-16 h-16 bg-[#F4F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
        <FileTextIcon className="w-8 h-8 text-[#A3AEA0]" />
      </div>
      <p className="text-[#6B7264] text-sm">No applications submitted yet.</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * "My Applications" list panel for the Candidate Dashboard.
 *
 * Props:
 *   applications — array of application objects from getMyApplications()
 */
export default function ApplicationList({ applications }) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-4 text-[#1A1A1A]">My Applications</h2>
      <div className="bg-white border border-[#E5E5E0] rounded-2xl shadow-sm overflow-hidden">
        {applications.length === 0 ? (
          <EmptyApplications />
        ) : (
          <div className="divide-y divide-[#E5E5E0]">
            {applications.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-[#F9F8F4] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-lg font-medium text-[#1A1A1A] mb-1">
                    {app.job.title}
                  </p>
                  <p className="text-sm text-[#6B7264] flex items-center gap-2">
                    <BuildingIcon className="w-4 h-4 text-[#A3AEA0]" />
                    {app.job.company.name}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {app.matchScore && (
                    <span className="text-sm font-medium text-[#7C9070] bg-[#F1F4F0] px-3 py-1 rounded-lg">
                      {app.matchScore}% Match
                    </span>
                  )}
                  <ApplicationBadge status={app.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
