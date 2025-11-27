import { prisma } from '@/lib/prisma';
import { AgenciesTable } from '@/components/agencies-table';

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; state?: string }>;
}

export default async function AgenciesPage(props: PageProps) {
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

  const [agencies, total] = await Promise.all([
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
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Get unique states for filter
  const states = await prisma.agency.findMany({
    select: { state: true },
    where: { state: { not: null } },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agencies</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Browse {total.toLocaleString()} verified government agencies
        </p>
      </div>

      <AgenciesTable
        agencies={agencies}
        states={states.map((s) => s.state!)}
        currentPage={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  );
}
