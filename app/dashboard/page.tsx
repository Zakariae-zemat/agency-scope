import DashboardClient from '@/components/dashboard-client';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


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

  return (
    <DashboardClient
      totalAgencies={totalAgencies}
      totalContacts={totalContacts}
      todayViews={todayViews}
    />
  );
}
