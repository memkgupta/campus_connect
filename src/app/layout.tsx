
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/react"
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode } from 'react'
//@ts-ignore
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Connect",
  description: "CampusConnect - A collaborative platform for students to share events, projects, and resources. Foster connections, promote open-source contributions, and enhance skills in Node.js and Next.js. Join now to be a part of the revolution!",
  openGraph: {
    title: "CampusConnect - Collaborate, Learn, Contribute",
    description:
      "Join CampusConnect to connect with peers, share projects, and grow your skills. Designed for students to foster collaboration and open-source contributions.",
    url: "https://campusconnected.vercel.app",
    siteName: "CampusConnect",
    images: [
      {
        url: "https://campusconnected.vercel.app/logo.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "CampusConnect - Share, Learn, Grow",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusConnect - Collaborate, Learn, Contribute",
    description:
      "CampusConnect is a platform for students to share events, projects, and resources while enhancing skills in Node.js and Next.js.",
    images: ["https://campusconnected.vercel.app/logo.png"], // Replace with your image URL
  },
};









export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <Analytics/>
      <AuthProvider>
      <body className={inter.className}>
        
        <Navbar/>
       
        <main>
       
    <NuqsAdapter>{children}</NuqsAdapter>
       
        </main>
       
        <Toaster />
        </body>
      </AuthProvider>
    </html>

  );
}
