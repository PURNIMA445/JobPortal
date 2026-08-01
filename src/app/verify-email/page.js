"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const {
    otp,
    otpString,
    inputRefs,
    error,
    success,
    resendMsg,
    resendError,
    loading,
    resendDisabled,
    countdown,
    initStatus,
    initError,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerify,
    handleResend,
  } = useVerifyEmail(email, router);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex items-center justify-center px-4 py-16 selection:bg-[#7A8B6A] selection:text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#E8E1D5]/25 rounded-bl-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#EEF4EC]/40 rounded-tr-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#7A8B6A] flex items-center justify-center shadow-sm group-hover:bg-[#687A5D] transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-serif text-xl font-medium text-[#1C1F1A] tracking-tight">JobPortal</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-[#E8E1D5] px-8 py-10">
          
          {/* Email icon header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#EEF4EC] flex items-center justify-center mb-5 border border-[#C2D9BE]">
              <svg className="w-7 h-7 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-medium text-[#1C1F1A] mb-1">Verify your email</h1>
            <p className="text-[#6B7264] text-sm text-center">
              We sent a 6-digit code to your inbox
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* PENDING */}
            {initStatus === "pending" && (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-6 gap-4"
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-[#7A8B6A]"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-[#6B7264] text-sm">Sending verification code...</p>
              </motion.div>
            )}

            {/* FAILED */}
            {initStatus === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-4 text-center">
                  <p className="text-[#DC2626] text-sm font-medium">{initError}</p>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3.5 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-sm text-sm"
                >
                  Back to Login
                </button>
              </motion.div>
            )}

            {/* READY */}
            {initStatus === "ready" && !success && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {/* Email display */}
                <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-2xl px-4 py-3 flex items-center gap-3">
                  <svg className="w-4 h-4 text-[#7A8B6A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[#1C1F1A] text-sm font-medium truncate">{email || "your email address"}</span>
                </div>

                {/* OTP Boxes */}
                <div>
                  <label className="block text-xs font-semibold text-[#6B7264] uppercase tracking-wider mb-3">
                    Enter 6-digit code
                  </label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all bg-[#FDFBF7] text-[#1C1F1A]
                          ${digit ? "border-[#7A8B6A] bg-[#EEF4EC]" : "border-[#E8E1D5]"}
                          focus:border-[#7A8B6A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(122,139,106,0.15)]
                        `}
                      />
                    ))}
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-2.5"
                    >
                      <p className="text-[#DC2626] text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={loading || otpString.length !== 6}
                  className="w-full py-3.5 bg-[#7A8B6A] hover:bg-[#687A5D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Email
                    </>
                  )}
                </button>

                {/* Resend */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[#6B7264] text-sm">Didn&apos;t receive a code?</span>
                  <button
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className="text-[#7A8B6A] hover:text-[#687A5D] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                  >
                    {resendDisabled ? `Resend (${countdown}s)` : "Resend code"}
                  </button>
                </div>

                <AnimatePresence>
                  {resendMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="bg-[#EEF4EC] border border-[#C2D9BE] rounded-xl px-4 py-2.5 text-center"
                    >
                      <p className="text-[#5C7356] text-sm font-medium">✓ {resendMsg}</p>
                    </motion.div>
                  )}
                  {resendError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-2.5"
                    >
                      <p className="text-[#DC2626] text-sm">{resendError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* SUCCESS */}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-6 gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#EEF4EC] flex items-center justify-center border border-[#C2D9BE]">
                  <svg className="w-8 h-8 text-[#7A8B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-serif text-xl font-medium text-[#1C1F1A] mb-1">Verified!</p>
                  <p className="text-[#6B7264] text-sm">{success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back link */}
        <p className="text-center text-sm text-[#6B7264] mt-6">
          <Link href="/login" className="text-[#7A8B6A] hover:text-[#687A5D] font-medium transition-colors">
            ← Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-[#7A8B6A] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}