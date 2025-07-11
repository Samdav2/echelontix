"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../component/Navbar";
import Fotter from "../component/Fotter";
import "./globals.css";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Hide layout on these paths
  const hideLayout =
    pathname.startsWith("/auth") ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/choose-role" ||
    pathname === "/registration" ||
    pathname === "/create-event" ||
    pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!hideLayout && <Navbar />}
        {children}
        {!hideLayout && <Fotter />}
      </body>
    </html>
  );
}
