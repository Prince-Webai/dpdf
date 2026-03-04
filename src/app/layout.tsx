import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { ProfileProvider } from "@/context/profile-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuNexu | AI PDF API",
  description: "Advanced PDF manipulation and AI extraction API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased`}>
        <ProfileProvider>
          <Navbar />
          {children}
          <Footer />
        </ProfileProvider>
=======
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-black text-white antialiased flex flex-col selection:bg-indigo-500/30`}
      >
        {children}
        <Toaster />
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI)
      </body>
    </html>
  );
}
