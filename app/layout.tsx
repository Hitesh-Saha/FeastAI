import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-poppins', // Optional, for CSS variables
});

export const metadata: Metadata = {
  title: 'AI Recipe Generator',
  description: 'Generate recipes from your ingredients using AI',
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={poppins.variable}
      >
        <main className="p-2">
          {children}
        </main>
        <Toaster richColors />
      </body>
    </html>
  );
}
