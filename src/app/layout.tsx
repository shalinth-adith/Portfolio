import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Shalinth — iOS Developer",
  description: "iOS developer crafting SwiftUI apps with obsessive attention to animation and feel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full" style={{ background: "var(--bg)", color: "var(--ink)" }}>
        {children}
      </body>
    </html>
  );
}
