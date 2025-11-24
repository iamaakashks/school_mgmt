import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "School Management System - Digital Campus Portal",
  description: "Comprehensive school management system for students, teachers, and administrators",
  keywords: "school management, education, student portal, teacher portal, admin portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="school-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
