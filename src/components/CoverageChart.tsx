import React from 'react';
import { motion } from 'motion/react';

interface Metric {
  name: string;
  percentage: number;
  coveredCount: number;
  missingCount: number;
}

interface CoverageMetricsProps {
  metrics: Metric[];
}

export function CoverageMetrics({ metrics }: CoverageMetricsProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Coverage & Missing Analysis</h3>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {metrics.map((metric, idx) => {
          const missingPercentage = 100 - metric.percentage;
          return (
            <div key={metric.name} className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-xs font-bold text-slate-500 tracking-wider">{metric.name}</span>
                <div className="flex gap-4 text-xs font-mono">
                  <span className="text-emerald-600 font-bold whitespace-nowrap text-xs">
                    Done: {Math.round(metric.percentage)}% ({metric.coveredCount})
                  </span>
                  <span className="text-slate-200 font-bold">|</span>
                  <span className="text-rose-400 font-bold whitespace-nowrap text-xs">
                    Miss: {Math.round(missingPercentage)}% ({metric.missingCount})
                  </span>
                </div>
              </div>
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                  className="h-full bg-emerald-500 rounded-l-full relative z-10"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${missingPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 + 0.2 }}
                  className="h-full bg-rose-500/20"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
