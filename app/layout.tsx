import type { Metadata } from "next";
import { Hachi_Maru_Pop } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const hachiMaruPop = Hachi_Maru_Pop({
  weight: "400",
  variable: "--font-hachi-marupop",
  subsets: ["latin"],
});

const siteName = "Kindo";
const description =
  "SNSに少し疲れちゃったあなたへ。Kindoは、悪口や批判のない安心できる居場所です。ここでは、みんなの言葉がAIの魔法で優しくなります。";
const url = "https://kindly-sns.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(url),

  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "OGP画像",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/ogp.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hachiMaruPop.className} antialiased`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
