"use client";

import { useState, useEffect } from "react";
import { getMyApplications } from "@/lib/api";
import Link from "next/link"
const STATUS_LABEL = {
  APPLIED: "Applied",
  REVIEWED: "Under Review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyApplications()
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
              <th>Match Score</th>
              <th>Applied On</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
  {applications.map((app) => (
    <tr key={app.id}>
      <td>{app.job?.title}</td>
      <td>{app.job?.company?.name}</td>
      <td>{STATUS_LABEL[app.status] || app.status}</td>
      <td>{app.matchScore != null ? `${app.matchScore}%` : "—"}</td>
      <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—"}</td>
      <td>
        <Link href={`/jobs/${app.job?.id}`}>View</Link>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      )}
    </div>
  );
}