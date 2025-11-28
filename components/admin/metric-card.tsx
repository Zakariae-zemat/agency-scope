import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ title, value, icon: Icon, subtitle, trend }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {title}
            </p>
          </div>
          {Icon && (
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/30 group-hover:border-cyan-200 dark:group-hover:border-cyan-800 transition-colors duration-300">
              <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300" strokeWidth={2.5} />
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-2">
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {value}
          </p>
        </div>
        
        {/* Subtitle or Trend */}
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {subtitle}
          </p>
        )}
        
        {trend && (
          <div className="flex items-center gap-1 text-xs">
            <span className={`font-semibold ${
              trend.value >= 0 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-slate-500 dark:text-slate-500">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
