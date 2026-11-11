// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import styles from "./Navbar.module.css";

// const navLinks = [
//   { href: "/", label: "Home" },
//   { href: "/services", label: "Services" },
//   { href: "/about", label: "About Us" },
//   { href: "/contact", label: "Contact Us" },
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <header className={styles.header}>
//       <nav className={styles.nav}>
//         {/* Logo */}
//         <Link href="/" className={styles.logo} onClick={closeMenu}>
//           <span className={styles.logoIcon}>B</span>
//           <span className={styles.logoText}>
//             Brand<span>Name</span>
//           </span>
//         </Link>

//         {/* Links + action buttons (dropdown on mobile) */}
//         <div className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
//           <ul className={styles.links}>
//             {navLinks.map((link) => (
//               <li key={link.href}>
//                 <Link
//                   href={link.href}
//                   onClick={closeMenu}
//                   className={`${styles.link} ${
//                     pathname === link.href ? styles.active : ""
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//           <div className={styles.actions}>
//             <Link
//               href="/contact#request-form"
//               className="btn btn-outline"
//               onClick={closeMenu}
//             >
//               Request Service
//             </Link>
//             <Link
//               href="/register"
//               className="btn btn-primary"
//               onClick={closeMenu}
//             >
//               Learn & Teach
//             </Link>
//           </div>
//         </div>

//         {/* Hamburger button (mobile only) */}
//         <button
//           className={styles.menuBtn}
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle navigation menu"
//         >
//           {menuOpen ? "✕" : "☰"}
//         </button>
//       </nav>
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
  <Image
    src="/logo.png"
    alt="Musticura"
    width={180}
    height={48}
    priority
  />
</Link>

        {/* Links + action buttons (dropdown on mobile) */}
        <div className={`${styles.menu} ${menuOpen ? styles.open : ""}`}>
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={`${styles.link} ${
                    pathname === link.href ? styles.active : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link
              href="/contact#request-form"
              className="btn btn-outline"
              onClick={closeMenu}
            >
              Request Service
            </Link>
            <Link
              href="/register"
              className="btn btn-primary"
              onClick={closeMenu}
            >
              Learn & Teach
            </Link>
          </div>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>
    </header>
  );
}