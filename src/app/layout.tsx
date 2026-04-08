import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samba Jarju | Data Marketeer & Marketing Automation",
  description: "Data-driven marketeer die marketing automatiseert en impact maximaliseert. Email marketing, automation, en CRM specialist.",
  metadataBase: new URL("https://sambajarju.com"),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Samba Jarju | Data Marketeer & Marketing Automation",
    description: "Data-driven marketeer die marketing automatiseert en impact maximaliseert.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
