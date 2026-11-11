// "use client";

// import { useEffect, useState } from "react";
// import Modal from "./Modal";
// import styles from "./teacher.module.css";
// import { supabase } from "../../lib/supabase";
// import { storagePathFromUrl } from "../../lib/storage";

// const BUCKET = "class-media";
// const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_IMAGE = 2 * 1024 * 1024;
// const MAX_PDF = 10 * 1024 * 1024;

// function toLocalInput(iso) {
//   const d = new Date(iso);
//   const pad = (n) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
//     d.getHours()
//   )}:${pad(d.getMinutes())}`;
// }

// export default function EditClassDialog({ open, item, courses, onClose, onSaved }) {
//   const [title, setTitle] = useState("");
//   const [course, setCourse] = useState("");
//   const [startsAt, setStartsAt] = useState("");
//   const [link, setLink] = useState("");
//   const [cover, setCover] = useState(null);
//   const [pdf, setPdf] = useState(null);
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open && item) {
//       setTitle(item.title || "");
//       setCourse(item.course || "");
//       setStartsAt(item.starts_at ? toLocalInput(item.starts_at) : "");
//       setLink(item.meeting_link || "");
//       setCover(null);
//       setPdf(null);
//       setError("");
//     }
//   }, [open, item]);

//   async function handleSave(e) {
//     e.preventDefault();
//     setError("");

//     if (!title.trim()) return setError("Title zaroori hai.");
//     if (!course) return setError("Course select karein.");
//     if (!startsAt) return setError("Date aur time zaroori hai.");
//     if (!/^https:\/\/\S+$/.test(link.trim()))
//       return setError("Meeting link https:// se shuru hona chahiye.");
//     if (cover && (!IMAGE_TYPES.includes(cover.type) || cover.size > MAX_IMAGE))
//       return setError("Course picture JPG/PNG/WEBP ho aur 2 MB se chhoti ho.");
//     if (pdf && (pdf.type !== "application/pdf" || pdf.size > MAX_PDF))
//       return setError("Class PDF sirf PDF ho aur 10 MB se chhoti ho.");

//     setSaving(true);
//     const uploaded = [];

//     try {
//       const teacherId = item.teacher_id;
//       const stamp = Date.now();
//       let coverUrl = item.cover_url;
//       let materialUrl = item.material_url;

//       if (cover) {
//         const ext = cover.name.split(".").pop().toLowerCase();
//         const path = `${teacherId}/${stamp}-cover.${ext}`;
//         const { error: upErr } = await supabase.storage
//           .from(BUCKET)
//           .upload(path, cover, { contentType: cover.type });
//         if (upErr) throw new Error("Course picture upload nahi ho saki: " + upErr.message);
//         uploaded.push(path);
//         coverUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
//       }

//       if (pdf) {
//         const path = `${teacherId}/${stamp}-material.pdf`;
//         const { error: upErr } = await supabase.storage
//           .from(BUCKET)
//           .upload(path, pdf, { contentType: "application/pdf" });
//         if (upErr) throw new Error("Class PDF upload nahi ho saki: " + upErr.message);
//         uploaded.push(path);
//         materialUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
//       }

//       const { error: updErr } = await supabase
//         .from("classes")
//         .update({
//           title: title.trim(),
//           course,
//           starts_at: new Date(startsAt).toISOString(),
//           meeting_link: link.trim(),
//           cover_url: coverUrl,
//           material_url: materialUrl,
//         })
//         .eq("id", item.id);

//       if (updErr) throw new Error("Class update nahi ho saki: " + updErr.message);

//       // Naya file lagne ke baad purani files delete karein
//       const oldPaths = [];
//       if (cover && item.cover_url) oldPaths.push(storagePathFromUrl(item.cover_url, BUCKET));
//       if (pdf && item.material_url) oldPaths.push(storagePathFromUrl(item.material_url, BUCKET));
//       const cleanPaths = oldPaths.filter(Boolean);
//       if (cleanPaths.length) await supabase.storage.from(BUCKET).remove(cleanPaths);

//       onSaved();
//       onClose();
//     } catch (err) {
//       if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
//       setError(err.message || "Save nahi ho saka. Dobara koshish karein.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <Modal open={open} title="Edit class" onClose={onClose}>
//       {item && (
//         <form className={styles.form} onSubmit={handleSave}>
//           <label className={styles.field}>
//             <span>Title</span>
//             <input
//               className={styles.input}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </label>

//           <label className={styles.field}>
//             <span>Course</span>
//             <select
//               className={styles.input}
//               value={course}
//               onChange={(e) => setCourse(e.target.value)}
//             >
//               {courses.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className={styles.field}>
//             <span>Date & time</span>
//             <input
//               className={styles.input}
//               type="datetime-local"
//               value={startsAt}
//               onChange={(e) => setStartsAt(e.target.value)}
//             />
//           </label>

//           <label className={styles.field}>
//             <span>Meeting link (https://)</span>
//             <input
//               className={styles.input}
//               value={link}
//               onChange={(e) => setLink(e.target.value)}
//             />
//           </label>

//           <div className={styles.fileBox}>
//             <span>Course picture badlein (optional)</span>
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={(e) => setCover(e.target.files?.[0] || null)}
//             />
//             <span className={styles.hint}>Khali chhorein to purani picture rahegi.</span>
//           </div>

//           <div className={styles.fileBox}>
//             <span>Class PDF badlein (optional)</span>
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => setPdf(e.target.files?.[0] || null)}
//             />
//             <span className={styles.hint}>Khali chhorein to purani PDF rahegi.</span>
//           </div>

