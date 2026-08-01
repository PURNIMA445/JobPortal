"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthenticatedMenu({ profile, dashboardLink, onLogout, unreadCount }) {
  const [open, setOpen] = useState(false);

  const initial = profile?.fullName ? profile.fullName.charAt(0) : "U";

  return (
    <div className="flex items-center gap-4 relative">
      {/* Notification Bell */}
      <Link href={`${dashboardLink}/notifications`} className="text-gray-500 hover:text-gray-700 relative transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.9 18 13V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v2c0 .9-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </Link>

      {/* Profile Dropdown Trigger */}
      <button 
        onClick={() => setOpen(!open)} 
        className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-[#E8E1D5] transition-all"
      >
        <span className="w-8 h-8 rounded-full bg-[#7A8B6A] text-white flex items-center justify-center font-medium text-sm shadow-sm inline-flex">
           {initial}
        </span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {profile?.fullName || "User"}
        </span>
        <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }} 
             exit={{ opacity: 0, y: 10 }} 
             transition={{ duration: 0.15 }}
             className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E8E1D5] rounded-xl shadow-lg py-1 z-50 overflow-hidden"
           >
             <Link href={dashboardLink} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A8B6A] transition-colors">
               Dashboard
             </Link>
             <Link href={`${dashboardLink}/setup`} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A8B6A] transition-colors">
               Settings
             </Link>
             <div className="h-px bg-[#E8E1D5] my-1 w-full" />
             <button onClick={onLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
               Sign Out
             </button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
