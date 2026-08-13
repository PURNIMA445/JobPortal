"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import {
  loginUser,
  getCandidateProfile,
  getRecruiterProfile
} from "@/lib/api";
import { BASE_URL } from "@/lib/apiClient";

export function useLogin(router) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data?.token) throw new Error("Login failed: token not returned");

      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("userId", data.userId || "");

      if (data.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      } else if (data.role === "CANDIDATE") {
        try {
          await getCandidateProfile();
          window.location.href = "/dashboard/candidate";
        } catch {
          window.location.href = "/candidate/onboarding";
        }
      } else if (data.role === "RECRUITER") {
        try {
          await getRecruiterProfile();
          window.location.href = "/dashboard/recruiter";
        } catch {
          window.location.href = "/recruiter/setup";
        }
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      if (err.status === 403 && err.email) {
        router.push(`/verify-email?email=${encodeURIComponent(err.email)}`);
      } else {
        setError(err?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError(null);
    setLoading(true);
    try {
      if (provider === "Google" || provider === "GitHub") {
        const authProvider = provider === "Google" ? googleProvider : githubProvider;
        const result = await signInWithPopup(auth, authProvider);
        const token = await result.user.getIdToken();
        
        const endpoint = `${BASE_URL}/api/auth/firebase`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            idToken: token,
            allowCreate: false,
            role: "CANDIDATE"
          }),
        });

        if (!res.ok) {
          const rawText = await res.text();
          let parsedMessage = rawText;
          try {
            const parsed = JSON.parse(rawText);
            parsedMessage = parsed.message || parsed.error || JSON.stringify(parsed);
          } catch {}
          throw new Error(parsedMessage || "Backend authentication failed");
        }

        const data = await res.json();
        
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "");
        localStorage.setItem("userId", data.userId || "");
        
        if (data.role === "ADMIN") {
          window.location.href = "/dashboard/admin";
        } else if (data.role === "CANDIDATE") {
          // profileCreated=true means brand-new user whose profile was auto-created → dashboard
          // profileCreated=false means returning user → they already have a profile → dashboard
          // Only send to setup if no profile exists (fallback for edge cases)
          if (data.profileCreated) {
            window.location.href = "/dashboard/candidate";
          } else {
            try {
              await getCandidateProfile();
              window.location.href = "/dashboard/candidate";
            } catch {
              window.location.href = "/candidate/onboarding";
            }
          }
        } else if (data.role === "RECRUITER") {
          if (data.profileCreated) {
            window.location.href = "/dashboard/recruiter";
          } else {
            try {
              await getRecruiterProfile();
              window.location.href = "/dashboard/recruiter";
            } catch {
              window.location.href = "/recruiter/setup";
            }
          }
        } else {
          window.location.href = "/";
        }
      } else {
        alert(`${provider} is not set up yet!`);
      }
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(`Failed to sign in with ${provider}. ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    focused,
    setFocused,
    showPassword,
    setShowPassword,
    handleLogin,
    handleSocialLogin
  };
}
