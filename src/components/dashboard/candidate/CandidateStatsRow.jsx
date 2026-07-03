"use client";

import { motion } from "framer-motion";
import { BriefcaseIcon, FileTextIcon, BellIcon } from "@/components/dashboard/icons";

/**
 * Three-column stats row for the Candidate Dashboard.
 * "My Applications" is highlighted as the primary metric —
 * it's what the candidate cares most about tracking.
 */
export default function CandidateStatsRow({ jobsCount, applicationsCount, notificationsCount }) {
  const stats = [
    {
      label: "Jobs Available",
      value: jobsCount,
      icon: <BriefcaseIcon className="w-6 h-6 text-[#7C9070]" />,
      primary: false,
    },
    {
      label: "My Applications",
      value: applicationsCount,
      icon: <FileTextIcon className="w-6 h-6 text-[#7C9070]" />,
      primary: true,
    },
    {
      label: "Notifications",
      value: notificationsCount,
      icon: <BellIcon className="w-6 h-6 text-[#7C9070]" />,
      primary: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl p-6 border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between transition-all ${
            stat.primary
              ? "border-[#7C9070]/30 ring-1 ring-[#7C9070]/20"
              : "border-[#E5E5E0]"
          }`}
        >
          <div>
            <p className="text-sm font-medium text-[#6B7264] mb-1">{stat.label}</p>
            <p className={`font-serif font-medium m-0 leading-none ${stat.primary ? "text-4xl text-[#1A1A1A]" : "text-3xl text-[#1A1A1A]"}`}>
              {stat.value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${stat.primary ? "bg-[#EEF1EB]" : "bg-[#F4F5F2]"}`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
