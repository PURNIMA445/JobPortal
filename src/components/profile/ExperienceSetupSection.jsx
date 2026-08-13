"use client";

import { motion, AnimatePresence } from "framer-motion";
import { INPUT_CLASS as inputClass, LABEL_CLASS as labelClass } from "@/constants/styles";

export default function ExperienceSetupSection({
  form,
  experience,
  setExperience,
  addingExperience,
  setAddingExperience,
  addExperience,
  removeExperience
}) {
  return (
    <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E1D5]">
      <h2 className="text-lg font-serif font-medium text-gray-900 mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Professional Experience
      </h2>

      {/* List Existing Experiences */}
      <div className="space-y-4 mb-4">
        <AnimatePresence>
          {form.experiences?.map((e, i) => (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              key={i} 
              className="bg-white border border-[#E8E1D5] p-5 rounded-xl shadow-sm flex justify-between items-start group"
            >
              <div className="w-full">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h4 className="font-serif font-medium text-gray-900 text-lg">{e.jobTitle}</h4>
                  {e.duration && (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                      {e.duration}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#7A8B6A] mb-3">{e.companyName}</p>
                {e.description && (
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {e.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeExperience(i)}
                className="text-gray-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors ml-4 shrink-0"
                title="Remove experience"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!addingExperience ? (
        <button
          type="button"
          onClick={() => setAddingExperience(true)}
          className="w-full text-sm font-semibold text-[#7A8B6A] bg-white border border-dashed border-[#C2D9BE] hover:border-[#7A8B6A] hover:bg-[#EEF4EC] rounded-xl py-4 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E8E1D5] rounded-xl p-6 shadow-sm mt-4 relative"
        >
          <button 
            type="button" 
            onClick={() => setAddingExperience(false)} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-sm font-serif font-medium text-gray-900 mb-5">Add Experience</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Title <span className="text-red-400">*</span></label>
                <input
                  className={inputClass}
                  placeholder="e.g. Software Engineer"
                  value={experience.jobTitle}
                  onChange={e => setExperience(p => ({ ...p, jobTitle: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Company Name <span className="text-red-400">*</span></label>
                <input
                  className={inputClass}
                  placeholder="e.g. Google"
                  value={experience.companyName}
                  onChange={e => setExperience(p => ({ ...p, companyName: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Duration</label>
              <input
                className={inputClass}
                placeholder="e.g. Jan 2020 - Present"
                value={experience.duration}
                onChange={e => setExperience(p => ({ ...p, duration: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={`${inputClass} resize-none py-3`}
                rows={4}
                placeholder="Describe your responsibilities and achievements. You can use bullet points or new lines."
                value={experience.description}
                onChange={e => setExperience(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <button
              type="button"
              onClick={addExperience}
              disabled={!experience.jobTitle || !experience.companyName}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              Save Experience
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
