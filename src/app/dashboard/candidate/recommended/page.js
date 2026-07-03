"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecommendedJobs, getSavedJobs, saveJob, unsaveJob } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getRecommendedJobs(), getSavedJobs()])
      .then(([recJobs, saved]) => {
        setJobs(recJobs);
        setSavedJobIds(new Set(saved.map((j) => j.id)));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (jobId) => {
    try {
      if (savedJobIds.has(jobId)) {
        await unsaveJob(jobId);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await saveJob(jobId);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // const handleApply = async (jobId) => {
  //   try {
  //     await applyToJob(jobId);
  //     alert("Application submitted");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };
  const router = useRouter();
  const handleApply = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };
  if (loading) return <p>Loading recommended jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Recommended Jobs</h1>

      {jobs.length === 0 ? (
        <p>No recommendations yet. Add skills to your profile to get matched.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Job Type</th>
              <th>View</th>
              <th>Save</th>
              <th>Apply</th>
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
                  <button onClick={() => handleSave(job.id)}>
                    {savedJobIds.has(job.id) ? "Unsave" : "Save"}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleApply(job.id)}>Apply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}