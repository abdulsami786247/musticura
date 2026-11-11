// "use client";

// import { useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import Modal from "./Modal";
// import styles from "./teacher.module.css";

// const PDF_MAX = 10 * 1024 * 1024; // 10 MB
// const IMG_MAX = 2 * 1024 * 1024; // 2 MB
// const IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

// const emptyForm = { title: "", course: "", startsAt: "", link: "" };

// export default function AddClassDialog({ open, onClose, teacherId, courses, onAdded }) {
//   const [form, setForm] = useState(emptyForm);
//   const [pdf, setPdf] = useState(null);
//   const [cover, setCover] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");

//   const pdfRef = useRef(null);
//   const coverRef = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setForm({ ...emptyForm, course: courses[0] || "" });
//       setPdf(null);
//       setCover(null);
//       setError("");
//       setStatus("");
//     }
//   }, [open]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     setError("");
//   };

//   const handlePdf = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (!file) return;

//     if (file.type !== "application/pdf") {
//       setError("Sirf PDF file upload karein");
//       return;
//     }
//     if (file.size > PDF_MAX) {
//       setError("PDF 10 MB se chhoti honi chahiye");
//       return;
//     }
//     setPdf(file);
//     setError("");
//   };

//   const handleCover = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (!file) return;

//     if (!IMG_TYPES.includes(file.type)) {
//       setError("Course picture JPG, PNG ya WEBP honi chahiye");
//       return;
//     }
//     if (file.size > IMG_MAX) {
//       setError("Course picture 2 MB se chhoti honi chahiye");
//       return;
//     }
//     setCover(file);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const title = form.title.trim();
//     const link = form.link.trim();

//     if (!title) {
//       setError("Class ka title likhein");
//       return;
//     }
//     if (!courses.includes(form.course)) {
//       setError("Course select karein");
//       return;
//     }
//     if (!form.startsAt) {
//       setError("Date aur time select karein");
//       return;
//     }
//     if (!/^https:\/\/\S+$/.test(link)) {
//       setError("Sahi link likhein (https:// se shuru ho)");
//       return;
//     }
//     if (!cover) {
//       setError("Course picture upload karein (zaroori hai)");
//       return;
//     }
//     if (!pdf) {
//       setError("Class PDF upload karein (zaroori hai)");
//       return;
//     }

//     setLoading(true);

//     const base = `${teacherId}/${Date.now()}`;
//     const uploaded = [];

//     try {
//       setStatus("Course picture upload ho rahi hai...");
//       const ext = cover.type === "image/png" ? "png" : cover.type === "image/webp" ? "webp" : "jpg";
//       const coverPath = `${base}-cover.${ext}`;
//       const { error: coverErr } = await supabase.storage
//         .from("class-media")
//         .upload(coverPath, cover, { contentType: cover.type });

//       if (coverErr) throw new Error("Course picture upload nahi ho saki. Dobara koshish karein.");
//       uploaded.push(coverPath);
//       const coverUrl = supabase.storage.from("class-media").getPublicUrl(coverPath).data.publicUrl;

//       setStatus("PDF upload ho rahi hai...");
//       const pdfPath = `${base}-material.pdf`;
//       const { error: pdfErr } = await supabase.storage
//         .from("class-media")
//         .upload(pdfPath, pdf, { contentType: "application/pdf" });

//       if (pdfErr) throw new Error("PDF upload nahi ho saki. Dobara koshish karein.");
//       uploaded.push(pdfPath);
//       const materialUrl = supabase.storage.from("class-media").getPublicUrl(pdfPath).data.publicUrl;

//       setStatus("Class save ho rahi hai...");
//       const { error: insErr } = await supabase.from("classes").insert({
//         teacher_id: teacherId,
//         title,
//         course: form.course,
//         starts_at: new Date(form.startsAt).toISOString(),
//         meeting_link: link,
//         material_url: materialUrl,
//         cover_url: coverUrl,
//       });

//       if (insErr) throw new Error("Class save nahi ho saki. Dobara koshish karein.");

