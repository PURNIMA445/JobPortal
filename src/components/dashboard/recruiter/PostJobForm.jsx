"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircleIcon, LoaderIcon,
} from "@/components/dashboard/icons";
import JobDetailsForm from "./JobDetailsForm";
import JobSkillsSelector from "./JobSkillsSelector";

/**
 * Collapsible "Post a Job" form panel.
 * All state and handlers are owned by the parent page — this component is
 * purely presentational and controlled via props.
 *
 * Props:
 *   visible      — whether the form is expanded
 *   jobForm      — current form values (controlled)
 *   skills       — full list of available skills from API
 *   posting      — true while the API call is in-flight
 *   error        — error message string or null
 *   onChange     — (field, value) => void — update a single field
 *   onToggleSkill — (skillId) => void — toggle a skill in requiredSkillIds
 *   onSubmit     — () => void — called when "Publish" is clicked
 */
export default function PostJobForm({
  visible,
  jobForm,
  skills,
  posting,
  error,
  onChange,
  onToggleSkill,
  onSubmit,
  isEdit = false,
}) {


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.98 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.98 }}
          className="overflow-hidden mb-10"
        >
          <div className="bg-white border border-[#E5E5E0] rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-serif text-3xl mb-2 text-[#1A1A1A]">
              {isEdit ? "Edit your listing" : "Create a new listing"}
            </h2>
            <p className="text-[#6B7264] mb-8 text-sm">
              {isEdit ? "Update the details for this job posting." : "Find the talent that truly fits your team."}
            </p>

            <div className="space-y-6">
              <JobDetailsForm jobForm={jobForm} onChange={onChange} />
              <JobSkillsSelector skills={skills} jobForm={jobForm} onToggleSkill={onToggleSkill} />

              {/* ── Error banner ─────────────────────────────────── */}
              {error && (
                <div className="p-4 bg-[#FFF0F0] text-[#D67373] text-sm rounded-xl border border-[#FAD4D4] flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {/* ── Submit ───────────────────────────────────────── */}
              <div className="pt-4 border-t border-[#E5E5E0]">
                <button
                  onClick={onSubmit}
                  disabled={posting}
                  className="w-full py-3.5 bg-[#7C9070] hover:bg-[#687A5D] text-white rounded-xl font-medium transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                >
                  {posting && <LoaderIcon className="w-5 h-5 animate-spin" />}
                  {posting 
                    ? (isEdit ? "Saving changes..." : "Publishing listing...") 
                    : (isEdit ? "Save Changes" : "Publish Job Listing")
                  }
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
