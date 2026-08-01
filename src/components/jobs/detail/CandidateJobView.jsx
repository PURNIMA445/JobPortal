"use client";

import { useState, useEffect } from "react";
import {
  applyToJob,
  checkMyScore,
  getMyApplications,
  uploadResume,
  getCandidateProfile,
} from "@/lib/api";
import { useSavedJobs } from "@/context/SavedJobsContext";
import JobHeader from "./JobHeader";
import JobDescription from "./JobDescription";
import CandidateActions from "./CandidateActions";

export default function CandidateJobView({ job }) {
  const { isSaved, toggleSaveJob } = useSavedJobs();
  const [applied, setApplied] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeUploadFile, setResumeUploadFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [myApplication, setMyApplication] = useState(null);
  const [checkingScore, setCheckingScore] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getCandidateProfile()
      .then((prof) => {
        setHasResume(!!prof.resumeUrl);
      })
      .catch(console.error);

    getMyApplications()
      .then((apps) => {
        const existing = apps.find((a) => a.job.id === parseInt(job.id));
        if (existing) {
          setMyApplication(existing);
          setApplied(true);
          if (existing.matchScore) {
            setScoreResult({
              matchScore: existing.matchScore,
              missingSkills: existing.missingSkills
                ? existing.missingSkills.split(",")
                : [],
              matchedSkills: [],
              suggestions: [],
            });
          }
        }
      })
      .catch(console.error);
  }, [job.id]);

  const handleApply = async () => {
    setApplying(true);
    setError(null);
    try {
      const result = await applyToJob(job.id, coverLetter);
      setApplied(true);
      setShowApplyForm(false);
      setSuccess("Application submitted successfully!");
      setMyApplication(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    await toggleSaveJob(job.id);
  };

  const handleUploadResumeThenShowApply = async () => {
    if (!resumeUploadFile) return setError("Please select a resume file");
    setUploadingResume(true);
    setError(null);
    try {
      await uploadResume(resumeUploadFile);
      setHasResume(true);
      setSuccess("Resume uploaded! You can now apply for this job.");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleCheckScore = async () => {
    setCheckingScore(true);
    setError(null);
    try {
      const result = await checkMyScore(myApplication.id);
      setScoreResult(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCheckingScore(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
      {/* Left Column: Job Info */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <JobHeader job={job} />
        <JobDescription job={job} />
      </div>

      {/* Right Column: Actions */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <CandidateActions
          job={job}
          hasResume={hasResume}
          applied={applied}
          saved={isSaved(job.id)}
          handleSave={handleSave}
          success={success}
          error={error}
          uploadingResume={uploadingResume}
          setResumeUploadFile={setResumeUploadFile}
          handleUploadResumeThenShowApply={handleUploadResumeThenShowApply}
          showApplyForm={showApplyForm}
          setShowApplyForm={setShowApplyForm}
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          handleApply={handleApply}
          applying={applying}
          checkingScore={checkingScore}
          handleCheckScore={handleCheckScore}
          scoreResult={scoreResult}
        />
      </div>
    </div>
  );
}
