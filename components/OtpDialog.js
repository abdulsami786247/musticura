"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./OtpDialog.module.css";

export default function OtpDialog({ email, onVerified, onClose }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  // Resend button ka 30 second ka timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });
    setLoading(false);

    if (verifyError) {
      setError("Invalid or expired code. Please try again.");
      return;
    }

    onVerified();
  };

  const handleResend = async () => {
    setError("");
    setInfo("");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setInfo("A new code has been sent to your email.");
    setCooldown(30);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.icon}>✉️</div>
        <h3 className={styles.title}>Verify your email</h3>
        <p className={styles.text}>
          We have sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && <p className="alert alert-error">{error}</p>}
        {info && <p className="alert alert-success">{info}</p>}

        <form onSubmit={handleVerify}>
          <input
            className={styles.otpInput}
            type="text"
            inputMode="numeric"
            placeholder="••••••"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            autoFocus
          />

          <button type="submit" className={styles.verifyBtn} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <button
          type="button"
          className={styles.resend}
          onClick={handleResend}
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}