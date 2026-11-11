// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { getCurrentRole } from "@/lib/auth";
// import styles from "./ForgotPasswordDialog.module.css";

// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// export default function ForgotPasswordDialog({ open, onClose }) {
//   const router = useRouter();

//   const [step, setStep] = useState("email"); // "email" | "otp"
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [info, setInfo] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [cooldown, setCooldown] = useState(0);

//   // Dialog band hone par sab reset
//   useEffect(() => {
//     if (!open) {
//       setStep("email");
//       setEmail("");
//       setOtp("");
//       setError("");
//       setInfo("");
//       setLoading(false);
//       setCooldown(0);
//     }
//   }, [open]);

//   // Resend ka 30 second cooldown
//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [cooldown]);

//   // Step 1: email check karke OTP bhejna
//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setInfo("");

//     const trimmed = email.trim();

//     if (!EMAIL_REGEX.test(trimmed)) {
//       setError("Sahi email likhein");
//       return;
//     }

//     setLoading(true);

//     const { data: exists, error: checkError } = await supabase.rpc(
//       "check_email_exists",
//       { p_email: trimmed }
//     );

//     if (checkError) {
//       setLoading(false);
//       setError("Kuch masla aaya. Dobara koshish karein.");
//       return;
//     }

//     if (!exists) {
//       setLoading(false);
//       setError("Email not exist");
//       return;
//     }

//     const { error: sendError } = await supabase.auth.resetPasswordForEmail(trimmed);

//     setLoading(false);

//     if (sendError) {
//       const msg = sendError.message.toLowerCase();
//       setError(
//         msg.includes("rate")
//           ? "Thori der baad dobara koshish karein."
//           : "OTP bhejne mein masla aaya. Dobara koshish karein."
//       );
//       return;
//     }

//     setEmail(trimmed);
//     setStep("otp");
//     setCooldown(30);
//     setInfo(`OTP ${trimmed} par bhej diya gaya hai.`);
//   };

//   // Step 2: OTP verify karke login karana
//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setInfo("");

//     if (!/^\d{6}$/.test(otp)) {
//       setError("6 digit ka OTP likhein");
//       return;
//     }

//     setLoading(true);

//     const { error: verifyError } = await supabase.auth.verifyOtp({
//       email,
//       token: otp,
//       type: "recovery",
//     });

//     if (verifyError) {
//       setLoading(false);
//       setError("Wrong OTP. Dobara check karein.");
//       return;
//     }

//     // OTP sahi hai, ab role check karein
//     const { user, role } = await getCurrentRole();

//     if (!user || !role) {
//       await supabase.auth.signOut();
//       setLoading(false);
//       setError("Ye account student ya teacher ke taur par registered nahi hai.");
//       return;
//     }

//     setLoading(false);
//     onClose();
//     router.replace(`/${role}`);
//   };

//   // OTP dobara bhejna
//   const handleResend = async () => {
//     if (cooldown > 0 || loading) return;

//     setError("");
//     setInfo("");
//     setLoading(true);

//     const { error: sendError } = await supabase.auth.resetPasswordForEmail(email);

//     setLoading(false);

//     if (sendError) {
//       setError("OTP dobara bhejne mein masla aaya.");
//       return;
//     }

//     setCooldown(30);
//     setInfo("Naya OTP bhej diya gaya hai.");
//   };

//   if (!open) return null;

//   return (
//     <div className={styles.overlay} onClick={onClose} role="presentation">
//       <div
//         className={styles.dialog}
//         onClick={(e) => e.stopPropagation()}
//         role="dialog"
//         aria-modal="true"
//       >
//         <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
//           ×
//         </button>

//         {step === "email" ? (
//           <form onSubmit={handleEmailSubmit} noValidate className={styles.form}>
//             <h2 className={styles.title}>Forgot password</h2>
//             <p className={styles.subtitle}>
//               Apna registered email likhein. Us par OTP bheja jayega.
//             </p>

//             <div className={styles.field}>
//               <label htmlFor="forgot-email">Email</label>
//               <input
//                 id="forgot-email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="you@example.com"
//                 autoComplete="email"
//                 className={error ? styles.inputError : ""}
//               />
//             </div>

//             {error && <div className={styles.errorBox}>{error}</div>}

//             <button type="submit" className={styles.button} disabled={loading}>
//               {loading ? "Checking..." : "Send OTP"}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleOtpSubmit} noValidate className={styles.form}>
//             <h2 className={styles.title}>Enter OTP</h2>
//             <p className={styles.subtitle}>
//               6 digit ka code <strong>{email}</strong> par bheja gaya hai.
//             </p>

