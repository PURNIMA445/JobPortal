"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/useLogin";
import AuthLayout, { GoogleIcon, GitHubIcon } from "@/components/layout/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const {
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
  } = useLogin(router);

  return (
    <AuthLayout
      title="Welcome <br /> back."
      subtitle="Continue your journey."
      description="Sign in to access your dashboard and opportunities tailored for you."
    >
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Sign in</h1>
        <p className="text-sm text-gray-500 mb-8">
          Don’t have an account?{" "}
          <Link href="/get-started" className="text-[#7A8B6A] font-semibold hover:underline">
            Sign up free
          </Link>
        </p>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { name: "Google", icon: <GoogleIcon /> },
            { name: "GitHub", icon: <GitHubIcon /> },
          ].map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin(name)}
              className="border border-gray-200 hover:bg-gray-50 text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {icon} Continue with {name}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 font-medium">
            ⚠ {error}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* EMAIL */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wide">Email Address</label>
            <div
              className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center transition-all duration-200"
              style={{ boxShadow: focused === "email" ? "4px 4px 0 #7A8B6A" : "none" }}
            >
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="w-full outline-none bg-transparent text-sm text-gray-900"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wide">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#7A8B6A] hover:underline">
                Forgot?
              </Link>
            </div>
            <div
              className="border-2 border-gray-800 bg-white px-3 py-2 flex items-center transition-all duration-200"
              style={{ boxShadow: focused === "password" ? "4px 4px 0 #7A8B6A" : "none" }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                className="flex-1 outline-none bg-transparent text-sm text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#7A8B6A] font-bold outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* CHECKBOX */}
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[#7A8B6A] w-4 h-4" />
            <span className="text-gray-600">Keep me signed in</span>
          </div>

          {/* BUTTON */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-[#7A8B6A] hover:bg-[#6A7B5C] text-white py-3 font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOG IN"}
          </motion.button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you accept Terms & Privacy Policy.
        </p>
      </div>
    </AuthLayout>
  );
}