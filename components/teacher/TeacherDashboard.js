// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import styles from "./teacher.module.css";
// import cstyles from "./course.module.css";
// import DashboardShell, { InfoCard } from "../DashboardShell";
// import { supabase } from "../../lib/supabase";
// import ProfileDialog from "./ProfileDialog";

// function CourseCards({ courses, teacher }) {
//   const teacherInitial = teacher?.username?.charAt(0)?.toUpperCase() || "T";

//   return (
//     <section className={cstyles.wrapper}>
//       <div className={cstyles.head}>
//         <h3 className={cstyles.heading}>My courses</h3>
//         <span className={cstyles.count}>
//           {courses.length} {courses.length === 1 ? "course" : "courses"}
//         </span>
//       </div>

//       {courses.length === 0 ? (
//         <p className={cstyles.empty}>
//           Abhi koi course nahi hai. Edit profile se course add karein.
//         </p>
//       ) : (
//         <div className={cstyles.grid}>
//           {courses.map((c) => (
//             <Link
//               key={c.course}
//               href={`/teacher/courses/${encodeURIComponent(c.course)}`}
//               className={cstyles.courseCard}
//             >
//               <div className={cstyles.cover}>
//                 {c.image_url ? (
//                   <img
//                     src={c.image_url}
//                     alt={c.course}
//                     className={cstyles.coverImg}
//                   />
//                 ) : (
//                   <span className={cstyles.coverInitial}>
//                     {c.course.charAt(0)}
//                   </span>
//                 )}
//                 <div className={cstyles.coverShade} />
//               </div>

//               <div className={cstyles.courseBody}>
//                 <h4 className={cstyles.courseName}>{c.course}</h4>

//                 <div className={cstyles.teacherRow}>
//                   {teacher?.avatar_url ? (
//                     <img
//                       src={teacher.avatar_url}
//                       alt={teacher.username}
//                       className={cstyles.teacherAvatar}
//                     />
//                   ) : (
//                     <span className={cstyles.teacherAvatarPh}>
//                       {teacherInitial}
//                     </span>
//                   )}
//                   <div className={cstyles.teacherInfo}>
//                     <span className={cstyles.teacherLabel}>Teacher</span>
//                     <span className={cstyles.teacherName}>
//                       {teacher?.username || "—"}
//                     </span>
//                   </div>
//                 </div>

//                 <p className={cstyles.courseDesc}>
//                   {c.description || "Description abhi add nahi kiya gaya."}
//                 </p>

//                 <div className={cstyles.courseFoot}>
//                   <div className={cstyles.metaChips}>
//                     <span className={cstyles.metaChip}>{c.classCount} classes</span>
//                     <span className={cstyles.metaChip}>
//                       {c.assignmentCount} assignments
//                     </span>
//                   </div>
//                   <span className={cstyles.openLink}>Open →</span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

// export default function TeacherDashboard({ profile }) {
//   const [current, setCurrent] = useState(null);
//   const [courseRows, setCourseRows] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const refresh = useCallback(async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const [t, c, cl, as] = await Promise.all([
//       supabase.from("teachers").select("*").eq("id", user.id).single(),
//       supabase
//         .from("teacher_courses")
//         .select("course, description, image_url, created_at")
//         .eq("teacher_id", user.id)
//         .order("created_at"),
//       supabase
//         .from("classes")
//         .select("*")
//         .eq("teacher_id", user.id)
//         .order("created_at"),
//       supabase
//         .from("assignments")
//         .select("*")
//         .eq("teacher_id", user.id)
//         .order("created_at"),
//     ]);

//     setCurrent(t.data || null);
//     setCourseRows(c.data || []);
//     setClasses(cl.data || []);
//     setAssignments(as.data || []);
//   }, []);

//   useEffect(() => {
//     refresh();
//   }, [refresh]);

//   const courses = useMemo(() => courseRows.map((r) => r.course), [courseRows]);

//   const courseCards = useMemo(
//     () =>
//       courseRows.map((r) => ({
//         course: r.course,
//         description: r.description,
//         image_url: r.image_url,
//         classCount: classes.filter((x) => x.course === r.course).length,
//         assignmentCount: assignments.filter((x) => x.course === r.course).length,
//       })),
//     [courseRows, classes, assignments]
//   );

//   if (!current) {
//     return <p className={styles.hint}>Loading...</p>;
//   }

//   const initial = current.username?.charAt(0)?.toUpperCase() || "T";

//   const leading = current.avatar_url ? (
//     <img src={current.avatar_url} alt="" className={styles.headerAvatar} />
//   ) : (
//     <div className={styles.headerAvatar}>{initial}</div>
//   );

//   const actions = (
//     <button className={styles.headerBtn} onClick={() => setProfileOpen(true)}>
//       Edit profile
//     </button>
//   );

//   return (
//     <>
//       <DashboardShell
//         roleLabel="Teacher"
//         name={current.username}
//         leading={leading}
//         actions={actions}
//       >
//         <InfoCard
//           label="Teaching courses"
//           value={courses.length ? courses.join(", ") : "Abhi koi course nahi"}
//         />
//         <InfoCard label="Scheduled classes" value={classes.length} />

