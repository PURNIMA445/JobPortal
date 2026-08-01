import { motion } from "framer-motion";
import { useState } from "react";

export default function ApprovalsTab({ pendingCompanies, handleVerifyCompany, updatingId }) {
  const [rejectReason, setRejectReason] = useState("");
  const [rejectId, setRejectId] = useState(null);

  const handleApprove = (id) => {
    if (confirm("Are you sure you want to approve this company?")) {
      handleVerifyCompany(id, true, null);
    }
  };

  const handleReject = (id) => {
    if (!rejectReason) {
      alert("Please provide a reason for rejection.");
      return;
    }
    handleVerifyCompany(id, false, rejectReason);
    setRejectId(null);
    setRejectReason("");
  };

  if (!pendingCompanies || pendingCompanies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white rounded-2xl border border-[#E8E1D5] p-12 text-center"
      >
        <div className="w-16 h-16 bg-[#EEF4EC] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-serif font-medium text-[#1C1F1A] mb-2">No Pending Approvals</h2>
        <p className="text-[#6B7264] max-w-sm mx-auto">All company registrations have been reviewed.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E1D5] bg-[#FDFBF7]">
                <th className="py-4 px-6 text-xs font-semibold text-[#6B7264] uppercase tracking-wider">Company Details</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#6B7264] uppercase tracking-wider">Submitted On</th>
                <th className="py-4 px-6 text-xs font-semibold text-[#6B7264] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E1D5]">
              {pendingCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} className="w-10 h-10 rounded-lg object-contain border border-[#E8E1D5] bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#EEF4EC] text-[#3D6B36] flex items-center justify-center font-bold text-lg">
                          {c.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#1C1F1A]">{c.name}</p>
                        <p className="text-xs text-[#6B7264]">{c.industry || "General"} • {c.location || "Location not provided"}</p>
                        {c.websiteUrl && <a href={c.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-[#7A8B6A] hover:underline mt-0.5 block">{c.websiteUrl}</a>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="text-sm text-[#1C1F1A]">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}</p>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {rejectId === c.id ? (
                      <div className="flex flex-col items-end gap-2">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection..."
                          className="w-full max-w-xs px-3 py-1.5 border border-[#E8E1D5] rounded-lg text-sm"
                        />
                        <div className="space-x-2">
                          <button
                            onClick={() => setRejectId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReject(c.id)}
                            disabled={updatingId === c.id}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
                          >
                            Confirm Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(c.id)}
                          disabled={updatingId === c.id}
                          className="inline-flex items-center px-4 py-2 bg-[#7A8B6A] text-white text-xs font-medium rounded-xl hover:bg-[#687A5D] transition-colors disabled:opacity-50"
                        >
                          {updatingId === c.id ? "Processing..." : "Approve"}
                        </button>
                        <button
                          onClick={() => setRejectId(c.id)}
                          disabled={updatingId === c.id}
                          className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
