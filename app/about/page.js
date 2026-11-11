import Link from "next/link";
import styles from "./about.module.css";

const VALUES = [
  {
    title: "Quality first",
    text: "Every website, design, video and course is built with care and reviewed before delivery.",
  },
  {
    title: "Clear communication",
    text: "You always know the progress, the timeline and the next step, with no hidden surprises.",
  },
  {
    title: "Fair and transparent",
    text: "Honest pricing and clear scope, so you pay for what you need and nothing more.",
  },
  {
    title: "Long-term growth",
    text: "We look beyond one project. Our goal is to help businesses and learners keep growing.",
  },
];

const WHAT_WE_DO = [
  {
    audience: "For businesses",
    title: "Digital services that grow your brand",
    text: "Web development, Shopify stores, graphic designing, video editing, digital marketing and SEO. We handle the creative and technical work so you can focus on your customers.",
    href: "/services",
    cta: "View business services",
  },
  {
    audience: "For students & teachers",
    title: "A learning platform that connects both",
    text: "Students learn skills through classes, materials and assignments. Teachers share their knowledge, manage courses and review student work, all in one place.",
    href: "/register",
    cta: "Join the platform",
  },
];

const POINTS = [
  "Transparent pricing with no hidden costs",
  "A dedicated team for every project",
  "Support available whenever you need it",
  "Long-term partnership, not one-time work",
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.kicker}>About Musticura</span>
          <h1 className={styles.heroTitle}>
            We help businesses grow and people learn the skills that matter.
          </h1>
          <p className={styles.heroText}>
            Musticura is a digital partner for businesses that need websites,
            creative work and marketing, and a learning platform where students
            and teachers connect through real courses.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div>
              <span className={styles.sectionKicker}>Who we are</span>
              <h2 className={styles.sectionTitle}>A team that cares about results</h2>
              <p className={styles.bodyText}>
                We started with a simple idea: good digital work should be
                accessible to every business, and good teaching should be
                accessible to every learner. Musticura brings both together.
              </p>
              <p className={styles.bodyText}>
                For businesses, we deliver websites, online stores, design,
                video, marketing and SEO that look professional and perform well.
                For students and teachers, we provide a structured platform for
                classes, course materials and assignments.
              </p>
            </div>

            <div className={styles.pointsCard}>
              <h3 className={styles.pointsTitle}>Why choose Musticura</h3>
              <ul className={styles.points}>
                {POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            <article className={styles.mvCard}>
              <span className={styles.mvLabel}>Our mission</span>
              <h3 className={styles.mvTitle}>Make quality digital work and learning easy to access</h3>
              <p className={styles.mvText}>
                We deliver reliable services for businesses and a clear, practical
                learning experience for students and teachers, at every stage.
              </p>
            </article>

            <article className={styles.mvCard}>
              <span className={styles.mvLabel}>Our vision</span>
              <h3 className={styles.mvTitle}>Be the partner people trust to grow</h3>
              <p className={styles.mvText}>
                We want Musticura to be the first place a business calls for digital
                growth, and the first platform a learner opens to build real skills.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>What we do</span>
            <h2 className={styles.sectionTitle}>Two sides, one platform</h2>
            <p className={styles.sectionText}>
              Whether you run a business or want to learn, Musticura has a path for you.
            </p>
          </div>

          <div className={styles.audienceGrid}>
            {WHAT_WE_DO.map((item) => (
              <article key={item.title} className={styles.audienceCard}>
                <span className={styles.audienceTag}>{item.audience}</span>
                <h3 className={styles.audienceTitle}>{item.title}</h3>
                <p className={styles.audienceText}>{item.text}</p>
                <Link href={item.href} className={styles.audienceCta}>
                  {item.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionKicker}>Our values</span>
            <h2 className={styles.sectionTitle}>What guides our work</h2>
            <p className={styles.sectionText}>
              These principles shape every project and every course we support.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {VALUES.map((value, index) => (
              <div key={value.title} className={styles.valueCard}>
                <span className={styles.valueNum}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueText}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.ctaBand}>
            <h2 className={styles.ctaTitle}>Let's build something together</h2>
            <p className={styles.ctaText}>
              Tell us about your business, or join as a student or teacher today.
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