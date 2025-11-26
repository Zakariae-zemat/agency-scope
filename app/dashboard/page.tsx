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
        <p className="text-slate-600 mt-2">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgencies}</div>
            <p className="text-xs text-slate-600 mt-1">
              Verified government agencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-slate-600 mt-1">
              Key decision-makers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views Remaining</CardTitle>
            <Eye className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingViews}/50</div>
            <p className="text-xs text-slate-600 mt-1">
              {remainingViews === 0 ? (
                <Link href="/upgrade" className="text-blue-600 hover:underline">
                  Upgrade for unlimited
                </Link>
              ) : (
                'Resets daily at midnight'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/agencies"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Browse Agencies</p>
                <p className="text-sm text-slate-600">Explore government organizations</p>
              </div>
            </Link>
            <Link
              href="/contacts"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">View Contacts</p>
                <p className="text-sm text-slate-600">Access key decision-makers</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                1
              </div>
              <div>
                <p className="font-medium">Browse agencies</p>
                <p className="text-sm text-slate-600">Start by exploring available agencies</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                2
              </div>
              <div>
                <p className="font-medium">View contacts</p>
                <p className="text-sm text-slate-600">Access up to 50 contacts per day for free</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                3
              </div>
              <div>
                <p className="font-medium">Upgrade anytime</p>
                <p className="text-sm text-slate-600">Get unlimited access with premium</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
