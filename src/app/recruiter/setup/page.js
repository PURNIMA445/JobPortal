"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRecruiterSetup } from "@/hooks/useRecruiterSetup";
import CompanyForm from "@/components/profile/CompanyForm";
import { INPUT_CLASS as inputClass, LABEL_CLASS as labelClass } from "@/constants/styles";


export default function RecruiterSetupPage() {
  const router = useRouter();
  const {
    loading,
    error,
    successMessage,
    companySearch,
    setCompanySearch,
    companyResults,
    selectedCompany,
    setSelectedCompany,
    creatingCompany,
    setCreatingCompany,
    newCompany,
    setNewCompany,
    form,
    setForm,
    handleCompanySearch,
    selectCompany,
    handleCreateCompany,
    handleSubmit
  } = useRecruiterSetup(router);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center py-12 px-4 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#7A8B6A]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#7A8B6A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-[#E8E1D5]/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-[#7A8B6A]/5 p-8 md:p-10 border border-[#E8E1D5] relative z-10"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#EEF4EC] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#C2D9BE]">
            <svg className="w-8 h-8 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Complete your Profile</h1>
          <p className="text-[#6B7264]">Set up your recruiter profile and link your company to start posting jobs.</p>
        </div>

        <div className="space-y-8">
          {/* PERSONAL DETAILS */}
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E1D5]">
            <h2 className="text-lg font-serif font-medium text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Details
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                  <input 
                    className={inputClass} 
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="E.g. John Doe" 
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input 
                    className={inputClass} 
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="E.g. +1 234 567 890" 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Job Title / Designation</label>
                <input 
                  className={inputClass} 
                  value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. Hiring Manager, HR Director" 
                />
              </div>
            </div>
          </div>

          {/* COMPANY SECTION */}
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#E8E1D5]">
            <h2 className="text-lg font-serif font-medium text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#7A8B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company Affiliation
            </h2>
            
            <div>
              <label className={labelClass}>Link your Company <span className="text-red-400">*</span></label>
              
              {!selectedCompany ? (
                <div className="relative z-20">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      className={`${inputClass} pl-11`}
                      value={companySearch}
                      onChange={e => handleCompanySearch(e.target.value)}
                      placeholder="Search for your company name..." 
                    />
                  </div>
                  
                  {/* SEARCH RESULTS DROPDOWN */}
                  <AnimatePresence>
                    {companyResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute w-full mt-2 bg-white border border-[#E8E1D5] rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto"
                      >
                        {companyResults.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => selectCompany(c)}
                            className="px-5 py-3.5 hover:bg-[#FDFBF7] cursor-pointer border-b border-[#E8E1D5]/50 last:border-0 transition-colors flex items-center gap-3"
                          >
                            {c.logoUrl ? (
                              <img src={c.logoUrl} alt={c.name} className="w-8 h-8 rounded-md object-contain bg-white border border-[#E8E1D5]" />
                            ) : (
                              <div className="w-8 h-8 rounded-md bg-[#EEF4EC] text-[#3D6B36] font-bold flex items-center justify-center text-xs">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 leading-tight">{c.name}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{c.industry || "General"} • {c.location || "Anywhere"}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}

              {selectedCompany && (
                <div className="flex items-center justify-between bg-white border border-emerald-200 p-4 rounded-xl shadow-sm mt-2">
                  <div className="flex items-center gap-4">
                    {selectedCompany.logoUrl ? (
                      <img src={selectedCompany.logoUrl} alt={selectedCompany.name} className="w-12 h-12 rounded-xl object-contain bg-white border border-emerald-100 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-[#EEF4EC] rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                        <span className="font-serif font-bold text-xl">{selectedCompany.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Linked to Team
                      </p>
                      <p className="font-semibold text-gray-900">{selectedCompany.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCompany(null);
                      setForm(f => ({ ...f, companyId: null }));
                      setCompanySearch("");
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors border border-gray-200"
                  >
                    Change
                  </button>
                </div>
              )}

              {!selectedCompany && !creatingCompany && (
                <button 
                  onClick={() => setCreatingCompany(true)}
                  className="mt-4 text-sm text-[#7A8B6A] font-semibold hover:text-[#687A5D] transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Can't find your company? Register it here.
                </button>
              )}

              {/* CREATE COMPANY INLINE FORM */}
              <AnimatePresence>
                {creatingCompany && !selectedCompany && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <CompanyForm
                      newCompany={newCompany}
                      setNewCompany={setNewCompany}
                      handleCreateCompany={handleCreateCompany}
                      setCreatingCompany={setCreatingCompany}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl border border-emerald-200 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 text-rose-700 text-sm font-medium rounded-xl border border-rose-200 flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <div className="pt-2">
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="w-full bg-[#7A8B6A] hover:bg-[#687A5D] disabled:opacity-70 text-white py-4 rounded-xl font-medium transition-all shadow-md shadow-[#7A8B6A]/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
              ) : (
                <>Save Profile & Continue <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}