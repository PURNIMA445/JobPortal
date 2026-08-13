"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { adminGetStats, adminGetPendingCompanies, adminVerifyCompany } from "@/lib/services/admin.service";
import useAuth from "@/hooks/useAuth";
import OverviewTab from "@/components/dashboard/admin/OverviewTab";
import ApprovalsTab from "@/components/dashboard/admin/ApprovalsTab";
import SkillsTab from "@/components/dashboard/admin/SkillsTab";
import UsersTab from "@/components/dashboard/admin/UsersTab";
import JobsTab from "@/components/dashboard/admin/JobsTab";
import CompaniesTab from "@/components/dashboard/admin/CompaniesTab";
import ApplicationsTab from "@/components/dashboard/admin/ApplicationsTab";

export default function AdminPanel() {
  const router = useRouter();
  const { logout, userRole, mounted } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!mounted) return;
    
    if (userRole !== "ADMIN") {
      router.replace("/");
      return;
    }
    loadData();
  }, [userRole, router, mounted]);

  async function loadData() {
    setLoading(true);
    try {
      const [s, pc] = await Promise.all([
        adminGetStats(),
        adminGetPendingCompanies()
      ]);
      setStats(s);
      setPendingCompanies(pc);
    } catch (e) {
      setError(e.message || "Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCompany(id, approve, reason) {
    setUpdatingId(id);
    try {
      await adminVerifyCompany(id, approve, reason);
      setPendingCompanies((prev) => prev.filter((c) => c.id !== id));
      loadData();
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "approvals", label: `Approvals (${pendingCompanies?.length || 0})`, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "skills", label: "Skills", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { key: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { key: "jobs", label: "Jobs", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { key: "companies", label: "Companies", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h5a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z" },
    { key: "applications", label: "Applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#7A8B6A]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#F5F2EB] border-r border-[#E8E1D5] md:sticky md:top-0 md:h-screen flex flex-col z-20">
        <div className="p-6 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-10 h-10 rounded-xl bg-[#7A8B6A] flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-serif font-medium text-lg text-[#1C1F1A] leading-none">Admin Panel</p>
              <p className="text-xs text-[#6B7264] mt-1">सीपसेतु</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === t.key
                  ? "bg-[#7A8B6A] text-white shadow-sm"
                  : "text-[#6B7264] hover:bg-white hover:text-[#1C1F1A]"
              }`}
            >
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              {t.label}
              
              {t.key === "approvals" && pendingCompanies?.length > 0 && (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === t.key ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                }`}>
                  {pendingCompanies.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E8E1D5]">
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
          >
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-[#E8E1D5] sticky top-0 z-10">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-semibold text-[#1C1F1A]">
                {tabs.find((t) => t.key === activeTab)?.label.replace(/ \(\d+\)/, '')}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#6B7264] mt-1">
                <span>Admin Dashboard</span>
                <span>/</span>
                <span className="text-[#1C1F1A] font-medium capitalize">{activeTab}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {error && (
            <div className="mb-6 bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-5 py-4 text-[#DC2626] text-sm font-medium shadow-sm flex items-center gap-3">
               <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && <OverviewTab stats={stats} />}
              {activeTab === "approvals" && (
                <ApprovalsTab 
                  pendingCompanies={pendingCompanies} 
                  handleVerifyCompany={handleVerifyCompany} 
                  updatingId={updatingId} 
                />
              )}
              {activeTab === "skills" && <SkillsTab />}
              {activeTab === "users" && <UsersTab />}
              {activeTab === "jobs" && <JobsTab />}
              {activeTab === "companies" && <CompaniesTab />}
              {activeTab === "applications" && <ApplicationsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
