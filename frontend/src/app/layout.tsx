import { Montserrat, Inter } from "next/font/google";
import Header from "@/_components/Header";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/_hooks/auth-context";
import { CartProvider } from "@/_contexts/CartContext";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ // 기본 폰트
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({ // font-title로 사용 
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Grids & Circles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider> 
            <Header />

            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar
              pauseOnHover
              closeOnClick
              theme="light"
            />

            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
