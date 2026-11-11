// "use client";

// import { useState } from "react";
// import { supabase } from "../../lib/supabase";

// const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

// export default function ContactPage() {
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [sending, setSending] = useState(false);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (sending) return;

//     setSuccess("");
//     setError("");
//     setSending(true);

//     const payload = {
//       full_name: form.name.trim(),
//       email: form.email.trim(),
//       subject: form.subject.trim(),
//       message: form.message.trim(),
//     };

//     const { error: insertErr } = await supabase.from("client").insert(payload);

//     setSending(false);

//     if (insertErr) {
//       setError("Message send nahi ho saka. Thori dair baad dobara koshish karein.");
//       return;
//     }

//     setSuccess("Thank you! Your message has been sent.");
//     setForm(EMPTY_FORM);
//   };

//   return (
//     <>
//       <section className="page-hero">
//         <div className="container">
//           <h1>Contact Us</h1>
//           <p>Have a question or project in mind? We'd love to hear from you.</p>
//         </div>
//       </section>

//       <section className="section">
//         <div className="container grid grid-2" style={{ alignItems: "start" }}>
//           {/* Contact info */}
//           <div>
//             <div className="info-item">
//               <div className="card-icon" style={{ marginBottom: 0 }}>📍</div>
//               <div>
//                 <h4>Our Office</h4>
//                 <p>123 Business Street, New York, NY 10001</p>
//               </div>
//             </div>
//             <div className="info-item">
//               <div className="card-icon" style={{ marginBottom: 0 }}>📧</div>
//               <div>
//                 <h4>Email</h4>
//                 <p>info@brandname.com</p>
//               </div>
//             </div>
//             <div className="info-item">
//               <div className="card-icon" style={{ marginBottom: 0 }}>📞</div>
//               <div>
//                 <h4>Phone</h4>
//                 <p>+1 (555) 123-4567</p>
//               </div>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="form-card" id="request-form">
//             {success && <p className="alert alert-success">{success}</p>}
//             {error && (
//               <p
//                 className="alert alert-error"
//                 style={{ color: "#b91c1c" }}
//               >
//                 {error}
//               </p>
//             )}

//             <form className="form" onSubmit={handleSubmit}>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="name">Full Name</label>
//                   <input id="name" name="name" value={form.name} onChange={handleChange} required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="email">Email</label>
//                   <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="subject">Subject</label>
//                 <input id="subject" name="subject" value={form.subject} onChange={handleChange} required />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="message">Message</label>
//                 <textarea id="message" name="message" value={form.message} onChange={handleChange} required />
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn-primary full-btn"
//                 disabled={sending}
//                 style={sending ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
//               >
//                 {sending ? "Sending..." : "Send Message"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSuccess("");
    setError("");
    setSending(true);

    const payload = {
      full_name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    const { error: insertErr } = await supabase.from("client").insert(payload);

    setSending(false);

    if (insertErr) {
      setError("Message could not be sent. Please try again in a little while.");
      return;
    }

    setSuccess("Thank you! Your message has been sent.");
    setForm(EMPTY_FORM);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have a question or project in mind? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          {/* Contact info */}
          <div>
            <div className="info-item">
              <div className="card-icon" style={{ marginBottom: 0 }}>📍</div>
              <div>
                <h4>Our Office</h4>
                <p>123 Business Street, New York, NY 10001</p>
              </div>
            </div>
            <div className="info-item">
              <div className="card-icon" style={{ marginBottom: 0 }}>📧</div>
              <div>
                <h4>Email</h4>
                <p>info@brandname.com</p>
              </div>
            </div>
            <div className="info-item">
              <div className="card-icon" style={{ marginBottom: 0 }}>📞</div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="form-card" id="request-form">
            {success && <p className="alert alert-success">{success}</p>}
            {error && (
              <p
                className="alert alert-error"
                style={{ color: "#b91c1c" }}
              >
                {error}
              </p>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" value={form.message} onChange={handleChange} required />
              </div>

              <button
                type="submit"
                className="btn btn-primary full-btn"
                disabled={sending}
                style={sending ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}