// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import DashboardShell, { InfoCard } from "../DashboardShell";
// import cstyles from "../teacher/course.module.css";
// import tstyles from "../teacher/teacher.module.css";
// import styles from "./studentCourse.module.css";
// import { supabase } from "../../lib/supabase";

// const SUBMIT_BUCKET = "submissions";
// const MAX_PDF_BYTES = 10 * 1024 * 1024;

// function safeDecode(value) {
//   try {
//     return decodeURIComponent(value || "");
//   } catch {
//     return value || "";
//   }
// }

// function formatDate(value) {
//   if (!value) return null;
//   return new Date(value).toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// export default function StudentCourseDetail() {
//   const params = useParams();
//   const teacherId = params?.teacher;
//   const course = safeDecode(params?.course);

//   const [me, setMe] = useState(null);
//   const [card, setCard] = useState(undefined); // undefined = loading, null = not found
//   const [classes, setClasses] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [submissions, setSubmissions] = useState({}); // { [assignment_id]: row }
//   const [busyKey, setBusyKey] = useState(null);
//   const [error, setError] = useState("");

//   const load = useCallback(async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const [s, cards, items, sub] = await Promise.all([
//       supabase
//         .from("students")
//         .select("username, avatar_url")
//         .eq("id", user.id)
//         .single(),
//       supabase.rpc("get_student_courses"),
//       supabase.rpc("get_course_items", {
//         p_teacher: teacherId,
//         p_course: course,
//       }),
//       supabase
//         .from("assignment_submissions")
//         .select("*")
//         .eq("student_id", user.id),
//     ]);

//     setMe(s.data || null);

//     const errors = [];
//     if (cards.error) errors.push("Course load nahi ho saka: " + cards.error.message);
//     if (items.error) errors.push("Classes/assignments load nahi ho saki: " + items.error.message);
//     if (sub.error) errors.push("Submissions load nahi ho saki: " + sub.error.message);
//     setError(errors.join(" "));

//     const found =
//       (cards.data || []).find(
//         (c) => c.teacher_id === teacherId && c.course === course
//       ) || null;

//     const map = {};
//     (sub.data || []).forEach((row) => {
//       map[row.assignment_id] = row;
//     });

//     setCard(found);
//     setClasses(items.data?.classes || []);
//     setAssignments(items.data?.assignments || []);
//     setSubmissions(map);
//   }, [teacherId, course]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const timeline = useMemo(
//     () =>
//       [
//         ...classes.map((c) => ({ ...c, kind: "class" })),
//         ...assignments.map((a) => ({ ...a, kind: "assignment" })),
//       ].sort((x, y) => new Date(x.created_at) - new Date(y.created_at)),
//     [classes, assignments]
//   );

//   async function handleUpload(item, file) {
//     if (!file) return;
//     setError("");

//     const isPdf =
//       file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
//     if (!isPdf) {
//       setError("Sirf PDF file upload karein.");
//       return;
//     }
//     if (file.size > MAX_PDF_BYTES) {
//       setError("PDF 10 MB se choti honi chahiye.");
//       return;
//     }

//     const key = `assignment-${item.id}`;
//     setBusyKey(key);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       setBusyKey(null);
//       return;
//     }

//     const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
//     const path = `${user.id}/${item.id}-${Date.now()}-${safeName}`;

//     const { error: upErr } = await supabase.storage
//       .from(SUBMIT_BUCKET)
//       .upload(path, file, { contentType: "application/pdf" });

//     if (upErr) {
//       setError("Upload nahi ho saka: " + upErr.message);
//       setBusyKey(null);
//       return;
//     }

//     const previous = submissions[item.id];

//     const { error: dbErr } = await supabase
//       .from("assignment_submissions")
//       .upsert(
//         {
//           assignment_id: item.id,
//           student_id: user.id,
//           file_path: path,
//           file_name: file.name,
//           submitted_at: new Date().toISOString(),
//         },
//         { onConflict: "assignment_id,student_id" }
//       );

//     if (dbErr) {
//       await supabase.storage.from(SUBMIT_BUCKET).remove([path]);
//       setError("Submission save nahi ho saki: " + dbErr.message);
//       setBusyKey(null);
//       return;
//     }

