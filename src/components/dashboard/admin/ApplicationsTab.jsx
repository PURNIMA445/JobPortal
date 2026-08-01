"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "./SharedUI";

export function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [appSearch, setAppSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    try {
      const { adminGetApplications } = await import("@/lib/services/admin.service");
      const data = await adminGetApplications();
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteApplication(id) {
    if (!confirm("Are you sure you want to delete this application?")) return;
    setDeletingId(id);
    try {
      const { adminDeleteApplication } = await import("@/lib/services/admin.service");
      await adminDeleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-[#6B7264]">Loading applications...</div>;
  }

  const filteredApps = applications.filter(
    (a) =>
      (a.candidateEmail || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.jobTitle || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (a.status || "").toLowerCase().includes(appSearch.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Section title={`All Job Applications (${filteredApps.length})`} action={
        <input
          type="text" placeholder="Filter by email or status..." value={appSearch}
          onChange={(e) => setAppSearch(e.target.value)}
          className="px-4 py-2 text-sm rounded-xl border border-[#E8E1D5] outline-none focus:border-[#7A8B6A] bg-[#FDFBF7] w-64"
        />
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-[#6B7264] text-xs uppercase tracking-wider border-b border-[#E8E1D5]">
                <th className="py-3 px-4 font-semibold">Applicant Email</th>
                <th className="py-3 px-4 font-semibold">Target Job Post</th>
                <th className="py-3 px-4 font-semibold">Match Score</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Applied At</th>
                <th className="py-3 px-4 font-semibold text-right">Delete Application</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((a) => (
                <tr key={a.id} className="border-b border-[#F5F0E8] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1C1F1A]">{a.candidateEmail}</td>
                  <td className="py-4 px-4 text-[#6B7264]">{a.jobTitle}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                      a.matchScore >= 80 ? "bg-[#EEF4EC] text-[#5C7356]" :
                      a.matchScore >= 50 ? "bg-[#F5F0E8] text-[#C8A96E]" :
                      "bg-[#FEF2F2] text-[#DC2626]"
                    }`}>
                      {a.matchScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-[#F0F2EB] text-[#6B7264] rounded-lg">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#6B7264] text-xs">{a.appliedAt?.split("T")[0] || "—"}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDeleteApplication(a.id)}
                      disabled={deletingId === a.id}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-xl hover:bg-[#FEE2E2] transition-colors disabled:opacity-40"
                    >
                      {deletingId === a.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <p className="text-center text-[#6B7264] text-sm py-12">No applications recorded yet.</p>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
export default ApplicationsTab;
