"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoaderIcon } from "@/components/dashboard/icons";
import { getRecruiterProfile } from "@/lib/services/recruiter.service";
import { getAllSkills } from "@/lib/services/common.service";
import useJobForm from "@/hooks/useJobForm";
import PostJobForm from "@/components/dashboard/recruiter/PostJobForm";

export default function CreateJobPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const jobFormHook = useJobForm(
    profile?.company?.id,
    () => {
      // Redirect to main dashboard after posting
      router.push("/dashboard/recruiter");
    }
  );

  useEffect(() => {
    Promise.all([getRecruiterProfile(), getAllSkills()])
      .then(([prof, skillList]) => {
        setProfile(prof);
        setSkills(skillList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FDFBF7]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <LoaderIcon className="w-10 h-10 text-[#7A8B6A]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <PostJobForm
        visible={true}
        jobForm={jobFormHook.jobForm}
        skills={skills}
        posting={jobFormHook.posting}
        error={jobFormHook.error}
        onChange={jobFormHook.handleFormChange}
        onToggleSkill={jobFormHook.handleToggleSkill}
        onSubmit={jobFormHook.handlePostJob}
      />
    </div>
  );
}
