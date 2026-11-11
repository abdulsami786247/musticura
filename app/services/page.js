// const services = [
//   { icon: "🌐", title: "Web Development", text: "Modern, fast, and responsive websites built with the latest technologies." },
//   { icon: "🎨", title: "UI/UX Design", text: "Beautiful interfaces that users love and that convert visitors into customers." },
//   { icon: "📱", title: "Mobile Apps", text: "Native and cross-platform mobile applications for iOS and Android." },
//   { icon: "📈", title: "Digital Marketing", text: "Data-driven campaigns that increase your reach and grow your revenue." },
//   { icon: "☁️", title: "Cloud Solutions", text: "Scalable and secure cloud infrastructure for your business needs." },
//   { icon: "🛠️", title: "Maintenance & Support", text: "Ongoing support to keep your systems running smoothly 24/7." },
// ];

// export default function ServicesPage() {
//   return (
//     <>
//       <section className="page-hero">
//         <div className="container">
//           <h1>Our Services</h1>
//           <p>Comprehensive solutions designed to meet the needs of modern businesses.</p>
//         </div>
//       </section>

//       <section className="section">
//         <div className="container">
//           <div className="grid grid-3">
//             {services.map((s) => (
//               <div className="card" key={s.title}>
//                 <div className="card-icon">{s.icon}</div>
//                 <h3>{s.title}</h3>
//                 <p>{s.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./services.module.css";

const FILTERS = [
  { key: "all", label: "All services" },
  { key: "business", label: "For businesses" },
  { key: "learning", label: "For students & teachers" },
];

const SERVICES = [
  {
    audience: "business",
    title: "Web Development",
    desc: "Fast, responsive websites and web apps that turn visitors into customers.",
    points: [
      "Business and landing pages",
      "E-commerce websites",
      "Mobile-friendly, SEO-ready code",
    ],
    cta: "Request service",
    href: "/contact#request-form",
  },
  {
    audience: "business",
    title: "Shopify Store Setup",
    desc: "A complete online store, ready to sell, with the right theme and payment setup.",
    points: [
      "Theme setup and customization",
      "Product listing and collections",
      "Payment and shipping configuration",
    ],
    cta: "Request service",
    href: "/contact#request-form",
  },
  {
    audience: "business",
    title: "Graphic Designing",
    desc: "Brand identity and visuals that make your business look professional everywhere.",
    points: [
      "Logo and brand identity",
      "Social media posts and banners",
      "Print material and brochures",
    ],
    cta: "Request service",
    href: "/contact#request-form",
  },
  {
    audience: "business",
    title: "Video Editing",
    desc: "Engaging videos for reels, ads, YouTube and your product stories.",
    points: [
      "Short-form reels and ads",
      "YouTube and long-form editing",
      "Captions, motion graphics and color grading",
    ],
    cta: "Request service",
    href: "/contact#request-form",
  },
  {
    audience: "business",
    title: "Digital Marketing",
    desc: "Campaigns that bring the right audience to your brand and keep them coming back.",
    points: [
      "Social media management",
      "Paid ads (Meta, Google)",
      "Content strategy and reporting",
    ],
    cta: "Request service",
    href: "/contact#request-form",
  },
  {
    audience: "business",
    title: "SEO",
    desc: "Get found on Google with a plan that improves your rankings step by step.",
    points: [
      "Keyword research",
      "On-page and technical SEO",
      "Google Business Profile setup",
    ],
    cta: "Request service",
    href: "/contact#request-form",
  },
  {
    audience: "learning",
    title: "Expert Teachers",
    desc: "Teachers share their skills through structured courses, classes and assignments.",
    points: [
      "Course-wise teacher profiles",
      "Teacher dashboard for courses",
      "Student activity overview",
    ],
    cta: "Start teaching",
    href: "/register?role=teach",
  },
  {
    audience: "learning",
    title: "Live Classes & Materials",
    desc: "Students join classes with meeting links and get class PDFs in one place.",
    points: [
      "Scheduled classes with join links",
      "Class PDFs and course pictures",
      "Clear course timeline",
    ],
    cta: "Start learning",
    href: "/register?role=learn",
  },
  {
    audience: "learning",
    title: "Assignments & Feedback",
    desc: "Students submit work online and teachers review every submission in one view.",
    points: [
      "PDF assignment uploads",
      "Due dates and descriptions",
      "Teacher review of student submissions",
    ],
    cta: "Start learning",
    href: "/register?role=learn",
  },
  {
    audience: "learning",
    title: "Flexible Course Paths",
    desc: "Choose one or more skills and grow step by step at your own pace.",
    points: [
      "Six in-demand skills",
      "Multiple courses per student",
      "Matched with a teacher for each course",
    ],
    cta: "Explore courses",
    href: "/register?role=learn",
  },
];

