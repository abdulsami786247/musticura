// "use client";

// import { useEffect, useState } from "react";
// import Modal from "../teacher/Modal";
// import OtpModal from "../teacher/OtpModal";
// import shared from "../teacher/teacher.module.css";
// import styles from "./student.module.css";
// import { supabase } from "../../lib/supabase";
// import { COURSES } from "../../lib/courses";
// import { storagePathFromUrl } from "../../lib/storage";

// const AVATAR_BUCKET = "avatars";
// const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_AVATAR = 2 * 1024 * 1024;
// const PHONE_RE = /^\+?\d{10,15}$/;
// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// function validatePassword(pw) {
//   if (pw.length < 8) return "Password kam az kam 8 characters ka ho.";
//   if (!/[A-Z]/.test(pw)) return "Ek uppercase letter zaroori hai.";
//   if (!/[a-z]/.test(pw)) return "Ek lowercase letter zaroori hai.";
//   if (!/[0-9]/.test(pw)) return "Ek number zaroori hai.";
//   if (!/[^A-Za-z0-9]/.test(pw)) return "Ek special character zaroori hai.";
//   return null;
// }

// export default function StudentProfileDialog({
//   open,
//   onClose,
//   profile,
//   courses = [],
//   onSaved,
// }) {
//   const [msg, setMsg] = useState(null);
//   const [busy, setBusy] = useState(false);

//   // Phone
//   const [phone, setPhone] = useState("");

//   // Email
//   const [newEmail, setNewEmail] = useState("");
//   const [pendingEmail, setPendingEmail] = useState("");
//   const [emailOtpOpen, setEmailOtpOpen] = useState(false);

//   // Password
//   const [pwOtpOpen, setPwOtpOpen] = useState(false);
//   const [pwSetOpen, setPwSetOpen] = useState(false);
//   const [newPw, setNewPw] = useState("");
//   const [confirmPw, setConfirmPw] = useState("");
//   const [pwError, setPwError] = useState("");
//   const [pwSaving, setPwSaving] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setMsg(null);
//       setNewEmail("");
//     }
//   }, [open]);

//   useEffect(() => {
//     if (profile) {
//       setPhone(profile.phone || "");
//     }
//   }, [profile?.phone]);

//   const showOk = (text) => setMsg({ type: "success", text });
//   const showErr = (text) => setMsg({ type: "error", text });

//   if (!profile) return null;

//   const initial = profile.username?.charAt(0)?.toUpperCase() || "S";

//   // ---------- Profile picture ----------
//   async function handleAvatar(e) {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (!file) return;
//     setMsg(null);

//     if (!IMAGE_TYPES.includes(file.type))
//       return showErr("Sirf JPG, PNG ya WEBP image upload karein.");
//     if (file.size > MAX_AVATAR) return showErr("Image 2 MB se chhoti honi chahiye.");

//     setBusy(true);
//     const ext = file.name.split(".").pop().toLowerCase();
//     const path = `${profile.id}/avatar-${Date.now()}.${ext}`;

//     const { error: upErr } = await supabase.storage
//       .from(AVATAR_BUCKET)
//       .upload(path, file, { contentType: file.type });

//     if (upErr) {
//       setBusy(false);
//       return showErr("Picture upload nahi ho saki: " + upErr.message);
//     }

//     const url = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
//     const { data, error: rpcErr } = await supabase.rpc("update_student_avatar", {
//       p_url: url,
//     });

//     if (rpcErr || !data?.ok) {
//       await supabase.storage.from(AVATAR_BUCKET).remove([path]);
//       setBusy(false);
//       return showErr("Picture save nahi ho saki. Dobara koshish karein.");
//     }

//     if (profile.avatar_url) {
//       const oldPath = storagePathFromUrl(profile.avatar_url, AVATAR_BUCKET);
//       if (oldPath) await supabase.storage.from(AVATAR_BUCKET).remove([oldPath]);
//     }

//     setBusy(false);
//     showOk("Profile picture update ho gayi.");
//     onSaved();
//   }

//   // ---------- Phone ----------
//   async function savePhone(e) {
//     e.preventDefault();
//     setMsg(null);

