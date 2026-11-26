import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { LocaleProvider, type Locale } from "@/lib/locale-context";
import { ThemeProvider } from "./ThemeProvider";
import { TournamentProvider } from "@/lib/tournament-context";
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
  icons: {
    icon: [
      {
        url: "/01_tournament-planner-icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/02_tournament-planner-app-icon.png",
    other: [
      {
        rel: "apple-touch-icon",
        url: "/02_tournament-planner-app-icon.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

/**
 * Next.js 16: cookies() via i18n ist runtime data → muss blockieren
 * zu prerendern. Mit `instant: false` wird die Seite
 * synchron geladen (kein Slow-Loading nach Prerender).
 */
export const instant = false;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-alabaster text-slate-ink`}
      >
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <ThemeProvider>
              <TournamentProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </TournamentProvider>
            </ThemeProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
