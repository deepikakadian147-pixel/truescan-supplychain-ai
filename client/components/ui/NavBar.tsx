"use client";

// ─────────────────────────────────────────────────────────────────────────────
// NavBar — site-wide navigation
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/scan", label: "SCAN" },
  { href: "/dashboard", label: "DASHBOARD" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Wordmark */}
        <Link href="/" className={styles.wordmark}>
          <span className={styles.wordmarkPrimary}>TRUE</span>
          <span className={styles.wordmarkAccent}>SCAN</span>
          <span className={styles.wordmarkTag}>v2.4</span>
        </Link>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Status indicator */}
        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
}
