// "use client";

// import { useEffect, useRef, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import Modal from "./Modal";
// import styles from "./teacher.module.css";

// const PDF_MAX = 10 * 1024 * 1024; // 10 MB

// const emptyForm = { title: "", course: "", dueAt: "", description: "" };

// export default function AddAssignmentDialog({ open, onClose, teacherId, courses, onAdded }) {
//   const [form, setForm] = useState(emptyForm);
//   const [pdf, setPdf] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");

//   const pdfRef = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setForm({ ...emptyForm, course: courses[0] || "" });
//       setPdf(null);
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const title = form.title.trim();
//     const description = form.description.trim();

//     if (!title) {
//       setError("Assignment ka title likhein");
//       return;
//     }
//     if (!courses.includes(form.course)) {
//       setError("Course select karein");
//       return;
//     }

//     setLoading(true);

//     const base = `${teacherId}/${Date.now()}`;
//     const uploaded = [];

//     try {
//       let materialUrl = null;

//       if (pdf) {
//         setStatus("PDF upload ho rahi hai...");
//         const path = `${base}-assignment.pdf`;
//         const { error: pdfErr } = await supabase.storage
//           .from("class-media")
//           .upload(path, pdf, { contentType: "application/pdf" });

//         if (pdfErr) throw new Error("PDF upload nahi ho saki: " + pdfErr.message);

//         uploaded.push(path);
//         materialUrl = supabase.storage.from("class-media").getPublicUrl(path).data.publicUrl;
//       }

//       setStatus("Assignment save ho raha hai...");
//       const { error: insErr } = await supabase.from("assignments").insert({
//         teacher_id: teacherId,
//         title,
//         course: form.course,
//         description: description || null,
//         due_at: form.dueAt ? new Date(form.dueAt).toISOString() : null,
//         material_url: materialUrl,
//       });

//       if (insErr) throw new Error("Assignment save nahi ho saka. Dobara koshish karein.");

//       onAdded();
//       onClose();
//     } catch (err) {
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
//     <Modal open={open} title="Add assignment" onClose={onClose}>
//       <form onSubmit={handleSubmit} noValidate className={styles.form}>
//         <div className={styles.field}>
//           <label htmlFor="asg-title">Assignment title</label>
//           <input
//             id="asg-title"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className={styles.input}
//             placeholder="e.g. Build a landing page"
//           />
//         </div>

//         <div className={styles.field}>
//           <label htmlFor="asg-course">Course</label>
//           <select
//             id="asg-course"
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
//           <label htmlFor="asg-due">Due date & time (optional)</label>
//           <input
//             id="asg-due"
//             name="dueAt"
//             type="datetime-local"
//             value={form.dueAt}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>

//         <div className={styles.field}>
//           <label htmlFor="asg-desc">Instructions (optional)</label>
//           <textarea
//             id="asg-desc"
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className={styles.input}
//             rows={4}
//             placeholder="Assignment ki details likhein"
//           />
//         </div>

//         <div className={styles.fileBox}>
//           <span className={styles.sectionTitle}>Assignment PDF (optional)</span>
//           <button
//             type="button"
//             className={styles.secondaryBtn}
//             onClick={() => pdfRef.current?.click()}
//             disabled={loading}
//           >
//             Choose PDF
//           </button>
//           <p className={styles.hint}>
//             {pdf ? `Selected: ${pdf.name}` : "PDF, 10 MB tak"}
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
//           {loading ? status || "Saving..." : "Add assignment"}
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

const emptyForm = { title: "", course: "", dueAt: "", description: "" };

export default function AddAssignmentDialog({ open, onClose, teacherId, courses, onAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const pdfRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, course: courses[0] || "" });
      setPdf(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      setError("Please enter the assignment title.");
      return;
    }
    if (!courses.includes(form.course)) {
      setError("Please select a course.");
      return;
    }

    setLoading(true);

    const base = `${teacherId}/${Date.now()}`;
    const uploaded = [];

    try {
      let materialUrl = null;

      if (pdf) {
        setStatus("Uploading PDF...");
        const path = `${base}-assignment.pdf`;
        const { error: pdfErr } = await supabase.storage
          .from("class-media")
          .upload(path, pdf, { contentType: "application/pdf" });

        if (pdfErr) throw new Error("PDF could not be uploaded: " + pdfErr.message);

        uploaded.push(path);
        materialUrl = supabase.storage.from("class-media").getPublicUrl(path).data.publicUrl;
      }

      setStatus("Saving assignment...");
      const { error: insErr } = await supabase.from("assignments").insert({
        teacher_id: teacherId,
        title,
        course: form.course,
        description: description || null,
        due_at: form.dueAt ? new Date(form.dueAt).toISOString() : null,
        material_url: materialUrl,
      });

      if (insErr) throw new Error("Assignment could not be saved. Please try again.");

      onAdded();
      onClose();
    } catch (err) {
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
    <Modal open={open} title="Add assignment" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="asg-title">Assignment title</label>
          <input
            id="asg-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g. Build a landing page"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="asg-course">Course</label>
          <select
            id="asg-course"
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
          <label htmlFor="asg-due">Due date & time (optional)</label>
          <input
            id="asg-due"
            name="dueAt"
            type="datetime-local"
            value={form.dueAt}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="asg-desc">Instructions (optional)</label>
          <textarea
            id="asg-desc"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={styles.input}
            rows={4}
            placeholder="Write the assignment details"
          />
        </div>

        <div className={styles.fileBox}>
          <span className={styles.sectionTitle}>Assignment PDF (optional)</span>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => pdfRef.current?.click()}
            disabled={loading}
          >
            Choose PDF
          </button>
          <p className={styles.hint}>
            {pdf ? `Selected: ${pdf.name}` : "PDF, up to 10 MB."}
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
          {loading ? status || "Saving..." : "Add assignment"}
        </button>
      </form>
    </Modal>
  );
}