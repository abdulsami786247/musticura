import Link from "next/link";
import styles from "./LearnTeach.module.css";

const topics = [
  "Web Development",
  "UI/UX Design",
  "Mobile Apps",
  "Shopify",
  "SEO",
  "Digital Marketing",
  "Graphic Designing",
  "Video Editing",
  "Cloud Solutions",
  "Business Software",
];

const teacherPoints = [
  "Share your IT skills with motivated students",
  "Set your own schedule and hourly rate",
  "Build your personal brand and reputation",
  "Get paid securely for every session",
];

const studentPoints = [
  "Learn in-demand skills from verified experts",
  "Choose beginner, intermediate or advanced courses",
  "Flexible online sessions at your own pace",
  "Get certificates and career guidance",
];

const steps = [
  {
    title: "Create Account",
    text: "Register in less than a minute and choose your role.",
  },
  {
    title: "Build Your Profile",
    text: "Add your skills, experience or learning goals.",
  },
  {
    title: "Start Teaching or Learning",
    text: "Connect with the right people and grow together.",
  },
];

export default function LearnTeach() {
  // Topics ko do baar dikhaya hai taake marquee loop seamless ho
  const loopTopics = [...topics, ...topics];

  return (
    <section className={styles.section}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Learn & Teach</span>
          <h2 className={styles.title}>Teach what you know. Learn what you need.</h2>
          <p className={styles.subtitle}>
            Our platform connects IT experts who want to teach with students
            who want to master in-demand digital skills.
          </p>
        </div>
      </div>

      {/* Scrolling topics strip */}
      <div className={styles.marquee}>
        <div className={styles.track}>
          {loopTopics.map((topic, i) => (
            <span className={styles.topic} key={`${topic}-${i}`}>
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Teacher & Student cards */}
        <div className={styles.grid}>
          <div className={`${styles.card} ${styles.teacher}`}>
            <div className={styles.cardIcon}>👨‍🏫</div>
            <h3>For Teachers</h3>
            <p className={styles.cardText}>
              Are you an IT professional? Turn your experience into income by
              teaching students around the world.
            </p>
            <ul className={styles.points}>
              {teacherPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link href="/register?role=teach" className={styles.cardBtn}>
              Register as Teacher
              <span>→</span>
            </Link>
          </div>

          <div className={`${styles.card} ${styles.student}`}>
            <div className={styles.cardIcon}>🎓</div>
            <h3>For Students</h3>
            <p className={styles.cardText}>
              Want to start a career in IT? Learn practical skills from experts
              who work in the industry every day.
            </p>
            <ul className={styles.points}>
              {studentPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link href="/register?role=learn" className={styles.cardBtn}>
              Register as Student
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div className={styles.step} key={step.title}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}