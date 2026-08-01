"use client";

import ResumeUploadBlock from "./ResumeUploadBlock";
import ApplyFormBlock from "./ApplyFormBlock";
import MatchScoreBlock from "./MatchScoreBlock";

/**
 * Orchestrates the right-hand action panel on the job detail page.
 * State and handlers all come from CandidateJobView via props.
 * UI is delegated to 3 focused sub-components:
 *   - ResumeUploadBlock  — prompt to upload CV when none exists
 *   - ApplyFormBlock     — cover letter form + submit button
 *   - MatchScoreBlock    — AI CV-match score card (post-application)
 */
export default function CandidateActions({
  job,
  hasResume,
  applied,
  saved,
  handleSave,
  success,
  error,
  uploadingResume,
  setResumeUploadFile,
  handleUploadResumeThenShowApply,
  showApplyForm,
  setShowApplyForm,
  coverLetter,
  setCoverLetter,
  handleApply,
  applying,
  checkingScore,
  handleCheckScore,
  scoreResult,
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Status banners */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-4 rounded-2xl text-sm font-semibold flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-4 rounded-2xl text-sm font-semibold flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Main Action Card */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-serif font-medium text-gray-900 mb-6">
          Interested in this role?
        </h3>

        {!applied && job.status === "OPEN" && (
          <div className="flex flex-col gap-5">
            {/* Save button */}
            <button
              onClick={handleSave}
              className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                saved
                  ? "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  : "bg-white text-[#7A8B6A] border-2 border-[#7A8B6A] hover:bg-[#FDFBF7]"
              }`}
            >
              <svg className={`w-5 h-5 ${saved ? "fill-current" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {saved ? "Job Saved to Profile" : "Save for Later"}
            </button>

            {/* Resume upload or apply form */}
            {!hasResume ? (
              <ResumeUploadBlock
                uploadingResume={uploadingResume}
                setResumeUploadFile={setResumeUploadFile}
                handleUploadResumeThenShowApply={handleUploadResumeThenShowApply}
              />
            ) : (
              <div className="mt-2 flex flex-col gap-4">
                <ApplyFormBlock
                  showApplyForm={showApplyForm}
                  setShowApplyForm={setShowApplyForm}
                  coverLetter={coverLetter}
                  setCoverLetter={setCoverLetter}
                  handleApply={handleApply}
                  applying={applying}
                />
              </div>
            )}
          </div>
        )}

        {/* Already Applied State */}
        {applied && (
          <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 rounded-3xl p-6 text-center mt-2 shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-serif text-lg font-medium text-gray-900 mb-2">Application Submitted</h4>
            <p className="text-sm text-gray-500 px-4">
              You have successfully applied for this position. The recruiter will review your profile.
            </p>
          </div>
        )}
      </div>

      {/* AI Match Score Card (only shown after applying) */}
      {applied && (
        <MatchScoreBlock
          hasResume={hasResume}
          scoreResult={scoreResult}
          checkingScore={checkingScore}
          handleCheckScore={handleCheckScore}
          uploadingResume={uploadingResume}
          setResumeUploadFile={setResumeUploadFile}
          handleUploadResumeThenShowApply={handleUploadResumeThenShowApply}
        />
      )}
    </div>
  );
}
