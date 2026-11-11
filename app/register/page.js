"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OtpDialog from "@/components/OtpDialog";
import styles from "./register.module.css";

const courses = [
  "Digital Marketing",
  "Shopify",
  "Graphic Designing",
  "Video Editing",
  "SEO",
  "Web Development",
];

const roles = [
  { value: "student", icon: "🎓", title: "Student", text: "I want to learn" },
  { value: "teacher", icon: "👨‍🏫", title: "Teacher", text: "I want to teach" },
];

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const initialForm = {
  username: "",
  email: "",
  phone: "",
  role: "",
  course: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim())) {
    return "Username must be 3 to 20 characters (letters, numbers or underscore).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return "Please enter a valid email address.";
  }
  if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/[\s-]/g, ""))) {
    return "Please enter a valid phone number (10 to 15 digits).";
  }
  if (!form.role) {
    return "Please select a role (Student or Teacher).";
  }
  if (!form.course) {
    return "Please select one course.";
  }
  if (!passwordRules.every((rule) => rule.test(form.password))) {
    return "Password does not meet all the requirements below.";
  }
  if (form.password !== form.confirmPassword) {
    return "Passwords do not match.";
  }
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [registered, setRegistered] = useState(false);

  // /register?role=teach ya /register?role=learn se role pehle select ho jata hai
  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "teach") setForm((p) => ({ ...p, role: "teacher" }));
    if (role === "learn") setForm((p) => ({ ...p, role: "student" }));
  }, []);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();
      const username = form.username.trim();
      const phone = form.phone.replace(/[\s-]/g, "");

      // 1. Check karein username, email aur phone pehle se to nahi hain
      const { data: availability, error: checkError } = await supabase.rpc(
        "check_availability",
        { p_username: username, p_email: email, p_phone: phone }
      );
      if (checkError) throw checkError;

      if (availability.username_taken) throw new Error("This username is already taken.");
      if (availability.email_taken) {
        throw new Error("This email is already registered. Please use another email or login.");
      }
      if (availability.phone_taken) throw new Error("This phone number is already registered.");

      // 2. Sign up karein. Supabase OTP email bhej dega
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: {
            username,
            phone,
            role: form.role,
            course: form.course,
          },
        },
      });
      if (signUpError) throw signUpError;

      if (!data.user || data.user.identities?.length === 0) {
        throw new Error("This email is already registered. Please login.");
      }

      // 3. OTP dialog kholein
      setPendingEmail(email);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = async () => {
    setPendingEmail("");

    // Welcome email bhejein (fail hone par bhi registration na ruke)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetch("/api/welcome-email", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
      }
    } catch (err) {
      console.error("Welcome email failed:", err);
    }

    // Login page par user ko dobara login karna hoga
    await supabase.auth.signOut();

    setForm(initialForm);
    setRegistered(true);
    setTimeout(() => router.push("/login"), 3000);
  };

  if (registered) {
    return (
      <section className={`auth-wrapper ${styles.page}`}>
        <div className="auth-card">
          <div className={styles.successIcon}>✓</div>
          <h1>Registered Successfully!</h1>
          <p className="subtitle">
            Check your email for next steps. Our team will get in touch with you soon.
          </p>
          <p className="auth-footer">
            Redirecting to login... <Link href="/login">Go now</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`auth-wrapper ${styles.page}`}>
      <div className="auth-card">
        <h1>Create an Account</h1>
        <p className="subtitle">Join as a student or teacher and start today</p>

        {error && <p className="alert alert-error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Contact Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <span className={styles.fieldLabel}>I want to</span>
            <div className={styles.roleGrid}>
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  className={`${styles.roleBtn} ${form.role === r.value ? styles.active : ""}`}
                  onClick={() => setField("role", r.value)}
                >
                  <span className={styles.roleIcon}>{r.icon}</span>
                  <span className={styles.roleTitle}>{r.title}</span>
                  <span className={styles.roleText}>{r.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className={styles.fieldLabel}>
              {form.role === "teacher" ? "Course you will teach" : "Course you want to learn"}{" "}
              <small>(select one)</small>
            </span>
            <div className={styles.courseGrid}>
              {courses.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`${styles.courseBtn} ${form.course === c ? styles.active : ""}`}
                  onClick={() => setField("course", c)}
                >
                  {form.course === c && <span className={styles.check}>✓</span>}
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {form.password && (
            <ul className={styles.rules}>
              {passwordRules.map((rule) => (
                <li key={rule.label} className={rule.test(form.password) ? styles.ok : ""}>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

          <button type="submit" className={`btn btn-primary full-btn ${styles.submit}`} disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>

      {pendingEmail && (
        <OtpDialog
          email={pendingEmail}
          onVerified={handleVerified}
          onClose={() => setPendingEmail("")}
        />
      )}
    </section>
  );
}