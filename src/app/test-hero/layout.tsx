import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({ src: "../../../public/fonts/GeistVF.woff2", variable: "--font-geist-sans" });
const geistMono = localFont({ src: "../../../public/fonts/GeistMonoVF.woff2", variable: "--font-geist-mono" });

export const metadata = { title: "Hero Test — Samba Jarju", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#FAFBFC] text-[#023047] font-[family-name:var(--font-geist-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}
