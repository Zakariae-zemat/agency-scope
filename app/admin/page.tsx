import { prisma } from '@/lib/prisma';
import { MetricCard } from '@/components/admin/metric-card';
import { Users, Building2, Eye, Phone, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function AdminOverviewPage() {
  // Quick stats
  const [totalUsers, totalAgencies, totalContacts, totalViews, viewsToday] = await Promise.all([
    prisma.contactView.findMany({
      distinct: ['userId'],
      select: { userId: true },
    }).then(users => users.length),
    prisma.agency.count(),
    prisma.contact.count(),
    prisma.contactView.count(),
    prisma.contactView.count({
      where: {
        viewedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);


  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome to Admin Panel</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor system performance and manage platform resources</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Active Users"
            value={totalUsers}
            icon={Users}
            subtitle="Users with activity"
          />
          <MetricCard
            title="Total Agencies"
            value={totalAgencies.toLocaleString()}
            icon={Building2}
            subtitle="Government agencies"
          />
          <MetricCard
            title="Total Contacts"
            value={totalContacts.toLocaleString()}
            icon={Phone}
            subtitle="Contact records"
          />
          <MetricCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            icon={Eye}
            subtitle="All-time views"
          />
          <MetricCard
            title="Today's Activity"
            value={viewsToday}
            icon={TrendingUp}
            subtitle="Views in last 24h"
          />
        </div>
      </div>
    </div>
  );
}
