"use client";

import { motion } from "framer-motion";
import { LeafIcon, PlusIcon, XIcon, SettingsIcon, LogOutIcon } from "@/components/dashboard/icons";

/**
 * Top section of the Recruiter Dashboard.
 * Displays the welcome greeting, job title, and action buttons.
 * All data and handlers come from the parent page.
 */
export default function DashboardHeader({ profile, showJobForm, onToggleForm, onSettings, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
    >
      <div>
        <div className="flex items-center gap-2 mb-2 text-[#7C9070]">
          <LeafIcon className="w-6 h-6" />
          <span className="font-serif italic text-lg">Dashboard</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight m-0 text-[#1A1A1A]">
          Welcome, {profile?.fullName}
        </h1>
        <p className="text-[#6B7264] mt-2 text-lg">
          {profile?.designation} at {profile?.company?.name}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Primary action — Post a Job */}
        <button
          onClick={onToggleForm}
          className="px-5 py-2.5 bg-[#7C9070] hover:bg-[#687A5D] text-white rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
        >
          {showJobForm ? <XIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
          {showJobForm ? "Cancel Posting" : "Post a Job"}
        </button>

        {/* Secondary actions */}
        <button
          onClick={onSettings}
          className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#F2F1EC] text-[#1A1A1A] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </button>

        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#FFF0F0] text-[#D67373] hover:border-[#D67373] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
        >
          <LogOutIcon className="w-4 h-4" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}
