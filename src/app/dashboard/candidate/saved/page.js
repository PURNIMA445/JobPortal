"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedJobs, unsaveJob } from "@/lib/api";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSavedJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading saved jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Saved Jobs</h1>

      {jobs.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Job Type</th>
              <th>View</th>
              <th>Unsave</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company?.name}</td>
                <td>{job.location}</td>
                <td>{job.jobType}</td>
                <td>
                  <Link href={`/jobs/${job.id}`}>View</Link>
                </td>
                <td>
                  <button onClick={() => handleUnsave(job.id)}>Unsave</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}