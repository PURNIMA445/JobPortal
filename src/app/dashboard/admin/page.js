"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { adminGetStats, adminGetPendingCompanies, adminVerifyCompany } from "@/lib/services/admin.service";

export default function AdminPanel() {
  const router = useRouter();
  const { logout, userRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (userRole !== "ADMIN") {
      router.replace("/");
      return;
    }
    loadData();
  }, [userRole, router]);

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
    { key: "overview", label: "Overview" },
    { key: "approvals", label: `Approvals (${pendingCompanies?.length || 0})` },
    { key: "skills", label: "Skills" },
    { key: "users", label: "Users" },
    { key: "jobs", label: "Jobs" },
    { key: "companies", label: "Companies" },
    { key: "applications", label: "Applications" }
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1C1F1A] selection:bg-[#7A8B6A] selection:text-white pb-20">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-[#E8E1D5] sticky top-0 z-20 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A8B6A] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-serif font-medium text-lg text-[#1C1F1A] leading-none">Admin Panel</p>
              <p className="text-xs text-[#6B7264] mt-1">Manage users, verification, jobs, skills & platforms stats</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-sm text-[#DC2626] hover:bg-[#FEF2F2] border border-[#FECACA] font-medium transition-colors flex items-center gap-1.5 rounded-xl px-4 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-[#6B7264] hover:text-[#7A8B6A] font-medium transition-colors flex items-center gap-1.5 border border-[#E8E1D5] rounded-xl px-4 py-2 hover:bg-[#FAF8F5]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              View Portal Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl px-5 py-3 text-[#DC2626] text-sm font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1.5 bg-white border border-[#E8E1D5] rounded-2xl p-1 mb-8 w-fit shadow-xs">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === t.key
                  ? "bg-[#7A8B6A] text-white shadow-sm"
                  : "text-[#6B7264] hover:text-[#1C1F1A]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" stats={stats} />}
          {activeTab === "approvals" && (
            <ApprovalsTab 
              key="approvals" 
              pendingCompanies={pendingCompanies} 
              handleVerifyCompany={handleVerifyCompany} 
              updatingId={updatingId} 
            />
          )}
          {activeTab === "skills" && <SkillsTab key="skills" />}
          {activeTab === "users" && <UsersTab key="users" />}
          {activeTab === "jobs" && <JobsTab key="jobs" />}
          {activeTab === "companies" && <CompaniesTab key="companies" />}
          {activeTab === "applications" && <ApplicationsTab key="applications" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
