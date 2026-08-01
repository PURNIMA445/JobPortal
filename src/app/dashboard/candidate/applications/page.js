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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1A1A1A] mb-2">
          My Applications
        </h1>
        <p className="text-lg text-[#6B7264]">
          Track and manage your job applications.
        </p>
      </div>

      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 md:p-8 shadow-sm">
        {applications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#6B7264]">You haven't applied to any jobs yet.</p>
            <Link href="/jobs" className="inline-block mt-4 text-[#7A8B6A] hover:underline font-medium">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8E1D5] bg-gray-50/50">
                  <th className="py-4 px-5 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-xl">Job Title</th>
                  <th className="py-4 px-5 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-5 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-5 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Score</th>
                  <th className="py-4 px-5 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied On</th>
                  <th className="py-4 px-5 font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider text-right rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-[#E8E1D5] last:border-0 hover:bg-[#F9F8F6] transition-colors group">
                    <td className="py-4 px-5 text-[#1A1A1A] font-medium group-hover:text-[#7A8B6A] transition-colors">{app.job?.title}</td>
                    <td className="py-4 px-5 text-gray-600">{app.job?.company?.name}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide ${
                        app.status === 'APPLIED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        app.status === 'REVIEWED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {STATUS_LABEL[app.status] || app.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-600">{app.matchScore != null ? (
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold">{app.matchScore}%</span>
                    ) : "—"}</td>
                    <td className="py-4 px-5 text-gray-600">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "—"}</td>
                    <td className="py-4 px-5 text-right">
                      <Link href={`/jobs/${app.job?.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-[#7A8B6A]/10 hover:bg-[#7A8B6A] text-[#7A8B6A] hover:text-white text-sm font-semibold rounded-xl transition-all duration-200">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}