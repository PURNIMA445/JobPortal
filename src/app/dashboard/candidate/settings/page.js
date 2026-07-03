"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCandidateProfile, changePassword, deleteAccount } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCandidateProfile()
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

  const handleDeleteAccount = async () => {
    const confirmed = confirm("This will permanently delete your account. Are you sure?");
    if (!confirmed) return;

    try {
      await deleteAccount();
      localStorage.clear();
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Settings</h1>

      <section>
        <h2>Profile Information</h2>
        {profileLoading ? (
          <p>Loading profile...</p>
        ) : profile ? (
          <table border="1" cellPadding="8">
            <tbody>
              <tr>
                <td><strong>Full Name</strong></td>
                <td>{profile.fullName}</td>
              </tr>
              <tr>
                <td><strong>Phone</strong></td>
                <td>{profile.phone || "—"}</td>
              </tr>
              <tr>
                <td><strong>Location</strong></td>
                <td>{profile.location || "—"}</td>
              </tr>
              <tr>
                <td><strong>Bio</strong></td>
                <td>{profile.bio || "—"}</td>
              </tr>
              <tr>
                <td><strong>Experience</strong></td>
                <td>{profile.experienceYears != null ? `${profile.experienceYears} years` : "—"}</td>
              </tr>
              <tr>
                <td><strong>Skills</strong></td>
                <td>{profile.skills?.length > 0 ? profile.skills.map((s) => s.name).join(", ") : "—"}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Profile not found.</p>
        )}
        <p>
          <Link href="/profile/setup">Edit Profile</Link>
        </p>
      </section>

      <section>
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div>
            <label>Current Password</label><br />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password</label><br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
        {message && <p>{message}</p>}
        {error && <p>Error: {error}</p>}
      </section>

      <section>
        <h2>Danger Zone</h2>
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </section>
    </div>
  );
}