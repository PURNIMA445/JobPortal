"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import dynamic from "next/dynamic";

const AuthenticatedMenu = dynamic(() => import("./AuthenticatedMenu"), { ssr: false });
const GuestAuthButtons = dynamic(() => import("./GuestAuthButtons"), { ssr: false });


const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/jobs", label: "Jobs" },
  { href: "/seekers", label: "Seekers" },
  { href: "/for-recruiters", label: "Recruiters" },
];


export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, profile, unreadCount, mounted, logout, dashboardLink } = useAuth();

  const isActive = (href) => {
    const current = pathname?.replace(/\/$/, "") || "";
    const target = href.replace(/\/$/, "");
    return current === target || current.startsWith(target + "/");
  };

  // Hide the global header completely on the Admin Panel and Join Company Page
  if (pathname && (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/recruiter/join"))) {
    return null;
  }

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
            {(!mounted || !isLoggedIn) ? (
              <GuestAuthButtons />
            ) : (
              <AuthenticatedMenu profile={profile} dashboardLink={dashboardLink} onLogout={logout} unreadCount={unreadCount} />
            )}
          </div>

          {/* MOBILE MENU BUTTON & AUTHENTICATED AVATAR (if logged in) */}
          <div className="md:hidden flex justify-end items-center gap-4">
            <div suppressHydrationWarning>
              {mounted && isLoggedIn && profile && (
                <div className="w-8 h-8 rounded-full bg-[#7A8B6A] text-white flex items-center justify-center font-medium text-sm shadow-sm">
                  {profile.fullName ? profile.fullName.charAt(0) : "U"}
                </div>
              )}
            </div>
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

                <div className="pt-3 border-t border-[#E8E1D5] flex flex-col gap-2 mt-2">
                  {(!mounted || !isLoggedIn) ? (
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-center border border-[#E8E1D5]">
                        Login
                      </Link>
                      <Link href="/get-started" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-white bg-[#7A8B6A] text-center">
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href={dashboardLink} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-center border border-[#E8E1D5]">
                        Dashboard
                      </Link>
                      <Link href={`${dashboardLink}/setup`} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 text-center border border-[#E8E1D5]">
                        Settings
                      </Link>
                      <button onClick={logout} className="block w-full px-4 py-3 rounded-xl text-white bg-red-500 hover:bg-red-600 text-center mt-2">
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </header>
  );
}