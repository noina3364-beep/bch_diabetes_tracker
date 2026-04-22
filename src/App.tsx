/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  FlaskConical, 
  Activity, 
  CheckCircle2, 
  Eye, 
  Footprints,
  Stethoscope,
  Trash2,
  RefreshCw,
  LayoutDashboard,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { MetricCard } from './components/MetricCard';
import { CoverageMetrics } from './components/CoverageChart';
import { DistributionChart } from './components/HbA1cDistribution';
import { PatientTable } from './components/PatientTable';
import { FilterBar } from './components/FilterBar';
import { parseExcel, normalizeData } from './utils/dataProcessor';
import { NormalizedPatient } from './types';
import { CATEGORY_COLORS } from './constants';

export default function App() {
  const [rawData, setRawData] = useState<NormalizedPatient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const handleUpload = async (buffer: ArrayBuffer) => {
    setIsLoading(true);
    try {
      const records = parseExcel(buffer);
      const normalized = normalizeData(records);
      setRawData(normalized);
      setSearchTerm('');
      setSelectedLocation('');
      setSelectedDoctor('');
    } catch (error) {
      console.error("Failed to process Excel:", error);
      alert("Error processing Excel file. Please ensure it follows the format.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setRawData([]);
  };

  const locations = useMemo(() => 
    Array.from(new Set(rawData.map(p => p.location))).filter(Boolean).sort(), 
    [rawData]
  );
  
  const doctors = useMemo(() => 
    Array.from(new Set(rawData.map(p => p.doctor))).filter(Boolean).sort(), 
    [rawData]
  );

  const filteredPatients = useMemo(() => {
    return rawData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.hn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !selectedLocation || p.location === selectedLocation;
      const matchesDoctor = !selectedDoctor || p.doctor === selectedDoctor;
      return matchesSearch && matchesLocation && matchesDoctor;
    });
  }, [rawData, searchTerm, selectedLocation, selectedDoctor]);

  const metrics = useMemo(() => {
    if (filteredPatients.length === 0) return null;

    const total = filteredPatients.length;
    const hba1cCount = filteredPatients.filter(p => p.has_hba1c).length;
    const egfrCount = filteredPatients.filter(p => p.has_egfr).length;
    const ldlCount = filteredPatients.filter(p => p.has_ldl).length;
    const footCount = filteredPatients.filter(p => p.has_foot).length;
    const eyeCount = filteredPatients.filter(p => p.has_eye).length;
    const denCount = filteredPatients.filter(p => p.has_den).length;
    const fuCount = filteredPatients.filter(p => p.has_fu).length;

    const hba1cDist = {
      'Normal': filteredPatients.filter(p => p.hba1c_category === 'Normal').length,
      'Abnormal': filteredPatients.filter(p => p.hba1c_category === 'Abnormal').length,
      'No Data': filteredPatients.filter(p => p.hba1c_category === 'No Data').length,
    };

    const egfrDist = {
      'Normal': filteredPatients.filter(p => p.egfr_category === 'Normal').length,
      'Abnormal': filteredPatients.filter(p => p.egfr_category === 'Abnormal').length,
      'No Data': filteredPatients.filter(p => p.egfr_category === 'No Data').length,
    };

    const missingRank = [
      { field: 'Eye Exam', count: total - eyeCount },
      { field: 'Foot Exam', count: total - footCount },
      { field: 'HbA1c', count: total - hba1cCount },
      { field: 'LDL', count: total - ldlCount },
      { field: 'eGFR', count: total - egfrCount },
      { field: 'Dental', count: total - denCount },
      { field: 'Follow Up', count: total - fuCount },
    ].sort((a, b) => b.count - a.count);

    return {
      totalPatients: total,
      hba1cCoverage: (hba1cCount / total) * 100,
      egfrCoverage: (egfrCount / total) * 100,
      ldlCoverage: (ldlCount / total) * 100,
      screeningCoverage: ((footCount + eyeCount) / (total * 2)) * 100,
      dentalCoverage: (denCount / total) * 100,
      hba1cDistribution: Object.entries(hba1cDist).map(([name, value]) => {
        const pct = total > 0 ? Math.round((value / total) * 100) : 0;
        return {
          name: name === 'No Data' ? name : `${name} (${pct}%)`,
          value,
          color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['No Data']
        };
      }),
      egfrDistribution: Object.entries(egfrDist).map(([name, value]) => {
        const pct = total > 0 ? Math.round((value / total) * 100) : 0;
        return {
          name: name === 'No Data' ? name : `${name} (${pct}%)`,
          value,
          color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['No Data']
        };
      }),
      missingItems: missingRank,
      coverageDetails: [
        { 
          name: 'Foot Exam', 
          percentage: (footCount / total) * 100,
          coveredCount: footCount,
          missingCount: total - footCount
        },
        { 
          name: 'Eye Exam', 
          percentage: (eyeCount / total) * 100,
          coveredCount: eyeCount,
          missingCount: total - eyeCount
        },
        { 
          name: 'Dental', 
          percentage: (denCount / total) * 100,
          coveredCount: denCount,
          missingCount: total - denCount
        },
        { 
          name: 'Follow Up', 
          percentage: (fuCount / total) * 100,
          coveredCount: fuCount,
          missingCount: total - fuCount
        },
      ]
    };
  }, [filteredPatients]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 font-sans p-6 overflow-x-hidden">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Diabetes Care Monitor <span className="text-sm font-normal text-slate-400 ml-2 italic">v1.0 MVP</span>
            </h1>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Clinical Data Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rawData.length > 0 && (
            <button 
              onClick={clearData}
              className="px-3 py-2 text-sm font-bold text-rose-500 uppercase tracking-wider hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear Dataset
            </button>
          )}
          <button 
            onClick={() => document.querySelector('input[type=\"file\"]')?.dispatchEvent(new MouseEvent('click'))}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Upload className="w-5 h-5" />
            <span className="text-base font-bold uppercase tracking-tight">Upload Excel</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {rawData.length === 0 ? (
            <motion.div 
              key="uploader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-3xl mx-auto mt-12 bg-white p-16 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50"
            >
              <FileUpload onUpload={handleUpload} isLoading={isLoading} />
              <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-4 gap-4 text-center">
                {['HN', 'Date', 'HbA1c', 'eGFR'].map(tag => (
                  <div key={tag} className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-3 rounded-lg">{tag}</div>
                ))}
                {['LDL', 'Foot', 'Eye', 'Dental', 'FU Date'].map(tag => (
                  <div key={tag} className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-3 rounded-lg">{tag}</div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Top KPI row */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricCard 
                  index={0}
                  label="Total Patients" 
                  value={metrics?.totalPatients.toLocaleString() || '0'} 
                  color="blue"
                  percentage={100}
                />
                <MetricCard 
                  index={1}
                  label="HbA1c Coverage" 
                  value={metrics ? `${Math.round(metrics.hba1cCoverage)}%` : '0%'} 
                  color="blue"
                  percentage={metrics?.hba1cCoverage}
                />
                <MetricCard 
                  index={2}
                  label="eGFR Coverage" 
                  value={metrics ? `${Math.round(metrics.egfrCoverage)}%` : '0%'} 
                  color="indigo"
                  percentage={metrics?.egfrCoverage}
                />
                <MetricCard 
                  index={3}
                  label="LDL Coverage" 
                  value={metrics ? `${Math.round(metrics.ldlCoverage)}%` : '0%'} 
                  color="teal"
                  percentage={metrics?.ldlCoverage}
                />
                <MetricCard 
                  index={4}
                  label="Screening Coverage" 
                  value={metrics ? `${Math.round(metrics.screeningCoverage)}%` : '0%'} 
                  color="amber"
                  percentage={metrics?.screeningCoverage}
                />
              </div>

              {/* Filter Row */}
              <FilterBar 
                locations={locations}
                doctors={doctors}
                selectedLocation={selectedLocation}
                selectedDoctor={selectedDoctor}
                onLocationChange={setSelectedLocation}
                onDoctorChange={setSelectedDoctor}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              {/* Charts & Ranking Middle Row */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DistributionChart title="HbA1c Status" data={metrics.hba1cDistribution} />
                  <DistributionChart title="eGFR Status" data={metrics.egfrDistribution} />
                  <div className="md:col-span-2 lg:col-span-2">
                    <CoverageMetrics metrics={metrics.coverageDetails} />
                  </div>
                </div>
              )}

              {/* Data Table */}
              <PatientTable patients={filteredPatients} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 py-8 text-center border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">&copy; Clinical Analytics MVP • Professional Polish Edition</p>
      </footer>
    </div>
  );
}

