"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function CalibrationTeaser({
  selectedRole,
  setSelectedRole,
  prioritizeExp,
  setPrioritizeExp,
  prioritizeTech,
  setPrioritizeTech,
  handleCalibration,
  isScanning,
  mockCandidates
}) {
  return (
    <section className="py-20 px-6 bg-white relative z-20 border-t border-[#E8E1D5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#1C1F1A] mb-4">Experience the AI Advantage</h2>
          <p className="text-[#6B7264] max-w-2xl mx-auto text-lg">
            Adjust your hiring priorities below and watch our AI instantly parse, rank, and calibrate the talent pool.
          </p>
        </div>

        <div className="bg-[#FDFBF7] rounded-4xl shadow-sm border border-[#E8E1D5] overflow-hidden flex flex-col lg:flex-row">
          {/* CONTROL PANEL */}
          <div className="w-full lg:w-95 bg-white border-r border-[#E8E1D5] p-8 flex flex-col relative z-10">
            <h3 className="text-[11px] font-bold text-[#A3AEA0] uppercase tracking-widest mb-6">Calibration Controls</h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-[#1C1F1A] mb-2">Target Role</label>
                <select 
                  className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/50 appearance-none"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="UX Designer">UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-[#1C1F1A] mb-4">Screening Priorities</label>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#6B7264]">Prioritize Years of Exp.</span>
                  <button 
                    onClick={() => setPrioritizeExp(!prioritizeExp)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${prioritizeExp ? 'bg-[#7A8B6A]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${prioritizeExp ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7264]">Prioritize Tech Stack</span>
                  <button 
                    onClick={() => setPrioritizeTech(!prioritizeTech)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${prioritizeTech ? 'bg-[#7A8B6A]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${prioritizeTech ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E8E1D5]">
              <button 
                onClick={handleCalibration}
                disabled={isScanning}
                className="w-full py-4 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {isScanning ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <svg className="w-4 h-4 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </motion.div>
                    Calibrating AI...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-[#C8A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Test AI Calibration
                  </>
                )}
              </button>
            </div>
          </div>

          {/* APPLICANT POOL */}
          <div className="flex-1 p-8 md:p-10 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif font-medium text-[#1C1F1A]">Applicant Pool</h3>
              <span className="text-xs font-bold text-[#A3AEA0] bg-white border border-[#E8E1D5] px-3 py-1.5 rounded-full shadow-sm">
                Top 4 Matches
              </span>
            </div>

            <div className="relative min-h-100">
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-[#FDFBF7]/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center border border-[#E8E1D5]/50"
                  >
                    <div className="w-12 h-12 border-4 border-[#E8E1D5] border-t-[#7A8B6A] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#1C1F1A] font-serif font-medium">Re-ranking candidates...</p>
                    <p className="text-xs text-[#6B7264] mt-1">Applying new priority weights.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 relative z-10">
                <AnimatePresence>
                  {mockCandidates.map((candidate, index) => (
                    <motion.div 
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center gap-4 relative"
                    >
                      <div className="absolute -left-3 -top-3 w-7 h-7 bg-[#1C1F1A] text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm z-10">
                        {index + 1}
                      </div>

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-serif font-medium text-lg shrink-0 shadow-inner ${candidate.color}`}>
                        {candidate.avatar}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-[#1C1F1A] text-base leading-tight mb-1">{candidate.name}</h4>
                        <p className="text-xs text-[#6B7264]">{candidate.role}</p>
                      </div>

                      <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-[#FDFBF7] border border-[#E8E1D5] rounded-lg flex flex-col items-center justify-center w-20">
                          <span className="text-sm font-bold text-[#1C1F1A] leading-none">{candidate.exp}</span>
                          <span className="text-[9px] text-[#A3AEA0] uppercase font-bold tracking-wider mt-1">Years</span>
                        </div>
                        <div className="px-3 py-1.5 bg-[#F0F2EB] border border-[#E2E6DD] rounded-lg flex flex-col items-center justify-center w-20">
                          <span className="text-sm font-bold text-[#5C7356] leading-none">{candidate.techMatch}%</span>
                          <span className="text-[9px] text-[#5C7356]/70 uppercase font-bold tracking-wider mt-1">Match</span>
                        </div>
                      </div>

                      <div className="relative group/tooltip shrink-0 self-start sm:self-center">
                        <div className="cursor-help px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-500 hover:text-[#7A8B6A] hover:border-[#7A8B6A]/30 transition-colors flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Why this rank?
                        </div>
                        
                        <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#1C1F1A] text-white p-4 rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 origin-bottom-right translate-y-2 group-hover/tooltip:translate-y-0 duration-200">
                          <div className="text-[10px] uppercase tracking-widest text-[#A3AEA0] font-bold mb-1.5">AI Reasoning</div>
                          <p className="text-xs leading-relaxed text-gray-200">{candidate.notes}</p>
                          <div className="absolute top-full right-6 w-3 h-3 bg-[#1C1F1A] transform rotate-45 -mt-1.5"></div>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
