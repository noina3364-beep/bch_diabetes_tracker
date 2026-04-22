import React, { useState, useMemo } from 'react';
import { NormalizedPatient } from '@/src/types';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PatientTableProps {
  patients: NormalizedPatient[];
}

type SortField = keyof NormalizedPatient;
type SortOrder = 'asc' | 'desc' | null;

export function PatientTable({ patients }: PatientTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') setSortOrder(null);
      else setSortOrder('asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedPatients = useMemo(() => {
    if (!sortOrder || !sortField) return patients;

    return [...patients].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [patients, sortField, sortOrder]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-700">Latest Records & Monitoring Status</h3>
        <span className="text-sm text-slate-400 italic">Showing {sortedPatients.length} unique patients</span>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
        <table className="w-full text-left border-collapse sticky-header">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-xs text-slate-400 border-b border-slate-100">
              <SortableHeader field="name" currentField={sortField} order={sortOrder} onSort={handleSort} label="Patient" className="px-6" />
              <SortableHeader field="location" currentField={sortField} order={sortOrder} onSort={handleSort} label="Location/Dr" className="px-6" />
              <SortableHeader field="status" currentField={sortField} order={sortOrder} onSort={handleSort} label="Status" className="px-6" />
              <SortableHeader field="hba1c" currentField={sortField} order={sortOrder} onSort={handleSort} label="HbA1c" className="px-4 text-center" />
              <SortableHeader field="egfr" currentField={sortField} order={sortOrder} onSort={handleSort} label="eGFR" className="px-4 text-center" />
              <SortableHeader field="has_ldl" currentField={sortField} order={sortOrder} onSort={handleSort} label="LDL" className="px-4 text-center" />
              <SortableHeader field="has_foot" currentField={sortField} order={sortOrder} onSort={handleSort} label="Foot" className="px-4 text-center" />
              <SortableHeader field="has_eye" currentField={sortField} order={sortOrder} onSort={handleSort} label="Eye" className="px-4 text-center" />
              <SortableHeader field="has_den" currentField={sortField} order={sortOrder} onSort={handleSort} label="Dental" className="px-4 text-center" />
              <SortableHeader field="fu" currentField={sortField} order={sortOrder} onSort={handleSort} label="Appointment Date" className="px-4 text-center" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {sortedPatients.map((p) => (
              <tr key={p.hn} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-slate-900 text-sm uppercase">HN: {p.hn}</span>
                    <span className="text-xs text-slate-400 font-semibold">{p.name} • {p.age}y</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-600">{p.location}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-tight">Dr. {p.doctor}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  {p.status === 'Complete' ? (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter">Complete</span>
                  ) : p.status === 'Partially Complete' ? (
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-tighter">Partially Complete</span>
                  ) : (
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded uppercase tracking-tighter">Incomplete</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <ValueIndicator value={p.hba1c} category={p.hba1c_category} />
                </td>
                <td className="px-4 py-3 text-center">
                  <ValueIndicator value={p.egfr} category={p.egfr_category} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusIcon isActive={p.has_ldl} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusIcon isActive={p.has_foot} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusIcon isActive={p.has_eye} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusIcon isActive={p.has_den} />
                </td>
                <td className="px-4 py-3 text-center">
                  {p.fu ? (
                    <span className="text-xs font-mono text-slate-500 font-bold whitespace-nowrap">
                      {format(p.fu, 'dd/MM/yyyy')}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-300 font-mono">-</span>
                  )}
                </td>
              </tr>
            ))}
            {sortedPatients.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-slate-400 italic">
                   No patients found for selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableHeader({ 
  field, 
  currentField, 
  order, 
  onSort, 
  label, 
  className 
}: { 
  field: SortField; 
  currentField: SortField; 
  order: SortOrder; 
  onSort: (field: SortField) => void; 
  label: string;
  className?: string;
}) {
  const isActive = currentField === field && order !== null;

  return (
    <th 
      className={cn(
        "py-3 font-bold tracking-widest cursor-pointer select-none group hover:text-slate-600 transition-colors",
        isActive && "text-slate-900",
        className
      )}
      onClick={() => onSort(field)}
    >
      <div className={cn("flex items-center gap-1", className?.includes('text-center') && "justify-center")}>
        <span>{label}</span>
        <div className="flex flex-col -space-y-1">
          {isActive ? (
            order === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
          )}
        </div>
      </div>
    </th>
  );
}

function StatusIcon({ isActive }: { isActive: boolean }) {
  return (
    <span className={cn(
      "font-bold text-lg",
      isActive ? "text-emerald-500" : "text-rose-400"
    )}>
      {isActive ? '✔' : '✘'}
    </span>
  );
}

function ValueIndicator({ value, category }: { value: number | null, category: string }) {
  if (value === null) return <span className="text-xs text-slate-300 font-mono">-</span>;
  
  const colors = {
    Normal: 'text-emerald-600',
    Abnormal: 'text-rose-600',
    'No Data': 'text-slate-400',
  };

  const dotColors = {
    Normal: 'bg-emerald-500',
    Abnormal: 'bg-rose-500',
    'No Data': 'bg-slate-300',
  };

  return (
    <div className="flex flex-col items-center">
      <span className={cn("text-sm font-mono font-bold", colors[category as keyof typeof colors])}>
        {Number.isInteger(value) ? value : value.toFixed(1)}
      </span>
      <div className={cn("w-1.5 h-1.5 rounded-full mt-1", dotColors[category as keyof typeof dotColors])} />
    </div>
  );
}
