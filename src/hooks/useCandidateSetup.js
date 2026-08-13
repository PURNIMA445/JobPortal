import { useState, useEffect } from "react";
import {
  getAllSkills,
  createCandidateProfile,
  updateCandidateProfile,
  getCandidateProfile
} from "@/lib/api";
import useAuth from "@/hooks/useAuth";

export function useCandidateSetup(router) {
  const { refreshProfile } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    location: "",
    bio: "",
    experienceYears: 0,
    skillIds: [],
    projects: [],
    experiences: [],
  });

  const [project, setProject] = useState({
    title: "",
    description: "",
    techStack: "",
    projectUrl: "",
    complexity: "BEGINNER",
  });
  const [addingProject, setAddingProject] = useState(false);

  const [experience, setExperience] = useState({
    companyName: "",
    jobTitle: "",
    duration: "",
    description: "",
  });
  const [addingExperience, setAddingExperience] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Look for query params for pre-filling
      const searchParams = new URLSearchParams(window.location.search);
      const fromParser = searchParams.get("fromParser") === "true";
      const qFullName = searchParams.get("fullName") || "";
      const qPhone = searchParams.get("phone") || "";
      const qLocation = searchParams.get("location") || "";
      const qBio = searchParams.get("bio") || "";
      const qExperienceYears = parseInt(searchParams.get("experienceYears")) || 0;
      
      const qParsedSkillNames = searchParams.get("parsedSkillNames") 
        ? searchParams.get("parsedSkillNames").toLowerCase().split(",") 
        : [];

      let qProjects = [];
      try {
        const storedProjects = sessionStorage.getItem("parsedProjects");
        if (storedProjects) {
          const parsed = JSON.parse(storedProjects);
          qProjects = parsed.map(p => ({
            title: p.title || "",
            description: p.description || "",
            techStack: (p.technologies || []).join(", "),
            projectUrl: "",
            complexity: "BEGINNER"
          }));
          // We intentionally DO NOT remove the item here because React Strict Mode 
          // runs useEffect twice, and it would be lost on the second render.
          // It will just be overwritten next time a CV is uploaded.
        }
      } catch (e) {
        console.warn("Failed to parse stored projects", e);
      }

      let qExperiences = [];
      try {
        const storedExperiences = sessionStorage.getItem("parsedExperiences");
        if (storedExperiences) {
          const parsed = JSON.parse(storedExperiences);
          qExperiences = parsed.map(e => ({
            companyName: e.companyName || "",
            jobTitle: e.jobTitle || "",
            duration: e.duration || "",
            description: e.description || "",
          }));
        }
      } catch (e) {
        console.warn("Failed to parse stored experiences", e);
      }

      let skillList = [];
      try {
        skillList = await getAllSkills();
        setSkills(skillList);
      } catch (err) {
        console.error("Failed to load skills", err);
      }

      try {
        const existing = await getCandidateProfile();
        // If profile exists, merge with parsed data but prioritize existing data for non-empty fields
        // In practice, CV parse is usually for new profiles, but we handle it just in case
        setForm({
          fullName: existing.fullName || qFullName,
          phone: existing.phone || qPhone,
          location: existing.location || qLocation,
          bio: existing.bio || qBio,
          experienceYears: existing.experienceYears || qExperienceYears,
          skillIds: existing.skills?.length > 0 ? existing.skills.map(s => s.id) : [],
          projects: existing.projects?.length > 0 ? existing.projects.map(p => ({
            title: p.title,
            description: p.description || "",
            techStack: p.techStack || "",
            projectUrl: p.projectUrl || "",
            complexity: p.complexity || "BEGINNER",
          })) : qProjects,
          experiences: existing.experiences?.length > 0 ? existing.experiences.map(e => ({
            companyName: e.companyName,
            jobTitle: e.jobTitle,
            duration: e.duration || "",
            description: e.description || "",
          })) : qExperiences,
        });
      } catch {
        
        // Find matching skill IDs for parsed skill names
        const matchedSkillIds = skillList
          .filter(s => qParsedSkillNames.includes(s.name.toLowerCase()))
          .map(s => s.id);

        setForm({
          fullName: qFullName,
          phone: qPhone,
          location: qLocation,
          bio: qBio,
          experienceYears: qExperienceYears,
          skillIds: matchedSkillIds,
          projects: qProjects,
          experiences: qExperiences,
        });
        
        if (fromParser && (!qFullName || !qPhone || !qBio)) {
            setError("We couldn't parse some fields — please fill them in manually.");
        }
      }
    }

    loadData();
  }, []);

  const toggleSkill = (id) => {
    setForm(f => ({
      ...f,
      skillIds: f.skillIds.includes(id)
        ? f.skillIds.filter(s => s !== id)
        : [...f.skillIds, id],
    }));
  };

  const addProject = () => {
    if (!project.title) return;

    setForm(f => ({
      ...f,
      projects: [...f.projects, project],
    }));

    setProject({
      title: "",
      description: "",
      techStack: "",
      projectUrl: "",
      complexity: "BEGINNER",
    });
    setAddingProject(false);
  };

  const removeProject = (index) => {
    setForm(f => ({
      ...f,
      projects: f.projects.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    if (!experience.companyName || !experience.jobTitle) return;

    setForm(f => ({
      ...f,
      experiences: [...(f.experiences || []), experience],
    }));

    setExperience({
      companyName: "",
      jobTitle: "",
      duration: "",
      description: "",
    });
    setAddingExperience(false);
  };

  const removeExperience = (index) => {
    setForm(f => ({
      ...f,
      experiences: f.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!form.fullName) return setError("Your full name is required.");
    
    setLoading(true);
    setError(null);

    try {
      let profileExists = false;
      try {
        await getCandidateProfile();
        profileExists = true;
      } catch (err) {
        // Treat 404 or backend 'Profile not found' exception as "profile doesn't exist yet"
        if (err.status !== 404 && err.message !== "Profile not found") {
          throw err;
        }
      }

      if (profileExists) {
        await updateCandidateProfile(form);
      } else {
        await createCandidateProfile(form);
      }

      if (refreshProfile) {
        await refreshProfile();
      }

      router.push("/dashboard/candidate");
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return {
    skills,
    loading,
    error,
    setError,
    form,
    setForm,
    project,
    setProject,
    addingProject,
    setAddingProject,
    experience,
    setExperience,
    addingExperience,
    setAddingExperience,
    toggleSkill,
    addProject,
    removeProject,
    addExperience,
    removeExperience,
    handleSubmit
  };
}
