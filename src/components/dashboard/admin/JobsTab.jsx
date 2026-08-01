"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "./SharedUI";

export function JobsTab() {
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const { adminGetJobs } = await import("@/lib/services/admin.service");
      const data = await adminGetJobs();
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteJob(id) {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    setDeletingId(id);
    try {
      const { adminDeleteJob } = await import("@/lib/services/admin.service");
      await adminDeleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-[#6B7264]">Loading jobs...</div>;
  }

  const filteredJobs = jobs.filter(
    (j) =>
      (j.title || "").toLowerCase().includes(jobSearch.toLowerCase()) ||
      (j.location || "").toLowerCase().includes(jobSearch.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Section title={`Active Job Postings (${filteredJobs.length})`} action={
        <input
          type="text" placeholder="Search title or location..." value={jobSearch}
          onChange={(e) => setJobSearch(e.target.value)}
          className="px-4 py-2 text-sm rounded-xl border border-[#E8E1D5] outline-none focus:border-[#7A8B6A] bg-[#FDFBF7] w-64"
        />
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-[#6B7264] text-xs uppercase tracking-wider border-b border-[#E8E1D5]">
                <th className="py-3 px-4 font-semibold">Job Title</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Employment Type</th>
                <th className="py-3 px-4 font-semibold">Experience Level</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((j) => (
                <tr key={j.id} className="border-b border-[#F5F0E8] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1C1F1A]">{j.title || "Untitled Job"}</td>
                  <td className="py-4 px-4 text-[#6B7264]">{j.location || "Remote / Anywhere"}</td>
                  <td className="py-4 px-4">
                    {j.jobType && (
                      <span className="px-2.5 py-1 bg-[#EEF4EC] text-[#5C7356] rounded-xl text-xs font-semibold">
                        {j.jobType}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[#6B7264] text-xs font-medium">{j.experienceLevel || "—"}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDeleteJob(j.id)}
                      disabled={deletingId === j.id}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-xl hover:bg-[#FEE2E2] transition-colors disabled:opacity-40"
                    >
                      {deletingId === j.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredJobs.length === 0 && (
            <p className="text-center text-[#6B7264] text-sm py-12">No active jobs matches found.</p>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
export default JobsTab;
