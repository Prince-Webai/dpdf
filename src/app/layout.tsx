import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { ProfileProvider } from "@/context/profile-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuNexu | Enterprise AI PDF Infrastructure",
  description: "The world's most sophisticated PDF API framework. Instantly merge, split, generate, and intelligently extract data from any PDF with AI-powered agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-black text-white antialiased flex flex-col selection:bg-indigo-500/30`}
      >
        <ProfileProvider>
          {children}
          <Toaster />
        </ProfileProvider>
      </body>
    </html>
  );
}
