import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { PeriodFilter } from '@/components/period-filter';

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminUsersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const period = searchParams.period || 'all';

  // Calculate date filter based on period
  const getDateFilter = () => {
    const now = new Date();
    switch (period) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const dateFilter = getDateFilter();

  // Get all users from database
  const dbUsers = await prisma.user.findMany({
    select: {
      id: true,
      clerkId: true,
      email: true,
      createdAt: true,
    },
  });

  const clerk = await clerkClient();

  // Get view stats for each user
  const usersWithDetails = await Promise.all(
    dbUsers.map(async (dbUser) => {
      // First and last activity should ALWAYS be absolute (not filtered by period)
      const [firstView, lastView, clerkUser] = await Promise.all([
        prisma.contactView.findFirst({
          where: { userId: dbUser.id },
          orderBy: { viewedAt: 'asc' },
        }),
        prisma.contactView.findFirst({
          where: { userId: dbUser.id },
          orderBy: { viewedAt: 'desc' },
        }),
        clerk.users.getUser(dbUser.clerkId).catch(() => null),
      ]);

      // Total views should be filtered by period
      const viewWhere = {
        userId: dbUser.id,
        ...(dateFilter && {
          viewedAt: {
            gte: dateFilter,
          },
        }),
      };

      const totalViews = await prisma.contactView.count({
        where: viewWhere,
      });

      return {
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        firstName: clerkUser?.firstName || '',
        lastName: clerkUser?.lastName || '',
        totalViews,
        firstView: firstView?.viewedAt,
        lastView: lastView?.viewedAt,
        createdAt: dbUser.createdAt,
      };
    })
  );

  // Sort by total views
  usersWithDetails.sort((a, b) => b.totalViews - a.totalViews);

  const periodLabels = {
    all: 'All Time',
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">User Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor {usersWithDetails.length} active users and their activity</p>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    Total Views
                    <PeriodFilter />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  First Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {usersWithDetails.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl">👥</div>
                      <div className="text-lg font-semibold">No users found</div>
                      <div className="text-sm">Users will appear here once they start viewing contacts</div>
                    </div>
                  </td>
                </tr>
              ) : (
                usersWithDetails.map((user) => {
                  // User is ONLY active if they have viewed contacts in last 7 days
                  const daysSinceLastView = user.lastView 
                    ? Math.floor((Date.now() - new Date(user.lastView).getTime()) / (1000 * 60 * 60 * 24))
                    : 999;
                  const isActive = daysSinceLastView < 7;

                  return (
                    <tr key={user.clerkId} className="hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <code className="text-xs font-mono text-slate-500 dark:text-slate-500">
                            {user.clerkId.slice(0, 12)}...
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700 dark:text-slate-300">{user.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.totalViews}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {user.firstView ? (
                            new Date(user.firstView).toLocaleDateString()
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">No activity</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {user.lastView ? (
                            new Date(user.lastView).toLocaleDateString()
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">No activity</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
