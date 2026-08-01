"use client";

/**
 * Shown when the candidate has a resume but has NOT yet applied.
 * Renders the "Apply for this Job" button and the cover letter form.
 */
export default function ApplyFormBlock({
  showApplyForm,
  setShowApplyForm,
  coverLetter,
  setCoverLetter,
  handleApply,
  applying,
}) {
  if (!showApplyForm) {
    return (
      <button
        onClick={() => setShowApplyForm(true)}
        className="w-full py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        Apply for this Job
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#7A8B6A]" />
      <div className="flex items-center justify-between mb-5 mt-2">
        <h4 className="font-serif text-lg font-medium text-gray-900">Your Application</h4>
        <button
          onClick={() => setShowApplyForm(false)}
          className="w-8 h-8 rounded-full bg-white border border-[#E8E1D5] flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 ml-1">
        Cover Letter (Optional)
      </label>
      <textarea
        className="w-full px-5 py-4 bg-white border border-[#E8E1D5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] transition-all text-sm mb-5 h-40 resize-none shadow-sm"
        placeholder="Tell the recruiter why you're a great fit for this specific role..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />
      <button
        onClick={handleApply}
        disabled={applying}
        className="w-full py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
      >
        {applying ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Submit Application
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