//     const value = phone.trim();
//     if (!PHONE_RE.test(value))
//       return showErr("Phone 10 se 15 digits ka ho, aur sirf + se shuru ho sakta hai.");
//     if (value === profile.phone) return showErr("Ye wahi phone number hai.");

//     setBusy(true);
//     const { data, error } = await supabase.rpc("update_student_phone", {
//       p_phone: value,
//     });
//     setBusy(false);

//     if (error) return showErr("Phone update nahi ho saka: " + error.message);
//     if (!data?.ok)
//       return showErr(
//         data?.error === "phone_taken"
//           ? "Ye phone number pehle se registered hai."
//           : "Phone update nahi ho saka."
//       );

//     showOk("Phone number update ho gaya.");
//     onSaved();
//   }

//   // ---------- Courses (select / remove, koi limit nahi) ----------
//   async function toggleCourse(course) {
//     setMsg(null);

//     const isOn = courses.includes(course);
//     const next = isOn
//       ? courses.filter((c) => c !== course)
//       : [...courses, course];

//     setBusy(true);
//     const { data, error } = await supabase.rpc("set_student_courses", {
//       p_courses: next,
//     });
//     setBusy(false);

//     if (error) return showErr("Course save nahi ho saka: " + error.message);
//     if (!data?.ok)
//       return showErr(
//         data?.error === "invalid_course"
//           ? "Ye course valid nahi hai."
//           : "Course save nahi ho saka."
//       );

//     showOk(isOn ? `${course} remove ho gaya.` : `${course} add ho gaya.`);
//     onSaved();
//   }

//   // ---------- Email ----------
//   async function sendEmailOtp(e) {
//     e.preventDefault();
//     setMsg(null);

//     const value = newEmail.trim().toLowerCase();
//     if (!EMAIL_RE.test(value)) return showErr("Sahi email likhein.");
//     if (value === profile.email) return showErr("Ye wahi email hai.");

//     setBusy(true);
//     const { data: exists, error: chkErr } = await supabase.rpc("check_email_exists", {
//       p_email: value,
//     });

//     if (chkErr) {
//       setBusy(false);
//       return showErr("Email check nahi ho saka: " + chkErr.message);
//     }
//     if (exists) {
//       setBusy(false);
//       return showErr("Ye email pehle se registered hai.");
//     }

//     const { error } = await supabase.auth.updateUser({ email: value });
//     setBusy(false);

//     if (error) return showErr("OTP nahi bhej saka: " + error.message);

//     setPendingEmail(value);
//     setEmailOtpOpen(true);
//   }

//   async function verifyEmailOtp(token) {
//     const { error } = await supabase.auth.verifyOtp({
//       email: pendingEmail,
//       token,
//       type: "email_change",
//     });
//     if (error) return "Wrong OTP. Dobara check karein.";

//     setEmailOtpOpen(false);
//     setNewEmail("");
//     showOk("Email update ho gayi.");
//     onSaved();
//     return null;
//   }

//   async function resendEmailOtp() {
//     const { error } = await supabase.auth.updateUser({ email: pendingEmail });
//     return error ? error.message : null;
//   }

//   // ---------- Password ----------
//   async function sendPasswordOtp() {
//     setMsg(null);
//     const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
//     if (error) return showErr("OTP nahi bhej saka: " + error.message);
//     setPwOtpOpen(true);
//   }

//   async function verifyPasswordOtp(token) {
//     const { error } = await supabase.auth.verifyOtp({
//       email: profile.email,
//       token,
//       type: "recovery",
//     });
//     if (error) return "Wrong OTP. Dobara check karein.";

//     setPwOtpOpen(false);
//     setNewPw("");
//     setConfirmPw("");
//     setPwError("");
//     setPwSetOpen(true);
//     return null;
//   }

//   async function resendPasswordOtp() {
//     const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
//     return error ? error.message : null;
//   }

//   async function savePassword(e) {
//     e.preventDefault();
//     setPwError("");

//     const rule = validatePassword(newPw);
//     if (rule) return setPwError(rule);
//     if (newPw !== confirmPw)
//       return setPwError("Password aur confirm password match nahi karte.");

