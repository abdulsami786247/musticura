// "use client";

// import styles from "./timeline.module.css";

// function formatDate(value) {
//   return new Date(value).toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// function DocIcon() {
//   return (
//     <svg
//       width="28"
//       height="28"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       aria-hidden="true"
//     >
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <polyline points="14 2 14 8 20 8" />
//       <line x1="8" y1="13" x2="16" y2="13" />
//       <line x1="8" y1="17" x2="13" y2="17" />
//     </svg>
//   );
// }

// export default function Timeline({ items, error, onEdit, onDelete }) {
//   return (
//     <section className={styles.wrapper}>
//       <div className={styles.head}>
//         <h3 className={styles.heading}>Timeline</h3>
//         {items.length > 0 && (
//           <span className={styles.count}>{items.length} items</span>
//         )}
//       </div>

//       {error && <p className={styles.error}>{error}</p>}

//       {items.length === 0 ? (
//         <p className={styles.empty}>Abhi koi class ya assignment nahi hai.</p>
//       ) : (
//         <ol className={styles.list}>
//           {items.map((item, index) => {
//             const isClass = item.kind === "class";
//             const when = isClass
//               ? formatDate(item.starts_at)
//               : item.due_at
//               ? formatDate(item.due_at)
//               : "No due date";

//             return (
//               <li key={`${item.kind}-${item.id}`} className={styles.item}>
//                 <span className={styles.step}>{index + 1}</span>

//                 <article
//                   className={`${styles.card} ${
//                     isClass ? styles.cardClass : styles.cardAssignment
//                   }`}
//                 >
//                   {isClass ? (
//                     item.cover_url ? (
//                       <img
//                         src={item.cover_url}
//                         alt={item.title}
//                         className={styles.thumb}
//                       />
//                     ) : (
//                       <div className={styles.thumbPlaceholder}>Class</div>
//                     )
//                   ) : (
//                     <div className={styles.docIcon}>
//                       <DocIcon />
//                     </div>
//                   )}

//                   <div className={styles.body}>
//                     <div className={styles.topRow}>
//                       <span
//                         className={`${styles.badge} ${
//                           isClass ? styles.badgeClass : styles.badgeAssignment
//                         }`}
//                       >
//                         {isClass ? "Class" : "Assignment"}
//                       </span>
//                       <span className={styles.course}>{item.course}</span>
//                     </div>

//                     <h4 className={styles.title}>{item.title}</h4>
//                     <p className={styles.meta}>{when}</p>

//                     {!isClass && item.description && (
//                       <p className={styles.desc}>{item.description}</p>
//                     )}

//                     <div className={styles.actions}>
//                       {item.material_url && (
//                         <a
//                           href={item.material_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={styles.btnGhost}
//                         >
//                           PDF dekhein
//                         </a>
//                       )}

//                       {isClass && item.meeting_link && (
//                         <a
//                           href={item.meeting_link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={styles.btnPrimary}
//                         >
//                           Join class
//                         </a>
//                       )}

//                       <button
//                         type="button"
//                         className={styles.btnGhost}
//                         onClick={() => onEdit(item)}
//                       >
//                         Edit
//                       </button>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     className={styles.remove}
//                     onClick={() => onDelete(item)}
//                     aria-label="Delete"
//                     title="Delete"
//                   >
//                     ×
//                   </button>
//                 </article>
//               </li>
//             );
//           })}
//         </ol>
//       )}
//     </section>
//   );
// }



"use client";

import styles from "./timeline.module.css";

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function DocIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export default function Timeline({ items, error, onEdit, onDelete }) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.head}>
        <h3 className={styles.heading}>Timeline</h3>
        {items.length > 0 && (
          <span className={styles.count}>{items.length} items</span>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {items.length === 0 ? (
        <p className={styles.empty}>There are no classes or assignments yet.</p>
      ) : (
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isClass = item.kind === "class";
            const when = isClass
              ? formatDate(item.starts_at)
              : item.due_at
              ? formatDate(item.due_at)
              : "No due date";

            return (
              <li key={`${item.kind}-${item.id}`} className={styles.item}>
                <span className={styles.step}>{index + 1}</span>

                <article
                  className={`${styles.card} ${
                    isClass ? styles.cardClass : styles.cardAssignment
                  }`}
                >
                  {isClass ? (
                    item.cover_url ? (
                      <img
                        src={item.cover_url}
                        alt={item.title}
                        className={styles.thumb}
                      />
                    ) : (
                      <div className={styles.thumbPlaceholder}>Class</div>
                    )
                  ) : (
                    <div className={styles.docIcon}>
                      <DocIcon />
                    </div>
                  )}

                  <div className={styles.body}>
                    <div className={styles.topRow}>
                      <span
                        className={`${styles.badge} ${
                          isClass ? styles.badgeClass : styles.badgeAssignment
                        }`}
                      >
                        {isClass ? "Class" : "Assignment"}
                      </span>
                      <span className={styles.course}>{item.course}</span>
                    </div>

                    <h4 className={styles.title}>{item.title}</h4>
                    <p className={styles.meta}>{when}</p>

                    {!isClass && item.description && (
                      <p className={styles.desc}>{item.description}</p>
                    )}

                    <div className={styles.actions}>
                      {item.material_url && (
                        <a
                          href={item.material_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.btnGhost}
                        >
                          View PDF
                        </a>
                      )}

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

                      <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => onDelete(item)}
                    aria-label="Delete"
                    title="Delete"
                  >
                    ×
                  </button>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}