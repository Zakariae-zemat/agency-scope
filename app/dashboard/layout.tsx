import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { PageTransition } from '@/components/page-transition';
import { isAdmin } from '@/lib/getUserRole';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userIsAdmin = await isAdmin();
  
  // If user is admin, redirect them to admin panel
  if (userIsAdmin) {
    redirect('/admin');
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav isAdmin={false} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
