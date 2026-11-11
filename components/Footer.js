import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <h3 className={styles.brand}>BrandName</h3>
          <p>Delivering professional solutions that help your business grow.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4>Account</h4>
          <ul>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Email: info@brandname.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>

      <div className={styles.bottom}>
        © {new Date().getFullYear()} BrandName. All rights reserved.
      </div>
    </footer>
  );
}