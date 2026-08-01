"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRecruiterProfile, changePassword, deactivateAccount } from "@/lib/api";

export default function RecruiterSettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRecruiterProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      setMessage(res.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmed = confirm("This will deactivate your account. You can reactivate it anytime by logging back in. Are you sure?");
    if (!confirmed) return;

    try {
      await deactivateAccount();
      localStorage.clear();
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1A1A1A] mb-2">
          Account Settings
        </h1>
        <p className="text-lg text-[#6B7264]">
          Manage your personal information and security preferences.
        </p>
      </div> 

      <div className="flex flex-col gap-8">
        {/* Profile Information Card with Banner */}
        <section className="bg-white border border-[#E8E1D5] rounded-3xl overflow-hidden shadow-sm relative group">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#7A8B6A]/20 via-[#A3AEA0]/20 to-[#E8E1D5]/40 w-full relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          </div>
          
          <div className="p-6 md:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 -mt-12">
              <div className="flex items-end gap-5">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-md">
                  <div className="w-full h-full rounded-xl bg-[#FDFBF7] border-2 border-[#E8E1D5] flex items-center justify-center text-3xl font-serif text-[#7A8B6A]">
                    {profile?.fullName?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="mb-1">
                  <h2 className="text-2xl font-serif font-medium text-gray-900">{profile?.fullName || "User"}</h2>
                  <p className="text-sm text-gray-500 font-medium">{profile?.designation || "No designation set"}</p>
                </div>
              </div>
              
              <Link 
                href="/dashboard/recruiter/setup" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E8E1D5] hover:border-[#7A8B6A] hover:bg-[#FDFBF7] text-[#7A8B6A] text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </Link>
            </div>

            {profileLoading ? (
              <div className="animate-pulse flex flex-col gap-4 mt-8">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</p>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{profile.phone || "—"}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Company</p>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{profile.company?.name || "—"}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-gray-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Designation</p>
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{profile.designation || "—"}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">Profile not found. Please set up your profile.</p>
            )}
          </div>
        </section>

        {/* Change Password Card */}
        <section className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-gray-900">Security & Password</h2>
              <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] transition-all text-gray-900"
                  placeholder="Enter current password"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7A8B6A]/20 focus:border-[#7A8B6A] transition-all text-gray-900"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all disabled:opacity-50 mt-4 shadow-sm"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            
            {message && <p className="text-emerald-700 text-sm font-semibold mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{message}</p>}
            {error && <p className="text-rose-700 text-sm font-semibold mt-4 bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>{error}</p>}
          </form>
        </section>

        {/* Deactivate Account Card */}
        <section className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-gray-900">Deactivate Account</h2>
                <p className="text-sm text-gray-500 mt-1">Temporarily deactivate your account. You can reactivate it at any time simply by logging back in.</p>
              </div>
            </div>
            <button 
              onClick={handleDeactivateAccount}
              className="shrink-0 px-6 py-3 bg-[#D67373] hover:bg-[#C55E5E] text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Deactivate Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}