const BUSINESS_STEPS = [
  {
    title: "Understand your goals",
    text: "We learn about your business, audience and what success looks like.",
  },
  {
    title: "Plan & design",
    text: "You get a clear plan, timeline and design direction before we build.",
  },
  {
    title: "Build & review",
    text: "We create the work and share it with you for feedback at each stage.",
  },
  {
    title: "Launch & support",
    text: "We deliver, launch and stay available to help your business keep growing.",
  },
];

const STUDENT_STEPS = [
  "Register as a student and verify your email",
  "Pick the courses you want to learn",
  "Join classes and study the course material",
  "Submit assignments and track your progress",
];

const TEACHER_STEPS = [
  "Register as a teacher and verify your email",
  "Add the courses you teach",
  "Schedule classes and share materials",
  "Review student submissions in one place",
];

const COURSES = [
  "Digital Marketing",
  "Shopify",
  "Graphic Designing",
  "Video Editing",
  "SEO",
  "Web Development",
];

export default function ServicesPage() {
  const [filter, setFilter] = useState("all");

  const visibleServices =
    filter === "all"
      ? SERVICES
      : SERVICES.filter((service) => service.audience === filter);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.kicker}>Our services</span>
          <h1 className={styles.heroTitle}>
            Everything your business needs to grow, and everything you need to learn.
          </h1>
          <p className={styles.heroText}>
            From websites and marketing for businesses, to live classes and
            assignments for students and teachers. One partner, one platform,
            real results.
          </p>

          <div className={styles.heroActions}>
            <Link href="/contact#request-form" className="btn btn-primary">
              Request a service
            </Link>
            <Link href="/register" className="btn btn-outline">
              Learn & Teach
            </Link>
          </div>

          <div className={styles.heroChips}>
            {["Web", "Graphics", "Video", "Marketing", "SEO", "Learning"].map(
              (item) => (
                <span key={item} className={styles.chip}>
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>What we offer</span>
            <h2 className={styles.sectionTitle}>Pick what fits your goal</h2>
            <p className={styles.sectionText}>
              Businesses get creative and marketing services. Students and
              teachers get a complete learning platform.
            </p>
          </div>

          <div className={styles.filters} role="group" aria-label="Filter services">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={filter === item.key}
                onClick={() => setFilter(item.key)}
                className={`${styles.filterBtn} ${
                  filter === item.key ? styles.filterBtnActive : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {visibleServices.map((service, index) => (
              <article key={service.title} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.num}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`${styles.tag} ${
                      service.audience === "business"
                        ? styles.tagBusiness
                        : styles.tagLearning
                    }`}
                  >
                    {service.audience === "business" ? "Business" : "Learning"}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.desc}</p>

                <ul className={styles.points}>
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <Link href={service.href} className={styles.cardCta}>
                  {service.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Business process */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>How we work</span>
            <h2 className={styles.sectionTitle}>A clear process for every project</h2>
            <p className={styles.sectionText}>
              No surprises. You always know what is happening and what comes next.
            </p>
          </div>

          <div className={styles.steps}>
            {BUSINESS_STEPS.map((step, index) => (
              <div key={step.title} className={styles.step}>
                <span className={styles.stepNum}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning platform */}
      <section className={styles.dark}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={`${styles.sectionKicker} ${styles.onDarkKicker}`}>
              Learning platform
            </span>
            <h2 className={`${styles.sectionTitle} ${styles.onDarkTitle}`}>
              Teach what you know. Learn what you need.
            </h2>
            <p className={`${styles.sectionText} ${styles.onDarkText}`}>
              A simple journey for both students and teachers, from sign-up to
              submission.
            </p>
          </div>

          <div className={styles.journeys}>
            <div className={styles.journeyCard}>
              <h3 className={styles.journeyTitle}>For students</h3>
              <ol className={styles.journeyList}>
                {STUDENT_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Link href="/register?role=learn" className="btn btn-primary">
                Start learning
              </Link>
            </div>

            <div className={styles.journeyCard}>
              <h3 className={styles.journeyTitle}>For teachers</h3>
              <ol className={styles.journeyList}>
                {TEACHER_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Link href="/register?role=teach" className="btn btn-primary">
                Start teaching
              </Link>
            </div>
          </div>

          <div className={styles.courseBlock}>
            <p className={styles.courseLabel}>Courses available</p>
            <div className={styles.courseChips}>
              {COURSES.map((course) => (
                <Link
                  key={course}
                  href="/register?role=learn"
                  className={styles.courseChip}
                >
                  {course}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.ctaBand}>
            <h2 className={styles.ctaTitle}>Ready to grow your business or your skills?</h2>
            <p className={styles.ctaText}>
              Tell us what you need, or join as a student or teacher today.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/contact#request-form" className="btn btn-outline">
                Request a service
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}