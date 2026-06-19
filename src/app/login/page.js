"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  loginUser,
  getCandidateProfile,
  getRecruiterProfile,
} from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

      if (data.role === "CANDIDATE") {
        try {
          await getCandidateProfile();
          router.push("/dashboard/candidate");
        } catch {
          router.push("/profile/setup");
        }
      } else if (data.role === "RECRUITER") {
        try {
          await getRecruiterProfile();
          router.push("/dashboard/recruiter");
        } catch {
          router.push("/recruiter/setup");
        }
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-800 bg-white">

      {/* ───────── LEFT PANEL (FULL WORTHY JORDAN STYLE) ───────── */}
      <div className="hidden lg:flex w-[40%] bg-[#F5F2EB] flex-col justify-between p-12 relative overflow-hidden">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-16 w-max">
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
              <path d="M14 2C10 2 7 6 7 11C7 16 10 20 14 24C18 20 21 16 21 11C21 6 18 2 14 2Z" fill="#C8A96E" />
              <path d="M14 2C13 2 11 6 11 11C11 16 13 20 14 24C15 20 17 16 17 11C17 6 15 2 14 2Z" fill="#E8C98E" opacity="0.5" />
            </svg>

            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                Worthy
              </h1>
              <p className="font-serif text-sm italic text-[#7A8B6A] -mt-1">
                Jordan
              </p>
            </div>
          </Link>

          <h2 className="text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
            Welcome <br /> back.
          </h2>

          <div className="w-12 h-1 bg-[#7A8B6A] mb-6" />

          <p className="text-gray-700 text-lg mb-2">
            Continue your journey.
          </p>

          <p className="text-gray-600 max-w-sm">
            Sign in to access your dashboard and opportunities tailored for you.
          </p>
        </motion.div>

        {/* SVG Illustration */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none">
          <svg viewBox="0 0 500 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMax slice">
            <path d="M 100 150 Q 130 130 160 150 Q 190 130 220 150" stroke="#FFF" strokeWidth="20" strokeLinecap="round" opacity="0.5" fill="none" />
            <path d="M 350 180 Q 380 160 410 180 Q 440 160 470 180" stroke="#FFF" strokeWidth="15" strokeLinecap="round" opacity="0.5" fill="none" />
            <path d="M 0 300 Q 150 200 300 280 T 550 250 L 550 400 L 0 400 Z" fill="#C5D3BA" opacity="0.6" />
            <path d="M -50 350 Q 100 250 250 320 T 600 280 L 600 400 L -50 400 Z" fill="#A7B99A" opacity="0.8" />
            <path d="M -100 400 Q 100 300 250 380 T 600 330 L 600 450 L -100 450 Z" fill="#8C9E7D" />
            <g transform="translate(180, 100)">
              <path d="M 20 0 C 40 0 50 20 50 40 C 50 65 30 80 25 90 L 15 90 C 10 80 -10 65 -10 40 C -10 20 0 0 20 0 Z" fill="#F4D090" />
              <path d="M 20 0 C 30 0 35 20 35 40 C 35 65 25 80 22 90 L 18 90 C 15 80 5 65 5 40 C 5 20 10 0 20 0 Z" fill="#FFF" opacity="0.4" />
              <rect x="15" y="95" width="10" height="10" fill="#8C6E52" rx="2" />
              <line x1="17" y1="90" x2="16" y2="95" stroke="#4A3F35" strokeWidth="1" />
              <line x1="23" y1="90" x2="24" y2="95" stroke="#4A3F35" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 sm:p-12">

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >

          {/* Header */}
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Sign in
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Don’t have an account?{" "}
            <Link href="/get-started" className="text-[#7A8B6A] font-semibold">
              Sign up free
            </Link>
          </p>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { name: "Google" },
              { name: "GitHub" },
            ].map(({ name }) => (
              <button
                key={name}
                className="border border-gray-200 hover:bg-gray-50 text-sm py-3 rounded-lg"
              >
                Continue with {name}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600">
              ⚠ {error}
            </div>
          )}

          {/* ───────── FORM (UNCHANGED LOGIC) ───────── */}
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide">
                Email Address
              </label>

              <div
                className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center"
                style={{
                  boxShadow:
                    focused === "email" ? "4px 4px 0 #7A8B6A" : "none",
                }}
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full outline-none bg-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wide">
                  Password
                </label>

                <Link href="/forgot-password" className="text-xs text-[#7A8B6A]">
                  Forgot?
                </Link>
              </div>

              <div
                className="border-2 border-gray-800 bg-white px-3 py-2 flex items-center"
                style={{
                  boxShadow:
                    focused === "password" ? "4px 4px 0 #7A8B6A" : "none",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="flex-1 outline-none bg-transparent text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#7A8B6A] font-bold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CHECKBOX */}
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              <span className="text-gray-600">Keep me signed in</span>
            </div>

            {/* BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[#7A8B6A] text-white py-3 font-bold rounded-lg"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you accept Terms & Privacy Policy.
          </p>

        </motion.div>
      </div>
    </div>
  );
}