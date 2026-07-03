"use client";

import { motion } from "framer-motion";
import { LeafIcon, BellIcon, SettingsIcon, LogOutIcon, MapPinIcon } from "@/components/dashboard/icons";

/**
 * Top section of the Candidate Dashboard.
 * Shows welcome greeting, location, unread notification badge, and action buttons.
 */
export default function CandidateHeader({ profile, unreadCount, onSettings, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
    >
      <div>
        <div className="flex items-center gap-2 mb-2 text-[#7C9070]">
          <LeafIcon className="w-6 h-6" />
          <span className="font-serif italic text-lg">Candidate Portal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight m-0 text-[#1A1A1A]">
          Welcome, {profile?.fullName}
        </h1>
        <p className="text-[#6B7264] mt-2 text-lg flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-[#A3AEA0]" />
          {profile?.location || "Location not specified"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
        {unreadCount > 0 && (
          <div className="bg-[#7C9070] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
            <BellIcon className="w-4 h-4" />
            {unreadCount} unread
          </div>
        )}
        <button
          onClick={onSettings}
          className="px-5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-[#F2F1EC] text-[#1A1A1A] rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
        >
          <SettingsIcon className="w-4 h-4" />
          Edit Profile
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
