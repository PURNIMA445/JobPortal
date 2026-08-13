"use client";

import { useState, useEffect } from "react";
import { getCompanyMembers, sendInvite, removeCompanyMember, getPendingMembers, verifyMember } from "@/lib/services/company.service";
import { UsersIcon } from "@/components/dashboard/icons";

export default function TeamManagement({ profile }) {
  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const companyId = profile?.company?.id;
  const isApproved = profile?.company?.status === "APPROVED";
  const isAdmin = profile?.companyRole === "ADMIN";

  useEffect(() => {
    if (companyId && isAdmin && isApproved) {
      loadMembers();
    }
  }, [companyId, isAdmin, isApproved]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const [membersData, pendingData] = await Promise.all([
        getCompanyMembers(companyId).catch(() => []),
        getPendingMembers(companyId).catch(() => [])
      ]);
      setMembers(Array.isArray(membersData) ? membersData : []);
      setPending(Array.isArray(pendingData) ? pendingData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setSending(true);
    setError("");
    setSuccess("");
    try {
      await sendInvite(companyId, inviteEmail);
      setSuccess("Invite sent successfully!");
      setInviteEmail("");
    } catch (err) {
      setError(err.message || "Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeCompanyMember(companyId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      alert(err.message || "Failed to remove member");
    }
  };

  const handleVerify = async (memberId, isApproved) => {
    try {
      await verifyMember(companyId, memberId, isApproved);
      // Remove from pending list
      const verifiedMember = pending.find((m) => m.id === memberId);
      setPending((prev) => prev.filter((m) => m.id !== memberId));
      // If approved, optionally refetch members to show them in the active team list
      if (isApproved) {
        loadMembers();
      }
    } catch (err) {
      alert(err.message || "Failed to verify member");
    }
  };

  if (!isAdmin || !isApproved) return null;

  return (
    <div className="bg-white border border-[#E8E1D5] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon className="w-5 h-5 text-[#7A8B6A]" />
        <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Team Management</h3>
      </div>

      <form onSubmit={handleSendInvite} className="mb-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl text-sm"
          />
          <button
            type="submit"
            disabled={sending || !inviteEmail}
            className="px-4 py-2 bg-[#7A8B6A] hover:bg-[#687A5D] text-white rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {sending ? "Sending..." : "Invite"}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {success && <p className="text-emerald-600 text-xs mt-1">{success}</p>}
      </form>

      {/* Pending Members Section */}
      {pending.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Requests</h4>
          <div className="space-y-2">
            {pending.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div>
                  <p className="text-sm font-medium text-amber-900">{req.fullName || req.name}</p>
                  <p className="text-xs text-amber-700">{req.designation || "Recruiter"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(req.id, true)}
                    className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold px-2 py-1 bg-emerald-100 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerify(req.id, false)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-100 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Team Section */}
      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Active Team</h4>
        {loading ? (
          <p className="text-xs text-gray-500 text-center">Loading team...</p>
        ) : members.length === 0 ? (
          <p className="text-xs text-gray-500 text-center">No team members yet</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-[#FDFBF7] border border-[#E8E1D5]">
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name || member.fullName}</p>
                <p className="text-xs text-gray-500">{member.role || "MEMBER"} • {member.designation || "Recruiter"}</p>
              </div>
              {member.role !== "ADMIN" && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
