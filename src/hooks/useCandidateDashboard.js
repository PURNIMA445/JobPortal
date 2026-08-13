import { useState, useEffect } from "react";
import { 
  getCandidateProfile, 
  getDashboardStats 
} from "@/lib/services/candidate.service";
import { getRecommendedJobs, getSavedJobs } from "@/lib/services/job.service";
import { getUnreadCount } from "@/lib/services/notification.service";
import { useProfileStrength } from "@/hooks/useProfileStrength";

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

  const { profileChecklist, profileCompletion } = useProfileStrength();

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
