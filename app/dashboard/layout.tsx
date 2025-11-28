import { DashboardNav } from '@/components/dashboard-nav';
import { PageTransition } from '@/components/page-transition';
import { isAdmin } from '@/lib/getUserRole';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userIsAdmin = await isAdmin();
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav isAdmin={userIsAdmin} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
