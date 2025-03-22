import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserDropdown from "../components/UserDropdown"; // ✅ Keep logic in UserDropdown
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "In Death Tournament",
  description: "Compete in tournaments and submit scores!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {/* ✅ Navbar */}
          <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
            <Link href="/" className="text-2xl font-bold">
              In Death Tournament
            </Link>

            {/* ✅ User Dropdown */}
            <UserDropdown />
          </nav>

          {/* ✅ Page Content */}
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
