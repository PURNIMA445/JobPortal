"use client";

/**
 * Shown when the candidate has NOT yet uploaded a resume.
 * Renders the file picker + upload button.
 */
export default function ResumeUploadBlock({ uploadingResume, setResumeUploadFile, handleUploadResumeThenShowApply }) {
  return (
    <div className="bg-gradient-to-b from-[#FDFBF7] to-white border border-[#E8E1D5] rounded-3xl p-6 text-center mt-2 shadow-sm">
      <div className="w-16 h-16 bg-[#EEF4EC] text-[#7A8B6A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#C2D9BE]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h4 className="font-serif text-lg font-medium text-gray-900 mb-2">Resume Required</h4>
      <p className="text-sm text-gray-500 mb-6 px-2 leading-relaxed">
        You must upload a CV to unlock the application for this job.
      </p>
      <div className="relative group mb-5">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7A8B6A] to-[#A3AEA0] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeUploadFile(e.target.files[0])}
          className="relative block w-full text-sm text-gray-500 bg-white file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#EEF4EC] file:text-[#7A8B6A] hover:file:bg-[#C2D9BE] border border-[#E8E1D5] rounded-2xl p-1.5 cursor-pointer"
        />
      </div>
      <button
        onClick={handleUploadResumeThenShowApply}
        disabled={uploadingResume}
        className="w-full py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {uploadingResume ? "Uploading..." : "Upload CV & Continue"}
      </button>
    </div>
  );
}
