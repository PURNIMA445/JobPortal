import { useState, useEffect } from "react";
import { getRecommendedJobs } from "@/lib/services/job.service";
import useAuth from "@/hooks/useAuth";

export function useExplore(router) {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [personalizedJobs, setPersonalizedJobs] = useState([]);

  const { userRole } = useAuth();

  const popularSearches = ["Software Engineer", "Remote", "Marketing", "Data Scientist", "Product Manager"];

  const dynamicIndustries = [
    { name: "IT", jobCount: 1205, icon: "💻", color: "bg-[#EEF4EC]" },
    { name: "Healthcare", jobCount: 843, icon: "🏥", color: "bg-[#F5F0E8]" },
    { name: "Finance", jobCount: 650, icon: "📈", color: "bg-[#EEF4EC]" },
    { name: "Education", jobCount: 432, icon: "🎓", color: "bg-[#F5F0E8]" }
  ];

  const dynamicSkills = [
    { name: "React.js", count: 850, trend: "up", percentage: "+15%" },
    { name: "Python", count: 1200, trend: "up", percentage: "+8%" },
    { name: "UX Design", count: 450, trend: "up", percentage: "+22%" },
    { name: "Data Analysis", count: 980, trend: "down", percentage: "-3%" }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        if (userRole === "CANDIDATE") {
          const jobs = await getRecommendedJobs();
          setPersonalizedJobs(jobs || []);
        } else {
          setPersonalizedJobs([]);
        }
      } catch (err) {
        console.error("Failed to load personalized jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userRole]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/jobs?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleTagClick = (tag) => {
    setKeyword(tag);
    router.push(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return {
    keyword,
    setKeyword,
    loading,
    popularSearches,
    dynamicIndustries,
    dynamicSkills,
    personalizedJobs,
    userRole,
    handleSearch,
    handleTagClick
  };
}
