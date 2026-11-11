"use client";

import RoleGuard from "@/components/RoleGuard";
import TeacherDashboard from "@/components/teacher/TeacherDashboard";

export default function TeacherPage() {
  return (
    <RoleGuard allowedRole="teacher">
      {(profile) => <TeacherDashboard profile={profile} />}
    </RoleGuard>
  );
}