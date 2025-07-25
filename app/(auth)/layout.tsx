import type { Metadata } from "next";
import "../globals.css";
import { Hachi_Maru_Pop } from "next/font/google";
import { ToastContainer } from "react-toastify";

const hachiMaruPop = Hachi_Maru_Pop({
  weight: "400",
  variable: "--font-hachi-marupop",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hachiMaruPop.className} antialiased`}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
