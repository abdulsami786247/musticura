import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token ke saath client banayen taake RLS ke tahat apna data mil sake
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = userData.user;

    // Pehle students mein dekhein, phir teachers mein
    let profile = null;
    let role = null;

    const { data: student } = await supabase
      .from("students")
      .select("username, email, course")
      .eq("id", user.id)
      .maybeSingle();

    if (student) {
      profile = student;
      role = "student";
    } else {
      const { data: teacher } = await supabase
        .from("teachers")
        .select("username, email, course")
        .eq("id", user.id)
        .maybeSingle();

      if (teacher) {
        profile = teacher;
        role = "teacher";
      }
    }

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const message =
      role === "student"
        ? "Our team will provide you your required course and teacher soon."
        : "We will provide you students accordingly to your selected course.";

    const roleLabel = role === "student" ? "Student" : "Teacher";

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6fb; padding:30px 15px;">
        <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
          <div style="background:linear-gradient(135deg,#2563eb,#1e40af); padding:28px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:24px;">Welcome to Musticura</h1>
          </div>
          <div style="padding:30px 26px; color:#374151; font-size:15px; line-height:1.7;">
            <p style="margin:0 0 12px;">Hi <strong>${profile.username}</strong>,</p>
            <p style="margin:0 0 12px;">Your registration as a <strong>${roleLabel}</strong> is complete.</p>
            <p style="margin:0 0 12px;">Selected course: <strong>${profile.course}</strong></p>
            <p style="margin:0 0 12px;">${message}</p>
            <p style="margin:24px 0 0; color:#6b7280; font-size:13px;">Thank you for joining Musticura.</p>
          </div>
          <div style="background:#f9fafb; padding:16px; text-align:center; border-top:1px solid #e5e7eb;">
            <p style="color:#9ca3af; font-size:12px; margin:0;">&copy; Musticura. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Musticura" <${process.env.GMAIL_USER}>`,
      to: profile.email,
      subject: "Registration Successful - Welcome to Musticura",
      html,
    });

    return Response.json({ success: true, role });
  } catch (error) {
    console.error("Welcome email error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}