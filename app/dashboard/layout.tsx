import { DashboardNav } from '@/components/dashboard-nav';
import { PageTransition } from '@/components/page-transition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