//         <InfoCard label="Chats" value="Coming soon" />

//         <CourseCards courses={courseCards} teacher={current} />
//       </DashboardShell>

//       <ProfileDialog
//         open={profileOpen}
//         onClose={() => setProfileOpen(false)}
//         profile={current}
//         courses={courses}
//         onSaved={refresh}
//         onChanged={refresh}
//       />
//     </>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./teacher.module.css";
import cstyles from "./course.module.css";
import DashboardShell, { InfoCard } from "../DashboardShell";
import { supabase } from "../../lib/supabase";
import ProfileDialog from "./ProfileDialog";

function CourseCards({ courses, teacher }) {
  const teacherInitial = teacher?.username?.charAt(0)?.toUpperCase() || "T";

  return (
    <section className={cstyles.wrapper}>
      <div className={cstyles.head}>
        <h3 className={cstyles.heading}>My courses</h3>
        <span className={cstyles.count}>
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </span>
      </div>

      {courses.length === 0 ? (
        <p className={cstyles.empty}>
          There are no courses yet. Add a course from Edit profile.
        </p>
      ) : (
        <div className={cstyles.grid}>
          {courses.map((c) => (
            <Link
              key={c.course}
              href={`/teacher/courses/${encodeURIComponent(c.course)}`}
              className={cstyles.courseCard}
            >
              <div className={cstyles.cover}>
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.course}
                    className={cstyles.coverImg}
                  />
                ) : (
                  <span className={cstyles.coverInitial}>
                    {c.course.charAt(0)}
                  </span>
                )}
                <div className={cstyles.coverShade} />
              </div>

              <div className={cstyles.courseBody}>
                <h4 className={cstyles.courseName}>{c.course}</h4>

                <div className={cstyles.teacherRow}>
                  {teacher?.avatar_url ? (
                    <img
                      src={teacher.avatar_url}
                      alt={teacher.username}
                      className={cstyles.teacherAvatar}
                    />
                  ) : (
                    <span className={cstyles.teacherAvatarPh}>
                      {teacherInitial}
                    </span>
                  )}
                  <div className={cstyles.teacherInfo}>
                    <span className={cstyles.teacherLabel}>Teacher</span>
                    <span className={cstyles.teacherName}>
                      {teacher?.username || "—"}
                    </span>
                  </div>
                </div>

                <p className={cstyles.courseDesc}>
                  {c.description || "No description added yet."}
                </p>

                <div className={cstyles.courseFoot}>
                  <div className={cstyles.metaChips}>
                    <span className={cstyles.metaChip}>{c.classCount} classes</span>
                    <span className={cstyles.metaChip}>
                      {c.assignmentCount} assignments
                    </span>
                  </div>
                  <span className={cstyles.openLink}>Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function TeacherDashboard({ profile }) {
  const [current, setCurrent] = useState(null);
  const [courseRows, setCourseRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const refresh = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [t, c, cl, as] = await Promise.all([
      supabase.from("teachers").select("*").eq("id", user.id).single(),
      supabase
        .from("teacher_courses")
        .select("course, description, image_url, created_at")
        .eq("teacher_id", user.id)
        .order("created_at"),
      supabase
        .from("classes")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at"),
      supabase
        .from("assignments")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at"),
    ]);

    setCurrent(t.data || null);
    setCourseRows(c.data || []);
    setClasses(cl.data || []);
    setAssignments(as.data || []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const courses = useMemo(() => courseRows.map((r) => r.course), [courseRows]);

  const courseCards = useMemo(
    () =>
      courseRows.map((r) => ({
        course: r.course,
        description: r.description,
        image_url: r.image_url,
        classCount: classes.filter((x) => x.course === r.course).length,
        assignmentCount: assignments.filter((x) => x.course === r.course).length,
      })),
    [courseRows, classes, assignments]
  );

  if (!current) {
    return <p className={styles.hint}>Loading...</p>;
  }

  const initial = current.username?.charAt(0)?.toUpperCase() || "T";

  const leading = current.avatar_url ? (
    <img src={current.avatar_url} alt="" className={styles.headerAvatar} />
  ) : (
    <div className={styles.headerAvatar}>{initial}</div>
  );

  const actions = (
    <button className={styles.headerBtn} onClick={() => setProfileOpen(true)}>
      Edit profile
    </button>
  );

  return (
    <>
      <DashboardShell
        roleLabel="Teacher"
        name={current.username}
        leading={leading}
        actions={actions}
      >
        <InfoCard
          label="Teaching courses"
          value={courses.length ? courses.join(", ") : "No courses yet"}
        />
        <InfoCard label="Scheduled classes" value={classes.length} />

        <InfoCard label="Chats" value="Coming soon" />

        <CourseCards courses={courseCards} teacher={current} />
      </DashboardShell>

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={current}
        courses={courses}
        onSaved={refresh}
        onChanged={refresh}
      />
    </>
  );
}