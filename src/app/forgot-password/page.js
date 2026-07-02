"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = request code, 2 = reset password
  const [email, setEmail] = useState("");

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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {step === 1 && (
          <>
            <h1 style={styles.heading}>Forgot your password?</h1>
            <p style={styles.subtext}>
              Enter your email address and we&apos;ll send you a code to reset your password.
            </p>

            <form onSubmit={handleSendCode} style={styles.form}>
              <label style={styles.label} htmlFor="email-input">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setStep1Error("");
                  setEmail(e.target.value);
                }}
                placeholder="you@example.com"
                style={styles.input}
              />

              {step1Error && <p style={styles.errorText}>{step1Error}</p>}

              <button
                type="submit"
                disabled={step1Loading}
                style={{
                  ...styles.primaryBtn,
                  opacity: step1Loading ? 0.7 : 1,
                  cursor: step1Loading ? "not-allowed" : "pointer",
                }}
              >
                {step1Loading ? "Sending..." : "Send reset code"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={styles.heading}>Reset your password</h1>
            <p style={styles.subtext}>A 6-digit code was sent to:</p>
            <p style={styles.email}>{email}</p>

            {success ? (
              <p style={styles.successBox}>{success}</p>
            ) : (
              <form onSubmit={handleResetPassword} style={styles.form}>
                <label style={styles.label} htmlFor="otp-input">
                  Enter OTP
                </label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setStep2Error("");
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  }}
                  placeholder="123456"
                  style={styles.otpInput}
                />

                <label style={styles.label} htmlFor="new-password-input">
                  New Password
                </label>
                <input
                  id="new-password-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setStep2Error("");
                    setNewPassword(e.target.value);
                  }}
                  placeholder="Enter new password"
                  style={styles.input}
                />

                <label style={styles.label} htmlFor="confirm-password-input">
                  Confirm Password
                </label>
                <input
                  id="confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setStep2Error("");
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="Confirm new password"
                  style={styles.input}
                />

                {step2Error && <p style={styles.errorText}>{step2Error}</p>}

                <button
                  type="submit"
                  disabled={step2Loading}
                  style={{
                    ...styles.primaryBtn,
                    opacity: step2Loading ? 0.7 : 1,
                    cursor: step2Loading ? "not-allowed" : "pointer",
                  }}
                >
                  {step2Loading ? "Resetting..." : "Reset Password"}
                </button>

                <div style={styles.resendRow}>
                  <span style={styles.resendLabel}>Didn&apos;t receive a code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendDisabled}
                    style={{
                      ...styles.resendBtn,
                      opacity: resendDisabled ? 0.5 : 1,
                      cursor: resendDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {resendDisabled ? `Resend code (${countdown}s)` : "Resend code"}
                  </button>
                </div>

                {resendMsg && <p style={styles.resendSuccess}>{resendMsg}</p>}
                {resendError && <p style={styles.errorText}>{resendError}</p>}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#1a1a1a",
  },
  subtext: {
    margin: 0,
    color: "#555",
    fontSize: "14px",
  },
  email: {
    margin: "0 0 8px 0",
    fontWeight: "600",
    color: "#1a1a1a",
    fontSize: "15px",
    wordBreak: "break-all",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "2px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
    boxSizing: "border-box",
  },
  otpInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "20px",
    letterSpacing: "8px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
    boxSizing: "border-box",
  },
  primaryBtn: {
    width: "100%",
    padding: "11px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    border: "none",
    borderRadius: "6px",
    marginTop: "4px",
  },
  resendRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
    flexWrap: "wrap",
  },
  resendLabel: {
    fontSize: "13px",
    color: "#666",
  },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "600",
    padding: 0,
    textDecoration: "underline",
  },
  resendSuccess: {
    color: "#16a34a",
    fontSize: "13px",
    margin: 0,
  },
  errorText: {
    color: "#dc2626",
    fontSize: "13px",
    margin: 0,
  },
  successBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    color: "#15803d",
    padding: "14px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
  },
};