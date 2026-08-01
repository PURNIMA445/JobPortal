import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAllJobs,
  searchJobs,
} from "@/lib/api";

export function useJobSearch() {
  const searchParams = useSearchParams();

  // Search and Filter State
  const initialKeyword = searchParams.get("keyword") || searchParams.get("title") || "";
  const initialLocation = searchParams.get("location") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  // Data State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    // Dynamic Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch jobs based on URL params
    if (initialKeyword || initialLocation) {
      searchJobs(initialKeyword || initialLocation)
        .then(setJobs)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      getAllJobs()
        .then(setJobs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [initialKeyword, initialLocation]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (keyword.length > 1) {
        const results = await searchJobs(keyword);
        setJobs(results);
      } else {
        const results = await getAllJobs();
        setJobs(results);
      }
    } catch {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  const filteredJobs = jobs.filter((job) => {
    let match = true;
    if (selectedJobType && job.jobType !== selectedJobType) match = false;
    if (selectedExperience && job.experienceLevel !== selectedExperience)
      match = false;
    if (
      location &&
      job.location &&
      !job.location.toLowerCase().includes(location.toLowerCase())
    )
      match = false;
    return match;
  });

  return {
    keyword,
    setKeyword,
    location,
    setLocation,
    selectedJobType,
    setSelectedJobType,
    selectedExperience,
    setSelectedExperience,
    loading,
    greeting,
    filteredJobs,
    handleSearch,
  };
}
