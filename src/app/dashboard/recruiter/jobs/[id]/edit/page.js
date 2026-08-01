"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoaderIcon } from "@/components/dashboard/icons";
import { getJob, updateJob } from "@/lib/services/job.service";
import { getAllSkills } from "@/lib/services/common.service";
import PostJobForm from "@/components/dashboard/recruiter/PostJobForm";

export default function EditJobPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    salaryMin: "",
    salaryMax: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    companyId: null,
    requiredSkillIds: [],
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getJob(jobId), getAllSkills()])
      .then(([job, skillList]) => {
        setJobForm({
          title: job.title || "",
          description: job.description || "",
          location: job.location || "",
          jobType: job.jobType || "FULL_TIME",
          experienceLevel: job.experienceLevel || "MID",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          responsibilities: job.responsibilities || "",
          requirements: job.requirements || "",
          benefits: job.benefits || "",
          companyId: job.company?.id || null,
          requiredSkillIds: job.requiredSkills?.map((s) => s.id) || [],
        });
        setSkills(skillList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleFormChange = (field, value) => {
    setJobForm((f) => ({ ...f, [field]: value }));
  };

  const handleToggleSkill = (id) => {
    setJobForm((f) => ({
      ...f,
      requiredSkillIds: f.requiredSkillIds.includes(id)
        ? f.requiredSkillIds.filter((s) => s !== id)
        : [...f.requiredSkillIds, id],
    }));
  };

  const handleUpdateJob = async () => {
    setPosting(true);
    setError(null);
    try {
      await updateJob(jobId, {
        ...jobForm,
        salaryMin: parseFloat(jobForm.salaryMin) || null,
        salaryMax: parseFloat(jobForm.salaryMax) || null,
      });
      router.push("/dashboard/recruiter");
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

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
        jobForm={jobForm}
        skills={skills}
        posting={posting}
        error={error}
        onChange={handleFormChange}
        onToggleSkill={handleToggleSkill}
        onSubmit={handleUpdateJob}
        isEdit={true}
      />
    </div>
  );
}
