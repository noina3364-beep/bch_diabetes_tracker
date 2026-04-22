import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

interface FiltersProps {
  locations: string[];
  doctors: string[];
  selectedLocation: string;
  selectedDoctor: string;
  onLocationChange: (val: string) => void;
  onDoctorChange: (val: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}

export function FilterBar({
  locations,
  doctors,
  selectedLocation,
  selectedDoctor,
  onLocationChange,
  onDoctorChange,
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-end gap-3 px-1">
      <div className="relative flex-1 w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5 block">Search Patient</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Name or HN..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="Complete">Complete</option>
            <option value="Partially Complete">Partially Complete</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[150px]"
          >
            <option value="">All Units</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5">Dr</label>
          <select
            value={selectedDoctor}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[150px]"
          >
            <option value="">All Drs</option>
            {doctors.map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