//       onAdded();
//       onClose();
//     } catch (err) {
//       // Class save nahi hui to upload ki hui files hata dein
//       if (uploaded.length) {
//         await supabase.storage.from("class-media").remove(uploaded);
//       }
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setStatus("");
//     }
//   };

//   return (
//     <Modal open={open} title="Add class" onClose={onClose}>
//       <form onSubmit={handleSubmit} noValidate className={styles.form}>
//         <div className={styles.field}>
//           <label htmlFor="class-title">Class title</label>
//           <input
//             id="class-title"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className={styles.input}
//             placeholder="e.g. SEO basics - Lesson 1"
//           />
//         </div>

//         <div className={styles.field}>
//           <label htmlFor="class-course">Course</label>
//           <select
//             id="class-course"
//             name="course"
//             value={form.course}
//             onChange={handleChange}
//             className={styles.input}
//           >
//             {courses.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className={styles.field}>
//           <label htmlFor="class-time">Date & time</label>
//           <input
//             id="class-time"
//             name="startsAt"
//             type="datetime-local"
//             value={form.startsAt}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>

//         <div className={styles.field}>
//           <label htmlFor="class-link">Meeting link</label>
//           <input
//             id="class-link"
//             name="link"
//             value={form.link}
//             onChange={handleChange}
//             className={styles.input}
//             placeholder="https://meet.google.com/..."
//           />
//         </div>

//         <div className={styles.fileBox}>
//           <span className={styles.sectionTitle}>Course picture *</span>
//           <button
//             type="button"
//             className={styles.secondaryBtn}
//             onClick={() => coverRef.current?.click()}
//             disabled={loading}
//           >
//             Choose picture
//           </button>
//           <p className={styles.hint}>
//             {cover ? `Selected: ${cover.name}` : "Zaroori hai. JPG, PNG ya WEBP, 2 MB tak"}
//           </p>
//           <input
//             ref={coverRef}
//             type="file"
//             accept="image/png,image/jpeg,image/webp"
//             onChange={handleCover}
//             style={{ display: "none" }}
//           />
//         </div>

//         <div className={styles.fileBox}>
//           <span className={styles.sectionTitle}>Class PDF *</span>
//           <button
//             type="button"
//             className={styles.secondaryBtn}
//             onClick={() => pdfRef.current?.click()}
//             disabled={loading}
//           >
//             Choose PDF
//           </button>
//           <p className={styles.hint}>
//             {pdf ? `Selected: ${pdf.name}` : "Zaroori hai. PDF, 10 MB tak"}
//           </p>
//           <input
//             ref={pdfRef}
//             type="file"
//             accept="application/pdf"
//             onChange={handlePdf}
//             style={{ display: "none" }}
//           />
//         </div>

//         {error && <div className={styles.errBox}>{error}</div>}

//         <button type="submit" className={styles.primaryBtn} disabled={loading}>
//           {loading ? status || "Saving..." : "Add class"}
//         </button>
//       </form>
//     </Modal>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";
import styles from "./teacher.module.css";

const PDF_MAX = 10 * 1024 * 1024; // 10 MB
const IMG_MAX = 2 * 1024 * 1024; // 2 MB
const IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm = { title: "", course: "", startsAt: "", link: "" };

