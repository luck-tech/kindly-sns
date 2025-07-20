import { hachiMaruPop } from '@/app/fonts';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={hachiMaruPop.className}>
      {children}
    </section>
  );
}