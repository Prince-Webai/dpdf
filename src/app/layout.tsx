import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased`}>
        <ProfileProvider>
          <Navbar />
          {children}
          <Footer />
        </ProfileProvider>
      </body>
    </html>
  );
}
