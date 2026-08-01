import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { searchCandidates } from "@/lib/services/candidate.service";

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
  
  // Interactive Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Senior Software Engineer");
  const [prioritizeExp, setPrioritizeExp] = useState(false);
  const [prioritizeTech, setPrioritizeTech] = useState(true);
  const [mockCandidates, setMockCandidates] = useState(DEMO_CANDIDATES);
  const { userRole } = useAuth();

  useEffect(() => {
    if (userRole === "RECRUITER") {
      searchCandidates()
        .then(data => {
          if (Array.isArray(data)) {
            setCandidates(data);
          }
        })
        .catch(err => console.error("Failed to fetch candidates:", err))
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
        
        if (prioritizeExp) {
          scoreA += a.exp * 10;
          scoreB += b.exp * 10;
        }
        if (prioritizeTech) {
          scoreA += a.techMatch;
          scoreB += b.techMatch;
        }
        if (!prioritizeExp && !prioritizeTech) {
          return Math.random() - 0.5;
        }
        
        return scoreB - scoreA;
      });
      
      setMockCandidates(sorted);
      setIsScanning(false);
    }, 1500);
  };

  return {
    candidates,
    loading,
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
