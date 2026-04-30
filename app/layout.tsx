import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "non normale",
  description: "普通じゃない、小さなハッピーミッション",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "non normale",
    description: "普通じゃない、小さなハッピーミッション",
    url: "https://nnm-lovat.vercel.app",
    siteName: "non normale",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "non normale",
    description: "普通じゃない、小さなハッピーミッション",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "nnm",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <ServiceWorkerRegistrar />
          {children}
        </body>
    </html>
  );
}
