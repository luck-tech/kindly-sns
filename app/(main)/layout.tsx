import Header from "@/components/header";
import NextTopLoader from "nextjs-toploader";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NextTopLoader showSpinner={false} />
      <Header />
      <main className="pt-16">{children}</main>
    </>
  );
}
