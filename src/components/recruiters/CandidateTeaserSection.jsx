"use client";

import Link from "next/link";

export default function CandidateTeaserSection({ userRole, loading, candidates, activeJob, aiAnalysis }) {
  
  const getMatchLevel = (score) => {
    if (score >= 90) return { label: "Excellent Match", color: "bg-green-100 text-green-800 border-green-200" };
    if (score >= 70) return { label: "Strong Match", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (score >= 50) return { label: "Moderate Match", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    if (score >= 30) return { label: "Weak Match", color: "bg-orange-100 text-orange-800 border-orange-200" };
    return { label: "Poor Match", color: "bg-red-100 text-red-800 border-red-200" };
  };

  return (
    <section className="pt-24 pb-24 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-6">
        
        {userRole === "RECRUITER" ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">
                {activeJob ? "AI Recommended Candidates" : "Discover Top Talent"}
              </h2>
              <p className="text-[#6B7264] text-lg max-w-2xl mx-auto">
                {activeJob 
                  ? `These candidates have been ranked by our AI for your active role: ${activeJob.title}.`
                  : "These elite professionals are currently active on our platform and open to new opportunities."}
              </p>
            </div>

            {aiAnalysis && (
              <div className="max-w-3xl mx-auto mb-12 bg-white rounded-2xl border border-[#E8E1D5] p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#1C1F1A] text-lg mb-1">Candidate Matching Summary</h3>
                  <p className="text-sm text-[#6B7264]">
                    Analyzed {aiAnalysis.totalAnalyzed} applicants against <strong>{activeJob?.title}</strong>
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#7A8B6A]">{aiAnalysis.strongMatches}</div>
                    <div className="text-xs text-[#A3AEA0] font-medium uppercase tracking-wider">Strong Matches</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#1C1F1A]">{aiAnalysis.highestScore}%</div>
                    <div className="text-xs text-[#A3AEA0] font-medium uppercase tracking-wider">Highest Match</div>
                  </div>
                </div>
              </div>
            )}

            {aiAnalysis && aiAnalysis.highestScore < 70 && candidates.length > 0 && (
              <div className="max-w-3xl mx-auto mb-12 bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-yellow-800 flex gap-4 items-center">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold">No Strong Match Found</h4>
                  <p className="text-sm">The highest score is {aiAnalysis.highestScore}%. The candidates below may lack core requirements, but you can still review them.</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-[#E8E1D5] border-t-[#7A8B6A] rounded-full animate-spin"></div>
              </div>
            ) : candidates.length === 0 ? (
               <div className="text-center py-16 text-[#6B7264] bg-white border border-[#E8E1D5] rounded-3xl shadow-sm max-w-2xl mx-auto">
                 <div className="w-16 h-16 bg-[#F9F8F4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8E1D5]">
                   <svg className="w-8 h-8 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                   </svg>
                 </div>
                 <p className="font-medium text-[#1C1F1A]">No public profiles available right now.</p>
                 <p className="text-sm mt-1">Candidates are joining daily. Check back soon.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {candidates.slice(0, 9).map((candidate) => {
                  const match = candidate.aiMatch;
                  const scoreInfo = match ? getMatchLevel(match.score) : null;

                  return (
                    <div key={candidate.id} className="bg-white p-8 rounded-3xl border border-[#E8E1D5] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col h-full">
                      
                      {match && (
                        <div className="mb-5 flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${scoreInfo.color}`}>
                            {scoreInfo.label}
                          </div>
                          <div className="text-xl font-black text-[#1C1F1A]">
                            {match.score}%
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-5 mb-5">
                        <div className="w-16 h-16 bg-[#7A8B6A] text-white rounded-full flex items-center justify-center font-serif text-2xl shadow-sm shrink-0">
                          {candidate.fullName ? candidate.fullName.charAt(0) : "C"}
                        </div>
                        <div>
                          <h3 className="font-serif font-medium text-xl text-[#1C1F1A] group-hover:text-[#7A8B6A] transition-colors">{candidate.fullName}</h3>
                          <p className="text-sm text-[#6B7264] flex items-center gap-1.5 mt-1">
                            <svg className="w-4 h-4 text-[#A3AEA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {candidate.location || "Remote"}
                          </p>
                        </div>
                      </div>
                      
                      {match && activeJob && (
                        <p className="text-xs text-[#A3AEA0] font-medium uppercase tracking-wider mb-2">
                          Matched Job: {activeJob.title}
                        </p>
                      )}

                      <p className="text-sm text-[#1C1F1A] mb-6 line-clamp-3 leading-relaxed grow">
                        {candidate.bio || "Experienced professional seeking new opportunities in a dynamic environment."}
                      </p>

                      <div className="mb-8 pt-4 border-t border-[#F9F8F4]">
                        <p className="text-[10px] font-bold text-[#A3AEA0] mb-3 uppercase tracking-widest">Verified Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills?.slice(0, 3).map(skill => (
                            <span key={skill.id} className="px-3 py-1.5 bg-[#F9F8F4] text-[#6B7264] text-xs font-medium rounded-lg border border-[#E8E1D5]">
                              {skill.name}
                            </span>
                          ))}
                          {candidate.skills?.length > 3 && (
                            <span className="px-3 py-1.5 bg-white text-[#A3AEA0] text-xs font-medium rounded-lg border border-[#E8E1D5] border-dashed">
                              +{candidate.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <Link href={`/dashboard/recruiter/candidate/${candidate.id}`} className="mt-auto">
                        <button className="w-full py-3.5 bg-white border border-[#E8E1D5] group-hover:bg-[#FDFBF7] group-hover:border-[#7A8B6A] group-hover:text-[#7A8B6A] text-[#1C1F1A] font-medium rounded-xl transition-all shadow-sm">
                          View Full Profile
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">Vetted Talent</h2>
              <p className="text-[#6B7264] text-lg max-w-2xl mx-auto">To protect candidate privacy, full profiles are hidden until you create a verified employer account. Here is a preview of our active talent.</p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Teaser Card 1 */}
                <div className="bg-white p-8 rounded-3xl border border-[#7A8B6A] shadow-sm relative overflow-hidden flex flex-col h-full">
                  <div className="flex items-center gap-5 mb-6 select-none opacity-60">
                    <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 filter blur-sm"></div>
                    <div className="flex-1 filter blur-sm">
                      <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <h3 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">Software Engineer</h3>
                  <p className="text-sm text-[#6B7264] mb-6 flex gap-3 font-medium">
                    <span>📍 San Francisco, CA</span>
                    <span>💼 5+ Years Exp.</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">React</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">Node.js</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">TypeScript</span>
                  </div>
                </div>

                {/* Teaser Card 2 */}
                <div className="bg-white p-8 rounded-3xl border border-[#7A8B6A] shadow-sm relative overflow-hidden flex flex-col h-full">
                  <div className="flex items-center gap-5 mb-6 select-none opacity-60">
                    <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 filter blur-sm"></div>
                    <div className="flex-1 filter blur-sm">
                      <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <h3 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">Product Designer</h3>
                  <p className="text-sm text-[#6B7264] mb-6 flex gap-3 font-medium">
                    <span>📍 London, UK</span>
                    <span>💼 4+ Years Exp.</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">Figma</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">UI/UX</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">Prototyping</span>
                  </div>
                </div>

                {/* Teaser Card 3 */}
                <div className="bg-white p-8 rounded-3xl border border-[#7A8B6A] shadow-sm relative overflow-hidden flex flex-col h-full">
                  <div className="flex items-center gap-5 mb-6 select-none opacity-60">
                    <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0 filter blur-sm"></div>
                    <div className="flex-1 filter blur-sm">
                      <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <h3 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">DevOps Engineer</h3>
                  <p className="text-sm text-[#6B7264] mb-6 flex gap-3 font-medium">
                    <span>📍 Remote</span>
                    <span>💼 6+ Years Exp.</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">AWS</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">Docker</span>
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-semibold">Kubernetes</span>
                  </div>
                </div>
              </div>

              {/* Blurred Overlay for unauthorized users */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent flex items-end justify-center pb-8">
                <div className="bg-white/80 backdrop-blur-md border border-[#7A8B6A] p-8 rounded-3xl shadow-xl text-center max-w-md mx-6">
                  <h4 className="font-serif font-medium text-xl text-[#1C1F1A] mb-2">Unlock Vetted Candidate Directory</h4>
                  <p className="text-sm text-[#6B7264] mb-5">Create a recruiter account to view full profiles, search by custom skills, and contact talent directly.</p>
                  <Link href="/get-started/recruiter">
                    <button className="px-8 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white text-sm font-semibold rounded-xl transition-all shadow-md">
                      Get Started as Recruiter
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
