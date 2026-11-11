import Link from "next/link";
import CreativeStep from "@/components/CreativeStep";
import WhyChooseUs from "@/components/WhyChooseUs";
import LearnTeach from "@/components/LearnTeach";
import StudentProjects from "@/components/StudentProjects";


export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <span className="badge">Trusted by 500+ clients worldwide</span>
          <h1>Professional Solutions for Your Business Growth</h1>
          <p>
            We combine strategy, design, and technology to help your business
            stand out and succeed.
          </p>
          <div className="hero-buttons">
            <Link href="/contact" className="btn btn-primary">Get Started</Link>
            <Link href="/services" className="btn btn-outline">Our Services</Link>
          </div>
        </div>
      </section>

      {/* Creative Step */}
      <CreativeStep />

      {/* Why Choose Us (cards + stats + trust strips) */}
      <WhyChooseUs />
      <LearnTeach />
      <StudentProjects />

      
    </>
  );
}