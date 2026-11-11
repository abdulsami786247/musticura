// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import DashboardShell, { InfoCard } from "../DashboardShell";
// import Timeline from "./Timeline";
// import AddClassDialog from "./AddClassDialog";
// import AddAssignmentDialog from "./AddAssignmentDialog";
// import EditClassDialog from "./EditClassDialog";
// import EditAssignmentDialog from "./EditAssignmentDialog";
// import EditCourseDialog from "./EditCourseDialog";
// import styles from "./teacher.module.css";
// import cstyles from "./course.module.css";
// import { supabase } from "../../lib/supabase";
// import { storagePathFromUrl } from "../../lib/storage";
// import StudentActivity from "./StudentActivity";

// const BUCKET = "class-media";

// function readCourseParam(params) {
//   const raw = Array.isArray(params?.course) ? params.course[0] : params?.course;
//   if (!raw) return "";
//   try {
//     return decodeURIComponent(raw);
//   } catch {
//     return raw;
//   }
// }

// export default function CourseDetail() {
//   const params = useParams();
//   const courseName = readCourseParam(params);

//   const [teacher, setTeacher] = useState(null);
//   const [courseRow, setCourseRow] = useState(undefined); // undefined: loading, null: not found
//   const [classes, setClasses] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [modal, setModal] = useState(null); // "addClass" | "addAssignment" | "editCourse"
//   const [editing, setEditing] = useState(null); // null | { kind, item }
//   const [error, setError] = useState("");

//   // Dialogs ko sirf yehi course milega, dusre courses nahi
//   const courseList = useMemo(() => [courseName], [courseName]);

