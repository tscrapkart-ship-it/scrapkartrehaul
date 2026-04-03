import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScrapKart — B2B Industrial Scrap Marketplace",
  description:
    "Connect waste producers with recyclers. Buy and sell industrial scrap materials efficiently.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ScrapKart",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#10B981" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${jakarta.variable} antialiased overflow-x-hidden`}>
        <NextTopLoader color="#10B981" height={3} showSpinner={false} shadow="0 0 10px rgba(16,185,129,0.4)" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