//           {error && <p className={styles.errBox}>{error}</p>}

//           <div className={styles.inline}>
//             <button type="button" className={styles.secondaryBtn} onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className={styles.primaryBtn} disabled={saving}>
//               {saving ? "Saving..." : "Save changes"}
//             </button>
//           </div>
//         </form>
//       )}
//     </Modal>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import styles from "./teacher.module.css";
import { supabase } from "../../lib/supabase";
import { storagePathFromUrl } from "../../lib/storage";

const BUCKET = "class-media";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE = 2 * 1024 * 1024;
const MAX_PDF = 10 * 1024 * 1024;

function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EditClassDialog({ open, item, courses, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [link, setLink] = useState("");
  const [cover, setCover] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && item) {
      setTitle(item.title || "");
      setCourse(item.course || "");
      setStartsAt(item.starts_at ? toLocalInput(item.starts_at) : "");
      setLink(item.meeting_link || "");
      setCover(null);
      setPdf(null);
      setError("");
    }
  }, [open, item]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!course) return setError("Please select a course.");
    if (!startsAt) return setError("Date and time are required.");
    if (!/^https:\/\/\S+$/.test(link.trim()))
      return setError("Meeting link must start with https://.");
    if (cover && (!IMAGE_TYPES.includes(cover.type) || cover.size > MAX_IMAGE))
      return setError("Course picture must be JPG/PNG/WEBP and smaller than 2 MB.");
    if (pdf && (pdf.type !== "application/pdf" || pdf.size > MAX_PDF))
      return setError("Class file must be a PDF smaller than 10 MB.");

    setSaving(true);
    const uploaded = [];

    try {
      const teacherId = item.teacher_id;
      const stamp = Date.now();
      let coverUrl = item.cover_url;
      let materialUrl = item.material_url;

      if (cover) {
        const ext = cover.name.split(".").pop().toLowerCase();
        const path = `${teacherId}/${stamp}-cover.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, cover, { contentType: cover.type });
        if (upErr) throw new Error("Course picture could not be uploaded: " + upErr.message);
        uploaded.push(path);
        coverUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }

      if (pdf) {
        const path = `${teacherId}/${stamp}-material.pdf`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, pdf, { contentType: "application/pdf" });
        if (upErr) throw new Error("Class PDF could not be uploaded: " + upErr.message);
        uploaded.push(path);
        materialUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const { error: updErr } = await supabase
        .from("classes")
        .update({
          title: title.trim(),
          course,
          starts_at: new Date(startsAt).toISOString(),
          meeting_link: link.trim(),
          cover_url: coverUrl,
          material_url: materialUrl,
        })
        .eq("id", item.id);

      if (updErr) throw new Error("Class could not be updated: " + updErr.message);

      // After a new file is uploaded, delete the old files
      const oldPaths = [];
      if (cover && item.cover_url) oldPaths.push(storagePathFromUrl(item.cover_url, BUCKET));
      if (pdf && item.material_url) oldPaths.push(storagePathFromUrl(item.material_url, BUCKET));
      const cleanPaths = oldPaths.filter(Boolean);
      if (cleanPaths.length) await supabase.storage.from(BUCKET).remove(cleanPaths);

      onSaved();
      onClose();
    } catch (err) {
      if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
      setError(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title="Edit class" onClose={onClose}>
      {item && (
        <form className={styles.form} onSubmit={handleSave}>
          <label className={styles.field}>
            <span>Title</span>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Course</span>
            <select
              className={styles.input}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Date & time</span>
            <input
              className={styles.input}
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Meeting link (https://)</span>
            <input
              className={styles.input}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </label>

          <div className={styles.fileBox}>
            <span>Change course picture (optional)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setCover(e.target.files?.[0] || null)}
            />
            <span className={styles.hint}>Leave empty to keep the current picture.</span>
          </div>

          <div className={styles.fileBox}>
            <span>Change class PDF (optional)</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
            <span className={styles.hint}>Leave empty to keep the current PDF.</span>
          </div>

          {error && <p className={styles.errBox}>{error}</p>}

          <div className={styles.inline}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}