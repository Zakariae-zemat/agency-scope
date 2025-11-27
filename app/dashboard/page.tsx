import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Get stats
  const [totalAgencies, totalContacts, todayViews] = await Promise.all([
    prisma.agency.count(),
    prisma.contact.count(),
    prisma.contactView.count({
      where: {
        userId: user.id,
        viewedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const remainingViews = Math.max(0, 50 - todayViews);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgencies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Verified government agencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Decision-makers and contacts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views Remaining</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingViews}/50</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resets daily at midnight
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/agencies">
              <button className="w-full flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Browse Agencies</div>
                  <div className="text-sm text-muted-foreground">
                    Explore {totalAgencies} verified agencies
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/contacts">
              <button className="w-full flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">View Contacts</div>
                  <div className="text-sm text-muted-foreground">
                    Access {totalContacts} contact profiles
                  </div>
                </div>
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily View Limit</span>
                <span className="text-sm text-muted-foreground">
                  {todayViews}/50 used
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${(todayViews / 50) * 100}%` }}
                />
              </div>
            </div>

            {remainingViews === 0 && (
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-900 p-4">
                <p className="text-sm text-orange-900 dark:text-orange-100 font-medium mb-1">
                  Daily limit reached
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  You've used all 50 contact views today. Upgrade for unlimited access.
                </p>
                <Link href="/dashboard/upgrade">
                  <button className="text-sm font-medium text-orange-900 dark:text-orange-100 hover:underline">
                    View upgrade options →
                  </button>
                </Link>
              </div>
            )}

            {remainingViews > 0 && (
              <div className="text-sm text-muted-foreground">
                You have <span className="font-medium text-foreground">{remainingViews}</span> contact views remaining today.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