//     setPwSaving(true);
//     const { error } = await supabase.auth.updateUser({ password: newPw });
//     setPwSaving(false);

//     if (error) return setPwError("Password change nahi ho saka: " + error.message);

//     setPwSetOpen(false);
//     showOk("Password change ho gaya.");
//   }

//   return (
//     <>
//       <Modal open={open} title="Edit profile" onClose={onClose} wide>
//         {msg && (
//           <p className={msg.type === "error" ? shared.errBox : shared.okBox}>
//             {msg.text}
//           </p>
//         )}

//         {/* Profile picture */}
//         <div className={shared.section}>
//           <h4 className={shared.sectionTitle}>Profile picture</h4>
//           <div className={styles.avatarRow}>
//             {profile.avatar_url ? (
//               <img src={profile.avatar_url} alt="" className={styles.avatarImg} />
//             ) : (
//               <div className={styles.avatarPlaceholder}>{initial}</div>
//             )}
//             <div>
//               <label className={styles.uploadBtn}>
//                 Photo change karein
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp"
//                   className={styles.hiddenInput}
//                   onChange={handleAvatar}
//                   disabled={busy}
//                 />
//               </label>
//               <p className={shared.hint}>JPG, PNG ya WEBP, 2 MB tak.</p>
//             </div>
//           </div>
//         </div>

//         {/* Phone */}
//         <div className={shared.section}>
//           <h4 className={shared.sectionTitle}>Phone number</h4>
//           <form className={shared.form} onSubmit={savePhone}>
//             <label className={shared.field}>
//               <span>Phone</span>
//               <input
//                 className={shared.input}
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             </label>
//             <div className={shared.inline}>
//               <button type="submit" className={shared.primaryBtn} disabled={busy}>
//                 Save phone
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Courses */}
//         <div className={shared.section}>
//           <h4 className={shared.sectionTitle}>My courses</h4>
//           <p className={shared.hint}>
//             Jitne chahein courses select karein. Jo course select ho chuka hai, usay
//             dobara click karne par remove ho jayega.
//           </p>

//           <div className={styles.courseGrid}>
//             {COURSES.map((c) => {
//               const on = courses.includes(c);
//               return (
//                 <button
//                   key={c}
//                   type="button"
//                   className={`${styles.chip} ${on ? styles.chipOn : ""}`}
//                   onClick={() => toggleCourse(c)}
//                   disabled={busy}
//                   aria-pressed={on}
//                 >
//                   <span className={styles.chipIcon}>{on ? "✓" : "+"}</span>
//                   {c}
//                 </button>
//               );
//             })}
//           </div>

//           <p className={shared.hint}>{courses.length} course selected</p>
//         </div>

//         {/* Email */}
//         <div className={shared.section}>
//           <h4 className={shared.sectionTitle}>Email</h4>
//           <p className={styles.readonly}>Current: {profile.email}</p>
//           <form className={shared.form} onSubmit={sendEmailOtp}>
//             <label className={shared.field}>
//               <span>Naya email</span>
//               <input
//                 type="email"
//                 className={shared.input}
//                 value={newEmail}
//                 onChange={(e) => setNewEmail(e.target.value)}
//                 placeholder="new@example.com"
//               />
//             </label>
//             <p className={shared.hint}>Naye email par 6 digit ka OTP jayega.</p>
//             <div className={shared.inline}>
//               <button type="submit" className={shared.primaryBtn} disabled={busy}>
//                 Send OTP
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Password */}
//         <div className={shared.section}>
//           <h4 className={shared.sectionTitle}>Password</h4>
//           <p className={shared.hint}>
//             Password badalne ke liye OTP aapke current email ({profile.email}) par jayega.
//           </p>
//           <div className={shared.inline}>
//             <button
//               type="button"
//               className={shared.secondaryBtn}
//               onClick={sendPasswordOtp}
//               disabled={busy}
//             >
//               Change password
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Email OTP */}
//       <OtpModal
//         open={emailOtpOpen}
//         email={pendingEmail}
//         title="Naya email verify karein"
//         onVerify={verifyEmailOtp}
//         onResend={resendEmailOtp}
//         onClose={() => setEmailOtpOpen(false)}
//       />

