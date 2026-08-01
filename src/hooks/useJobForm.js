import { useState } from "react";
import { createJob } from "@/lib/services/job.service";

const EMPTY_FORM = {
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
};

export default function useJobForm(companyId, onJobCreated) {
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({ ...EMPTY_FORM, companyId });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  // Sync companyId if it loads later
  if (companyId && jobForm.companyId === null) {
    setJobForm((prev) => ({ ...prev, companyId }));
  }

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

  const handlePostJob = async () => {
    setPosting(true);
    setError(null);
    try {
      const posted = await createJob({
        ...jobForm,
        salaryMin: parseFloat(jobForm.salaryMin) || null,
        salaryMax: parseFloat(jobForm.salaryMax) || null,
      });

      if (onJobCreated) {
        onJobCreated(posted);
      }

      setShowJobForm(false);
      setJobForm({ ...EMPTY_FORM, companyId });
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return {
    showJobForm,
    setShowJobForm,
    jobForm,
    posting,
    error,
    handleFormChange,
    handleToggleSkill,
    handlePostJob,
  };
}
