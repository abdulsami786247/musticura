// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { getCurrentRole } from "@/lib/auth";
// import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
// import styles from "./login.module.css";

// export default function LoginPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [submitError, setSubmitError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showForgot, setShowForgot] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//     setSubmitError("");
//   };

//   const validate = () => {
//     const newErrors = {};
//     const email = form.email.trim();

//     if (!email) {
//       newErrors.email = "Email zaroori hai";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Sahi email likhein";
//     }

//     if (!form.password) {
//       newErrors.password = "Password zaroori hai";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitError("");

//     if (!validate()) return;

//     setLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email: form.email.trim(),
//       password: form.password,
//     });

//     if (error) {
//       setLoading(false);
//       const msg = error.message.toLowerCase();

//       if (msg.includes("email not confirmed")) {
//         setSubmitError("Aapka email verify nahi hua. Pehle registration ka OTP verify karein.");
//       } else if (msg.includes("invalid login credentials")) {
//         setSubmitError("Email ya password galat hai.");
//       } else {
//         setSubmitError("Login nahi ho saka. Dobara koshish karein.");
//       }
//       return;
//     }

//     const { role } = await getCurrentRole();

//     if (!role) {
//       await supabase.auth.signOut();
//       setLoading(false);
//       setSubmitError("Ye account student ya teacher ke taur par registered nahi hai.");
//       return;
//     }

//     router.replace(`/${role}`);
//   };

//   return (
//     <main className={styles.page}>
//       <div className={styles.card}>
//         <h1 className={styles.title}>Welcome back</h1>
//         <p className={styles.subtitle}>Apne account mein login karein</p>

//         <form onSubmit={handleSubmit} noValidate className={styles.form}>
//           <div className={styles.field}>
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               className={errors.email ? styles.inputError : ""}
//               autoComplete="email"
//             />
//             {errors.email && <span className={styles.error}>{errors.email}</span>}
//           </div>

//           <div className={styles.field}>
//             <label htmlFor="password">Password</label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Apna password likhein"
//               className={errors.password ? styles.inputError : ""}
//               autoComplete="current-password"
//             />
//             {errors.password && <span className={styles.error}>{errors.password}</span>}
//           </div>

//           <div className={styles.forgotRow}>
//             <button
//               type="button"
//               className={styles.linkButton}
//               onClick={() => setShowForgot(true)}
//             >
//               Forgot password?
//             </button>
//           </div>

//           {submitError && <div className={styles.submitError}>{submitError}</div>}

//           <button type="submit" className={styles.button} disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className={styles.footerText}>
//           Account nahi hai? <Link href="/register">Register karein</Link>
//         </p>
//       </div>

//       <ForgotPasswordDialog open={showForgot} onClose={() => setShowForgot(false)} />
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentRole } from "@/lib/auth";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};
    const email = form.email.trim();

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setLoading(false);
      const msg = error.message.toLowerCase();

      if (msg.includes("email not confirmed")) {
        setSubmitError("Your email is not verified. Please verify the registration OTP first.");
      } else if (msg.includes("invalid login credentials")) {
        setSubmitError("Email or password is incorrect.");
      } else {
        setSubmitError("Login failed. Please try again.");
      }
      return;
    }

    const { role } = await getCurrentRole();

    if (!role) {
      await supabase.auth.signOut();
      setLoading(false);
      setSubmitError("This account is not registered as a student or teacher.");
      return;
    }

    router.replace(`/${role}`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Log in to your account</p>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? styles.inputError : ""}
              autoComplete="email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? styles.inputError : ""}
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <div className={styles.forgotRow}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>

          {submitError && <div className={styles.submitError}>{submitError}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>

      <ForgotPasswordDialog open={showForgot} onClose={() => setShowForgot(false)} />
    </main>
  );
}