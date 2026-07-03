"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getNotifications, markAllRead } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Notifications</h1>
        <button onClick={handleMarkAllRead}>Mark all as read</button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Message</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Job</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} style={{ fontWeight: n.isRead ? "normal" : "bold" }}>
                <td>{n.message}</td>
                <td>{n.type}</td>
                <td>{n.isRead ? "Read" : "Unread"}</td>
                <td>{n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}</td>
                <td>{n.jobId ? <Link href={`/jobs/${n.jobId}`}>View Job</Link> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}