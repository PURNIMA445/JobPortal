"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getSavedJobs, saveJob as apiSaveJob, unsaveJob as apiUnsaveJob } from "@/lib/api";
import useAuth from "@/hooks/useAuth";

const SavedJobsContext = createContext({
  savedJobIds: [],
  isSaved: () => false,
  toggleSaveJob: async () => {},
  loading: true,
});

export function SavedJobsProvider({ children }) {
  const { isLoggedIn, userRole } = useAuth();
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && userRole === "CANDIDATE") {
      fetchSavedJobs();
    } else {
      setSavedJobIds([]);
      setLoading(false);
    }
  }, [isLoggedIn, userRole]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const data = await getSavedJobs();
      setSavedJobIds(data.map((job) => job.id));
    } catch (err) {
      if (err.status !== 404 && err.message !== "Candidate profile not found") {
        console.error("Failed to fetch saved jobs", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const isSaved = (jobId) => savedJobIds.includes(jobId);

  const toggleSaveJob = async (jobId) => {
    if (!isLoggedIn || userRole !== "CANDIDATE") {
      alert("Please log in as a candidate to save jobs.");
      return;
    }

    const currentlySaved = isSaved(jobId);
    
    // Optimistic update
    setSavedJobIds((prev) => 
      currentlySaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );

    try {
      if (currentlySaved) {
        await apiUnsaveJob(jobId);
      } else {
        await apiSaveJob(jobId);
      }
    } catch (err) {
      console.error("Failed to toggle saved job:", err);
      // Revert on failure
      setSavedJobIds((prev) => 
        currentlySaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)
      );
      alert("Failed to save/unsave job. Please try again.");
    }
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobIds, isSaved, toggleSaveJob, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  return useContext(SavedJobsContext);
}
