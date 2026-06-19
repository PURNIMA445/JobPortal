"use client";

import { useEffect, useState } from "react";

export default function Recruiter() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:8080/api/recruiter/jobs";

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load recruiter dashboard");
        }

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterJobs();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-serif">
      {/* 📰 HEADER */}
      <div className="border-b-2 border-ink p-6 text-center">
        <h1 className="text-3xl font-bold tracking-widest">
          RECRUITER DASHBOARD
        </h1>
        <p className="text-xs font-type mt-1">
          Employer Control Panel • Classified Posting System
        </p>
      </div>

      {/* ⚠ STATES */}
      <div className="p-6">
        {loading && (
          <p className="text-sm text-center font-type">
            Loading your postings...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 text-center">
            ⚠ {error}
          </p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-sm text-center font-type">
            No job postings found. Create your first recruitment notice.
          </p>
        )}

        {/* 🗂 JOB LIST */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border-2 border-ink bg-white p-4 shadow-[4px_4px_0px_#2B2B2B]"
              >
                <h2 className="text-lg font-bold mb-1">
                  {job.title}
                </h2>

                <p className="text-sm font-type text-gray-700">
                  {job.company}
                </p>

                <p className="text-xs text-gray-600 mt-2">
                  📍 {job.location}
                </p>

                <p className="text-xs text-gray-600">
                  💼 {job.type}
                </p>

                <p className="text-xs text-gray-600">
                  💰 {job.salary}
                </p>

                <div className="mt-4 flex gap-2">
                  <button className="text-xs font-bold border-2 border-ink px-2 py-1 hover:bg-ink hover:text-paper transition">
                    EDIT
                  </button>

                  <button className="text-xs font-bold border-2 border-red-600 text-red-600 px-2 py-1 hover:bg-red-600 hover:text-white transition">
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ➕ FLOATING ACTION (future add job) */}
      <button className="fixed bottom-6 right-6 bg-accent text-paper border-2 border-ink px-4 py-3 font-bold shadow-[4px_4px_0px_#2B2B2B]">
        + POST NEW JOB
      </button>
    </div>
  );
}