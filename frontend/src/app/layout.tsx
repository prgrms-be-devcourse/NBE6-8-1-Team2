"use client";  // 클라이언트 컴포넌트로 지정

import { usePathname } from "next/navigation"; 
import Header from "@/components/Header"; 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 로그인 페이지가 아닐 때만 상단 바를 표시 */}
        {pathname !== "/login" && <Header />} 
        
        {/* 페이지의 실제 콘텐츠가 들어오는 부분 */}
        {children}
      </body>
    </html>
  );
}