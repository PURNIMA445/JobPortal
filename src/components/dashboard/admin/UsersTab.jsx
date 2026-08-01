"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function UserTable({
  title,
  users,
  emptyMessage,
  handleRoleChange,
  handleToggleVerification,
  handleDeleteUser,
  updatingId,
  deletingId,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#E8E1D5] bg-[#FAF8F5] flex items-center justify-between">
        <h3 className="font-serif font-medium text-lg text-[#1C1F1A]">
          {title} ({users.length})
        </h3>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="text-[#6B7264] uppercase tracking-wider border-b border-[#E8E1D5]">
              <th className="py-2.5 px-2 font-semibold">Email</th>
              <th className="py-2.5 px-2 font-semibold">Role</th>
              <th className="py-2.5 px-2 font-semibold">Verify</th>
              <th className="py-2.5 px-2 font-semibold text-right">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[#F5F0E8] hover:bg-[#FAF8F5] transition-colors"
              >
                <td className="py-3 px-2 font-medium text-[#1C1F1A] break-all max-w-[120px]">
                  {u.email}
                </td>
                <td className="py-3 px-2">
                  <select
                    value={u.role}
                    disabled={updatingId === u.id}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="px-2 py-1 bg-white border border-[#E8E1D5] text-[10px] font-semibold text-[#1C1F1A] rounded-xl outline-none focus:border-[#7A8B6A]"
                  >
                    <option value="CANDIDATE">CANDIDATE</option>
                    <option value="RECRUITER">RECRUITER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => handleToggleVerification(u.id, u.isEmailVerified)}
                    disabled={updatingId === u.id}
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border transition-all ${
                      u.isEmailVerified
                        ? "bg-[#EEF4EC] border-[#C2D9BE] text-[#5C7356]"
                        : "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                    }`}
                  >
                    {u.isEmailVerified ? "Verified ✓" : "Unverified ✗"}
                  </button>
                </td>
                <td className="py-3 px-2 text-right">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    disabled={deletingId === u.id}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-[#6B7264] py-8">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const { adminGetUsers } = await import("@/lib/services/admin.service");
      const data = await adminGetUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    setUpdatingId(userId);
    try {
      const { adminUpdateUserRole } = await import("@/lib/services/admin.service");
      await adminUpdateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleVerification(userId, currentStatus) {
    setUpdatingId(userId);
    const newStatus = !currentStatus;
    try {
      const { adminToggleUserVerification } = await import("@/lib/services/admin.service");
      await adminToggleUserVerification(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isEmailVerified: newStatus } : u))
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this user? This will delete all their profile data too.")) return;
    setDeletingId(id);
    try {
      const { adminDeleteUser } = await import("@/lib/services/admin.service");
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-[#6B7264]">Loading users...</div>;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const candidates = filteredUsers.filter((u) => u.role === "CANDIDATE");
  const recruitersAndAdmins = filteredUsers.filter((u) => u.role !== "CANDIDATE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between bg-white border border-[#E8E1D5] rounded-3xl px-6 py-4 shadow-sm">
        <h2 className="font-serif text-xl font-medium text-[#1C1F1A]">
          Manage Platform Users ({filteredUsers.length})
        </h2>
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="px-4 py-2 text-sm rounded-xl border border-[#E8E1D5] outline-none focus:border-[#7A8B6A] bg-[#FDFBF7] w-64"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserTable
          title="Candidates"
          users={candidates}
          emptyMessage="No candidates found."
          handleRoleChange={handleRoleChange}
          handleToggleVerification={handleToggleVerification}
          handleDeleteUser={handleDeleteUser}
          updatingId={updatingId}
          deletingId={deletingId}
        />
        <UserTable
          title="Recruiters & Admins"
          users={recruitersAndAdmins}
          emptyMessage="No recruiters or admins found."
          handleRoleChange={handleRoleChange}
          handleToggleVerification={handleToggleVerification}
          handleDeleteUser={handleDeleteUser}
          updatingId={updatingId}
          deletingId={deletingId}
        />
      </div>
    </motion.div>
  );
}
