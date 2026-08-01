"use client";

import { useState, useEffect } from "react";
import {
  getJobApplications,
  updateApplicationStatus,
  getApplicationCv,
} from "@/lib/api";
import JobHeader from "./JobHeader";
import JobDescription from "./JobDescription";
import RecruiterApplicationsList from "./RecruiterApplicationsList";

export default function RecruiterJobView({ job }) {
  const [applications, setApplications] = useState([]);
  const [cvLoadingId, setCvLoadingId] = useState(null);
  const [cvErrorId, setCvErrorId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJobApplications(job.id)
      .then(setApplications)
      .catch(console.error);
  }, [job.id]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const updated = await updateApplicationStatus(applicationId, status);
      setApplications((apps) =>
        apps.map((app) => (app.id === applicationId ? updated : app))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewCv = async (applicationId) => {
    setCvErrorId(null);
    setCvLoadingId(applicationId);
    try {
      const blob = await getApplicationCv(applicationId);
      const objectUrl = URL.createObjectURL(blob);
      const newTab = window.open(objectUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      if (!newTab) {
        setCvErrorId({
          id: applicationId,
          message: "Popup blocked — allow popups to view the CV.",
        });
      }
    } catch (err) {
      const message =
        err.status === 404
          ? "This candidate hasn't uploaded a resume yet."
          : err.status === 403
          ? "You don't have access to this candidate's CV."
          : err.message || "Failed to load CV.";
      setCvErrorId({ id: applicationId, message });
    } finally {
      setCvLoadingId(null);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Job Info */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <JobHeader job={job} />
          <JobDescription job={job} />
        </div>

        {/* Right Column: Actions */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-sm sticky top-8">
            <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">
              Recruiter Tools
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You are viewing this job as a recruiter.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-[#7A8B6A] bg-[#EEF4EC] p-3 rounded-xl border border-[#C2D9BE]">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {applications.length} Candidate(s) Applied
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {/* Recruiter full width block below */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <RecruiterApplicationsList
          applications={applications}
          handleStatusUpdate={handleStatusUpdate}
          handleViewCv={handleViewCv}
          cvLoadingId={cvLoadingId}
          cvErrorId={cvErrorId}
        />
      </div>
    </>
  );
}
