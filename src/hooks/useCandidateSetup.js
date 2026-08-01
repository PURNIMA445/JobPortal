import { useState, useEffect } from "react";
import {
  getAllSkills,
  createCandidateProfile,
  updateCandidateProfile,
  getCandidateProfile
} from "@/lib/api";

export function useCandidateSetup(router) {
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
  });

  const [project, setProject] = useState({
    title: "",
    description: "",
    techStack: "",
    projectUrl: "",
    complexity: "BEGINNER",
  });
  
  const [addingProject, setAddingProject] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const skillList = await getAllSkills();
        setSkills(skillList);
      } catch (err) {
        console.error("Failed to load skills", err);
      }

      try {
        const existing = await getCandidateProfile();
        setForm({
          fullName: existing.fullName || "",
          phone: existing.phone || "",
          location: existing.location || "",
          bio: existing.bio || "",
          experienceYears: existing.experienceYears || 0,
          skillIds: existing.skills?.map(s => s.id) || [],
          projects: existing.projects?.map(p => ({
            title: p.title,
            description: p.description || "",
            techStack: p.techStack || "",
            projectUrl: p.projectUrl || "",
            complexity: p.complexity || "BEGINNER",
          })) || [],
        });
      } catch {
        // Normal behavior if profile doesn't exist yet
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
        // Only treat 404 as "profile doesn't exist yet"
        if (err.status !== 404) throw err;
      }

      if (profileExists) {
        await updateCandidateProfile(form);
      } else {
        await createCandidateProfile(form);
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
    toggleSkill,
    addProject,
    removeProject,
    handleSubmit
  };
}
