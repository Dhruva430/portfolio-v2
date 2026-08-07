import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dhruva Kushwaha | Full Stack Developer — Backend Focused",
  description:
    "Full stack developer who builds fast, reliable web apps with TypeScript, Golang, React, and Next.js. Backend-focused: Go and Node APIs, PostgreSQL and Redis, plus frontend and Shopify builds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]" suppressHydrationWarning>
        <link
          rel="preload"
          as="image"
          href="/frames/main/001.webp"
          fetchPriority="high"
        />
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
