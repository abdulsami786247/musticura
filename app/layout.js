// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export const metadata = {
//   title: "BrandName | Professional Solutions",
//   description: "We deliver professional services that help your business grow.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <Navbar />
//         <main className="main">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: "Musticura",
  description: "IT services and learning platform for students and teachers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}