"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getCandidateProfile, getRecruiterProfile, getUnreadCount } from "@/lib/api";
// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/jobs", label: "Jobs" },
  { href: "/seekers", label: "Seekers" },
  { href: "/recruiters", label: "Recruiters" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AuthenticatedMenu({ profile, dashboardLink, onLogout, unreadCount }) {
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
        <div className="w-8 h-8 rounded-full bg-[#7A8B6A] text-white flex items-center justify-center font-medium text-sm shadow-sm">
           {initial}
        </div>
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

function GuestAuthButtons() {
  return (
    <>
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#7A8B6A] transition"
      >
        Login
      </Link>
      <Link
        href="/get-started"
        className="px-5 py-2.5 text-sm font-medium text-white bg-[#7A8B6A] hover:bg-[#6A7B5C] rounded-xl shadow-sm"
      >
        Sign Up
      </Link>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      
      if (role === "CANDIDATE") {
        getCandidateProfile().then(setProfile).catch(console.error);
        getUnreadCount().then(setUnreadCount).catch(console.error);
      } else if (role === "RECRUITER") {
        getRecruiterProfile().then(setProfile).catch(console.error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    setProfile(null);
    window.location.href = "/"; // Force hard redirect to home after logout
  };

  const isActive = (href) => {
    const current = pathname?.replace(/\/$/, "") || "";
    const target = href.replace(/\/$/, "");
    return current === target || current.startsWith(target + "/");
  };

  // Resolve dashboard URL from role
  const dashboardLink = userRole === "RECRUITER" ? "/dashboard/recruiter" : "/dashboard/candidate";

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="max-w-7xl mx-auto">

        {/* OUTER CONTAINER */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center bg-white/90 backdrop-blur-xl border border-[#E8E1D5] rounded-2xl shadow-sm px-5 lg:px-8 h-20 relative">

          {/* LEFT: LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
                <path d="M14 2C10 2 7 6 7 11C7 16 10 20 14 24C18 20 21 16 21 11C21 6 18 2 14 2Z" fill="#C8A96E" />
                <path d="M14 2C13 2 11 6 11 11C11 16 13 20 14 24C15 20 17 16 17 11C17 6 15 2 14 2Z" fill="#E8C98E" opacity="0.5" />
              </svg>
            </motion.div>

            <div className="leading-tight">
              <span className="font-serif text-xl font-bold text-gray-900 block">
                सीपसेतु
              </span>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                Connecting Skills &amp; Opportunities
              </p>
            </div>
          </Link>

          {/* CENTER: NAV CAPSULE (Desktop) */}
          <div className="hidden lg:flex justify-center">
            <div className="flex items-center gap-1 bg-[#F5F2EB] border border-[#E8E1D5] px-2 py-1 rounded-full">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 text-sm font-medium rounded-full"
                >
                  {isActive(href) && (
                    <motion.div
                      layoutId="pill"
                      className="absolute inset-0 bg-white border border-[#E8E1D5] rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition ${
                      isActive(href) ? "text-[#7A8B6A]" : "text-gray-600 hover:text-[#7A8B6A]"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: DESKTOP AUTH BLOCK */}
          <div className="hidden md:flex justify-end items-center gap-3">
            {mounted && (
              isLoggedIn ? (
                <AuthenticatedMenu profile={profile} dashboardLink={dashboardLink} onLogout={handleLogout} unreadCount={unreadCount} />
              ) : (
                <GuestAuthButtons />
              )
            )}
          </div>

          {/* MOBILE MENU BUTTON & AUTHENTICATED AVATAR (if logged in) */}
          <div className="md:hidden flex justify-end items-center gap-4">
            {mounted && isLoggedIn && profile && (
               <div className="w-8 h-8 rounded-full bg-[#7A8B6A] text-white flex items-center justify-center font-medium text-sm shadow-sm">
                  {profile.fullName ? profile.fullName.charAt(0) : "U"}
               </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-[#F5F2EB]"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M6 18L18 6M6 6L18 18" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 bg-white border border-[#E8E1D5] rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl ${
                      isActive(href)
                        ? "bg-[#F5F2EB] text-[#7A8B6A]"
                        : "text-gray-700 hover:bg-[#F5F2EB]"
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                {mounted && (
                  <div className="pt-3 border-t border-[#E8E1D5] flex flex-col gap-2 mt-2">
                    {isLoggedIn ? (
                      <>
                        <Link href={dashboardLink} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-center border border-[#E8E1D5]">
                          Dashboard
                        </Link>
                        <Link href={`${dashboardLink}/setup`} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-center border border-[#E8E1D5]">
                          Settings
                        </Link>
                        <button onClick={handleLogout} className="block w-full px-4 py-3 rounded-xl text-white bg-red-500 hover:bg-red-600 text-center mt-2">
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-center border border-[#E8E1D5]">
                          Login
                        </Link>
                        <Link href="/get-started" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white bg-[#7A8B6A] text-center">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </header>
  );
}