//       {/* Password OTP */}
//       <OtpModal
//         open={pwOtpOpen}
//         email={profile.email}
//         title="Password change OTP"
//         onVerify={verifyPasswordOtp}
//         onResend={resendPasswordOtp}
//         onClose={() => setPwOtpOpen(false)}
//       />

//       {/* New password */}
//       <Modal
//         open={pwSetOpen}
//         title="Naya password set karein"
//         onClose={() => setPwSetOpen(false)}
//       >
//         <form className={shared.form} onSubmit={savePassword}>
//           <label className={shared.field}>
//             <span>New password</span>
//             <input
//               type="password"
//               className={shared.input}
//               value={newPw}
//               onChange={(e) => setNewPw(e.target.value)}
//             />
//           </label>

//           <label className={shared.field}>
//             <span>Confirm password</span>
//             <input
//               type="password"
//               className={shared.input}
//               value={confirmPw}
//               onChange={(e) => setConfirmPw(e.target.value)}
//             />
//           </label>

//           <p className={shared.hint}>
//             Kam az kam 8 characters, ek uppercase, ek lowercase, ek number aur ek special
//             character.
//           </p>

//           {pwError && <p className={shared.errBox}>{pwError}</p>}

//           <div className={shared.inline}>
//             <button
//               type="button"
//               className={shared.secondaryBtn}
//               onClick={() => setPwSetOpen(false)}
//             >
//               Cancel
//             </button>
//             <button type="submit" className={shared.primaryBtn} disabled={pwSaving}>
//               {pwSaving ? "Saving..." : "Save password"}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Modal from "../teacher/Modal";
import OtpModal from "../teacher/OtpModal";
import shared from "../teacher/teacher.module.css";
import styles from "./student.module.css";
import { supabase } from "../../lib/supabase";
import { COURSES } from "../../lib/courses";
import { storagePathFromUrl } from "../../lib/storage";

