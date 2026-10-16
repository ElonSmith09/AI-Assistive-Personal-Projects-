import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  await headers();
  const title = "GRE Test Prep — Adaptive Quant & Verbal Training";
  const description =
    "Private adaptive GRE preparation with separate Quant and Verbal training, concept lessons, rotating questions, and time-to-mastery tracking.";

  return {
    title,
    description,
    applicationName: "GRE Test Prep",
    manifest: "/manifest.webmanifest",
    themeColor: "#13294b",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "GRE Test Prep",
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/icon-192.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
