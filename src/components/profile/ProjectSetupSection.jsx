"use client";

import { motion, AnimatePresence } from "framer-motion";
import { INPUT_CLASS as inputClass, LABEL_CLASS as labelClass } from "@/constants/styles";


export default function ProjectSetupSection({
  form,
  project,
  setProject,
  addingProject,
  setAddingProject,
  addProject,
  removeProject
}) {
  return (
    <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E1D5]">
      <h2 className="text-lg font-serif font-medium text-gray-900 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Portfolio Projects
      </h2>

      {/* List Existing Projects */}
      <div className="space-y-4 mb-4">
        <AnimatePresence>
          {form.projects.map((p, i) => (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              key={i} 
              className="bg-white border border-[#E8E1D5] p-5 rounded-xl shadow-sm flex justify-between items-start group"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-serif font-medium text-gray-900 text-lg">{p.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8B6A] bg-[#EEF4EC] px-2 py-0.5 rounded-md border border-[#C2D9BE]">
                    {p.complexity}
                  </span>
                </div>
                {p.techStack && <p className="text-sm text-gray-600 mb-2 font-medium">{p.techStack}</p>}
                {p.description && <p className="text-sm text-gray-500 mb-3">{p.description}</p>}
                {p.projectUrl && (
                  <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Project
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeProject(i)}
                className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove project"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!addingProject ? (
        <button
          type="button"
          onClick={() => setAddingProject(true)}
          className="w-full text-sm font-semibold text-[#7A8B6A] bg-white border border-dashed border-[#C2D9BE] hover:border-[#7A8B6A] hover:bg-[#EEF4EC] rounded-xl py-4 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Project
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E8E1D5] rounded-xl p-6 shadow-sm mt-4 relative"
        >
          <button 
            type="button" 
            onClick={() => setAddingProject(false)} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-sm font-serif font-medium text-gray-900 mb-5">Add a New Project</h3>
          
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Project Title <span className="text-red-400">*</span></label>
              <input
                className={inputClass}
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tech Stack</label>
                <input
                  className={inputClass}
                  placeholder="e.g. React, Java"
                  value={project.techStack}
                  onChange={e => setProject(p => ({ ...p, techStack: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Complexity</label>
                <select
                  className={inputClass}
                  value={project.complexity}
                  onChange={e => setProject(p => ({ ...p, complexity: e.target.value }))}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Project URL</label>
              <input
                className={inputClass}
                type="url"
                placeholder="https://..."
                value={project.projectUrl}
                onChange={e => setProject(p => ({ ...p, projectUrl: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={`${inputClass} resize-none py-3`}
                rows={2}
                placeholder="Brief description of what you built..."
                value={project.description}
                onChange={e => setProject(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <button
              type="button"
              onClick={addProject}
              disabled={!project.title}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              Add Project to List
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