export default function AddClassDialog({ open, onClose, teacherId, courses, onAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const pdfRef = useRef(null);
  const coverRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, course: courses[0] || "" });
      setPdf(null);
      setCover(null);
      setError("");
      setStatus("");
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handlePdf = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload PDF files only.");
      return;
    }
    if (file.size > PDF_MAX) {
      setError("PDF must be smaller than 10 MB.");
      return;
    }
    setPdf(file);
    setError("");
  };

  const handleCover = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!IMG_TYPES.includes(file.type)) {
      setError("Course picture must be JPG, PNG or WEBP.");
      return;
    }
    if (file.size > IMG_MAX) {
      setError("Course picture must be smaller than 2 MB.");
      return;
    }
    setCover(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const link = form.link.trim();

    if (!title) {
      setError("Please enter the class title.");
      return;
    }
    if (!courses.includes(form.course)) {
      setError("Please select a course.");
      return;
    }
    if (!form.startsAt) {
      setError("Please select date and time.");
      return;
    }
    if (!/^https:\/\/\S+$/.test(link)) {
      setError("Please enter a valid link (starting with https://).");
      return;
    }
    if (!cover) {
      setError("Please upload a course picture (required).");
      return;
    }
    if (!pdf) {
      setError("Please upload a class PDF (required).");
      return;
    }

    setLoading(true);

    const base = `${teacherId}/${Date.now()}`;
    const uploaded = [];

    try {
      setStatus("Uploading course picture...");
      const ext = cover.type === "image/png" ? "png" : cover.type === "image/webp" ? "webp" : "jpg";
      const coverPath = `${base}-cover.${ext}`;
      const { error: coverErr } = await supabase.storage
        .from("class-media")
        .upload(coverPath, cover, { contentType: cover.type });

      if (coverErr) throw new Error("Course picture could not be uploaded. Please try again.");
      uploaded.push(coverPath);
      const coverUrl = supabase.storage.from("class-media").getPublicUrl(coverPath).data.publicUrl;

      setStatus("Uploading PDF...");
      const pdfPath = `${base}-material.pdf`;
      const { error: pdfErr } = await supabase.storage
        .from("class-media")
        .upload(pdfPath, pdf, { contentType: "application/pdf" });

      if (pdfErr) throw new Error("PDF could not be uploaded. Please try again.");
      uploaded.push(pdfPath);
      const materialUrl = supabase.storage.from("class-media").getPublicUrl(pdfPath).data.publicUrl;

      setStatus("Saving class...");
      const { error: insErr } = await supabase.from("classes").insert({
        teacher_id: teacherId,
        title,
        course: form.course,
        starts_at: new Date(form.startsAt).toISOString(),
        meeting_link: link,
        material_url: materialUrl,
        cover_url: coverUrl,
      });

      if (insErr) throw new Error("Class could not be saved. Please try again.");

      onAdded();
      onClose();
    } catch (err) {
      // If the class was not saved, remove the uploaded files
      if (uploaded.length) {
        await supabase.storage.from("class-media").remove(uploaded);
      }
      setError(err.message);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <Modal open={open} title="Add class" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="class-title">Class title</label>
          <input
            id="class-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. SEO basics - Lesson 1"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="class-course">Course</label>
          <select
            id="class-course"
            name="course"
            value={form.course}
            onChange={handleChange}
            className={styles.input}
          >
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="class-time">Date & time</label>
          <input
            id="class-time"
            name="startsAt"
            type="datetime-local"
            value={form.startsAt}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="class-link">Meeting link</label>
          <input
            id="class-link"
            name="link"
            value={form.link}
            onChange={handleChange}
            className={styles.input}
            placeholder="https://meet.google.com/..."
          />
        </div>

        <div className={styles.fileBox}>
          <span className={styles.sectionTitle}>Course picture *</span>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => coverRef.current?.click()}
            disabled={loading}
          >
            Choose picture
          </button>
          <p className={styles.hint}>
            {cover ? `Selected: ${cover.name}` : "Required. JPG, PNG or WEBP, up to 2 MB."}
          </p>
          <input
            ref={coverRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleCover}
            style={{ display: "none" }}
          />
        </div>

        <div className={styles.fileBox}>
          <span className={styles.sectionTitle}>Class PDF *</span>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => pdfRef.current?.click()}
            disabled={loading}
          >
            Choose PDF
          </button>
          <p className={styles.hint}>
            {pdf ? `Selected: ${pdf.name}` : "Required. PDF, up to 10 MB."}
          </p>
          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdf}
            style={{ display: "none" }}
          />
        </div>

        {error && <div className={styles.errBox}>{error}</div>}

        <button type="submit" className={styles.primaryBtn} disabled={loading}>
          {loading ? status || "Saving..." : "Add class"}
        </button>
      </form>
    </Modal>
  );
}