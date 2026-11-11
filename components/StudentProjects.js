import Link from "next/link";
import styles from "./StudentProjects.module.css";

const journey = [
  {
    title: "Learn the Skill",
    text: "Start with guided lessons from experts who work in the industry.",
  },
  {
    title: "Work on Real Projects",
    text: "Apply what you learn on live projects from our real clients.",
  },
  {
    title: "Handle Real Clients",
    text: "Understand requirements, communicate and deliver work on time.",
  },
  {
    title: "Earn & Get Certified",
    text: "Earn while you learn and receive a certificate of real experience.",
  },
];

const projects = [
  {
    icon: "🌐",
    title: "Business Landing Page",
    client: "Local Service Company",
    level: "Beginner",
    duration: "2 weeks",
    tech: ["HTML", "CSS", "Next.js"],
  },
  {
    icon: "🛍️",
    title: "Online Store Setup",
    client: "Fashion Brand",
    level: "Intermediate",
    duration: "3 weeks",
    tech: ["Shopify", "SEO"],
  },
  {
    icon: "📣",
    title: "Social Media Campaign",
    client: "Restaurant Chain",
    level: "Intermediate",
    duration: "4 weeks",
    tech: ["Meta Ads", "Graphics"],
  },
  {
    icon: "📊",
    title: "Admin Dashboard",
    client: "Software Startup",
    level: "Advanced",
    duration: "6 weeks",
    tech: ["React", "Node.js"],
  },
];

const stats = [
  { value: "50+", label: "Live Client Projects" },
  { value: "200+", label: "Students Learning" },
  { value: "120+", label: "Clients Served" },
  { value: "Free", label: "To Get Started" },
];

export default function StudentProjects() {
  return (
    <section className={styles.section}>
      <div className={`${styles.blob} ${styles.blobTop}`} />
      <div className={`${styles.blob} ${styles.blobBottom}`} />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>For Students</span>
          <h2 className={styles.title}>Learn by Building Real Projects</h2>
          <p className={styles.subtitle}>
            At our platform, you do not just watch lessons. You work on real
            projects, handle real clients and get paid for your skills.
          </p>
        </div>

        {/* Journey timeline */}
        <div className={styles.journey}>
          {journey.map((step, index) => (
            <div className={styles.step} key={step.title}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        {/* Live projects */}
        <div className={styles.projectsHead}>
          <h3>Live Projects You Can Join</h3>
          <p>Pick a project that matches your skill level and start working today.</p>
        </div>

        <div className={styles.grid}>
          {projects.map((p) => (
            <div className={styles.card} key={p.title}>
              <div className={styles.cardTop}>
                <div className={styles.icon}>{p.icon}</div>
                <span className={styles.level}>{p.level}</span>
              </div>

              <h4>{p.title}</h4>
              <p className={styles.client}>Client: {p.client}</p>

              <div className={styles.meta}>
                <span>⏱ {p.duration}</span>
              </div>

              <div className={styles.techs}>
                {p.tech.map((t) => (
                  <span className={styles.tech} key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className={styles.stats}>
          {stats.map((s) => (
            <div className={styles.statItem} key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h3>Start learning without paying a single rupee</h3>
            <p>Create your free student account and join your first live project this week.</p>
          </div>
          <Link href="/register?role=learn" className={styles.ctaBtn}>
            Learn for Free
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}