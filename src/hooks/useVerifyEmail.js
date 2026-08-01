import { useState, useEffect, useRef } from "react";
import { sendVerificationOtp, verifyEmail as verifyEmailApi } from "@/lib/services/auth.service";

export function useVerifyEmail(email, router) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resendError, setResendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  const inputRefs = useRef([]);

  // Initial load state: pending | ready | failed
  const [initStatus, setInitStatus] = useState("pending");
  const [initError, setInitError] = useState("");

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // On mount, send the initial OTP
  useEffect(() => {
    let cancelled = false;

    const sendInitialOtp = async () => {
      if (!email) {
        setInitStatus("failed");
        setInitError("No email address provided.");
        return;
      }

      try {
        await sendVerificationOtp(email);
        if (!cancelled) setInitStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setInitStatus("failed");
        setInitError(err.message || "Could not send verification code.");
      }
    };

    sendInitialOtp();
    return () => { cancelled = true; };
  }, [email]);

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

  const otpString = otp.join("");

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setError("");
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await verifyEmailApi(email, otpString);
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setResendError("");
    startResendCooldown();

    try {
      await sendVerificationOtp(email);
      setResendMsg("Code resent! Check your inbox.");
    } catch (err) {
      setResendError(err.message || "Failed to resend code. Try again later.");
    }
  };

  return {
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
  };
}
