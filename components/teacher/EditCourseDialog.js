// "use client";

// import { useEffect, useState } from "react";
// import Modal from "./Modal";
// import styles from "./teacher.module.css";
// import cstyles from "./course.module.css";
// import { supabase } from "../../lib/supabase";
// import { storagePathFromUrl } from "../../lib/storage";

// const BUCKET = "class-media";
// const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_IMAGE = 2 * 1024 * 1024;
// const MAX_DESC = 500;

// export default function EditCourseDialog({
//   open,
//   onClose,
//   course,
//   courseName,
//   teacherId,
//   onSaved,
// }) {
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open && course) {
//       setDescription(course.description || "");
//       setFile(null);
//       setError("");
//     }
//   }, [open, course]);

//   useEffect(() => {
//     if (!file) {
//       setPreview("");
//       return;
//     }
//     const url = URL.createObjectURL(file);
//     setPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [file]);

//   async function handleSave(e) {
//     e.preventDefault();
//     setError("");

//     const desc = description.trim();
//     if (desc.length > MAX_DESC)
//       return setError(`Description ${MAX_DESC} characters se zyada nahi ho sakta.`);
//     if (file && (!IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE))
//       return setError("Course picture JPG/PNG/WEBP ho aur 2 MB se chhoti ho.");

//     setSaving(true);
//     let uploadedPath = null;

//     try {
//       let imageUrl = course.image_url;

//       if (file) {
//         const ext = file.name.split(".").pop().toLowerCase();
//         const slug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
//         const path = `${teacherId}/course-${slug}-${Date.now()}.${ext}`;

//         const { error: upErr } = await supabase.storage
//           .from(BUCKET)
//           .upload(path, file, { contentType: file.type });
//         if (upErr)
//           throw new Error("Course picture upload nahi ho saki: " + upErr.message);

//         uploadedPath = path;
//         imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
//       }

//       const { error: updErr } = await supabase
//         .from("teacher_courses")
//         .update({
//           description: desc || null,
//           image_url: imageUrl,
//         })
//         .eq("teacher_id", teacherId)
//         .eq("course", courseName);

//       if (updErr) throw new Error("Course save nahi ho saka: " + updErr.message);

//       // Nayi picture lagne ke baad purani delete karein
//       if (file && course.image_url) {
//         const oldPath = storagePathFromUrl(course.image_url, BUCKET);
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
//     <Modal open={open} title="Edit course" onClose={onClose}>
//       {course && (
//         <form className={styles.form} onSubmit={handleSave}>
//           <div className={cstyles.picPreview}>
//             {preview || course.image_url ? (
//               <img src={preview || course.image_url} alt={courseName} />
//             ) : (
//               <span className={cstyles.coverInitial}>{courseName.charAt(0)}</span>
//             )}
//           </div>

//           <div className={styles.fileBox}>
//             <span>Course picture (optional)</span>
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//             />
//             <span className={styles.hint}>
//               JPG, PNG ya WEBP, 2 MB tak. Khali chhorein to purani picture rahegi.
//             </span>
//           </div>

//           <label className={styles.field}>
//             <span>Description (optional)</span>
//             <textarea
//               className={styles.input}
//               rows={5}
//               maxLength={MAX_DESC}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Is course mein kya sikhaya jayega..."
//             />
//           </label>
//           <p className={styles.hint}>
//             {description.length} / {MAX_DESC}
//           </p>

//           {error && <p className={styles.errBox}>{error}</p>}

//           <div className={styles.inline}>
//             <button type="button" className={styles.secondaryBtn} onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className={styles.primaryBtn} disabled={saving}>
//               {saving ? "Saving..." : "Save course"}
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
import cstyles from "./course.module.css";
import { supabase } from "../../lib/supabase";
import { storagePathFromUrl } from "../../lib/storage";

const BUCKET = "class-media";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE = 2 * 1024 * 1024;
const MAX_DESC = 500;

export default function EditCourseDialog({
  open,
  onClose,
  course,
  courseName,
  teacherId,
  onSaved,
}) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && course) {
      setDescription(course.description || "");
      setFile(null);
      setError("");
    }
  }, [open, course]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    const desc = description.trim();
    if (desc.length > MAX_DESC)
      return setError(`Description cannot be more than ${MAX_DESC} characters.`);
    if (file && (!IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE))
      return setError("Course picture must be JPG/PNG/WEBP and smaller than 2 MB.");

    setSaving(true);
    let uploadedPath = null;

    try {
      let imageUrl = course.image_url;

      if (file) {
        const ext = file.name.split(".").pop().toLowerCase();
        const slug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const path = `${teacherId}/course-${slug}-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: file.type });
        if (upErr)
          throw new Error("Course picture could not be uploaded: " + upErr.message);

        uploadedPath = path;
        imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const { error: updErr } = await supabase
        .from("teacher_courses")
        .update({
          description: desc || null,
          image_url: imageUrl,
        })
        .eq("teacher_id", teacherId)
        .eq("course", courseName);

      if (updErr) throw new Error("Course could not be saved: " + updErr.message);

      // After a new picture is uploaded, delete the old one
      if (file && course.image_url) {
        const oldPath = storagePathFromUrl(course.image_url, BUCKET);
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
    <Modal open={open} title="Edit course" onClose={onClose}>
      {course && (
        <form className={styles.form} onSubmit={handleSave}>
          <div className={cstyles.picPreview}>
            {preview || course.image_url ? (
              <img src={preview || course.image_url} alt={courseName} />
            ) : (
              <span className={cstyles.coverInitial}>{courseName.charAt(0)}</span>
            )}
          </div>

          <div className={styles.fileBox}>
            <span>Course picture (optional)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <span className={styles.hint}>
              JPG, PNG or WEBP, up to 2 MB. Leave empty to keep the current picture.
            </span>
          </div>

          <label className={styles.field}>
            <span>Description (optional)</span>
            <textarea
              className={styles.input}
              rows={5}
              maxLength={MAX_DESC}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will be taught in this course..."
            />
          </label>
          <p className={styles.hint}>
            {description.length} / {MAX_DESC}
          </p>

          {error && <p className={styles.errBox}>{error}</p>}

          <div className={styles.inline}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? "Saving..." : "Save course"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}