//   const refresh = useCallback(async () => {
//     if (!courseName) return;
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const [t, c, cl, as] = await Promise.all([
//       supabase.from("teachers").select("*").eq("id", user.id).single(),
//       supabase
//         .from("teacher_courses")
//         .select("*")
//         .eq("teacher_id", user.id)
//         .eq("course", courseName)
//         .maybeSingle(),
//       supabase
//         .from("classes")
//         .select("*")
//         .eq("teacher_id", user.id)
//         .eq("course", courseName)
//         .order("created_at"),
//       supabase
//         .from("assignments")
//         .select("*")
//         .eq("teacher_id", user.id)
//         .eq("course", courseName)
//         .order("created_at"),
//     ]);

//     setTeacher(t.data || null);
//     setCourseRow(c.data || null);
//     setClasses(cl.data || []);
//     setAssignments(as.data || []);
//   }, [courseName]);

//   useEffect(() => {
//     refresh();
//   }, [refresh]);

//   const timeline = useMemo(
//     () =>
//       [
//         ...classes.map((c) => ({ ...c, kind: "class" })),
//         ...assignments.map((a) => ({ ...a, kind: "assignment" })),
//       ].sort((x, y) => new Date(x.created_at) - new Date(y.created_at)),
//     [classes, assignments]
//   );

//   async function deleteItem(item) {
//     if (!window.confirm(`"${item.title}" delete karna hai?`)) return;
//     setError("");

//     const table = item.kind === "class" ? "classes" : "assignments";
//     const { error: delErr } = await supabase
//       .from(table)
//       .delete()
//       .eq("id", item.id);
//     if (delErr) {
//       setError("Delete nahi ho saka: " + delErr.message);
//       return;
//     }

//     const paths = [item.material_url, item.cover_url]
//       .map((u) => (u ? storagePathFromUrl(u, BUCKET) : null))
//       .filter(Boolean);
//     if (paths.length) await supabase.storage.from(BUCKET).remove(paths);

//     refresh();
//   }

//   if (courseRow === undefined || !teacher) {
//     return <p className={styles.hint}>Loading...</p>;
//   }

//   if (courseRow === null) {
//     return (
//       <div className={cstyles.notFound}>
//         <p>Ye course aapke account mein nahi mila.</p>
//         <Link href="/teacher" className={cstyles.btnOutline}>
//           Dashboard par wapas jayein
//         </Link>
//       </div>
//     );
//   }

//   const initial = teacher.username?.charAt(0)?.toUpperCase() || "T";

//   const leading = teacher.avatar_url ? (
//     <img src={teacher.avatar_url} alt="" className={styles.headerAvatar} />
//   ) : (
//     <div className={styles.headerAvatar}>{initial}</div>
//   );

//   const actions = (
//     <Link href="/teacher" className={styles.headerBtn}>
//       ← Dashboard
//     </Link>
//   );

//   return (
//     <>
//       <DashboardShell
//         roleLabel="Teacher"
//         name={teacher.username}
//         leading={leading}
//         actions={actions}
//       >
//         <section className={cstyles.hero}>
//           <div className={cstyles.heroImage}>
//             {courseRow.image_url ? (
//               <img src={courseRow.image_url} alt={courseName} className={cstyles.heroImg} />
//             ) : (
//               <span className={cstyles.coverInitial}>{courseName.charAt(0)}</span>
//             )}
//           </div>

//           <div className={cstyles.heroBody}>
//             <p className={cstyles.kicker}>Course</p>
//             <h2 className={cstyles.heroTitle}>{courseName}</h2>
//             <p className={cstyles.heroDesc}>
//               {courseRow.description ||
//                 "Is course ka description abhi add nahi kiya gaya. Edit course par click karke add karein."}
//             </p>

//             <div className={cstyles.heroActions}>
//               <button
//                 type="button"
//                 className={cstyles.btnPrimary}
//                 onClick={() => setModal("addClass")}
//               >
//                 + Add class
//               </button>
//               <button
//                 type="button"
//                 className={cstyles.btnOutline}
//                 onClick={() => setModal("addAssignment")}
//               >
//                 + Add assignment
//               </button>
//               <button
//                 type="button"
//                 className={cstyles.btnOutline}
//                 onClick={() => setModal("editCourse")}
//               >
//                 Edit course
//               </button>
//             </div>
//           </div>
//         </section>

//         <InfoCard label="Classes" value={classes.length} />
//         <InfoCard label="Assignments" value={assignments.length} />
//         <StudentActivity course={courseName} />

//         <Timeline
//           items={timeline}
//           error={error}
//           onEdit={(item) => setEditing({ kind: item.kind, item })}
//           onDelete={deleteItem}
//         />
//       </DashboardShell>

//       <EditCourseDialog
//         open={modal === "editCourse"}
//         onClose={() => setModal(null)}
//         course={courseRow}
//         courseName={courseName}
//         teacherId={teacher.id}
//         onSaved={refresh}
//       />

//       <AddClassDialog
//         open={modal === "addClass"}
//         onClose={() => setModal(null)}
//         courses={courseList}
//         teacherId={teacher.id}
//         onAdded={refresh}
//         onSaved={refresh}
//       />

//       <AddAssignmentDialog
//         open={modal === "addAssignment"}
//         onClose={() => setModal(null)}
//         courses={courseList}
//         teacherId={teacher.id}
//         onAdded={refresh}
//         onSaved={refresh}
//       />

//       <EditClassDialog
//         open={editing?.kind === "class"}
//         item={editing?.kind === "class" ? editing.item : null}
//         courses={courseList}
//         onClose={() => setEditing(null)}
//         onSaved={refresh}
//       />

//       <EditAssignmentDialog
//         open={editing?.kind === "assignment"}
//         item={editing?.kind === "assignment" ? editing.item : null}
//         courses={courseList} 
//         onClose={() => setEditing(null)}
//         onSaved={refresh}
//       />
//     </> 
//   );
// }




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardShell, { InfoCard } from "../DashboardShell";
import Timeline from "./Timeline";
import AddClassDialog from "./AddClassDialog";
import AddAssignmentDialog from "./AddAssignmentDialog";
import EditClassDialog from "./EditClassDialog";
import EditAssignmentDialog from "./EditAssignmentDialog";
import EditCourseDialog from "./EditCourseDialog";
import styles from "./teacher.module.css";
import cstyles from "./course.module.css";
import { supabase } from "../../lib/supabase";
import { storagePathFromUrl } from "../../lib/storage";
import StudentActivity from "./StudentActivity";

const BUCKET = "class-media";

function readCourseParam(params) {
  const raw = Array.isArray(params?.course) ? params.course[0] : params?.course;
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function CourseDetail() {
  const params = useParams();
  const courseName = readCourseParam(params);

  const [teacher, setTeacher] = useState(null);
  const [courseRow, setCourseRow] = useState(undefined); // undefined: loading, null: not found
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [modal, setModal] = useState(null); // "addClass" | "addAssignment" | "editCourse"
  const [editing, setEditing] = useState(null); // null | { kind, item }
  const [error, setError] = useState("");

  // Dialogs only get this course, not other courses
  const courseList = useMemo(() => [courseName], [courseName]);

  const refresh = useCallback(async () => {
    if (!courseName) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [t, c, cl, as] = await Promise.all([
      supabase.from("teachers").select("*").eq("id", user.id).single(),
      supabase
        .from("teacher_courses")
        .select("*")
        .eq("teacher_id", user.id)
        .eq("course", courseName)
        .maybeSingle(),
      supabase
        .from("classes")
        .select("*")
        .eq("teacher_id", user.id)
        .eq("course", courseName)
        .order("created_at"),
      supabase
        .from("assignments")
        .select("*")
        .eq("teacher_id", user.id)
        .eq("course", courseName)
        .order("created_at"),
    ]);

    setTeacher(t.data || null);
    setCourseRow(c.data || null);
    setClasses(cl.data || []);
    setAssignments(as.data || []);
  }, [courseName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const timeline = useMemo(
    () =>
      [
        ...classes.map((c) => ({ ...c, kind: "class" })),
        ...assignments.map((a) => ({ ...a, kind: "assignment" })),
      ].sort((x, y) => new Date(x.created_at) - new Date(y.created_at)),
    [classes, assignments]
  );

  async function deleteItem(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setError("");

    const table = item.kind === "class" ? "classes" : "assignments";
    const { error: delErr } = await supabase
      .from(table)
      .delete()
      .eq("id", item.id);
    if (delErr) {
      setError("Could not delete: " + delErr.message);
      return;
    }

    const paths = [item.material_url, item.cover_url]
      .map((u) => (u ? storagePathFromUrl(u, BUCKET) : null))
      .filter(Boolean);
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);

    refresh();
  }

  if (courseRow === undefined || !teacher) {
    return <p className={styles.hint}>Loading...</p>;
  }

  if (courseRow === null) {
    return (
      <div className={cstyles.notFound}>
        <p>This course was not found in your account.</p>
        <Link href="/teacher" className={cstyles.btnOutline}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  const initial = teacher.username?.charAt(0)?.toUpperCase() || "T";

  const leading = teacher.avatar_url ? (
    <img src={teacher.avatar_url} alt="" className={styles.headerAvatar} />
  ) : (
    <div className={styles.headerAvatar}>{initial}</div>
  );

  const actions = (
    <Link href="/teacher" className={styles.headerBtn}>
      ← Dashboard
    </Link>
  );

  return (
    <>
      <DashboardShell
        roleLabel="Teacher"
        name={teacher.username}
        leading={leading}
        actions={actions}
      >
        <section className={cstyles.hero}>
          <div className={cstyles.heroImage}>
            {courseRow.image_url ? (
              <img src={courseRow.image_url} alt={courseName} className={cstyles.heroImg} />
            ) : (
              <span className={cstyles.coverInitial}>{courseName.charAt(0)}</span>
            )}
          </div>

          <div className={cstyles.heroBody}>
            <p className={cstyles.kicker}>Course</p>
            <h2 className={cstyles.heroTitle}>{courseName}</h2>
            <p className={cstyles.heroDesc}>
              {courseRow.description ||
                "No description has been added for this course yet. Click Edit course to add one."}
            </p>

            <div className={cstyles.heroActions}>
              <button
                type="button"
                className={cstyles.btnPrimary}
                onClick={() => setModal("addClass")}
              >
                + Add class
              </button>
              <button
                type="button"
                className={cstyles.btnOutline}
                onClick={() => setModal("addAssignment")}
              >
                + Add assignment
              </button>
              <button
                type="button"
                className={cstyles.btnOutline}
                onClick={() => setModal("editCourse")}
              >
                Edit course
              </button>
            </div>
          </div>
        </section>

        <InfoCard label="Classes" value={classes.length} />
        <InfoCard label="Assignments" value={assignments.length} />
        <StudentActivity course={courseName} />

        <Timeline
          items={timeline}
          error={error}
          onEdit={(item) => setEditing({ kind: item.kind, item })}
          onDelete={deleteItem}
        />
      </DashboardShell>

      <EditCourseDialog
        open={modal === "editCourse"}
        onClose={() => setModal(null)}
        course={courseRow}
        courseName={courseName}
        teacherId={teacher.id}
        onSaved={refresh}
      />

      <AddClassDialog
        open={modal === "addClass"}
        onClose={() => setModal(null)}
        courses={courseList}
        teacherId={teacher.id}
        onAdded={refresh}
        onSaved={refresh}
      />

      <AddAssignmentDialog
        open={modal === "addAssignment"}
        onClose={() => setModal(null)}
        courses={courseList}
        teacherId={teacher.id}
        onAdded={refresh}
        onSaved={refresh}
      />

      <EditClassDialog
        open={editing?.kind === "class"}
        item={editing?.kind === "class" ? editing.item : null}
        courses={courseList}
        onClose={() => setEditing(null)}
        onSaved={refresh}
      />

      <EditAssignmentDialog
        open={editing?.kind === "assignment"}
        item={editing?.kind === "assignment" ? editing.item : null}
        courses={courseList}
        onClose={() => setEditing(null)}
        onSaved={refresh}
      />
    </>
  );
}