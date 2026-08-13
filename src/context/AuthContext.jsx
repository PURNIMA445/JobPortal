"use client";

import { createContext, useState, useEffect } from "react";
import { getCandidateProfile } from "@/lib/services/candidate.service";
import { getRecruiterProfile } from "@/lib/services/recruiter.service";
import { getUnreadCount as fetchUnreadCount } from "@/lib/services/notification.service";

export const AuthContext = createContext({
  isLoggedIn: false,
  userRole: null,
  profile: null,
  unreadCount: 0,
  mounted: false,
  logout: () => {},
  dashboardLink: "/",
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);

      if (role === "CANDIDATE") {
        getCandidateProfile()
          .then(setProfile)
          .catch((err) => {
            if (err.status !== 404 && err.message !== "Profile not found") {
              console.error(err);
            }
          });
        fetchUnreadCount().then(setUnreadCount).catch(console.error);
      } else if (role === "RECRUITER") {
        getRecruiterProfile().then(setProfile).catch(console.error);
      }
    }
  }, []);

  const logout = () => {
    // Clear cookies explicitly if needed (usually handled by document.cookie)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // Reset local state
    setIsLoggedIn(false);
    setUserRole(null);
    setProfile(null);
    setUnreadCount(0);

    // Force hard redirect to home after logout to clear any protected state
    window.location.href = "/";
  };

  const refreshProfile = async () => {
    const role = localStorage.getItem("role");
    if (role === "CANDIDATE") {
      try {
        const p = await getCandidateProfile();
        setProfile(p);
      } catch (err) {
        if (err.status !== 404 && err.message !== "Profile not found") console.error(err);
      }
    } else if (role === "RECRUITER") {
      try {
        const p = await getRecruiterProfile();
        setProfile(p);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getDashboardLink = () => {
    return userRole === "ADMIN" 
      ? "/dashboard/admin" 
      : userRole === "RECRUITER" 
        ? "/dashboard/recruiter" 
        : "/dashboard/candidate";
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        profile,
        unreadCount,
        mounted,
        logout,
        refreshProfile,
        dashboardLink: getDashboardLink(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
