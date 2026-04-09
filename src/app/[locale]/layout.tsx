import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatBot } from "@/components/ui/chatbot";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { PostHogProvider, PostHogPageView } from "@/components/providers/posthog-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { Suspense } from "react";

const geistSans = localFont({
  src: "../../../public/fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../../public/fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const themeScript = `
  (function() {
    const stored = localStorage.getItem('theme');
    const theme = stored || 'system';
    const resolved = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;
    document.documentElement.classList.add(resolved);
  })();
`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://sambajarju.com/#website",
                  "url": "https://sambajarju.com",
                  "name": "Samba Jarju",
                  "description": "Data marketeer en marketing automation specialist uit Rotterdam",
                  "inLanguage": ["nl", "en"],
                },
                {
                  "@type": "Person",
                  "@id": "https://sambajarju.com/#person",
                  "name": "Samba Jarju",
                  "url": "https://sambajarju.com",
                  "jobTitle": "Data Marketeer & Marketing Automation Specialist",
                  "worksFor": {
                    "@type": "Organization",
                    "name": "Vandebron",
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Rotterdam",
                    "addressCountry": "NL",
                  },
                  "email": "samba@sambajarju.nl",
                  "telephone": "+31687975656",
                  "sameAs": [
                    "https://www.linkedin.com/in/sambajarju/",
                  ],
                  "knowsAbout": [
                    "Email Marketing",
                    "Marketing Automation",
                    "Salesforce Marketing Cloud",
                    "SQL",
                    "AMPScript",
                    "Deployteq",
                    "CRM",
                    "SEO",
                    "Data Analytics",
                  ],
                },
                {
                  "@type": "ProfilePage",
                  "@id": "https://sambajarju.com/#profilepage",
                  "url": "https://sambajarju.com",
                  "name": "Samba Jarju Portfolio",
                  "mainEntity": { "@id": "https://sambajarju.com/#person" },
                  "isPartOf": { "@id": "https://sambajarju.com/#website" },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <JsonLd />
        <PostHogProvider>
          <Suspense fallback={null}><PostHogPageView /></Suspense>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ScrollProgress />
              <Header />
              <main>{children}</main>
              <Footer />
              <ChatBot />
            </NextIntlClientProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
