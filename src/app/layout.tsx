import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LocaleProvider } from "@/lib/locale-context";
import { ThemeProvider } from "./ThemeProvider";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tournament Planner — Live-Ergebnisse & Spielpläne",
  description:
    "Allgemeine Turnierplattform für Fußballturniere. Spielplan, Gruppenstände und Live-Ergebnisse in Echtzeit.",
};

/**
 * Next.js 16: cookies() via i18n ist runtime data → muss blockieren
 * statt zu prerendern. Mit `instant: false` wird die Seite
 * synchron geladen (kein Slow-Loading nach Prerender).
 */
export const instant = false;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-alabaster text-slate-ink dark:bg-dark-bg dark:text-dark-text`}
      >
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider>
            <ThemeProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ThemeProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
