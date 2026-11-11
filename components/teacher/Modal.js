"use client";

import styles from "./teacher.module.css";

export default function Modal({ open, title, onClose, wide = false, children }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${styles.dialog} ${wide ? styles.dialogWide : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}