"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentRole } from "@/lib/auth";
import styles from "./DashboardShell.module.css";

export default function RoleGuard({ allowedRole, children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function checkAccess() {
      const { user, role, profile } = await getCurrentRole();
      if (!mounted) return;

      // Login nahi hai ya kisi role mein registered nahi
      if (!user || !role) {
        router.replace("/login");
        return;
      }

      // Galat page par hai: apne sahi dashboard par bhejo
      if (role !== allowedRole) {
        router.replace(`/${role}`);
        return;
      }

      setProfile(profile);
      setStatus("allowed");
    }

    checkAccess();

    // Logout ya session khatam hone par login page par bhejo
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [allowedRole, router]);

  if (status !== "allowed") {
    return <div className={styles.loading}>Loading...</div>;
  }

  return children(profile);
}