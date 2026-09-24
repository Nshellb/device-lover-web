import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollAwareHeader } from "@/components/layout/scroll-aware-header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitializationScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("device-lover-theme");
      const useDarkTheme = savedTheme
        ? savedTheme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", useDarkTheme);
    } catch {}
  })();
`;

export const metadata: Metadata = {
  title: {
    default: "Device Lover",
    template: "%s | Device Lover",
  },
  description: "스마트폰과 카메라 등 전자기기의 사양을 한눈에 비교하세요.",
  icons: {
    icon: "/device-lover-logo.svg",
    shortcut: "/device-lover-logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ScrollAwareHeader>
          <SiteHeader />
        </ScrollAwareHeader>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
