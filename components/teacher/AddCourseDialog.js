"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { COURSES } from "@/lib/courses";
import Modal from "./Modal";
import styles from "./teacher.module.css";

export default function AddCourseDialog({ open, onClose, teacherId, existingCourses, onAdded }) {
  const available = COURSES.filter((c) => !existingCourses.includes(c));
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCourse("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!course) {
      setError("Course select karein");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase
      .from("teacher_courses")
      .insert({ teacher_id: teacherId, course });
    setLoading(false);

    if (err) {
      setError(
        err.code === "23505"
          ? "Ye course aap pehle se add kar chuke hain."
          : "Course add nahi ho saka. Dobara koshish karein."
      );
      return;
    }

    onAdded();
    onClose();
  };

  return (
    <Modal open={open} title="Add course" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="add-course">Course</label>
          <select
            id="add-course"
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setError("");
            }}
            className={styles.input}
          >
            <option value="">
              {available.length ? "Course select karein" : "Sab courses add ho chuke hain"}
            </option>
            {available.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && <div className={styles.errBox}>{error}</div>}

        <button type="submit" className={styles.primaryBtn} disabled={loading || !available.length}>
          {loading ? "Adding..." : "Add course"}
        </button>
      </form>
    </Modal>
  );
}