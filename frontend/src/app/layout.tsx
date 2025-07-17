import Header from "@/_components/Header"; 
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
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

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Header /> 

        {/* 전역 토스트 컨테이너 */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          pauseOnHover
          closeOnClick
          theme="light"
        />

        {/* 페이지 콘텐츠 */}
        {children}
      </body>
    </html>
  );
}
