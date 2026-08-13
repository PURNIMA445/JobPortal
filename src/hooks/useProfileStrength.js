import useAuth from "@/hooks/useAuth";

export function useProfileStrength() {
  const { profile } = useAuth();

  const profileChecklist = [
    { label: "Basic Information", done: !!profile?.fullName },
    { label: "Skills", done: (profile?.skills?.length || 0) > 0 },
    { label: "Projects", done: (profile?.projects?.length || 0) > 0 },
    { label: "Experience", done: (profile?.experienceYears || 0) > 0 || (profile?.experiences?.length || 0) > 0 },
    { label: "Resume Uploaded", done: !!profile?.resumeUrl },
  ];
  
  
  let profileCompletion = 0;
  if (profileChecklist[0].done) profileCompletion += 20; 
  if (profileChecklist[1].done) profileCompletion += 20; 
  if (profileChecklist[2].done) profileCompletion += 15; 
  if (profileChecklist[3].done) profileCompletion += 25; 
  if (profileChecklist[4].done) profileCompletion += 20; 
  return {
    profileChecklist,
    profileCompletion
  };
}