//     if (previous?.file_path) {
//       await supabase.storage.from(SUBMIT_BUCKET).remove([previous.file_path]);
//     }

//     await load();
//     setBusyKey(null);
//   }

//   async function viewSubmission(sub) {
//     setError("");
//     const { data, error: signErr } = await supabase.storage
//       .from(SUBMIT_BUCKET)
//       .createSignedUrl(sub.file_path, 300);

//     if (signErr || !data?.signedUrl) {
//       setError("File khul nahi saki: " + (signErr?.message || "unknown error"));
//       return;
//     }
//     window.open(data.signedUrl, "_blank", "noopener,noreferrer");
//   }

//   if (!me) {
//     return <p className={tstyles.hint}>Loading...</p>;
//   }

//   const initial = me.username?.charAt(0)?.toUpperCase() || "S";

//   const leading = me.avatar_url ? (
//     <img src={me.avatar_url} alt="" className={tstyles.headerAvatar} />
//   ) : (
//     <div className={tstyles.headerAvatar}>{initial}</div>
//   );

//   const actions = (
//     <Link href="/student" className={tstyles.headerBtn}>
//       ← Dashboard
//     </Link>
//   );

//   return (
//     <DashboardShell
//       roleLabel="Student"
//       name={me.username}
//       leading={leading}
//       actions={actions}
//     >
//       {card === undefined ? (
//         <p className={cstyles.empty}>Loading...</p>
//       ) : card === null ? (
//         <section className={cstyles.wrapper}>
//           <p className={styles.notFound}>
//             Ye course aapke enrolled courses mein nahi hai ya teacher ne remove kar diya hai.
//           </p>
//           <Link href="/student" className={styles.btn}>
//             ← Dashboard par wapas jayein
//           </Link>
//         </section>
//       ) : (
//         <div className={styles.page}>
//           <section className={cstyles.hero}>
//             <div className={cstyles.heroImage}>
//               {card.image_url ? (
//                 <img src={card.image_url} alt={course} className={cstyles.heroImg} />
//               ) : (
//                 <span className={cstyles.coverInitial}>{course.charAt(0)}</span>
//               )}
//             </div>
//             <div className={cstyles.heroBody}>
//               <span className={cstyles.kicker}>Course</span>
//               <h2 className={cstyles.heroTitle}>{course}</h2>
//               <div className={cstyles.teacherRow}>
//                 {card.teacher_avatar_url ? (
//                   <img
//                     src={card.teacher_avatar_url}
//                     alt={card.teacher_username}
//                     className={cstyles.teacherAvatar}
//                   />
//                 ) : (
//                   <span className={cstyles.teacherAvatarPh}>
//                     {card.teacher_username?.charAt(0)?.toUpperCase() || "T"}
//                   </span>
//                 )}
//                 <div className={cstyles.teacherInfo}>
//                   <span className={cstyles.teacherLabel}>Teacher</span>
//                   <span className={cstyles.teacherName}>
//                     {card.teacher_username || "—"}
//                   </span>
//                 </div>
//               </div>
//               <p className={cstyles.heroDesc}>
//                 {card.description || "Description abhi add nahi kiya gaya."}
//               </p>
//             </div>
//           </section>

//           <div className={styles.cards}>
//             <InfoCard label="Classes" value={classes.length} />
//             <InfoCard label="Assignments" value={assignments.length} />
//           </div>

//           <section className={styles.section}>
//             <div className={styles.sectionHead}>
//               <h3 className={styles.sectionTitle}>Timeline</h3>
//               <span className={styles.countPill}>
//                 {timeline.length} {timeline.length === 1 ? "item" : "items"}
//               </span>
//             </div>

//             {error && <p className={styles.error}>{error}</p>}

//             {timeline.length === 0 ? (
//               <p className={styles.empty}>Abhi koi class ya assignment nahi hai.</p>
//             ) : (
//               <ol className={styles.list}>
//                 {timeline.map((item, i) => {
//                   const isClass = item.kind === "class";
//                   const when = formatDate(isClass ? item.starts_at : item.due_at);
//                   const isLast = i === timeline.length - 1;
//                   const sub = isClass ? null : submissions[item.id];
//                   const busy = busyKey === `assignment-${item.id}`;

