"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getJobApplications, updateApplicationStatus, getApplicationCv } from "@/lib/api";

const STATUS_OPTIONS = ["APPLIED", "REVIEWED", "SHORTLISTED", "REJECTED"];

export default function JobApplicantsPage() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getJobApplications(id)
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updated = await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updated : app))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewCv = async (applicationId) => {
    try {
      const blob = await getApplicationCv(applicationId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Applicants</h1>

      {applications.length === 0 ? (
        <p>No applicants yet for this job.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Match Score</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>CV</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.candidateName}</td>
                <td>{app.matchScore != null ? `${app.matchScore}%` : "—"}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—"}</td>
                <td>
                  <button onClick={() => handleViewCv(app.id)}>View CV</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}