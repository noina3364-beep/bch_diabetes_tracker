import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  percentage?: number;
  count?: number;
  total?: number;
  color?: 'blue' | 'green' | 'amber' | 'rose' | 'indigo' | 'teal';
  index: number;
}

const colorMap = {
  blue: { text: 'text-blue-600', bar: 'bg-blue-500' },
  green: { text: 'text-emerald-600', bar: 'bg-emerald-500' },
  amber: { text: 'text-amber-600', bar: 'bg-amber-500' },
  rose: { text: 'text-rose-600', bar: 'bg-rose-500' },
  indigo: { text: 'text-indigo-600', bar: 'bg-indigo-500' },
  teal: { text: 'text-teal-600', bar: 'bg-teal-500' },
};

export function MetricCard({ label, value, percentage, count, total, color = 'blue', index }: MetricCardProps) {
  const theme = colorMap[color as keyof typeof colorMap] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"
    >
      <p className="text-xs font-bold text-slate-400 tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className={cn("text-3xl font-bold tracking-tight", theme.text)}>
          {value}
        </p>
        <p className="text-sm font-mono text-slate-400">
          {count !== undefined ? `(${count})` : ''}
        </p>
      </div>
      
      <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: percentage !== undefined ? `${percentage}%` : '100%' }}
          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
          className={cn("h-full", theme.bar)} 
        />
      </div>
    </motion.div>
  );
}
