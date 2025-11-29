'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function PeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const period = searchParams.get('period') || 'all';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (newPeriod === 'all') {
      params.delete('period');
    } else {
      params.set('period', newPeriod);
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={period}
      onChange={handleChange}
      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-cyan-600 dark:text-cyan-400 text-xs font-semibold focus:border-cyan-500/50 focus:outline-none cursor-pointer"
    >
      <option value="all">All Time</option>
      <option value="24h">24h</option>
      <option value="7d">7d</option>
      <option value="30d">30d</option>
      <option value="90d">90d</option>
    </select>
  );
}