//                   return (
//                     <li key={`${item.kind}-${item.id}`} className={styles.item}>
//                       <div className={styles.stepCol}>
//                         <span className={styles.step}>{i + 1}</span>
//                         {!isLast && <span className={styles.line} />}
//                       </div>

//                       <div
//                         className={`${styles.card} ${
//                           isClass ? styles.cardClass : styles.cardAssign
//                         }`}
//                       >
//                         <div className={isClass ? styles.thumb : styles.thumbDoc}>
//                           {isClass && item.cover_url ? (
//                             <img
//                               src={item.cover_url}
//                               alt={item.title}
//                               className={styles.thumbImg}
//                             />
//                           ) : (
//                             <span className={styles.thumbPh}>
//                               {isClass ? "Class" : "Doc"}
//                             </span>
//                           )}
//                         </div>

//                         <div className={styles.body}>
//                           <div className={styles.topRow}>
//                             <span
//                               className={
//                                 isClass ? styles.typeClass : styles.typeAssign
//                               }
//                             >
//                               {isClass ? "Class" : "Assignment"}
//                             </span>
//                             <span className={styles.courseChip}>{course}</span>
//                             {sub && <span className={styles.submitted}>Submitted</span>}
//                           </div>

//                           <h4 className={styles.title}>{item.title}</h4>

//                           <p className={styles.meta}>
//                             {isClass
//                               ? when
//                                 ? `Date: ${when}`
//                                 : "Date abhi set nahi"
//                               : when
//                               ? `Due: ${when}`
//                               : "No due date"}
//                           </p>

//                           {!isClass && item.description && (
//                             <p className={styles.desc}>{item.description}</p>
//                           )}

//                           {!isClass && sub && (
//                             <p className={styles.meta}>Aapki file: {sub.file_name}</p>
//                           )}

//                           <div className={styles.actions}>
//                             {isClass && item.meeting_link && (
//                               <a
//                                 href={item.meeting_link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className={styles.btnPrimary}
//                               >
//                                 Join class
//                               </a>
//                             )}

//                             {item.material_url && (
//                               <a
//                                 href={item.material_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className={styles.btn}
//                               >
//                                 PDF dekhein
//                               </a>
//                             )}

//                             {!isClass && sub && (
//                               <button
//                                 type="button"
//                                 className={styles.btn}
//                                 onClick={() => viewSubmission(sub)}
//                               >
//                                 Apni file dekhein
//                               </button>
//                             )}

//                             {!isClass && (
//                               <label
//                                 className={`${styles.btnUpload} ${
//                                   busy ? styles.isBusy : ""
//                                 }`}
//                               >
//                                 {busy
//                                   ? "Uploading..."
//                                   : sub
//                                   ? "Dobara upload karein"
//                                   : "Upload"}
//                                 <input
//                                   type="file"
//                                   accept="application/pdf,.pdf"
//                                   hidden
//                                   disabled={busy}
//                                   onChange={(e) => {
//                                     const file = e.target.files?.[0];
//                                     e.target.value = "";
//                                     handleUpload(item, file);
//                                   }}
//                                 />
//                               </label>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ol>
//             )}
//           </section>
//         </div>
//       )}
//     </DashboardShell>
//   );
// }



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardShell, { InfoCard } from "../DashboardShell";
import cstyles from "../teacher/course.module.css";
import tstyles from "../teacher/teacher.module.css";
import styles from "./studentCourse.module.css";
import { supabase } from "../../lib/supabase";

