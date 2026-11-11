// "use client";

// import { useEffect, useState } from "react";
// import Modal from "./Modal";
// import styles from "./teacher.module.css";

// export default function OtpModal({ open, email, title, onVerify, onResend, onClose }) {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [info, setInfo] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [cooldown, setCooldown] = useState(30);

//   useEffect(() => {
//     if (open) {
//       setOtp("");
//       setError("");
//       setInfo("");
//       setCooldown(30);
//     }
//   }, [open]);

//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [cooldown]);

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!/^\d{6}$/.test(otp)) {
//       setError("6 digit ka OTP likhein");
//       return;
//     }

//     setLoading(true);
//     const err = await onVerify(otp);
//     setLoading(false);

//     if (err) setError(err);
//   };

//   const handleResend = async () => {
//     setLoading(true);
//     setError("");
//     const err = await onResend();
//     setLoading(false);

//     if (err) {
//       setError(err);
//     } else {
//       setInfo("Naya OTP bhej diya gaya hai.");
//       setCooldown(30);
//     }
//   };

//   return (
//     <Modal open={open} title={title} onClose={onClose}>
//       <form onSubmit={handleVerify} noValidate className={styles.form}>
//         <p className={styles.hint}>
//           6 digit ka code <strong>{email}</strong> par bheja gaya hai.
//         </p>

//         <input
//           type="text"
//           inputMode="numeric"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => {
//             setOtp(e.target.value.replace(/\D/g, ""));
//             setError("");
//           }}
//           placeholder="000000"
//           className={styles.otpInput}
//           autoComplete="one-time-code"
//         />

//         {info && <div className={styles.okBox}>{info}</div>}
//         {error && <div className={styles.errBox}>{error}</div>}

//         <button type="submit" className={styles.primaryBtn} disabled={loading}>
//           {loading ? "Verifying..." : "Verify"}
//         </button>

//         <button
//           type="button"
//           className={styles.linkBtn}
//           onClick={handleResend}
//           disabled={cooldown > 0 || loading}
//         >
//           {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
//         </button>
//       </form>
//     </Modal>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import styles from "./teacher.module.css";

export default function OtpModal({ open, email, title, onVerify, onResend, onClose }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (open) {
      setOtp("");
      setError("");
      setInfo("");
      setCooldown(30);
    }
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    const err = await onVerify(otp);
    setLoading(false);

    if (err) setError(err);
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    const err = await onResend();
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      setInfo("A new OTP has been sent.");
      setCooldown(30);
    }
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={handleVerify} noValidate className={styles.form}>
        <p className={styles.hint}>
          A 6-digit code has been sent to <strong>{email}</strong>.
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          placeholder="000000"
          className={styles.otpInput}
          autoComplete="one-time-code"
        />

        {info && <div className={styles.okBox}>{info}</div>}
        {error && <div className={styles.errBox}>{error}</div>}

        <button type="submit" className={styles.primaryBtn} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          className={styles.linkBtn}
          onClick={handleResend}
          disabled={cooldown > 0 || loading}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </button>
      </form>
    </Modal>
  );
}