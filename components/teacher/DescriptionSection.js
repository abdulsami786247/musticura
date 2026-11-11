// "use client";

// import { useEffect, useState } from "react";
// import styles from "./teacher.module.css";
// import { supabase } from "../../lib/supabase";

// const MAX = 500;

// export default function DescriptionSection({ profile }) {
//   const [text, setText] = useState(profile?.description || "");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [ok, setOk] = useState("");

//   useEffect(() => {
//     setText(profile?.description || "");
//   }, [profile?.description]);

//   async function handleSave() {
//     setError("");
//     setOk("");

//     const value = text.trim();
//     if (value.length > MAX) {
//       setError(`Description ${MAX} characters se zyada nahi ho sakta.`);
//       return;
//     }

//     setSaving(true);
//     const { data, error: rpcErr } = await supabase.rpc(
//       "update_teacher_description",
//       { p_description: value }
//     );
//     setSaving(false);

//     if (rpcErr) {
//       setError("Description save nahi ho saka: " + rpcErr.message);
//       return;
//     }
//     if (!data?.ok) {
//       setError(
//         data?.error === "too_long"
//           ? `Description ${MAX} characters se zyada nahi ho sakta.`
//           : "Description save nahi ho saka. Dobara koshish karein."
//       );
//       return;
//     }

//     setOk("Description save ho gaya.");
//   }

//   return (
//     <div className={styles.section}>
//       <h4 className={styles.sectionTitle}>About you (description)</h4>

//       <label className={styles.field}>
//         <span>Apne baare mein likhein (optional)</span>
//         <textarea
//           className={styles.input}
//           rows={4}
//           maxLength={MAX}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Apna experience, skills aur teaching style likhein..."
//         />
//       </label>

//       <p className={styles.hint}>
//         {text.length} / {MAX}
//       </p>

//       {error && <p className={styles.errBox}>{error}</p>}
//       {ok && <p className={styles.okBox}>{ok}</p>}

//       <div className={styles.inline}>
//         <button
//           type="button"
//           className={styles.primaryBtn}
//           onClick={handleSave}
//           disabled={saving}
//         >
//           {saving ? "Saving..." : "Save description"}
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import styles from "./teacher.module.css";
import { supabase } from "../../lib/supabase";

const MAX = 500;

export default function DescriptionSection({ profile }) {
  const [text, setText] = useState(profile?.description || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    setText(profile?.description || "");
  }, [profile?.description]);

  async function handleSave() {
    setError("");
    setOk("");

    const value = text.trim();
    if (value.length > MAX) {
      setError(`Description cannot be more than ${MAX} characters.`);
      return;
    }

    setSaving(true);
    const { data, error: rpcErr } = await supabase.rpc(
      "update_teacher_description",
      { p_description: value }
    );
    setSaving(false);

    if (rpcErr) {
      setError("Description could not be saved: " + rpcErr.message);
      return;
    }
    if (!data?.ok) {
      setError(
        data?.error === "too_long"
          ? `Description cannot be more than ${MAX} characters.`
          : "Description could not be saved. Please try again."
      );
      return;
    }

    setOk("Description saved.");
  }

  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>About you (description)</h4>

      <label className={styles.field}>
        <span>Write about yourself (optional)</span>
        <textarea
          className={styles.input}
          rows={4}
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your experience, skills and teaching style..."
        />
      </label>

      <p className={styles.hint}>
        {text.length} / {MAX}
      </p>

      {error && <p className={styles.errBox}>{error}</p>}
      {ok && <p className={styles.okBox}>{ok}</p>}

      <div className={styles.inline}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save description"}
        </button>
      </div>
    </div>
  );
}