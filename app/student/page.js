"use client";

import RoleGuard from "../../components/RoleGuard";
import StudentDashboard from "../../components/student/StudentDashboard";

export default function StudentPage() {
  return (
    <RoleGuard allowedRole="student">
      {() => <StudentDashboard />}
    </RoleGuard>
  );
}