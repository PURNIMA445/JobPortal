"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoaderIcon } from "@/components/dashboard/icons";
import { getCandidateProfile, getDashboardStats, getRecommendedJobs,getSavedJobs, getUnreadCount  } from "@/lib/api";
import CenterContent from "@/components/dashboard/candidate/CenterContent";
import RightSidebar from "@/components/dashboard/candidate/RightSidebar";
import LeftSidebar from "@/components/dashboard/candidate/LeftSidebar";
export default function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    Promise.all([
      getCandidateProfile(),
      getDashboardStats(),
      getRecommendedJobs(),
      getSavedJobs(),
      getUnreadCount(),
    ])
      .then(([prof, dashboardStats, recJobs, savedJobs, unread]) => {
        setProfile(prof);
        setStats(dashboardStats);
        setRecommendedJobs(recJobs);
        setSavedJobsCount(savedJobs?.length || 0);
        setUnreadCount(unread ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <LoaderIcon className="w-10 h-10 text-[#7A8B6A]" />
        </motion.div>
      </div>
    );
  }

  const profileCompletion = profile?.profileCompletion || 65;
  const profileChecklist = [
    { label: "Basic Information", done: !!profile?.fullName },
    { label: "Skills", done: (profile?.skills?.length || 0) > 0 },
    { label: "Education", done: (profile?.education?.length || 0) > 0 },
    { label: "Experience", done: (profile?.experience?.length || 0) > 0 },
    { label: "Resume Uploaded", done: !!profile?.resumeUrl },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1A1A] pb-20 selection:bg-[#7A8B6A] selection:text-white">
      <div className="max-w-350 mx-auto px-4 md:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
            <LeftSidebar profileCompletion={profileCompletion} />
          </div>

          <div className="col-span-1 lg:col-span-6 xl:col-span-6">
            <CenterContent profile={profile} recommendedJobs={recommendedJobs} />
          </div>

          <div className="col-span-1 lg:col-span-3 xl:col-span-3">
          <RightSidebar stats={stats} savedJobsCount={savedJobsCount} unreadCount={unreadCount} profileChecklist={profileChecklist} />
          </div>

        </div>
      </div>
    </div>
  );
}