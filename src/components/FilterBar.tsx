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
}: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
      <div className="relative flex-1 w-full">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Search Patient</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Name or HN..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-base font-medium text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[180px]"
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
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5">Doctor</label>
          <select
            value={selectedDoctor}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-base font-medium text-slate-600 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[180px]"
          >
            <option value="">All Doctors</option>
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
