// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import cstyles from "../teacher/course.module.css";
// import tstyles from "../teacher/teacher.module.css";
// import DashboardShell, { InfoCard } from "../DashboardShell";
// import { supabase } from "../../lib/supabase";
// import { COURSES } from "../../lib/courses";
// import StudentProfileDialog from "./StudentProfileDialog";

// export default function StudentDashboard() {
//   const [me, setMe] = useState(null);
//   const [enrolled, setEnrolled] = useState([]);
//   const [cards, setCards] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [editOpen, setEditOpen] = useState(false);

//   const refresh = useCallback(async () => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const [s, sc, cd, cl, as] = await Promise.all([
//       supabase.from("students").select("*").eq("id", user.id).single(),
//       supabase
//         .from("student_courses")
//         .select("course, created_at")
//         .eq("student_id", user.id)
//         .order("created_at"),
//       supabase.rpc("get_student_courses"),
//       supabase.from("classes").select("teacher_id, course"),
//       supabase.from("assignments").select("teacher_id, course"),
//     ]);

//     setMe(s.data || null);
//     setEnrolled(sc.data || []);
//     setCards(cd.data || []);
//     setClasses(cl.data || []);
//     setAssignments(as.data || []);
//   }, []);

//   useEffect(() => {
//     refresh();
//   }, [refresh]);

//   const enrolledNames = useMemo(() => enrolled.map((r) => r.course), [enrolled]);

//   const waiting = useMemo(
//     () => enrolledNames.filter((n) => !cards.some((c) => c.course === n)),
//     [enrolledNames, cards]
//   );

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
//     <button className={tstyles.headerBtn} onClick={() => setEditOpen(true)}>
//       Edit profile
//     </button>
//   );

//   return (
//     <>
//       <DashboardShell
//         roleLabel="Student"
//         name={me.username}
//         leading={leading}
//         actions={actions}
//       >
//         <InfoCard label="Total courses" value={`${enrolled.length} / ${COURSES.length}`} />
//         <InfoCard
//           label="My courses"
//           value={enrolledNames.length ? enrolledNames.join(", ") : "Abhi koi course nahi"}
//         />
//         <InfoCard label="Assigned teacher" value="Will be assigned soon" />
//         <InfoCard label="Chats" value="Coming soon" />

//         <section className={cstyles.wrapper}>
//           <div className={cstyles.head}>
//             <h3 className={cstyles.heading}>My courses</h3>
//             <span className={cstyles.count}>
//               {cards.length} {cards.length === 1 ? "course" : "courses"}
//             </span>
//           </div>

//           {enrolled.length === 0 ? (
//             <p className={cstyles.empty}>
//               Abhi koi course nahi hai. Edit profile se course select karein.
//             </p>
//           ) : (
//             <>
//               {cards.length > 0 && (
//                 <div className={cstyles.grid}>
//                   {cards.map((c) => {
//                     const classCount = classes.filter(
//                       (x) => x.teacher_id === c.teacher_id && x.course === c.course
//                     ).length;
//                     const assignmentCount = assignments.filter(
//                       (x) => x.teacher_id === c.teacher_id && x.course === c.course
//                     ).length;
//                     const teacherInitial =
//                       c.teacher_username?.charAt(0)?.toUpperCase() || "T";

//                     return (
//                       <Link
//                         key={`${c.teacher_id}-${c.course}`}
//                         href={`/student/courses/${c.teacher_id}/${encodeURIComponent(c.course)}`}
//                         className={cstyles.courseCard}
//                       >
//                         <div className={cstyles.cover}>
//                           {c.image_url ? (
//                             <img
//                               src={c.image_url}
//                               alt={c.course}
//                               className={cstyles.coverImg}
//                             />
//                           ) : (
//                             <span className={cstyles.coverInitial}>
//                               {c.course.charAt(0)}
//                             </span>
//                           )}
//                           <div className={cstyles.coverShade} />
//                         </div>

//                         <div className={cstyles.courseBody}>
//                           <h4 className={cstyles.courseName}>{c.course}</h4>

//                           <div className={cstyles.teacherRow}>
//                             {c.teacher_avatar_url ? (
//                               <img
//                                 src={c.teacher_avatar_url}
//                                 alt={c.teacher_username}
//                                 className={cstyles.teacherAvatar}
//                               />
//                             ) : (
//                               <span className={cstyles.teacherAvatarPh}>
//                                 {teacherInitial}
//                               </span>
//                             )}
//                             <div className={cstyles.teacherInfo}>
//                               <span className={cstyles.teacherLabel}>Teacher</span>
//                               <span className={cstyles.teacherName}>
//                                 {c.teacher_username || "—"}
//                               </span>
//                             </div>
//                           </div>

//                           <p className={cstyles.courseDesc}>
//                             {c.description || "Description abhi add nahi kiya gaya."}
//                           </p>

