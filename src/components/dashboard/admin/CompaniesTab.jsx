"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "./SharedUI";

export function CompaniesTab() {
  const [companies, setCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    setLoading(true);
    try {
      const { adminGetCompanies } = await import("@/lib/services/admin.service");
      const data = await adminGetCompanies();
      setCompanies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCompany(id) {
    if (!confirm("Are you sure you want to delete this company? This may delete all related recruiters and job posts.")) return;
    setDeletingId(id);
    try {
      const { adminDeleteCompany } = await import("@/lib/services/admin.service");
      await adminDeleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-[#6B7264]">Loading companies...</div>;
  }

  const filteredCompanies = companies.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(companySearch.toLowerCase()) ||
      (c.industry || "").toLowerCase().includes(companySearch.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Section title={`Platform Companies Database (${filteredCompanies.length})`} action={
        <input
          type="text" placeholder="Search company name, industry..." value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          className="px-4 py-2 text-sm rounded-xl border border-[#E8E1D5] outline-none focus:border-[#7A8B6A] bg-[#FDFBF7] w-64"
        />
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-[#6B7264] text-xs uppercase tracking-wider border-b border-[#E8E1D5]">
                <th className="py-3 px-4 font-semibold">Company Name</th>
                <th className="py-3 px-4 font-semibold">Industry</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Website</th>
                <th className="py-3 px-4 font-semibold text-right">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="border-b border-[#F5F0E8] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-4 px-4 font-medium text-[#1C1F1A] flex items-center gap-2.5">
                    {c.logoUrl && (
                      <img src={c.logoUrl} alt={c.name} className="w-8 h-8 rounded-lg border border-[#E8E1D5] object-cover" />
                    )}
                    {c.name || "Unnamed Organization"}
                  </td>
                  <td className="py-4 px-4 text-[#6B7264]">{c.industry || "General Industry"}</td>
                  <td className="py-4 px-4 text-[#6B7264]">{c.location || "Not Specifed"}</td>
                  <td className="py-4 px-4 text-[#7A8B6A]">
                    {c.websiteUrl ? (
                      <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-xs">
                        Visit site ↗
                      </a>
                    ) : "—"}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCompany(c.id)}
                      disabled={deletingId === c.id}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-xl hover:bg-[#FEE2E2] transition-colors disabled:opacity-40"
                    >
                      {deletingId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCompanies.length === 0 && (
            <p className="text-center text-[#6B7264] text-sm py-12">No companies recorded in database yet.</p>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
export default CompaniesTab;
