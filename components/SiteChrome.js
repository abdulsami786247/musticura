"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Ye pages par navbar aur footer nahi dikhenge
const DASHBOARD_PATHS = ["/student", "/teacher"];

export default function SiteChrome({ children }) {
  const pathname = usePathname();

  const isDashboard = DASHBOARD_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}