//                           <div className={cstyles.courseFoot}>
//                             <div className={cstyles.metaChips}>
//                               <span className={cstyles.metaChip}>{classCount} classes</span>
//                               <span className={cstyles.metaChip}>
//                                 {assignmentCount} assignments
//                               </span>
//                             </div>
//                             <span className={cstyles.openLink}>Open →</span>
//                           </div>
//                         </div>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}

//               {waiting.length > 0 && (
//                 <p className={cstyles.empty}>
//                   Ye courses abhi kisi teacher ne add nahi kiye: {waiting.join(", ")}
//                 </p>
//               )}
//             </>
//           )}
//         </section>
//       </DashboardShell>

//       <StudentProfileDialog
//         open={editOpen}
//         onClose={() => setEditOpen(false)}
//         profile={me}
//         courses={enrolledNames}
//         onSaved={refresh}
//       />
//     </>
//   );
// }



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import cstyles from "../teacher/course.module.css";
import tstyles from "../teacher/teacher.module.css";
import DashboardShell, { InfoCard } from "../DashboardShell";
import { supabase } from "../../lib/supabase";
import { COURSES } from "../../lib/courses";
import StudentProfileDialog from "./StudentProfileDialog";

export default function StudentDashboard() {
  const [me, setMe] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [cards, setCards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const refresh = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [s, sc, cd, cl, as] = await Promise.all([
      supabase.from("students").select("*").eq("id", user.id).single(),
      supabase
        .from("student_courses")
        .select("course, created_at")
        .eq("student_id", user.id)
        .order("created_at"),
      supabase.rpc("get_student_courses"),
      supabase.from("classes").select("teacher_id, course"),
      supabase.from("assignments").select("teacher_id, course"),
    ]);

    setMe(s.data || null);
    setEnrolled(sc.data || []);
    setCards(cd.data || []);
    setClasses(cl.data || []);
    setAssignments(as.data || []);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enrolledNames = useMemo(() => enrolled.map((r) => r.course), [enrolled]);

  const waiting = useMemo(
    () => enrolledNames.filter((n) => !cards.some((c) => c.course === n)),
    [enrolledNames, cards]
  );

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
    <button className={tstyles.headerBtn} onClick={() => setEditOpen(true)}>
      Edit profile
    </button>
  );

  return (
    <>
      <DashboardShell
        roleLabel="Student"
        name={me.username}
        leading={leading}
        actions={actions}
      >
        <InfoCard label="Total courses" value={`${enrolled.length} / ${COURSES.length}`} />
        <InfoCard
          label="My courses"
          value={enrolledNames.length ? enrolledNames.join(", ") : "No courses yet"}
        />
        <InfoCard label="Assigned teacher" value="Will be assigned soon" />
        <InfoCard label="Chats" value="Coming soon" />

        <section className={cstyles.wrapper}>
          <div className={cstyles.head}>
            <h3 className={cstyles.heading}>My courses</h3>
            <span className={cstyles.count}>
              {cards.length} {cards.length === 1 ? "course" : "courses"}
            </span>
          </div>

          {enrolled.length === 0 ? (
            <p className={cstyles.empty}>
              There are no courses yet. Select courses from Edit profile.
            </p>
          ) : (
            <>
              {cards.length > 0 && (
                <div className={cstyles.grid}>
                  {cards.map((c) => {
                    const classCount = classes.filter(
                      (x) => x.teacher_id === c.teacher_id && x.course === c.course
                    ).length;
                    const assignmentCount = assignments.filter(
                      (x) => x.teacher_id === c.teacher_id && x.course === c.course
                    ).length;
                    const teacherInitial =
                      c.teacher_username?.charAt(0)?.toUpperCase() || "T";

                    return (
                      <Link
                        key={`${c.teacher_id}-${c.course}`}
                        href={`/student/courses/${c.teacher_id}/${encodeURIComponent(c.course)}`}
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
                            {c.teacher_avatar_url ? (
                              <img
                                src={c.teacher_avatar_url}
                                alt={c.teacher_username}
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
                                {c.teacher_username || "—"}
                              </span>
                            </div>
                          </div>

                          <p className={cstyles.courseDesc}>
                            {c.description || "No description added yet."}
                          </p>

                          <div className={cstyles.courseFoot}>
                            <div className={cstyles.metaChips}>
                              <span className={cstyles.metaChip}>{classCount} classes</span>
                              <span className={cstyles.metaChip}>
                                {assignmentCount} assignments
                              </span>
                            </div>
                            <span className={cstyles.openLink}>Open →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {waiting.length > 0 && (
                <p className={cstyles.empty}>
                  These courses have not been added by any teacher yet: {waiting.join(", ")}
                </p>
              )}
            </>
          )}
        </section>
      </DashboardShell>

      <StudentProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={me}
        courses={enrolledNames}
        onSaved={refresh}
      />
    </>
  );
}