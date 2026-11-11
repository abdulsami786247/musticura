// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { supabase } from "../../lib/supabase";
// import { InfoCard } from "../DashboardShell";
// import Modal from "./Modal";
// import styles from "./studentActivity.module.css";

// const SUBMIT_BUCKET = "submissions";

// function formatDate(value) {
//   if (!value) return "";
//   return new Date(value).toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// export default function StudentActivity({ course }) {
//   const [rows, setRows] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const load = useCallback(async () => {
//     setLoading(true);
//     const { data, error: rpcErr } = await supabase.rpc("get_course_submissions", {
//       p_course: course,
//     });
//     if (rpcErr) {
//       setError("Submissions load nahi ho saki: " + rpcErr.message);
//     } else {
//       setError("");
//       setRows(data || []);
//     }
//     setLoading(false);
//   }, [course]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   // Submissions ko assignment ke hisaab se group karna (pehle add hua assignment pehle)
//   const groups = useMemo(() => {
//     const map = new Map();
//     rows.forEach((r) => {
//       if (!map.has(r.assign_id)) {
//         map.set(r.assign_id, { id: r.assign_id, title: r.assign_title, items: [] });
//       }
//       map.get(r.assign_id).items.push(r);
//     });
//     return [...map.values()];
//   }, [rows]);

//   async function openFile(row) {
//     setError("");
//     // Popup blocker se bachne ke liye tab pehle khol kar baad mein URL set karte hain
//     const win = window.open("", "_blank");

//     const { data, error: signErr } = await supabase.storage
//       .from(SUBMIT_BUCKET)
//       .createSignedUrl(row.sub_file_path, 300);

//     if (signErr || !data?.signedUrl) {
//       if (win) win.close();
//       setError("File khul nahi saki: " + (signErr?.message || "unknown error"));
//       return;
//     }

//     if (win) {
//       win.location.href = data.signedUrl;
//     } else {
//       window.open(data.signedUrl, "_blank", "noopener,noreferrer");
//     }
//   }

//   const count = rows.length;

//   return (
//     <>
//       <button
//         type="button"
//         className={styles.trigger}
//         onClick={() => {
//           setOpen(true);
//           load();
//         }}
//       >
//         <InfoCard
//           label="Student activity"
//           value={loading && count === 0 ? "..." : `${count} submission${count === 1 ? "" : "s"}`}
//         />
//       </button>

//       <Modal
//         open={open}
//         title="Student activity"
//         onClose={() => setOpen(false)}
//         wide
//       >
//         {error && <p className={styles.error}>{error}</p>}

//         {loading && rows.length === 0 ? (
//           <p className={styles.empty}>Loading...</p>
//         ) : groups.length === 0 ? (
//           <p className={styles.empty}>Abhi kisi student ne assignment upload nahi kiya.</p>
//         ) : (
//           groups.map((g) => (
//             <div key={g.id} className={styles.group}>
//               <h4 className={styles.groupTitle}>
//                 {g.title}
//                 <span className={styles.groupCount}>
//                   {g.items.length} {g.items.length === 1 ? "submission" : "submissions"}
//                 </span>
//               </h4>

//               <ul className={styles.list}>
//                 {g.items.map((r) => (
//                   <li key={r.sub_id} className={styles.row}>
//                     <div className={styles.info}>
//                       <span className={styles.student}>{r.student_name || "—"}</span>
//                       <span className={styles.meta}>
//                         {r.sub_file_name} · {formatDate(r.sub_submitted_at)}
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       className={styles.btn}
//                       onClick={() => openFile(r)}
//                     >
//                       File dekhein
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </Modal>
//     </>
//   );
// }




"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { InfoCard } from "../DashboardShell";
import Modal from "./Modal";
import styles from "./studentActivity.module.css";

const SUBMIT_BUCKET = "submissions";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function StudentActivity({ course }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: rpcErr } = await supabase.rpc("get_course_submissions", {
      p_course: course,
    });
    if (rpcErr) {
      setError("Submissions could not be loaded: " + rpcErr.message);
    } else {
      setError("");
      setRows(data || []);
    }
    setLoading(false);
  }, [course]);

  useEffect(() => {
    load();
  }, [load]);

  // Group submissions by assignment (the assignment added first comes first)
  const groups = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.assign_id)) {
        map.set(r.assign_id, { id: r.assign_id, title: r.assign_title, items: [] });
      }
      map.get(r.assign_id).items.push(r);
    });
    return [...map.values()];
  }, [rows]);

  async function openFile(row) {
    setError("");
    // To avoid the popup blocker, open the tab first and set the URL later
    const win = window.open("", "_blank");

    const { data, error: signErr } = await supabase.storage
      .from(SUBMIT_BUCKET)
      .createSignedUrl(row.sub_file_path, 300);

    if (signErr || !data?.signedUrl) {
      if (win) win.close();
      setError("File could not be opened: " + (signErr?.message || "unknown error"));
      return;
    }

    if (win) {
      win.location.href = data.signedUrl;
    } else {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  }

  const count = rows.length;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => {
          setOpen(true);
          load();
        }}
      >
        <InfoCard
          label="Student activity"
          value={loading && count === 0 ? "..." : `${count} submission${count === 1 ? "" : "s"}`}
        />
      </button>

      <Modal
        open={open}
        title="Student activity"
        onClose={() => setOpen(false)}
        wide
      >
        {error && <p className={styles.error}>{error}</p>}

        {loading && rows.length === 0 ? (
          <p className={styles.empty}>Loading...</p>
        ) : groups.length === 0 ? (
          <p className={styles.empty}>No student has uploaded an assignment yet.</p>
        ) : (
          groups.map((g) => (
            <div key={g.id} className={styles.group}>
              <h4 className={styles.groupTitle}>
                {g.title}
                <span className={styles.groupCount}>
                  {g.items.length} {g.items.length === 1 ? "submission" : "submissions"}
                </span>
              </h4>

              <ul className={styles.list}>
                {g.items.map((r) => (
                  <li key={r.sub_id} className={styles.row}>
                    <div className={styles.info}>
                      <span className={styles.student}>{r.student_name || "—"}</span>
                      <span className={styles.meta}>
                        {r.sub_file_name} · {formatDate(r.sub_submitted_at)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={() => openFile(r)}
                    >
                      View file
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </Modal>
    </>
  );
}