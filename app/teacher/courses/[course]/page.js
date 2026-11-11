"use client";

import RoleGuard from "../../../../components/RoleGuard";
import CourseDetail from "../../../../components/teacher/CourseDetail";

export default function TeacherCoursePage() {
  return (
    <RoleGuard allowedRole="teacher">
      {() => <CourseDetail />}
    </RoleGuard>
  );
}