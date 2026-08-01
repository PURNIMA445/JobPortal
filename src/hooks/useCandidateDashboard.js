import { useState, useEffect } from "react";
import { 
  getCandidateProfile, 
  getDashboardStats 
} from "@/lib/services/candidate.service";
import { getRecommendedJobs, getSavedJobs } from "@/lib/services/job.service";
import { getUnreadCount } from "@/lib/services/notification.service";

export function useCandidateDashboard() {
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

  const profileChecklist = [
    { label: "Basic Information", done: !!profile?.fullName },
    { label: "Skills", done: (profile?.skills?.length || 0) > 0 },
    { label: "Projects", done: (profile?.projects?.length || 0) > 0 },
    { label: "Experience", done: (profile?.experienceYears || 0) > 0 },
    { label: "Resume Uploaded", done: !!profile?.resumeUrl },
  ];
  
  const profileCompletion = profileChecklist.filter(item => item.done).length * 20;

  return {
    profile,
    recommendedJobs,
    stats,
    loading,
    savedJobsCount,
    unreadCount,
    profileChecklist,
    profileCompletion
  };
}
