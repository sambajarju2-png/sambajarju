import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Samba Jarju | Data Marketeer & Marketing Automation",
    template: "%s | Samba Jarju",
  },
  description: "Data marketeer en marketing automation specialist uit Rotterdam. Email marketing, CRM, SQL, Salesforce Marketing Cloud en Deployteq.",
  metadataBase: new URL("https://sambajarju.com"),
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Samba Jarju | Data Marketeer & Marketing Automation",
    description: "Data marketeer en marketing automation specialist uit Rotterdam.",
    type: "website",
    locale: "nl_NL",
    alternateLocale: "en_US",
    siteName: "Samba Jarju",
    url: "https://sambajarju.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samba Jarju | Data Marketeer",
    description: "Data marketeer en marketing automation specialist uit Rotterdam.",
  },
  alternates: {
    canonical: "https://sambajarju.com",
    languages: {
      "nl": "https://sambajarju.com",
      "en": "https://sambajarju.com",
      "x-default": "https://sambajarju.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
  category: 'marketing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
