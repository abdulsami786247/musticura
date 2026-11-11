// "use client";

// import { useRef } from "react";
// import styles from "./WhyChooseUs.module.css";

// const features = [
//   {
//     icon: "🚀",
//     title: "Fast Delivery",
//     text: "We deliver high-quality results on time, every time, without compromising on quality.",
//     tag: "On-time",
//   },
//   {
//     icon: "💡",
//     title: "Creative Solutions",
//     text: "Innovative ideas tailored to your business goals, designed to stand out in the market.",
//     tag: "Innovative",
//   },
//   {
//     icon: "🛡️",
//     title: "Secure & Reliable",
//     text: "Your data and projects are protected at every step with industry-standard security.",
//     tag: "Protected",
//   },
// ];

// const trustPoints = [
//   { value: "Transparent", label: "Pricing" },
//   { value: "24/7", label: "Support" },
//   { value: "Dedicated", label: "Team" },
//   { value: "Long-term", label: "Partnership" },
// ];

// function FeatureCard({ feature, index }) {
//   const cardRef = useRef(null);

//   // Cursor ki position card ke andar track karta hai (spotlight effect)
//   const handleMove = (e) => {
//     const rect = cardRef.current.getBoundingClientRect();
//     cardRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
//     cardRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
//   };

//   return (
//     <div className={styles.card} ref={cardRef} onMouseMove={handleMove}>
//       <span className={styles.number}>0{index + 1}</span>
//       <div className={styles.icon}>{feature.icon}</div>
//       <h3>{feature.title}</h3>
//       <p>{feature.text}</p>
//       <span className={styles.tagline}>{feature.tag}</span>
//     </div>
//   );
// }

// export default function WhyChooseUs() {
//   return (
//     <section className={styles.section}>
//       <div className={`${styles.blob} ${styles.blobLeft}`} />
//       <div className={`${styles.blob} ${styles.blobRight}`} />

//       <div className="container">
//         {/* Header */}
//         <div className={styles.header}>
//           <span className={styles.eyebrow}>Why Choose Us</span>
//           <h2 className={styles.title}>Your Trust, Our Success</h2>
//           <p className={styles.subtitle}>
//             We focus on quality, transparency, and long-term partnerships that
//             help your business grow with confidence.
//           </p>
//         </div>

//         {/* Cards */}
//         <div className={styles.grid}>
//           {features.map((f, i) => (
//             <FeatureCard key={f.title} feature={f} index={i} />
//           ))}
//         </div>

//         {/* Trust strip */}
//         <div className={styles.trust}>
//           {trustPoints.map((item) => (
//             <div className={styles.trustItem} key={item.label}>
//               <strong>{item.value}</strong>
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useRef } from "react";
import styles from "./WhyChooseUs.module.css";

const features = [
  {
    icon: "🚀",
    title: "Fast Delivery",
    text: "We deliver high-quality results on time, every time, without compromising on quality.",
    tag: "On-time",
  },
  {
    icon: "💡",
    title: "Creative Solutions",
    text: "Innovative ideas tailored to your business goals, designed to stand out in the market.",
    tag: "Innovative",
  },
  {
    icon: "🛡️",
    title: "Secure & Reliable",
    text: "Your data and projects are protected at every step with industry-standard security.",
    tag: "Protected",
  },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "1200+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const trustPoints = [
  { value: "Transparent", label: "Pricing" },
  { value: "24/7", label: "Support" },
  { value: "Dedicated", label: "Team" },
  { value: "Long-term", label: "Partnership" },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);

  // Cursor ki position card ke andar track karta hai (spotlight effect)
  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div className={styles.card} ref={cardRef} onMouseMove={handleMove}>
      <span className={styles.number}>0{index + 1}</span>
      <div className={styles.icon}>{feature.icon}</div>
      <h3>{feature.title}</h3>
      <p>{feature.text}</p>
      <span className={styles.tagline}>{feature.tag}</span>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <div className={`${styles.blob} ${styles.blobLeft}`} />
      <div className={`${styles.blob} ${styles.blobRight}`} />

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Why Choose Us</span>
          <h2 className={styles.title}>Your Trust, Our Success</h2>
          <p className={styles.subtitle}>
            We focus on quality, transparency, and long-term partnerships that
            help your business grow with confidence.
          </p>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>

        {/* Stats + Trust strips */}
        <div className={styles.bannerGroup}>
          <div className={styles.trust}>
            {stats.map((item) => (
              <div className={styles.trustItem} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.trust}>
            {trustPoints.map((item) => (
              <div className={styles.trustItem} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}