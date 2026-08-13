"use client";

/**
 * Shown after a candidate has applied.
 * Displays the AI Match Score card with the option to calculate/view score.
 * Also handles the edge case where the resume hasn't been uploaded yet.
 */
export default function MatchScoreBlock({
  hasResume,
  scoreResult,
  checkingScore,
  handleCheckScore,
  uploadingResume,
  setResumeUploadFile,
  handleUploadResumeThenShowApply,
}) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/50 rounded-3xl p-1 shadow-md relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-700" />

      <div className="bg-white/80 backdrop-blur-xl rounded-[1.6rem] p-6 md:p-8 relative">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif font-medium text-gray-900">AI Match Score</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
          Match your CV with the Job Description (JD) to see how well you fit this role.
        </p>

        {scoreResult ? (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm">
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-5xl font-serif font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-none">
                {scoreResult.matchScore}%
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1.5">Match</span>
            </div>

            {/* Matched Skills */}
            {scoreResult.matchedSkills?.length > 0 && (
              <div className="mb-6">
                <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Matched Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                  {scoreResult.matchedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 shadow-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {scoreResult.missingSkills?.length > 0 && (
              <div className="mb-6">
                <h5 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Missing Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                  {scoreResult.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100 shadow-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Relevance */}
            {(scoreResult.experienceMatch || scoreResult.projectRelevance) && (
              <div className="mb-6 space-y-4">
                {scoreResult.experienceMatch && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">Experience</h5>
                    <p className="text-sm text-gray-700">{scoreResult.experienceMatch}</p>
                  </div>
                )}
                {scoreResult.projectRelevance && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">Analysis</h5>
                    <p className="text-sm text-gray-700">{scoreResult.projectRelevance}</p>
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            {scoreResult.suggestions?.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Suggestions for Improvement
                </h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {scoreResult.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : !hasResume ? (
          <div className="bg-white/60 rounded-2xl p-5 border border-indigo-100 text-center">
            <p className="text-sm text-gray-600 mb-4 font-medium">
              You need to upload your CV first to calculate your Match Score.
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeUploadFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#EEF4EC] file:text-[#7A8B6A] hover:file:bg-[#C2D9BE] border border-[#E8E1D5] rounded-xl p-1 mb-3 cursor-pointer"
            />
            <button
              onClick={handleUploadResumeThenShowApply}
              disabled={uploadingResume}
              className="w-full py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {uploadingResume ? "Uploading CV..." : "Upload CV"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheckScore}
            disabled={checkingScore}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {checkingScore ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing CV...
              </>
            ) : (
              <>
                Calculate Match Score
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
