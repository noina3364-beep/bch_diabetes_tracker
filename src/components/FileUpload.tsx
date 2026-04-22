import React, { useRef } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface FileUploadProps {
  onUpload: (data: ArrayBuffer) => void;
  isLoading?: boolean;
}

export function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          onUpload(event.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-500 transition-colors group cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleFileChange} 
        accept=".xlsx" 
        className="hidden" 
      />
      
      <div className="p-4 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors">
        {isLoading ? (
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
        )}
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Upload Diabetes Data</h3>
        <p className="text-sm text-slate-500 mt-1">Select or drag .xlsx file to process</p>
      </div>

      <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        <FileSpreadsheet className="w-3 h-3" />
        Excel format required (.xlsx)
      </div>
    </motion.div>
  );
}
