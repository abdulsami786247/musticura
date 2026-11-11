"use client";
import DescriptionSection from "./DescriptionSection";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { COURSES } from "@/lib/courses";
import Modal from "./Modal";
import OtpModal from "./OtpModal";
import styles from "./teacher.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

function validatePassword(pw) {
  if (pw.length < 8) return "Password kam az kam 8 characters ka ho";
  if (!/[A-Z]/.test(pw)) return "Password mein ek capital letter ho";
  if (!/[a-z]/.test(pw)) return "Password mein ek small letter ho";
  if (!/[0-9]/.test(pw)) return "Password mein ek number ho";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password mein ek special character ho";
  return "";
}

export default function ProfileDialog({ open, onClose, profile, courses, onChanged }) {
  const fileRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [phone, setPhone] = useState("");
  const [newCourse, setNewCourse] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailOtpOpen, setEmailOtpOpen] = useState(false);

  const [passOtpOpen, setPassOtpOpen] = useState(false);
  const [passSetOpen, setPassSetOpen] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");

  // Dialog khulne par form reset
  useEffect(() => {
    if (open) {
      setPhone(profile.phone || "");
      setNewCourse("");
      setNewEmail("");
      setMsg({ type: "", text: "" });
    }
  }, [open]);

  if (!open) return null;

  const showError = (text) => setMsg({ type: "error", text });
  const showOk = (text) => setMsg({ type: "success", text });

  const available = COURSES.filter((c) => !courses.includes(c));
  const initial = profile.username?.charAt(0).toUpperCase() || "T";

  // ---------- Profile picture ----------
  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      showError("Sirf JPG, PNG ya WEBP image upload karein");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showError("Image 2 MB se chhoti honi chahiye");
      return;
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;

    setBusy(true);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setBusy(false);
      showError("Photo upload nahi ho saki. Dobara koshish karein.");
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

    const { data, error } = await supabase.rpc("update_teacher_avatar", {
      p_url: urlData.publicUrl,
    });

    if (error || !data?.ok) {
      setBusy(false);
      showError("Photo save nahi ho saki.");
      return;
    }

    // Purani photo storage se hata dein
    if (profile.avatar_url) {
      const marker = "/storage/v1/object/public/avatars/";
      const oldPath = profile.avatar_url.split(marker)[1];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([decodeURIComponent(oldPath)]);
      }
    }

    setBusy(false);
    showOk("Profile picture update ho gayi.");
    onChanged();
  };

  // ---------- Phone ----------
  const savePhone = async () => {
    const value = phone.trim();

    if (!PHONE_REGEX.test(value)) {
      showError("Sahi phone number likhein (10 se 15 digits)");
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.rpc("update_teacher_phone", { p_phone: value });
    setBusy(false);

    if (error) {
      showError("Phone update nahi ho saka.");
      return;
    }

    if (!data?.ok) {
      showError("Ye phone number pehle se use ho raha hai.");
      return;
    }

    showOk("Phone number update ho gaya.");
    onChanged();
  };

  // ---------- Courses ----------
  const addCourse = async () => {
    if (!newCourse) {
      showError("Course select karein");
      return;
    }

    setBusy(true);
    const { error } = await supabase
      .from("teacher_courses")
      .insert({ teacher_id: profile.id, course: newCourse });
    setBusy(false);

    if (error) {
      showError(
        error.code === "23505"
          ? "Ye course aap pehle se add kar chuke hain."
          : "Course add nahi ho saka. Dobara koshish karein."
      );
      return;
    }

    setNewCourse("");
    showOk("Course add ho gaya.");
    onChanged();
  };

  const removeCourse = async (course) => {
    if (courses.length <= 1) {
      showError("Kam az kam ek course zaroori hai. Pehle naya course add karein.");
      return;
    }

    setBusy(true);
    const { error } = await supabase
      .from("teacher_courses")
      .delete()
      .eq("teacher_id", profile.id)
      .eq("course", course);
    setBusy(false);

    if (error) {
      showError("Course remove nahi ho saka.");
      return;
    }

    showOk(`${course} remove ho gaya.`);
    onChanged();
  };

  // ---------- Email ----------
  const requestEmailChange = async (email) => {
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      return error.message.toLowerCase().includes("rate")
        ? "Thori der baad dobara koshish karein."
        : "OTP bhejne mein masla aaya.";
    }
    return null;
  };

  const sendEmailOtp = async (e) => {
    e.preventDefault();
    const value = newEmail.trim().toLowerCase();

    if (!EMAIL_REGEX.test(value)) {
      showError("Sahi email likhein");
      return;
    }

    if (value === profile.email.toLowerCase()) {
      showError("Ye aap ki current email hai");
      return;
    }

    setBusy(true);
    const { data: exists, error: checkError } = await supabase.rpc("check_email_exists", {
      p_email: value,
    });

    if (checkError) {
      setBusy(false);
      showError("Kuch masla aaya. Dobara koshish karein.");
      return;
    }

    if (exists) {
      setBusy(false);
      showError("Ye email pehle se registered hai.");
      return;
    }

    const sendError = await requestEmailChange(value);
    setBusy(false);

    if (sendError) {
      showError(sendError);
      return;
    }

    setNewEmail(value);
    setEmailOtpOpen(true);
    setMsg({ type: "info", text: `OTP ${value} par bhej diya gaya hai.` });
  };

  const verifyEmailOtp = async (token) => {
    const { error } = await supabase.auth.verifyOtp({
      email: newEmail,
      token,
      type: "email_change",
    });

    if (error) return "Wrong OTP. Dobara check karein.";

    setEmailOtpOpen(false);
    setNewEmail("");
    showOk("Email update ho gayi.");
    onChanged();
    return null;
  };

  const resendEmailOtp = () => requestEmailChange(newEmail);

  // ---------- Password ----------
  const sendPassOtp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    setBusy(false);

    if (error) {
      showError("OTP bhejne mein masla aaya. Thori der baad dobara koshish karein.");
      return;
    }

    setMsg({ type: "info", text: `OTP ${profile.email} par bhej diya gaya hai.` });
    setPassOtpOpen(true);
  };

  const verifyPassOtp = async (token) => {
    const { error } = await supabase.auth.verifyOtp({
      email: profile.email,
      token,
      type: "recovery",
    });

    if (error) return "Wrong OTP. Dobara check karein.";

    setPassOtpOpen(false);
    setPassSetOpen(true);
    return null;
  };

  const resendPassOtp = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    return error ? "OTP dobara bhejne mein masla aaya." : null;
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPassError("");

    const pwError = validatePassword(newPass);
    if (pwError) {
      setPassError(pwError);
      return;
    }

    if (newPass !== confirmPass) {
      setPassError("Dono passwords same nahi hain");
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setBusy(false);

    if (error) {
      setPassError("Password change nahi ho saka. Dobara koshish karein.");
      return;
    }

    setPassSetOpen(false);
    setNewPass("");
    setConfirmPass("");
    showOk("Password change ho gaya.");
  };

  return (
    <>
      <Modal open title="My profile" onClose={onClose} wide>
        {msg.text && (
          <div className={msg.type === "error" ? styles.errBox : styles.okBox}>{msg.text}</div>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Profile picture</h3>
          <div className={styles.avatarRow}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className={styles.avatarLarge} />
            ) : (
              <div className={styles.avatarPlaceholder}>{initial}</div>
            )}

            <div className={styles.avatarActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => fileRef.current?.click()}
                disabled={busy}
              >
                Upload photo
              </button>
              <p className={styles.text}>JPG, PNG ya WEBP, 2 MB tak</p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatar}
              style={{ display: "none" }}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          <p className={styles.text}>Username: <strong>{profile.username}</strong></p>
          <p className={styles.text}>Current email: <strong>{profile.email}</strong></p>
        </section>
        <DescriptionSection profile={profile} />
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Phone number</h3>
          <div className={styles.inline}>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
            />
            <button type="button" className={styles.primaryBtn} onClick={savePhone} disabled={busy}>
              Update
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>My courses</h3>

          {courses.length === 0 ? (
            <p className={styles.text}>Abhi koi course nahi hai.</p>
          ) : (
            <ul className={styles.courseList}>
              {courses.map((c) => (
                <li key={c} className={styles.courseItem}>
                  <span>{c}</span>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => removeCourse(c)}
                    disabled={busy}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.inline}>
            <select
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className={styles.input}
              disabled={!available.length}
            >
              <option value="">
                {available.length ? "Naya course select karein" : "Sab courses add ho chuke hain"}
              </option>
              {available.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={addCourse}
              disabled={busy || !available.length}
            >
              Add course
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Change email</h3>
          <form onSubmit={sendEmailOtp} className={styles.inline} noValidate>
            <input
              type="email"
              placeholder="new@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.primaryBtn} disabled={busy}>
              Send OTP
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Password</h3>
          <button type="button" className={styles.secondaryBtn} onClick={sendPassOtp} disabled={busy}>
            Change password
          </button>
        </section>
      </Modal>

      <OtpModal
        open={emailOtpOpen}
        email={newEmail}
        title="Verify new email"
        onVerify={verifyEmailOtp}
        onResend={resendEmailOtp}
        onClose={() => setEmailOtpOpen(false)}
      />

      <OtpModal
        open={passOtpOpen}
        email={profile.email}
        title="Verify to change password"
        onVerify={verifyPassOtp}
        onResend={resendPassOtp}
        onClose={() => setPassOtpOpen(false)}
      />

      <Modal open={passSetOpen} title="Set new password" onClose={() => setPassSetOpen(false)}>
        <form onSubmit={savePassword} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="new-pass">New password</label>
            <input
              id="new-pass"
              type="password"
              value={newPass}
              onChange={(e) => {
                setNewPass(e.target.value);
                setPassError("");
              }}
              className={styles.input}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm-pass">Confirm password</label>
            <input
              id="confirm-pass"
              type="password"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                setPassError("");
              }}
              className={styles.input}
              autoComplete="new-password"
            />
          </div>

          {passError && <div className={styles.errBox}>{passError}</div>}

          <button type="submit" className={styles.primaryBtn} disabled={busy}>
            {busy ? "Saving..." : "Change password"}
          </button>
        </form>
      </Modal>
    </>
  );
}