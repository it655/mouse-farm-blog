import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import TacticalHeader from "../components/layout/TacticalHeader";
import Footer from "../components/layout/Footer";

// 1. Font chữ thường (Đọc nội dung)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 2. Font chữ kỹ thuật (Hiển thị thông số)
const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono" 
});

export const metadata: Metadata = {
  title: "MOUSE FARM ARCHIVE | ORIGINAL SOURCE",
  description: "Official Original Video Archive. Content ID Protection & Source Storage. Unauthorized use is prohibited.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
        {/* Lớp nền chính bao trùm toàn bộ web */}
        <div className="bg-tactical min-h-screen relative">
          <TacticalHeader />
          {/* Hiệu ứng đốm sáng (Glow) ở giữa màn hình cho nghệ */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-thermal-glow blur-[150px] rounded-full pointer-events-none opacity-20"></div>
          
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}