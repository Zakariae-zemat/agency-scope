import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/getUserRole';
import { DashboardNav } from '@/components/dashboard-nav';
import { PageTransition } from '@/components/page-transition';
import { Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav isAdmin={true} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PageTransition>
          <div className="space-y-6">
            {/* Admin Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800">
                  <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">System analytics and management</p>
                </div>
              </div>
            </div>
            
            {children}
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
