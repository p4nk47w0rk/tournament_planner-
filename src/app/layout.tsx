import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { LocaleProvider, type Locale } from "@/lib/locale-context";
import { EditModeProvider } from "@/lib/edit-mode-context";
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-alabaster text-slate-ink dark:bg-dark-bg dark:text-dark-text`}
      >
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <EditModeProvider>
              <ThemeProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </ThemeProvider>
            </EditModeProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
