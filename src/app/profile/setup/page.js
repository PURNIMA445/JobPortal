"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCandidateSetup } from "@/hooks/useCandidateSetup";
import ProjectSetupSection from "@/components/profile/ProjectSetupSection";

const inputClass = "w-full px-4 py-3 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] transition-all";
const labelClass = "text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 block";

export default function CandidateSetupPage() {
  const router = useRouter();
  const {
    skills,
    loading,
    error,
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
  } = useCandidateSetup(router);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center py-12 px-4 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#7A8B6A]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#7A8B6A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-[#E8E1D5]/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-[#7A8B6A]/5 p-8 md:p-10 border border-[#E8E1D5] relative z-10"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#EEF4EC] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#C2D9BE]">
            <svg className="w-8 h-8 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">
            Complete your Profile
          </h1>
          <p className="text-[#6B7264]">
            Build out your profile to stand out to top recruiters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PERSONAL DETAILS */}
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E1D5]">
            <h2 className="text-lg font-serif font-medium text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              Basic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                <input
                  className={inputClass}
                  value={form.fullName}
                  required
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="E.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="E.g. +1 234 567 890"
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    className={inputClass}
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="E.g. Kathmandu, Nepal"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  className={`${inputClass} resize-none py-4`}
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell recruiters a bit about yourself..."
                />
              </div>
            </div>
          </div>

          {/* EXPERIENCE & SKILLS */}
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E1D5]">
            <h2 className="text-lg font-serif font-medium text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Experience & Skills
            </h2>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Total Experience (Years)</label>
                <div className="relative max-w-[200px]">
                  <input
                    type="number"
                    min="0"
                    className={`${inputClass} pr-12`}
                    value={form.experienceYears}
                    onChange={e => setForm(f => ({ ...f, experienceYears: parseInt(e.target.value) || 0 }))}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 font-medium">
                    Years
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Top Skills</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map(skill => {
                    const active = form.skillIds.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm border
                          ${active 
                            ? "bg-[#EEF4EC] text-[#3D6B36] border-[#C2D9BE]" 
                            : "bg-white text-gray-600 border-[#E8E1D5] hover:border-[#7A8B6A] hover:text-[#7A8B6A]"
                          }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                  {skills.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No skills available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PROJECTS SECTION */}
          <ProjectSetupSection
            form={form}
            project={project}
            setProject={setProject}
            addingProject={addingProject}
            setAddingProject={setAddingProject}
            addProject={addProject}
            removeProject={removeProject}
          />

          {/* ERROR DISPLAY */}
          {error && (
            <div className="p-4 bg-rose-50 text-rose-700 text-sm font-medium rounded-xl border border-rose-200 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-[#7A8B6A] hover:bg-[#687A5D] disabled:opacity-70 text-white py-4 rounded-xl font-medium transition-all shadow-md shadow-[#7A8B6A]/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
              ) : (
                <>Save Profile & Continue <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}