const SUBMIT_BUCKET = "submissions";
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function safeDecode(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return value || "";
  }
}

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function StudentCourseDetail() {
  const params = useParams();
  const teacherId = params?.teacher;
  const course = safeDecode(params?.course);

  const [me, setMe] = useState(null);
  const [card, setCard] = useState(undefined); // undefined = loading, null = not found
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({}); // { [assignment_id]: row }
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [s, cards, items, sub] = await Promise.all([
      supabase
        .from("students")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single(),
      supabase.rpc("get_student_courses"),
      supabase.rpc("get_course_items", {
        p_teacher: teacherId,
        p_course: course,
      }),
      supabase
        .from("assignment_submissions")
        .select("*")
        .eq("student_id", user.id),
    ]);

    setMe(s.data || null);

    const errors = [];
    if (cards.error) errors.push("Course could not be loaded: " + cards.error.message);
    if (items.error) errors.push("Classes/assignments could not be loaded: " + items.error.message);
    if (sub.error) errors.push("Submissions could not be loaded: " + sub.error.message);
    setError(errors.join(" "));

    const found =
      (cards.data || []).find(
        (c) => c.teacher_id === teacherId && c.course === course
      ) || null;

    const map = {};
    (sub.data || []).forEach((row) => {
      map[row.assignment_id] = row;
    });

    setCard(found);
    setClasses(items.data?.classes || []);
    setAssignments(items.data?.assignments || []);
    setSubmissions(map);
  }, [teacherId, course]);

  useEffect(() => {
    load();
  }, [load]);

  const timeline = useMemo(
    () =>
      [
        ...classes.map((c) => ({ ...c, kind: "class" })),
        ...assignments.map((a) => ({ ...a, kind: "assignment" })),
      ].sort((x, y) => new Date(x.created_at) - new Date(y.created_at)),
    [classes, assignments]
  );

  async function handleUpload(item, file) {
    if (!file) return;
    setError("");

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Please upload PDF files only.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setError("PDF must be smaller than 10 MB.");
      return;
    }

    const key = `assignment-${item.id}`;
    setBusyKey(key);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusyKey(null);
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${item.id}-${Date.now()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from(SUBMIT_BUCKET)
      .upload(path, file, { contentType: "application/pdf" });

    if (upErr) {
      setError("Upload failed: " + upErr.message);
      setBusyKey(null);
      return;
    }

    const previous = submissions[item.id];

    const { error: dbErr } = await supabase
      .from("assignment_submissions")
      .upsert(
        {
          assignment_id: item.id,
          student_id: user.id,
          file_path: path,
          file_name: file.name,
          submitted_at: new Date().toISOString(),
        },
        { onConflict: "assignment_id,student_id" }
      );

    if (dbErr) {
      await supabase.storage.from(SUBMIT_BUCKET).remove([path]);
      setError("Submission could not be saved: " + dbErr.message);
      setBusyKey(null);
      return;
    }

    if (previous?.file_path) {
      await supabase.storage.from(SUBMIT_BUCKET).remove([previous.file_path]);
    }

    await load();
    setBusyKey(null);
  }

  async function viewSubmission(sub) {
    setError("");
    const { data, error: signErr } = await supabase.storage
      .from(SUBMIT_BUCKET)
      .createSignedUrl(sub.file_path, 300);

    if (signErr || !data?.signedUrl) {
      setError("File could not be opened: " + (signErr?.message || "unknown error"));
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  if (!me) {
    return <p className={tstyles.hint}>Loading...</p>;
  }

  const initial = me.username?.charAt(0)?.toUpperCase() || "S";

  const leading = me.avatar_url ? (
    <img src={me.avatar_url} alt="" className={tstyles.headerAvatar} />
  ) : (
    <div className={tstyles.headerAvatar}>{initial}</div>
  );

  const actions = (
    <Link href="/student" className={tstyles.headerBtn}>
      ← Dashboard
    </Link>
  );

  return (
    <DashboardShell
      roleLabel="Student"
      name={me.username}
      leading={leading}
      actions={actions}
    >
      {card === undefined ? (
        <p className={cstyles.empty}>Loading...</p>
      ) : card === null ? (
        <section className={cstyles.wrapper}>
          <p className={styles.notFound}>
            This course is not in your enrolled courses, or the teacher has removed it.
          </p>
          <Link href="/student" className={styles.btn}>
            ← Back to dashboard
          </Link>
        </section>
      ) : (
        <div className={styles.page}>
          <section className={cstyles.hero}>
            <div className={cstyles.heroImage}>
              {card.image_url ? (
                <img src={card.image_url} alt={course} className={cstyles.heroImg} />
              ) : (
                <span className={cstyles.coverInitial}>{course.charAt(0)}</span>
              )}
            </div>
            <div className={cstyles.heroBody}>
              <span className={cstyles.kicker}>Course</span>
              <h2 className={cstyles.heroTitle}>{course}</h2>
              <div className={cstyles.teacherRow}>
                {card.teacher_avatar_url ? (
                  <img
                    src={card.teacher_avatar_url}
                    alt={card.teacher_username}
                    className={cstyles.teacherAvatar}
                  />
                ) : (
                  <span className={cstyles.teacherAvatarPh}>
                    {card.teacher_username?.charAt(0)?.toUpperCase() || "T"}
                  </span>
                )}
                <div className={cstyles.teacherInfo}>
                  <span className={cstyles.teacherLabel}>Teacher</span>
                  <span className={cstyles.teacherName}>
                    {card.teacher_username || "—"}
                  </span>
                </div>
              </div>
              <p className={cstyles.heroDesc}>
                {card.description || "No description added yet."}
              </p>
            </div>
          </section>

          <div className={styles.cards}>
            <InfoCard label="Classes" value={classes.length} />
            <InfoCard label="Assignments" value={assignments.length} />
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>Timeline</h3>
              <span className={styles.countPill}>
                {timeline.length} {timeline.length === 1 ? "item" : "items"}
              </span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {timeline.length === 0 ? (
              <p className={styles.empty}>No class or assignment yet.</p>
            ) : (
              <ol className={styles.list}>
                {timeline.map((item, i) => {
                  const isClass = item.kind === "class";
                  const when = formatDate(isClass ? item.starts_at : item.due_at);
                  const isLast = i === timeline.length - 1;
                  const sub = isClass ? null : submissions[item.id];
                  const busy = busyKey === `assignment-${item.id}`;

                  return (
                    <li key={`${item.kind}-${item.id}`} className={styles.item}>
                      <div className={styles.stepCol}>
                        <span className={styles.step}>{i + 1}</span>
                        {!isLast && <span className={styles.line} />}
                      </div>

                      <div
                        className={`${styles.card} ${
                          isClass ? styles.cardClass : styles.cardAssign
                        }`}
                      >
                        <div className={isClass ? styles.thumb : styles.thumbDoc}>
                          {isClass && item.cover_url ? (
                            <img
                              src={item.cover_url}
                              alt={item.title}
                              className={styles.thumbImg}
                            />
                          ) : (
                            <span className={styles.thumbPh}>
                              {isClass ? "Class" : "Doc"}
                            </span>
                          )}
                        </div>

                        <div className={styles.body}>
                          <div className={styles.topRow}>
                            <span
                              className={
                                isClass ? styles.typeClass : styles.typeAssign
                              }
                            >
                              {isClass ? "Class" : "Assignment"}
                            </span>
                            <span className={styles.courseChip}>{course}</span>
                            {sub && <span className={styles.submitted}>Submitted</span>}
                          </div>

                          <h4 className={styles.title}>{item.title}</h4>

                          <p className={styles.meta}>
                            {isClass
                              ? when
                                ? `Date: ${when}`
                                : "Date not set yet"
                              : when
                              ? `Due: ${when}`
                              : "No due date"}
                          </p>

                          {!isClass && item.description && (
                            <p className={styles.desc}>{item.description}</p>
                          )}

                          {!isClass && sub && (
                            <p className={styles.meta}>Your file: {sub.file_name}</p>
                          )}

                          <div className={styles.actions}>
                            {isClass && item.meeting_link && (
                              <a
                                href={item.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnPrimary}
                              >
                                Join class
                              </a>
                            )}

                            {item.material_url && (
                              <a
                                href={item.material_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btn}
                              >
                                View PDF
                              </a>
                            )}

                            {!isClass && sub && (
                              <button
                                type="button"
                                className={styles.btn}
                                onClick={() => viewSubmission(sub)}
                              >
                                View your file
                              </button>
                            )}

                            {!isClass && (
                              <label
                                className={`${styles.btnUpload} ${
                                  busy ? styles.isBusy : ""
                                }`}
                              >
                                {busy
                                  ? "Uploading..."
                                  : sub
                                  ? "Upload again"
                                  : "Upload"}
                                <input
                                  type="file"
                                  accept="application/pdf,.pdf"
                                  hidden
                                  disabled={busy}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    handleUpload(item, file);
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      )}
    </DashboardShell>
  );
}