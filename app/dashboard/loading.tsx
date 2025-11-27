import { TableSkeleton } from '@/components/table-skeleton';

export default function ContactsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-48 bg-muted animate-pulse rounded" />
          <div className="h-6 w-64 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="text-right">
          <div className="h-8 w-16 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </div>
      </div>
      <TableSkeleton rows={20} />
    </div>
  );
}
