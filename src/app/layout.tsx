import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Tonrong Rijang - Sistem Informasi Desa",
  description: "Website resmi Desa Tonrong Rijang, Kecamatan Baranti, Kabupaten Sidenreng Rappang, Sulawesi Selatan",
  icons: {
    icon: [
      {
        url: '/kabupatensidrap.png',
        sizes: 'any',
      },
    ],
    shortcut: '/kabupatensidrap.png',
    apple: '/kabupatensidrap.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/kabupatensidrap.png" />
        <link rel="apple-touch-icon" href="/kabupatensidrap.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
        position="top-right"
          toastOptions={{
            duration: 4000
          }}
          />
        {children}
      </body>
    </html>
  );
}