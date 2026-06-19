"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCandidateProfile,
  getAllJobs,
  getMyApplications,
  getNotifications,
  getUnreadCount
} from "@/lib/api";

export default function CandidateDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCandidateProfile(),
      getAllJobs(),
      getMyApplications(),
      getNotifications(),
      getUnreadCount(),
    ])
      .then(([prof, jobList, apps, notifs, unread]) => {
        setProfile(prof);
        setJobs(jobList);
        setApplications(apps);
        setNotifications(notifs);
        setUnreadCount(unread);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    document.cookie = "token=; max-age=0; path=/";
    localStorage.clear();
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB]">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F2EB] px-6 py-10 font-sans">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl shadow-sm">

          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Welcome, {profile?.fullName} 👋
            </h1>
            <p className="text-gray-500">{profile?.location}</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 items-center">

            <span className="bg-[#7A8B6A] text-white px-3 py-1 rounded-full text-xs">
              🔔 {unreadCount} unread
            </span>

            <button
              onClick={() => router.push("/profile/setup")}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-[#7A8B6A] transition"
            >
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {[
            { label: "Jobs Available", value: jobs.length },
            { label: "My Applications", value: applications.length },
            { label: "Notifications", value: notifications.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                {stat.value}
              </h2>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* SKILLS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">My Skills</h3>

          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 text-sm rounded-full bg-[#F5F2EB] text-gray-700 border border-gray-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">🔔 Notifications</h3>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`text-sm flex justify-between border-b pb-2 ${
                    n.isRead ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  <span>{n.message}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">My Applications</h3>

          {applications.length === 0 ? (
            <p className="text-gray-400">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {app.job.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {app.job.company.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${badgeStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>

                    {app.matchScore && (
                      <span className="text-xs text-green-600">
                        {app.matchScore}% match
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JOBS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Jobs</h3>

            <button
              onClick={() => router.push("/jobs")}
              className="text-sm text-[#7A8B6A] font-semibold hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-xs text-gray-500">
                    {job.company.name} · {job.location}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="px-3 py-1 text-xs bg-[#7A8B6A] text-white rounded-lg hover:bg-[#6c7d5c]"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* STATUS BADGE */
function badgeStyle(status) {
  const map = {
    APPLIED: "bg-blue-100 text-blue-700",
    REVIEWED: "bg-yellow-100 text-yellow-700",
    SHORTLISTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}