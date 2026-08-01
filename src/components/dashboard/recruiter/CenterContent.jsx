"use client";

import React from "react";
import PostJobForm from "@/components/dashboard/recruiter/PostJobForm";
import JobList from "@/components/dashboard/recruiter/JobList";

export default function CenterContent({ 
  profile, 
  jobs, 
  skills,
  jobFormHook,
  handleCloseJob,
  router
}) {
  const {
    showJobForm,
    setShowJobForm,
    jobForm,
    posting,
    error,
    handleFormChange,
    handleToggleSkill,
    handlePostJob
  } = jobFormHook;

  return (
    <div className="flex flex-col gap-8">
       {/* Greeting */}
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1A1A1A] mb-2">
          Good Morning, {profile?.fullName?.split(' ')[0] || "Recruiter"}
        </h1>
        <p className="text-lg text-[#6B7264]">
          Here is what's happening with your job postings today.
        </p>
      </div>

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
        onView={(id) => router.push(`/dashboard/recruiter/jobs/${id}/applicants`)}
        onClose={handleCloseJob}
        onPost={() => setShowJobForm(true)}
      />
    </div>
  );
}
