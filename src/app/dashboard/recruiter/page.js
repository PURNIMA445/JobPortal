"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  getRecruiterProfile, getMyJobs, getNotifications,
  closeJob, createJob, getAllSkills,
} from "@/lib/api";

import DashboardHeader  from "@/components/dashboard/recruiter/DashboardHeader";
import StatsRow         from "@/components/dashboard/recruiter/StatsRow";
import PostJobForm      from "@/components/dashboard/recruiter/PostJobForm";
import JobList          from "@/components/dashboard/recruiter/JobList";
import ActivitySidebar  from "@/components/dashboard/recruiter/ActivitySidebar";
import { LoaderIcon }   from "@/components/dashboard/icons";

// ─── Initial form state ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "", description: "", location: "",
  jobType: "FULL_TIME", experienceLevel: "MID",
  salaryMin: "", salaryMax: "",
  companyId: null, requiredSkillIds: [],
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function RecruiterDashboard() {
  const router = useRouter();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [profile,       setProfile]       = useState(null);
  const [jobs,          setJobs]          = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [skills,        setSkills]        = useState([]);
  const [loading,       setLoading]       = useState(true);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm,     setJobForm]     = useState(EMPTY_FORM);
  const [posting,     setPosting]     = useState(false);
  const [error,       setError]       = useState(null);

  // ── Data fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      getRecruiterProfile(),
      getMyJobs(),
      getNotifications(),
      getAllSkills(),
    ])
      .then(([prof, jobList, notifs, skillList]) => {
        setProfile(prof);
        setJobs(jobList);
        setNotifications(notifs);
        setSkills(skillList);
        setJobForm((f) => ({ ...f, companyId: prof.company?.id }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  /** Update a single form field by key */
  const handleFormChange = (field, value) =>
    setJobForm((f) => ({ ...f, [field]: value }));

  /** Toggle a skill in/out of requiredSkillIds */
  const handleToggleSkill = (id) =>
    setJobForm((f) => ({
      ...f,
      requiredSkillIds: f.requiredSkillIds.includes(id)
        ? f.requiredSkillIds.filter((s) => s !== id)
        : [...f.requiredSkillIds, id],
    }));

  const handlePostJob = async () => {
    setPosting(true);
    setError(null);
    try {
      const posted = await createJob({
        ...jobForm,
        salaryMin: parseFloat(jobForm.salaryMin) || null,
        salaryMax: parseFloat(jobForm.salaryMax) || null,
      });
      setJobs((j) => [posted, ...j]);
      setShowJobForm(false);
      setJobForm((f) => ({ ...EMPTY_FORM, companyId: f.companyId }));
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    try {
      const updated = await closeJob(jobId);
      setJobs((j) => j.map((job) => (job.id === jobId ? updated : job)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; max-age=0; path=/";
    localStorage.clear();
    router.push("/login");
  };

  // ── Loading screen ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F4]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <LoaderIcon className="w-10 h-10 text-[#7C9070]" />
        </motion.div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────────
  const activeJobs = jobs.filter((j) => j.status === "OPEN").length;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#1C1F1A] font-sans pb-20 selection:bg-[#7C9070] selection:text-white">
      <div className="max-w-5xl mx-auto px-6 pt-12">

        <DashboardHeader
          profile={profile}
          showJobForm={showJobForm}
          onToggleForm={() => setShowJobForm((v) => !v)}
          onSettings={() => router.push("/recruiter/setup")}
          onLogout={handleLogout}
        />

        <StatsRow
          totalJobs={jobs.length}
          activeJobs={activeJobs}
          notificationCount={notifications.length}
        />

        <PostJobForm
          visible={showJobForm}
          jobForm={jobForm}
          skills={skills}
          posting={posting}
          error={error}
          onChange={handleFormChange}
          onToggleSkill={handleToggleSkill}
          onSubmit={handlePostJob}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <JobList
              jobs={jobs}
              onView={(id) => router.push(`/dashboard/recruiter/jobs/${id}/applicants`)}
              onClose={handleCloseJob}
              onPost={() => setShowJobForm(true)}
            />
          </div>
          <div className="lg:col-span-1">
            <ActivitySidebar notifications={notifications} />
          </div>
        </div>

      </div>
    </div>
  );
}