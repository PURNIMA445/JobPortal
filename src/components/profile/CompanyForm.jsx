"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { uploadImage } from "@/lib/api";

const inputClass = "w-full px-4 py-3 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] transition-all text-sm";
const labelClass = "block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1";
const sectionClass = "p-5 bg-white border border-[#E8E1D5] rounded-2xl shadow-sm space-y-4 mb-4";
const sectionTitleClass = "text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-2 border-b border-[#E8E1D5] pb-2";

export default function CompanyForm({
  newCompany,
  setNewCompany,
  handleCreateCompany,
  setCreatingCompany
}) {
  const [perkInput, setPerkInput] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }

    try {
      setUploadingLogo(true);
      const data = await uploadImage(file);
      if (data && data.url) {
        setNewCompany(c => ({ ...c, logoUrl: data.url }));
      }
    } catch (err) {
      alert(err.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddPerk = (e) => {
    e.preventDefault();
    if (perkInput.trim() && !newCompany.perks.includes(perkInput.trim())) {
      setNewCompany(c => ({ ...c, perks: [...c.perks, perkInput.trim()] }));
      setPerkInput("");
    }
  };

  const handleRemovePerk = (perkToRemove) => {
    setNewCompany(c => ({ ...c, perks: c.perks.filter(p => p !== perkToRemove) }));
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center bg-[#FDFBF7] p-4 rounded-xl border border-[#E8E1D5]">
        <h3 className="text-base font-serif font-bold text-gray-900">Register New Company</h3>
        <button 
          onClick={() => setCreatingCompany(false)} 
          className="text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors"
        >
          Cancel Registration
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {/* SECTION 1: Core Branding */}
        <div className={sectionClass}>
          <h4 className={sectionTitleClass}>
            <span>1.</span> Public Branding
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
              <input className={inputClass} placeholder="e.g. Acme Corp" value={newCompany.name} onChange={e => setNewCompany(c => ({ ...c, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Industry / Sector</label>
              <input className={inputClass} placeholder="e.g. Technology" value={newCompany.industry} onChange={e => setNewCompany(c => ({ ...c, industry: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Official Website URL</label>
              <input className={inputClass} type="url" placeholder="https://..." value={newCompany.websiteUrl} onChange={e => setNewCompany(c => ({ ...c, websiteUrl: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Company Logo</label>
              <div className="flex items-center gap-4">
                {newCompany.logoUrl ? (
                  <div className="relative group shrink-0">
                    <img src={newCompany.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-white border border-[#E8E1D5] shadow-sm" />
                    <button 
                      type="button"
                      onClick={() => setNewCompany(c => ({ ...c, logoUrl: "" }))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#FDFBF7] border border-dashed border-[#C2D9BE] rounded-xl flex items-center justify-center text-[#7A8B6A] shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload}
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#E8E1D5] hover:bg-white rounded-xl text-gray-700 font-medium transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploadingLogo ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></motion.div> Uploading...</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> Choose Image</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Company Details */}
        <div className={sectionClass}>
          <h4 className={sectionTitleClass}>
            <span>2.</span> Company Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Company Type</label>
              <select className={inputClass} value={newCompany.type} onChange={e => setNewCompany(c => ({ ...c, type: e.target.value }))}>
                <option value="">Select Type...</option>
                <option value="Public">Public Company</option>
                <option value="Private">Private / Startup</option>
                <option value="Non-Profit">Non-Profit</option>
                <option value="Government">Government Agency</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Company Size</label>
              <select className={inputClass} value={newCompany.size} onChange={e => setNewCompany(c => ({ ...c, size: e.target.value }))}>
                <option value="">Select Size...</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Year Established</label>
              <input className={inputClass} type="number" placeholder="e.g. 2010" value={newCompany.yearEstablished} onChange={e => setNewCompany(c => ({ ...c, yearEstablished: e.target.value }))} />
            </div>
          </div>
          
          <div>
            <label className={labelClass}>Headquarters Location</label>
            <input className={inputClass} placeholder="e.g. Chitwan" value={newCompany.location} onChange={e => setNewCompany(c => ({ ...c, location: e.target.value }))} />
          </div>

          <div>
            <label className={labelClass}>About Us / Bio</label>
            <textarea className={`${inputClass} resize-none`} placeholder="Brief description of the company culture and mission..." rows="3" value={newCompany.description} onChange={e => setNewCompany(c => ({ ...c, description: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input className={inputClass} type="url" placeholder="https://linkedin.com/company/..." value={newCompany.linkedinUrl} onChange={e => setNewCompany(c => ({ ...c, linkedinUrl: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Twitter / X URL</label>
              <input className={inputClass} type="url" placeholder="https://twitter.com/..." value={newCompany.twitterUrl} onChange={e => setNewCompany(c => ({ ...c, twitterUrl: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Perks & Benefits</label>
            <div className="flex gap-2">
              <input 
                className={inputClass} 
                placeholder="e.g. Health Insurance, Remote Work" 
                value={perkInput}
                onChange={(e) => setPerkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPerk(e)}
              />
              <button 
                type="button"
                onClick={handleAddPerk}
                className="px-4 py-2 bg-[#F5F2EB] text-[#1A1A1A] font-semibold rounded-xl text-sm border border-[#E8E1D5] hover:bg-[#E8E1D5]"
              >
                Add
              </button>
            </div>
            {newCompany.perks && newCompany.perks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newCompany.perks.map((perk, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF4EC] text-[#3D6B36] rounded-full text-xs font-medium border border-[#3D6B36]/20">
                    {perk}
                    <button type="button" onClick={() => handleRemovePerk(perk)} className="hover:text-red-500 font-bold">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Trust & Verification */}
        <div className={sectionClass}>
          <h4 className={sectionTitleClass}>
            <span>3.</span> Trust & Verification (Private)
          </h4>
          <p className="text-xs text-gray-500 mb-3">These details are kept private and are only used for admin verification to issue your Verified Trust Badge 🟢.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Corporate Email <span className="text-red-500">*</span></label>
              <input className={inputClass} type="email" placeholder="e.g. hr@company.com" value={newCompany.corporateEmail} onChange={e => setNewCompany(c => ({ ...c, corporateEmail: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Company Phone Number</label>
              <input className={inputClass} type="tel" placeholder="e.g. +1 800 555 1234" value={newCompany.phone} onChange={e => setNewCompany(c => ({ ...c, phone: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Business Registration / Tax ID</label>
              <input className={inputClass} placeholder="e.g. EIN, VAT, PAN Number" value={newCompany.taxId} onChange={e => setNewCompany(c => ({ ...c, taxId: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleCreateCompany} 
        disabled={!newCompany.name || !newCompany.corporateEmail}
        className="w-full bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        Submit Registration & Link Company
      </button>
    </div>
  );
}
