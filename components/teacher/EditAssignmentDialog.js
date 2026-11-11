// "use client";

// import { useEffect, useState } from "react";
// import Modal from "./Modal";
// import styles from "./teacher.module.css";
// import { supabase } from "../../lib/supabase";
// import { storagePathFromUrl } from "../../lib/storage";

// const BUCKET = "class-media";
// const MAX_PDF = 10 * 1024 * 1024;

// function toLocalInput(iso) {
//   const d = new Date(iso);
//   const pad = (n) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
//     d.getHours()
//   )}:${pad(d.getMinutes())}`;
// }

// export default function EditAssignmentDialog({ open, item, courses, onClose, onSaved }) {
//   const [title, setTitle] = useState("");
//   const [course, setCourse] = useState("");
//   const [dueAt, setDueAt] = useState("");
//   const [description, setDescription] = useState("");
//   const [pdf, setPdf] = useState(null);
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open && item) {
//       setTitle(item.title || "");
//       setCourse(item.course || "");
//       setDueAt(item.due_at ? toLocalInput(item.due_at) : "");
//       setDescription(item.description || "");
//       setPdf(null);
//       setError("");
//     }
//   }, [open, item]);

//   async function handleSave(e) {
//     e.preventDefault();
//     setError("");

//     if (!title.trim()) return setError("Title zaroori hai.");
//     if (!course) return setError("Course select karein.");
//     if (pdf && (pdf.type !== "application/pdf" || pdf.size > MAX_PDF))
//       return setError("Assignment PDF sirf PDF ho aur 10 MB se chhoti ho.");

//     setSaving(true);
//     let uploadedPath = null;

//     try {
//       let materialUrl = item.material_url;

//       if (pdf) {
//         const path = `${item.teacher_id}/${Date.now()}-assignment.pdf`;
//         const { error: upErr } = await supabase.storage
//           .from(BUCKET)
//           .upload(path, pdf, { contentType: "application/pdf" });
//         if (upErr) throw new Error("PDF upload nahi ho saka: " + upErr.message);
//         uploadedPath = path;
//         materialUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
//       }

//       const { error: updErr } = await supabase
//         .from("assignments")
//         .update({
//           title: title.trim(),
//           course,
//           due_at: dueAt ? new Date(dueAt).toISOString() : null,
//           description: description.trim() || null,
//           material_url: materialUrl,
//         })
//         .eq("id", item.id);

//       if (updErr) throw new Error("Assignment update nahi ho saka: " + updErr.message);

//       if (pdf && item.material_url) {
//         const oldPath = storagePathFromUrl(item.material_url, BUCKET);
//         if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
//       }

//       onSaved();
//       onClose();
//     } catch (err) {
//       if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
//       setError(err.message || "Save nahi ho saka. Dobara koshish karein.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <Modal open={open} title="Edit assignment" onClose={onClose}>
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
//             <span>Due date (optional)</span>
//             <input
//               className={styles.input}
//               type="datetime-local"
//               value={dueAt}
//               onChange={(e) => setDueAt(e.target.value)}
//             />
//           </label>

//           <label className={styles.field}>
//             <span>Description (optional)</span>
//             <textarea
//               className={styles.input}
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </label>

//           <div className={styles.fileBox}>
//             <span>Assignment PDF badlein (optional)</span>
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
const MAX_PDF = 10 * 1024 * 1024;

function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EditAssignmentDialog({ open, item, courses, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && item) {
      setTitle(item.title || "");
      setCourse(item.course || "");
      setDueAt(item.due_at ? toLocalInput(item.due_at) : "");
      setDescription(item.description || "");
      setPdf(null);
      setError("");
    }
  }, [open, item]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!course) return setError("Please select a course.");
    if (pdf && (pdf.type !== "application/pdf" || pdf.size > MAX_PDF))
      return setError("Assignment must be a PDF smaller than 10 MB.");

    setSaving(true);
    let uploadedPath = null;

    try {
      let materialUrl = item.material_url;

      if (pdf) {
        const path = `${item.teacher_id}/${Date.now()}-assignment.pdf`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, pdf, { contentType: "application/pdf" });
        if (upErr) throw new Error("PDF could not be uploaded: " + upErr.message);
        uploadedPath = path;
        materialUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const { error: updErr } = await supabase
        .from("assignments")
        .update({
          title: title.trim(),
          course,
          due_at: dueAt ? new Date(dueAt).toISOString() : null,
          description: description.trim() || null,
          material_url: materialUrl,
        })
        .eq("id", item.id);

      if (updErr) throw new Error("Assignment could not be updated: " + updErr.message);

      if (pdf && item.material_url) {
        const oldPath = storagePathFromUrl(item.material_url, BUCKET);
        if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
      }

      onSaved();
      onClose();
    } catch (err) {
      if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
      setError(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title="Edit assignment" onClose={onClose}>
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
            <span>Due date (optional)</span>
            <input
              className={styles.input}
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Description (optional)</span>
            <textarea
              className={styles.input}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className={styles.fileBox}>
            <span>Change assignment PDF (optional)</span>
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