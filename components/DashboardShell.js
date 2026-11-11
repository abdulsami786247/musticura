"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./DashboardShell.module.css";

export default function DashboardShell({ roleLabel, name, leading, actions, children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {leading}
          <div>
            <p className={styles.roleTag}>{roleLabel} Dashboard</p>
            <h1 className={styles.title}>Welcome, {name}</h1>
          </div>
        </div>

        <div className={styles.actions}>
          {actions}
          <button type="button" onClick={handleLogout} className={styles.logout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.grid}>{children}</div>
      </main>
    </div>
  );
}

export function InfoCard({ label, value }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <strong className={styles.cardValue}>{value}</strong>
    </div>
  );
}