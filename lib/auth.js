import { supabase } from "@/lib/supabase";

// Current user ka role pata karta hai (students ya teachers table se)
export async function getCurrentRole() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { user: null, role: null, profile: null };
  }

  const user = session.user;

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (student) {
    return { user, role: "student", profile: student };
  }

  const { data: teacher } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (teacher) {
    return { user, role: "teacher", profile: teacher };
  }

  return { user, role: null, profile: null };
}