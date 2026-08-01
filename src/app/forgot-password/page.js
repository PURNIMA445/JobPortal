"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layout/AuthLayout";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = request code, 2 = reset password
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(null);

  // Step 1 state
  const [step1Error, setStep1Error] = useState("");
  const [step1Loading, setStep1Loading] = useState(false);

  // Step 2 state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step2Error, setStep2Error] = useState("");
  const [step2Loading, setStep2Loading] = useState(false);
  const [success, setSuccess] = useState("");

  // Resend state
  const [resendMsg, setResendMsg] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

  const startResendCooldown = () => {
    setResendDisabled(true);
    setCountdown(30);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setStep1Error("");

    if (!email) {
      setStep1Error("Please enter your email address.");
      return;
    }

    setStep1Loading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStep(2);
      } else {
        setStep1Error(data.message || "Failed to send reset code. Please try again.");
      }
    } catch {
      setStep1Error("Network error. Please check your connection.");
    } finally {
      setStep1Loading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setResendError("");
    startResendCooldown();

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setResendMsg("Code resent! Check your inbox.");
      } else {
        setResendError(data.message || "Failed to resend code. Try again later.");
      }
    } catch {
      setResendError("Network error. Please check your connection.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStep2Error("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setStep2Error("Please enter the 6-digit OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setStep2Error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStep2Error("Passwords do not match.");
      return;
    }

    setStep2Loading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setStep2Error(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setStep2Error("Network error. Please check your connection.");
    } finally {
      setStep2Loading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot <br /> password."
      subtitle="Don't worry."
      description="We'll help you get back on track so you don't miss out on opportunities."
    >
      <div className="w-full max-w-md mx-auto">
        {step === 1 && (
          <>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Forgot password?</h1>
            <p className="text-sm text-gray-500 mb-8">
              Enter your email address and we'll send you a code to reset your password.
            </p>

            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide">Email Address</label>
                <div
                  className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center transition-all duration-200"
                  style={{ boxShadow: focused === "email" ? "4px 4px 0 #7A8B6A" : "none" }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setStep1Error("");
                      setEmail(e.target.value);
                    }}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="you@example.com"
                    className="w-full outline-none bg-transparent text-sm text-gray-900"
                    required
                  />
                </div>
              </div>

              {step1Error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 font-medium">
                  ⚠ {step1Error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={step1Loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-[#7A8B6A] hover:bg-[#6A7B5C] text-white py-3 font-bold rounded-lg transition-colors disabled:opacity-50 mt-4"
              >
                {step1Loading ? "Sending..." : "Send Reset Code"}
              </motion.button>
            </form>
            
            <p className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{" "}
              <Link href="/login" className="text-[#7A8B6A] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Reset password</h1>
            <p className="text-sm text-gray-500 mb-6">
              A 6-digit code was sent to: <span className="font-semibold text-gray-900">{email}</span>
            </p>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg font-medium text-center">
                {success}
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide">Enter OTP</label>
                  <div
                    className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center transition-all duration-200"
                    style={{ boxShadow: focused === "otp" ? "4px 4px 0 #7A8B6A" : "none" }}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setStep2Error("");
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      }}
                      onFocus={() => setFocused("otp")}
                      onBlur={() => setFocused(null)}
                      placeholder="123456"
                      className="w-full outline-none bg-transparent text-xl text-center tracking-[0.5em] text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide">New Password</label>
                  <div
                    className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center transition-all duration-200"
                    style={{ boxShadow: focused === "newPassword" ? "4px 4px 0 #7A8B6A" : "none" }}
                  >
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setStep2Error("");
                        setNewPassword(e.target.value);
                      }}
                      onFocus={() => setFocused("newPassword")}
                      onBlur={() => setFocused(null)}
                      placeholder="Enter new password"
                      className="w-full outline-none bg-transparent text-sm text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide">Confirm Password</label>
                  <div
                    className="border-2 border-gray-800 bg-white px-3 py-2 mt-1 flex items-center transition-all duration-200"
                    style={{ boxShadow: focused === "confirmPassword" ? "4px 4px 0 #7A8B6A" : "none" }}
                  >
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setStep2Error("");
                        setConfirmPassword(e.target.value);
                      }}
                      onFocus={() => setFocused("confirmPassword")}
                      onBlur={() => setFocused(null)}
                      placeholder="Confirm new password"
                      className="w-full outline-none bg-transparent text-sm text-gray-900"
                      required
                    />
                  </div>
                </div>

                {step2Error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 font-medium">
                    ⚠ {step2Error}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={step2Loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-[#7A8B6A] hover:bg-[#6A7B5C] text-white py-3 font-bold rounded-lg transition-colors disabled:opacity-50 mt-4"
                >
                  {step2Loading ? "Resetting..." : "Reset Password"}
                </motion.button>

                <div className="flex items-center gap-2 mt-4 text-sm">
                  <span className="text-gray-600">Didn't receive a code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className="text-[#7A8B6A] font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                  </button>
                </div>

                {resendMsg && <p className="text-sm text-green-600 font-medium">{resendMsg}</p>}
                {resendError && <p className="text-sm text-red-600 font-medium">{resendError}</p>}
              </form>
            )}
          </>
        )}
      </div>
    </AuthLayout>
  );
}