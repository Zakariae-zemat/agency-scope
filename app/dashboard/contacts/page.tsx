import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ContactsTable } from '@/components/contacts-table';
import { getTodayViewCount } from '@/lib/actions';

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; agency?: string }>;
}

export default async function ContactsPage(props: PageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const agencyFilter = searchParams.agency || '';
  const pageSize = 20;

  const viewStats = await getTodayViewCount();

  const where = {
    AND: [
      search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { title: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      agencyFilter
        ? {
            agency: {
              name: { contains: agencyFilter, mode: 'insensitive' as const },
            },
          }
        : {},
    ],
  };

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      include: {
        agency: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
      },
    }),
    prisma.contact.count({ where }),
  ]);

  // Get contacts viewed today by this user
  const viewedContactIds = await prisma.contactView.findMany({
    where: {
      userId: user.id,
      viewedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    select: { contactId: true },
  });

  const viewedSet = new Set(viewedContactIds.map((v) => v.contactId));

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Browse {total.toLocaleString()} verified contacts
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {viewStats.remaining}/50
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">views remaining</div>
        </div>
      </div>

      <ContactsTable
        contacts={contacts}
        viewedContactIds={viewedSet}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        remainingViews={viewStats.remaining}
      />
    </div>
  );
}
