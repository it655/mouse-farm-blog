import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import TacticalHeader from "../components/layout/Header/TacticalHeader";
import Footer from "../components/layout/Footer/Footer";
import Header from "../components/layout/Header/TacticalHeader";
import {Oswald } from 'next/font/google';
// 1. Font chữ thường (Đọc nội dung)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 2. Font chữ kỹ thuật (Hiển thị thông số)
const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono" 
});

const oswald = Oswald({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-oswald' });
export const metadata: Metadata = {
  title: "MOUSE FARM ARCHIVE | ORIGINAL SOURCE",
  description: "Official Original Video Archive. Content ID Protection & Source Storage. Unauthorized use is prohibited.",
  icons:"icon.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="vi" className={`${inter.className} ${oswald.variable}`}>
      {/* Nền đen, chữ trắng */}
      <body className="bg-black text-white flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}