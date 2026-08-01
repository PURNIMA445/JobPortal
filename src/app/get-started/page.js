"use client";
import { signupUser } from "@/lib/api";
import { BASE_URL } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- FIREBASE IMPORTS ---
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import AuthLayout, { GoogleIcon, GitHubIcon } from "@/components/layout/AuthLayout";

const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  
  // Choose default role based on path location instead of query parameters
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.includes("/recruiter")) {
        return "RECRUITER";
      }
    }
    return "CANDIDATE";
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        email: form.email,
        password: form.password,
        role: role,
      };

      await signupUser(payload);
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- SOCIAL LOGIN LOGIC ---
  const handleSocialLogin = async (provider) => {
    if (provider === "Google" || provider === "GitHub") {
      try {
        const authProvider = provider === "Google" ? googleProvider : githubProvider;
        const result = await signInWithPopup(auth, authProvider);
        const token = await result.user.getIdToken();
        
        const endpoint = `${BASE_URL}/api/auth/firebase`;
        
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            idToken: token,
            allowCreate: true,
            role: role // Send the currently selected role tab
          }),
        });

        if (!res.ok) {
          const rawText = await res.text();
          let parsedMessage = rawText;
          try {
            const parsed = JSON.parse(rawText);
            parsedMessage = parsed.message || parsed.error || JSON.stringify(parsed);
          } catch {
            // not valid JSON, fall back to raw text
          }
          throw new Error(parsedMessage || "Backend authentication failed");
        }

        const data = await res.json();
        
        // Save the tokens so the Header and protected routes know the user is logged in
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || role);
        localStorage.setItem("userId", data.userId || "");
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        
        const userRole = data.role || role;
        
        // If the backend auto-created a profile from OAuth data → go straight to dashboard
        // If not (existing user or profile creation failed) → go to setup form
        if (data.profileCreated) {
          if (userRole === "RECRUITER") {
            window.location.href = "/dashboard/recruiter";
          } else if (userRole === "CANDIDATE") {
            window.location.href = "/dashboard/candidate";
          } else {
            window.location.href = "/";
          }
        } else {
          // Existing user or profile creation failed — check if profile exists
          if (userRole === "RECRUITER") {
            window.location.href = "/recruiter/setup";
          } else if (userRole === "CANDIDATE") {
            window.location.href = "/profile/setup";
          } else {
            window.location.href = "/";
          }
        }

      } catch (err) {
        console.error(`${provider} login error:`, err);
        setError(`Failed to sign in with ${provider}. ` + err.message);
      }
    } else {
      alert(`${provider} is not set up yet!`);
    }
  };

  return (
    <AuthLayout
      title="Find work <br /> that feels <br /> like you."
      subtitle="Meaningful work. Better future."
      description="We connect talent with opportunities that truly fit."
    >
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Join Smart Job Portal and take the next step in your career.
        </p>

        {/* Role Toggle */}
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 mb-8">
          {[
            { value: "CANDIDATE", label: "Job Seeker" },
            { value: "RECRUITER", label: "Recruiter" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRole(opt.value)}
              className={`relative flex-1 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                role === opt.value ? "text-[#7A8B6A]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {role === opt.value && (
                <motion.div
                  layoutId="role-pill"
                  className="absolute inset-0 bg-white rounded-md shadow-sm border border-gray-100"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <EmailIcon />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors outline-none
                      ${focused === "email" ? "border-[#7A8B6A] ring-1 ring-[#7A8B6A]" : "border-gray-200 focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A]"}
                    `}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    required
                    minLength={6}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm transition-colors outline-none
                      ${focused === "password" ? "border-[#7A8B6A] ring-1 ring-[#7A8B6A]" : "border-gray-200 focus:border-[#7A8B6A] focus:ring-1 focus:ring-[#7A8B6A]"}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-2">
                <input required type="checkbox" className="mt-1 w-4 h-4 border-gray-300 rounded text-[#7A8B6A] focus:ring-[#7A8B6A] cursor-pointer" />
                <p className="text-sm text-gray-600">
                  I agree to the <Link href="#" className="text-[#7A8B6A] hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#7A8B6A] hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-[#7A8B6A] hover:bg-[#6c7d5c] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-lg shadow-sm transition-colors mt-4"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-sm text-gray-500 bg-white">or sign up with</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { name: "Google", icon: <GoogleIcon /> },
            { name: "GitHub", icon: <GitHubIcon /> },
          ].map(({ name, icon }) => (
            <motion.button
              key={name}
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin(name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {icon} Continue with {name}
            </motion.button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#7A8B6A] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}