import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/getUserRole';
import { AdminNav } from '@/components/admin-nav';
import { PageTransition } from '@/components/page-transition';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userIsAdmin = await isAdmin();
  
  if (!userIsAdmin) {
    redirect('/dashboard');
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}
