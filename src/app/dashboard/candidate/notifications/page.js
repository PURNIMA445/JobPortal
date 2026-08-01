"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getNotifications, markAllRead } from "@/lib/api";

const getNotificationStyle = (message, isRead) => {
  const msg = message.toLowerCase();
  
  if (msg.includes("shortlisted") || msg.includes("accepted")) {
    return {
      iconBg: isRead ? "bg-emerald-50" : "bg-emerald-100",
      iconText: isRead ? "text-emerald-500" : "text-emerald-600",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-600",
      border: isRead ? "border-[#E8E1D5]" : "border-emerald-200",
      cardBg: isRead ? "bg-transparent" : "bg-white",
      hoverRing: "group-hover:text-emerald-500"
    };
  }
  if (msg.includes("reviewed")) {
    return {
      iconBg: isRead ? "bg-amber-50" : "bg-amber-100",
      iconText: isRead ? "text-amber-500" : "text-amber-600",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-600",
      border: isRead ? "border-[#E8E1D5]" : "border-amber-200",
      cardBg: isRead ? "bg-transparent" : "bg-white",
      hoverRing: "group-hover:text-amber-500"
    };
  }
  if (msg.includes("rejected")) {
    return {
      iconBg: isRead ? "bg-rose-50" : "bg-rose-100",
      iconText: isRead ? "text-rose-400" : "text-rose-600",
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-600",
      border: isRead ? "border-[#E8E1D5]" : "border-rose-200",
      cardBg: isRead ? "bg-transparent" : "bg-white",
      hoverRing: "group-hover:text-rose-500"
    };
  }
  if (msg.includes("applied")) {
    return {
      iconBg: isRead ? "bg-blue-50" : "bg-blue-100",
      iconText: isRead ? "text-blue-500" : "text-blue-600",
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-600",
      border: isRead ? "border-[#E8E1D5]" : "border-blue-200",
      cardBg: isRead ? "bg-transparent" : "bg-white",
      hoverRing: "group-hover:text-blue-500"
    };
  }
  
  // Default
  return {
    iconBg: isRead ? "bg-[#FDFBF7]" : "bg-[#EEF4EC]",
    iconText: isRead ? "text-gray-400" : "text-[#7A8B6A]",
    badgeBg: isRead ? "bg-gray-100" : "bg-[#7A8B6A]/10",
    badgeText: isRead ? "text-gray-500" : "text-[#7A8B6A]",
    border: isRead ? "border-[#E8E1D5]" : "border-[#C2D9BE]",
    cardBg: isRead ? "bg-transparent" : "bg-white",
    hoverRing: "group-hover:text-[#7A8B6A]"
  };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { getNotifications().then(setNotifications).catch(console.error); }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-serif font-medium text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={() => { markAllRead(); setNotifications(p => p.map(n => ({...n, isRead: true}))) }} className="text-sm font-medium text-[#7A8B6A] hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-4 mt-6">
        {notifications.length ? notifications.map((n) => {
          const style = getNotificationStyle(n.message, n.isRead);
          
          return (
          <Link 
            key={n.id} 
            href={n.jobId ? `/jobs/${n.jobId}` : "#"} 
            className={`group flex items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${style.cardBg} ${style.border} hover:bg-white hover:shadow-md ${!n.isRead ? 'shadow-sm' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${style.iconBg} ${style.iconText}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {n.type?.includes('APPLICATION') 
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.9 18 13V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v2c0 .9-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  }
                </svg>
              </div>
              <div>
                <p className={`text-base leading-tight ${!n.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${style.badgeBg} ${style.badgeText}`}>
                    {n.type?.replace("_", " ")}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">• {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            {n.jobId && (
              <div className={`hidden sm:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center bg-gray-50 text-gray-400 group-hover:bg-gray-100 ${style.hoverRing} transition-colors`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            )}
          </Link>
        )}) : (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-12 text-center shadow-sm">
            <svg className="w-16 h-16 mx-auto text-[#E8E1D5] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.9 18 13V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v2c0 .9-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-xl font-serif text-gray-900 mb-2">You're all caught up</h3>
            <p className="text-gray-500">You have no new notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}