const AVATAR_BUCKET = "avatars";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR = 2 * 1024 * 1024;
const PHONE_RE = /^\+?\d{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePassword(pw) {
  if (pw.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(pw)) return "One uppercase letter is required.";
  if (!/[a-z]/.test(pw)) return "One lowercase letter is required.";
  if (!/[0-9]/.test(pw)) return "One number is required.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "One special character is required.";
  return null;
}

export default function StudentProfileDialog({
  open,
  onClose,
  profile,
  courses = [],
  onSaved,
}) {
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  // Phone
  const [phone, setPhone] = useState("");

  // Email
  const [newEmail, setNewEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailOtpOpen, setEmailOtpOpen] = useState(false);

  // Password
  const [pwOtpOpen, setPwOtpOpen] = useState(false);
  const [pwSetOpen, setPwSetOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMsg(null);
      setNewEmail("");
    }
  }, [open]);

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || "");
    }
  }, [profile?.phone]);

  const showOk = (text) => setMsg({ type: "success", text });
  const showErr = (text) => setMsg({ type: "error", text });

  if (!profile) return null;

  const initial = profile.username?.charAt(0)?.toUpperCase() || "S";

  // ---------- Profile picture ----------
  async function handleAvatar(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg(null);

    if (!IMAGE_TYPES.includes(file.type))
      return showErr("Please upload only JPG, PNG or WEBP images.");
    if (file.size > MAX_AVATAR) return showErr("Image must be smaller than 2 MB.");

    setBusy(true);
    const ext = file.name.split(".").pop().toLowerCase();
    const path = `${profile.id}/avatar-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, { contentType: file.type });

    if (upErr) {
      setBusy(false);
      return showErr("Picture could not be uploaded: " + upErr.message);
    }

    const url = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
    const { data, error: rpcErr } = await supabase.rpc("update_student_avatar", {
      p_url: url,
    });

    if (rpcErr || !data?.ok) {
      await supabase.storage.from(AVATAR_BUCKET).remove([path]);
      setBusy(false);
      return showErr("Picture could not be saved. Please try again.");
    }

    if (profile.avatar_url) {
      const oldPath = storagePathFromUrl(profile.avatar_url, AVATAR_BUCKET);
      if (oldPath) await supabase.storage.from(AVATAR_BUCKET).remove([oldPath]);
    }

    setBusy(false);
    showOk("Profile picture updated.");
    onSaved();
  }

  // ---------- Phone ----------
  async function savePhone(e) {
    e.preventDefault();
    setMsg(null);

    const value = phone.trim();
    if (!PHONE_RE.test(value))
      return showErr("Phone must be 10 to 15 digits long, and may only start with +.");
    if (value === profile.phone) return showErr("This is the same phone number.");

    setBusy(true);
    const { data, error } = await supabase.rpc("update_student_phone", {
      p_phone: value,
    });
    setBusy(false);

    if (error) return showErr("Phone could not be updated: " + error.message);
    if (!data?.ok)
      return showErr(
        data?.error === "phone_taken"
          ? "This phone number is already registered."
          : "Phone could not be updated."
      );

    showOk("Phone number updated.");
    onSaved();
  }

  // ---------- Courses (select / remove, no limit) ----------
  async function toggleCourse(course) {
    setMsg(null);

    const isOn = courses.includes(course);
    const next = isOn
      ? courses.filter((c) => c !== course)
      : [...courses, course];

    setBusy(true);
    const { data, error } = await supabase.rpc("set_student_courses", {
      p_courses: next,
    });
    setBusy(false);

    if (error) return showErr("Course could not be saved: " + error.message);
    if (!data?.ok)
      return showErr(
        data?.error === "invalid_course"
          ? "This course is not valid."
          : "Course could not be saved."
      );

    showOk(isOn ? `${course} removed.` : `${course} added.`);
    onSaved();
  }

  // ---------- Email ----------
  async function sendEmailOtp(e) {
    e.preventDefault();
    setMsg(null);

    const value = newEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) return showErr("Please enter a valid email.");
    if (value === profile.email) return showErr("This is the same email.");

    setBusy(true);
    const { data: exists, error: chkErr } = await supabase.rpc("check_email_exists", {
      p_email: value,
    });

    if (chkErr) {
      setBusy(false);
      return showErr("Email could not be checked: " + chkErr.message);
    }
    if (exists) {
      setBusy(false);
      return showErr("This email is already registered.");
    }

    const { error } = await supabase.auth.updateUser({ email: value });
    setBusy(false);

    if (error) return showErr("OTP could not be sent: " + error.message);

    setPendingEmail(value);
    setEmailOtpOpen(true);
  }

  async function verifyEmailOtp(token) {
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token,
      type: "email_change",
    });
    if (error) return "Wrong OTP. Please check again.";

    setEmailOtpOpen(false);
    setNewEmail("");
    showOk("Email updated.");
    onSaved();
    return null;
  }

  async function resendEmailOtp() {
    const { error } = await supabase.auth.updateUser({ email: pendingEmail });
    return error ? error.message : null;
  }

  // ---------- Password ----------
  async function sendPasswordOtp() {
    setMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    if (error) return showErr("OTP could not be sent: " + error.message);
    setPwOtpOpen(true);
  }

  async function verifyPasswordOtp(token) {
    const { error } = await supabase.auth.verifyOtp({
      email: profile.email,
      token,
      type: "recovery",
    });
    if (error) return "Wrong OTP. Please check again.";

    setPwOtpOpen(false);
    setNewPw("");
    setConfirmPw("");
    setPwError("");
    setPwSetOpen(true);
    return null;
  }

  async function resendPasswordOtp() {
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email);
    return error ? error.message : null;
  }

  async function savePassword(e) {
    e.preventDefault();
    setPwError("");

    const rule = validatePassword(newPw);
    if (rule) return setPwError(rule);
    if (newPw !== confirmPw)
      return setPwError("Password and confirm password do not match.");

    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);

    if (error) return setPwError("Password could not be changed: " + error.message);

    setPwSetOpen(false);
    showOk("Password changed.");
  }

  return (
    <>
      <Modal open={open} title="Edit profile" onClose={onClose} wide>
        {msg && (
          <p className={msg.type === "error" ? shared.errBox : shared.okBox}>
            {msg.text}
          </p>
        )}

        {/* Profile picture */}
        <div className={shared.section}>
          <h4 className={shared.sectionTitle}>Profile picture</h4>
          <div className={styles.avatarRow}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>{initial}</div>
            )}
            <div>
              <label className={styles.uploadBtn}>
                Change photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={styles.hiddenInput}
                  onChange={handleAvatar}
                  disabled={busy}
                />
              </label>
              <p className={shared.hint}>JPG, PNG or WEBP, up to 2 MB.</p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className={shared.section}>
          <h4 className={shared.sectionTitle}>Phone number</h4>
          <form className={shared.form} onSubmit={savePhone}>
            <label className={shared.field}>
              <span>Phone</span>
              <input
                className={shared.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <div className={shared.inline}>
              <button type="submit" className={shared.primaryBtn} disabled={busy}>
                Save phone
              </button>
            </div>
          </form>
        </div>

        {/* Courses */}
        <div className={shared.section}>
          <h4 className={shared.sectionTitle}>My courses</h4>
          <p className={shared.hint}>
            Select as many courses as you want. Click a selected course again to remove it.
          </p>

          <div className={styles.courseGrid}>
            {COURSES.map((c) => {
              const on = courses.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                  onClick={() => toggleCourse(c)}
                  disabled={busy}
                  aria-pressed={on}
                >
                  <span className={styles.chipIcon}>{on ? "✓" : "+"}</span>
                  {c}
                </button>
              );
            })}
          </div>

          <p className={shared.hint}>{courses.length} course selected</p>
        </div>

        {/* Email */}
        <div className={shared.section}>
          <h4 className={shared.sectionTitle}>Email</h4>
          <p className={styles.readonly}>Current: {profile.email}</p>
          <form className={shared.form} onSubmit={sendEmailOtp}>
            <label className={shared.field}>
              <span>New email</span>
              <input
                type="email"
                className={shared.input}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
              />
            </label>
            <p className={shared.hint}>A 6-digit OTP will be sent to the new email.</p>
            <div className={shared.inline}>
              <button type="submit" className={shared.primaryBtn} disabled={busy}>
                Send OTP
              </button>
            </div>
          </form>
        </div>

        {/* Password */}
        <div className={shared.section}>
          <h4 className={shared.sectionTitle}>Password</h4>
          <p className={shared.hint}>
            To change your password, an OTP will be sent to your current email ({profile.email}).
          </p>
          <div className={shared.inline}>
            <button
              type="button"
              className={shared.secondaryBtn}
              onClick={sendPasswordOtp}
              disabled={busy}
            >
              Change password
            </button>
          </div>
        </div>
      </Modal>

      {/* Email OTP */}
      <OtpModal
        open={emailOtpOpen}
        email={pendingEmail}
        title="Verify new email"
        onVerify={verifyEmailOtp}
        onResend={resendEmailOtp}
        onClose={() => setEmailOtpOpen(false)}
      />

      {/* Password OTP */}
      <OtpModal
        open={pwOtpOpen}
        email={profile.email}
        title="Password change OTP"
        onVerify={verifyPasswordOtp}
        onResend={resendPasswordOtp}
        onClose={() => setPwOtpOpen(false)}
      />

      {/* New password */}
      <Modal
        open={pwSetOpen}
        title="Set new password"
        onClose={() => setPwSetOpen(false)}
      >
        <form className={shared.form} onSubmit={savePassword}>
          <label className={shared.field}>
            <span>New password</span>
            <input
              type="password"
              className={shared.input}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </label>

          <label className={shared.field}>
            <span>Confirm password</span>
            <input
              type="password"
              className={shared.input}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
          </label>

          <p className={shared.hint}>
            At least 8 characters, one uppercase, one lowercase, one number and one special
            character.
          </p>

          {pwError && <p className={shared.errBox}>{pwError}</p>}

          <div className={shared.inline}>
            <button
              type="button"
              className={shared.secondaryBtn}
              onClick={() => setPwSetOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={shared.primaryBtn} disabled={pwSaving}>
              {pwSaving ? "Saving..." : "Save password"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}