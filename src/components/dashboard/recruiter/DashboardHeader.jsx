"use client";

import { motion } from "framer-motion";
import { LeafIcon, PlusIcon, XIcon, SettingsIcon, LogOutIcon } from "@/components/dashboard/icons";

/**
 * Top section of the Recruiter Dashboard.
 * Displays the welcome greeting, job title, and action buttons.
 * All data and handlers come from the parent page.
 */
export default function DashboardHeader({ profile, showJobForm, onToggleForm, onSettings, onLogout }) {
  // Simple check since we don't have user.email easily exposed in profile, we check if it has websiteUrl
  // Ideally, verification is done on the backend or we decode the JWT to get the user's email.
  // For this UI mockup, we'll assume verified if they have a corporate email in the metadata that matches the website.
  let isVerified = false;
  if (profile?.company?.websiteUrl && profile?.company?.corporateEmail) {
    const websiteDomain = profile.company.websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const emailDomain = profile.company.corporateEmail.split('@')[1];
    isVerified = websiteDomain && emailDomain && websiteDomain.toLowerCase() === emailDomain.toLowerCase();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E8E1D5] rounded-2xl p-6 shadow-sm mb-2 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7A8B6A] to-[#A3B18F]"></div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {profile?.company?.logoUrl ? (
            <img src={profile.company.logoUrl} alt={profile.company.name} className="w-16 h-16 rounded-xl object-contain bg-white border border-[#E8E1D5] shadow-sm p-1" />
          ) : (
            <div className="w-16 h-16 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl flex items-center justify-center text-[#7A8B6A] text-2xl font-serif font-bold shadow-sm">
              {profile?.company?.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
                {profile?.company?.name || 'Your Company'}
              </h1>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF4EC] text-[#3D6B36] uppercase tracking-wider border border-[#3D6B36]/20" title="Verified Corporate Domain">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 uppercase tracking-wider border border-amber-200" title="Pending Domain Verification">
                  Unverified
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{profile?.fullName}</span> • {profile?.designation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50" title="Log Out">
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
