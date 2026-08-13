"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoaderIcon } from "@/components/dashboard/icons";
import { useCandidateDashboard } from "@/hooks/useCandidateDashboard";
import { CenterContent, RightSidebar, LeftSidebar } from "@/components/dashboard/candidate";

export default function CandidateDashboard() {
  const {
    profile,
    recommendedJobs,
    stats,
    loading,
    savedJobsCount,
    unreadCount,
    profileChecklist,
    profileCompletion
  } = useCandidateDashboard();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <LoaderIcon className="w-10 h-10 text-[#7A8B6A]" />
        </motion.div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-6 xl:col-span-6">
        <CenterContent profile={profile} recommendedJobs={recommendedJobs} />
      </div>

      <div className="col-span-1 lg:col-span-3 xl:col-span-3">
        <RightSidebar stats={stats} savedJobsCount={savedJobsCount} unreadCount={unreadCount} profileChecklist={profileChecklist} />
      </div>
    </div>
  );
}