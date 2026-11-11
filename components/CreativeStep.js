"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./CreativeStep.module.css";

// x, y = position in the stage (%), depth = how strongly it follows the cursor
const services = [
  { label: "SEO", x: "8%", y: "10%", depth: 25, delay: "0s" },
  { label: "Meta Ads", x: "52%", y: "6%", depth: 45, delay: "1s" },
  { label: "Social Media Marketing", x: "6%", y: "40%", depth: 30, delay: "2s" },
  { label: "Web Development", x: "44%", y: "42%", depth: 20, delay: "0.5s" },
  { label: "Graphic Designing", x: "4%", y: "72%", depth: 38, delay: "1.5s" },
  { label: "Shopify", x: "60%", y: "70%", depth: 50, delay: "2.5s" },
  { label: "Video Editing", x: "34%", y: "88%", depth: 28, delay: "3s" },
  { label: "Business Software", x: "62%", y: "22%", depth: 15, delay: "0.8s" },
];

export default function CreativeStep() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  // Har 1 second baad next chip blue ho jati hai
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const resetPos = () => setPos({ x: 0, y: 0 });

  return (
    <section className={styles.section}>
      <div className={styles.glow} />

      <div className="container">
        <div className={styles.grid}>
          {/* Left: floating services */}
          <div
            className={styles.stage}
            onMouseMove={handleMove}
            onMouseLeave={resetPos}
          >
            {services.map((s, i) => (
              <div
                key={s.label}
                className={styles.chipWrap}
                style={{
                  left: s.x,
                  top: s.y,
                  transform: `translate3d(${pos.x * s.depth * 2}px, ${pos.y * s.depth * 2}px, 0)`,
                }}
              >
                <div className={styles.float} style={{ animationDelay: s.delay }}>
                  <span
                    className={`${styles.chip} ${
                      i === activeIndex ? styles.active : ""
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: text */}
          <div className={styles.content}>
            <span className={styles.label}>Creative Step</span>
            <h2 className={styles.heading}>
              Have a question about growing your brand?
            </h2>
            <p className={styles.text}>
              Tell us your goal and we will suggest the best route, with
              services that fit your budget.
            </p>
            <Link href="/contact#request-form" className={styles.consult}>
              Make Free Consultation
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}