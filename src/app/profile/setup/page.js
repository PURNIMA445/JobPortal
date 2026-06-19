"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSkills,
  createCandidateProfile,
  updateCandidateProfile,
  getCandidateProfile
} from "@/lib/api";

export default function CandidateSetupPage() {
  const router = useRouter();

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

  useEffect(() => {
    async function loadData() {
      const skillList = await getAllSkills();
      setSkills(skillList);

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
      } catch {}
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
  };

  const removeProject = (index) => {
    setForm(f => ({
      ...f,
      projects: f.projects.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      try {
        await getCandidateProfile();
        await updateCandidateProfile(form);
      } catch {
        await createCandidateProfile(form);
      }

      router.push("/dashboard/candidate");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A] transition";

  const labelClass = "text-xs font-semibold uppercase text-gray-600 tracking-wide";

  const btnClass =
    "w-full bg-[#7A8B6A] hover:bg-[#6c7d5c] text-white py-2.5 rounded-lg font-semibold transition";

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex justify-center px-4 py-10 font-sans">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8">

        {/* HEADER */}
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
          Set up your profile
        </h1>

        <p className="text-gray-500 mb-8">
          Complete your profile to get better job matches
        </p>

        {/* FORM */}
        <div className="space-y-5">

          {/* NAME */}
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              className={inputClass}
              value={form.fullName}
              onChange={e =>
                setForm(f => ({ ...f, fullName: e.target.value }))
              }
              placeholder="John Doe"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className={labelClass}>Phone</label>
            <input
              className={inputClass}
              value={form.phone}
              onChange={e =>
                setForm(f => ({ ...f, phone: e.target.value }))
              }
              placeholder="98XXXXXXXX"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={form.location}
              onChange={e =>
                setForm(f => ({ ...f, location: e.target.value }))
              }
              placeholder="Kathmandu, Nepal"
            />
          </div>

          {/* BIO */}
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.bio}
              onChange={e =>
                setForm(f => ({ ...f, bio: e.target.value }))
              }
              placeholder="Tell us about yourself"
            />
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className={labelClass}>Experience (years)</label>
            <input
              type="number"
              className={inputClass}
              value={form.experienceYears}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  experienceYears: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className={labelClass}>Skills</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map(skill => {
                const active = form.skillIds.includes(skill.id);

                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition
                      ${
                        active
                          ? "bg-[#7A8B6A] text-white border-[#7A8B6A]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#7A8B6A]"
                      }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROJECTS */}
          <div>
            <label className={labelClass}>Projects</label>

            <div className="space-y-2 mt-2">
              {form.projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-sm">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.complexity}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* ADD PROJECT */}
            <div className="mt-3 space-y-2 border border-gray-200 rounded-lg p-3">

              <input
                className={inputClass}
                placeholder="Project title"
                value={project.title}
                onChange={e =>
                  setProject(p => ({ ...p, title: e.target.value }))
                }
              />

              <textarea
                className={inputClass}
                placeholder="Description"
                value={project.description}
                onChange={e =>
                  setProject(p => ({ ...p, description: e.target.value }))
                }
              />

              <input
                className={inputClass}
                placeholder="Tech stack"
                value={project.techStack}
                onChange={e =>
                  setProject(p => ({ ...p, techStack: e.target.value }))
                }
              />

              <input
                className={inputClass}
                placeholder="Project URL"
                value={project.projectUrl}
                onChange={e =>
                  setProject(p => ({ ...p, projectUrl: e.target.value }))
                }
              />

              <select
                className={inputClass}
                value={project.complexity}
                onChange={e =>
                  setProject(p => ({ ...p, complexity: e.target.value }))
                }
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>

              <button
                type="button"
                onClick={addProject}
                className="text-sm text-[#7A8B6A] font-semibold"
              >
                + Add Project
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={btnClass}
          >
            {loading ? "Saving..." : "Save Profile →"}
          </button>

        </div>
      </div>
    </div>
  );
}