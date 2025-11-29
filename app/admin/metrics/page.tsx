import { prisma } from '@/lib/prisma';
import { MetricCard } from '@/components/admin/metric-card';
import { Users, Building2, Eye, TrendingUp, Award, Phone } from 'lucide-react';

export default async function AdminMetricsPage() {
  // Fetch all metrics in parallel
  const [
    totalUsers,
    totalAgencies,
    totalContacts,
    totalViews,
    viewsToday,
    topViewedContacts,
  ] = await Promise.all([
    // Total unique users who have made contact views
    prisma.contactView.findMany({
      distinct: ['userId'],
      select: { userId: true },
    }).then(users => users.length),
    
    // Total agencies
    prisma.agency.count(),
    
    // Total contacts
    prisma.contact.count(),
    
    // Total contact views (all time)
    prisma.contactView.count(),
    
    // Views today
    prisma.contactView.count({
      where: {
        viewedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    
    // Top 5 most viewed contacts
    prisma.contactView.groupBy({
      by: ['contactId'],
      _count: {
        contactId: true,
      },
      orderBy: {
        _count: {
          contactId: 'desc',
        },
      },
      take: 5,
    }),
  ]);

  // Fetch contact details for top viewed
  const topContactIds = topViewedContacts.map(item => item.contactId);
  const topContactsDetails = await prisma.contact.findMany({
    where: {
      id: {
        in: topContactIds,
      },
    },
    include: {
      agency: {
        select: {
          name: true,
          state: true,
        },
      },
    },
  });

  // Merge view counts with contact details
  const topContactsWithCounts = topContactsDetails.map(contact => {
    const viewCount = topViewedContacts.find(
      item => item.contactId === contact.id
    )?._count.contactId || 0;
    
    return {
      ...contact,
      viewCount,
    };
  }).sort((a, b) => b.viewCount - a.viewCount);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Detailed Metrics</h1>
        <p className="text-slate-600 dark:text-slate-400">Comprehensive analytics and performance insights</p>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            subtitle="Active users with view history"
          />
          <MetricCard
            title="Total Agencies"
            value={totalAgencies.toLocaleString()}
            icon={Building2}
            subtitle="Verified government agencies"
          />
          <MetricCard
            title="Total Contacts"
            value={totalContacts.toLocaleString()}
            icon={Phone}
            subtitle="Available contact records"
          />
          <MetricCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            icon={Eye}
            subtitle="All-time contact views"
          />
          <MetricCard
            title="Views Today"
            value={viewsToday}
            icon={TrendingUp}
            subtitle="Contact views in last 24h"
          />
          <MetricCard
            title="Avg Views/User"
            value={totalUsers > 0 ? Math.round(totalViews / totalUsers) : 0}
            icon={Award}
            subtitle="Average views per active user"
          />
        </div>
      </div>

      {/* Top Viewed Contacts Table */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Top Viewed Contacts
        </h2>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Views
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {topContactsWithCounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-500">
                      No contact views recorded yet
                    </td>
                  </tr>
                ) : (
                  topContactsWithCounts.map((contact, index) => (
                    <tr key={contact.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {contact.firstName} {contact.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {contact.title || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {contact.agency?.name || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {contact.agency?.state || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {contact.viewCount}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
