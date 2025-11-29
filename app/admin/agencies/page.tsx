import { prisma } from '@/lib/prisma';
import { AdminAgenciesTable } from '@/components/admin-agencies-table';

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; state?: string }>;
}

export default async function AdminAgenciesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const state = searchParams.state || '';
  const pageSize = 20;

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { county: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      state ? { state: { equals: state, mode: 'insensitive' as const } } : {},
    ],
  };

  const [agencies, total, states] = await Promise.all([
    prisma.agency.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    }),
    prisma.agency.count({ where }),
    prisma.agency.findMany({
      select: { state: true },
      distinct: ['state'],
      orderBy: { state: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Agency Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Browse and manage all {total.toLocaleString()} government agencies</p>
      </div>

      <AdminAgenciesTable
        agencies={agencies}
        states={states.map((s) => s.state!)}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
      />
    </div>
  );
}
