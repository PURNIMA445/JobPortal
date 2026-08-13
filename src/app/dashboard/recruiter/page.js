"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  getRecruiterProfile, getCompanyJobs, getNotifications,
  closeJob, createJob, getAllSkills,
} from "@/lib/api";

import {
  DashboardHeader,
  PostJobForm,
  JobList,
  LeftSidebar,
  RightSidebar
} from "@/components/dashboard/recruiter";
import { LoaderIcon } from "@/components/dashboard/icons";

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
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState(EMPTY_FORM);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  // ── Data fetch ───────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      getRecruiterProfile(),
      getCompanyJobs(),
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
    if (!profile?.company) {
      setError("Please link or register your company in the setup page before posting jobs.");
      return;
    }
    if (profile.company.status !== "APPROVED") {
      setError("Your company is not verified yet. You cannot post jobs.");
      return;
    }
    if (profile.companyJoinStatus !== "APPROVED") {
      setError("Your request to join this company is not yet approved. You cannot post jobs.");
      return;
    }

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Sidebar */}
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      {/* Center Content */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
        <DashboardHeader
          profile={profile}
          showJobForm={showJobForm}
          onToggleForm={() => setShowJobForm((v) => !v)}
          onSettings={() => router.push("/recruiter/setup")}
          onLogout={handleLogout}
        />

        {profile?.company?.status === "PENDING_VERIFICATION" && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="text-amber-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-amber-800 font-semibold text-sm mb-1">Company Pending Verification</h3>
              <p className="text-amber-700 text-xs leading-relaxed">
                Your company profile is currently being reviewed by our admin team. You cannot post new jobs or invite team members until verification is complete.
              </p>
            </div>
          </div>
        )}

        {profile?.companyJoinStatus === "PENDING" && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="text-amber-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-amber-800 font-semibold text-sm mb-1">Membership Pending Verification</h3>
              <p className="text-amber-700 text-xs leading-relaxed">
                Your request to join this company is pending verification by the company admin. You cannot post new jobs until you are approved.
              </p>
            </div>
          </div>
        )}

        {profile?.companyJoinStatus === "REJECTED" && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="text-red-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold text-sm mb-1">Membership Request Rejected</h3>
              <p className="text-red-700 text-xs leading-relaxed">
                Your request to join this company was rejected by the company admin. Please update your company details in the settings page.
              </p>
            </div>
          </div>
        )}

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

        <JobList
          jobs={jobs}
          profile={profile}
          onView={(id) => router.push(`/dashboard/recruiter/jobs/${id}/applicants`)}
          onClose={handleCloseJob}
          onPost={() => setShowJobForm(true)}
        />
      </div>

      {/* Right Sidebar */}
      <div className="col-span-1 lg:col-span-3 xl:col-span-3">
        <RightSidebar
          totalJobs={jobs.length}
          activeJobs={activeJobs}
          notifications={notifications}
          profile={profile}
        />
      </div>
    </div>
  );
}