//             <div className={styles.field}>
//               <label htmlFor="forgot-otp">OTP</label>
//               <input
//                 id="forgot-otp"
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={6}
//                 value={otp}
//                 onChange={(e) => {
//                   setOtp(e.target.value.replace(/\D/g, ""));
//                   setError("");
//                 }}
//                 placeholder="000000"
//                 className={`${styles.otpInput} ${error ? styles.inputError : ""}`}
//                 autoComplete="one-time-code"
//               />
//             </div>

//             {info && <div className={styles.infoBox}>{info}</div>}
//             {error && <div className={styles.errorBox}>{error}</div>}

//             <button type="submit" className={styles.button} disabled={loading}>
//               {loading ? "Verifying..." : "Verify & Login"}
//             </button>

//             <div className={styles.row}>
//               <button
//                 type="button"
//                 className={styles.linkButton}
//                 onClick={handleResend}
//                 disabled={cooldown > 0 || loading}
//               >
//                 {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
//               </button>

//               <button
//                 type="button"
//                 className={styles.linkButton}
//                 onClick={() => {
//                   setStep("email");
//                   setOtp("");
//                   setError("");
//                   setInfo("");
//                 }}
//               >
//                 Change email
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentRole } from "@/lib/auth";
import styles from "./ForgotPasswordDialog.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordDialog({ open, onClose }) {
  const router = useRouter();

  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Reset everything when the dialog is closed
  useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setOtp("");
      setError("");
      setInfo("");
      setLoading(false);
      setCooldown(0);
    }
  }, [open]);

  // 30 second cooldown for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Step 1: check email and send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const trimmed = email.trim();

    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    const { data: exists, error: checkError } = await supabase.rpc(
      "check_email_exists",
      { p_email: trimmed }
    );

    if (checkError) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    if (!exists) {
      setLoading(false);
      setError("Email not exist");
      return;
    }

    const { error: sendError } = await supabase.auth.resetPasswordForEmail(trimmed);

    setLoading(false);

    if (sendError) {
      const msg = sendError.message.toLowerCase();
      setError(
        msg.includes("rate")
          ? "Please try again after some time."
          : "There was a problem sending the OTP. Please try again."
      );
      return;
    }

    setEmail(trimmed);
    setStep("otp");
    setCooldown(30);
    setInfo(`OTP has been sent to ${trimmed}.`);
  };

  // Step 2: verify OTP and log the user in
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (verifyError) {
      setLoading(false);
      setError("Wrong OTP. Please check again.");
      return;
    }

    // OTP is correct, now check the role
    const { user, role } = await getCurrentRole();

    if (!user || !role) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account is not registered as a student or teacher.");
      return;
    }

    setLoading(false);
    onClose();
    router.replace(`/${role}`);
  };

  // Resend OTP
  const handleResend = async () => {
    if (cooldown > 0 || loading) return;

    setError("");
    setInfo("");
    setLoading(true);

    const { error: sendError } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);

    if (sendError) {
      setError("There was a problem resending the OTP.");
      return;
    }

    setCooldown(30);
    setInfo("A new OTP has been sent.");
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} noValidate className={styles.form}>
            <h2 className={styles.title}>Forgot password</h2>
            <p className={styles.subtitle}>
              Enter your registered email. An OTP will be sent to it.
            </p>

            <div className={styles.field}>
              <label htmlFor="forgot-email">Email</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className={error ? styles.inputError : ""}
              />
            </div>

            {error && <div className={styles.errorBox}>{error}</div>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Checking..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} noValidate className={styles.form}>
            <h2 className={styles.title}>Enter OTP</h2>
            <p className={styles.subtitle}>
              A 6-digit code has been sent to <strong>{email}</strong>.
            </p>

            <div className={styles.field}>
              <label htmlFor="forgot-otp">OTP</label>
              <input
                id="forgot-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="000000"
                className={`${styles.otpInput} ${error ? styles.inputError : ""}`}
                autoComplete="one-time-code"
              />
            </div>

            {info && <div className={styles.infoBox}>{info}</div>}
            {error && <div className={styles.errorBox}>{error}</div>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <div className={styles.row}>
              <button
                type="button"
                className={styles.linkButton}
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>

              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                  setInfo("");
                }}
              >
                Change email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}