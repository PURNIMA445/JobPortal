import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { searchCandidates } from "@/lib/services/candidate.service";
import { getMyJobs } from "@/lib/services/job.service";

// Demo candidates shown on the public recruiter landing page (simulator feature)
const DEMO_CANDIDATES = [
  { id: 1, name: "Sarah Williams", avatar: "SW", role: "Senior React Engineer", exp: 8, techMatch: 98, notes: "Exceptional system design skills. Matches all required tech stack.", color: "bg-[#7A8B6A]" },
  { id: 2, name: "James Chen", avatar: "JC", role: "Full Stack Developer", exp: 4, techMatch: 95, notes: "Strong technical match. High potential for growth.", color: "bg-[#C8A96E]" },
  { id: 3, name: "Emily Rodriguez", avatar: "ER", role: "Frontend Engineer", exp: 10, techMatch: 75, notes: "Great overall experience but missing some modern framework requirements.", color: "bg-[#D67373]" },
  { id: 4, name: "Michael Taylor", avatar: "MT", role: "Junior Web Developer", exp: 2, techMatch: 60, notes: "Strong fundamentals but lacks required enterprise architecture experience.", color: "bg-gray-400" },
];

export function useRecruitersLanding() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  
  // Interactive Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Senior Software Engineer");
  const [prioritizeExp, setPrioritizeExp] = useState(false);
  const [prioritizeTech, setPrioritizeTech] = useState(true);
  const [mockCandidates, setMockCandidates] = useState(DEMO_CANDIDATES);
  const { userRole } = useAuth();

  useEffect(() => {
    if (userRole === "RECRUITER") {
      setLoading(true);
      Promise.all([
        searchCandidates().catch(() => []),
        getMyJobs().catch(() => [])
      ])
      .then(async ([candidatesData, jobsData]) => {
        if (!Array.isArray(candidatesData)) candidatesData = [];
        
        let targetJob = null;
        if (Array.isArray(jobsData) && jobsData.length > 0) {
          targetJob = jobsData.find(j => j.status === 'OPEN') || jobsData[0];
          setActiveJob(targetJob);
        }

        if (targetJob && candidatesData.length > 0) {
          const jobDescription = [
            targetJob.title,
            targetJob.description,
            "Requirements: " + (targetJob.requirements || ""),
            "Nice to have: " + (targetJob.preferredQualifications || "")
          ].join("\n");

          const aiCandidates = candidatesData.map(c => {
            const skillsStr = c.skills?.map(s => s.name).join(", ") || "";
            const projectsStr = c.projects?.map(p => p.title + ": " + p.techStack).join(". ") || "";
            const resumeText = [
              c.bio || "",
              "Skills: " + skillsStr,
              "Experience Years: " + (c.experienceYears || 0),
              "Projects: " + projectsStr
            ].join("\n");

            return {
              candidateName: `${c.id}::${c.fullName || "Candidate"}`,
              resumeText: resumeText
            };
          });

          try {
            const aiResponse = await fetch("http://127.0.0.1:8000/rank-candidates", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jobDescription: jobDescription,
                candidates: aiCandidates
              })
            });

            if (aiResponse.ok) {
              const result = await aiResponse.json();
              
              const rankedMapped = result.rankedCandidates.map(aiRanked => {
                const candId = parseInt(aiRanked.candidateName.split("::")[0], 10);
                const originalCand = candidatesData.find(c => c.id === candId);
                return {
                  ...originalCand,
                  aiMatch: aiRanked 
                };
              });

              setCandidates(rankedMapped);
              setAiAnalysis({
                totalAnalyzed: candidatesData.length,
                strongMatches: result.rankedCandidates.filter(c => c.score >= 70).length,
                highestScore: result.best_candidate?.score || 0
              });
              return;
            } else {
              setAiError("AI Ranking failed. Falling back to chronological order.");
            }
          } catch (err) {
            console.error("AI service error:", err);
            setAiError("AI service unavailable.");
          }
        }
        
        setCandidates(candidatesData);
      })
      .catch(err => console.error("Failed to fetch data:", err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userRole]);

  const handleCalibration = () => {
    setIsScanning(true);
    setTimeout(() => {
      const sorted = [...mockCandidates].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        if (prioritizeExp) { scoreA += a.exp * 10; scoreB += b.exp * 10; }
        if (prioritizeTech) { scoreA += a.techMatch; scoreB += b.techMatch; }
        if (!prioritizeExp && !prioritizeTech) return Math.random() - 0.5;
        
        return scoreB - scoreA;
      });
      setMockCandidates(sorted);
      setIsScanning(false);
    }, 1500);
  };

  return {
    candidates,
    loading,
    activeJob,
    aiError,
    aiAnalysis,
    isScanning,
    selectedRole,
    setSelectedRole,
    prioritizeExp,
    setPrioritizeExp,
    prioritizeTech,
    setPrioritizeTech,
    mockCandidates,
    userRole,
    handleCalibration
  };
}
