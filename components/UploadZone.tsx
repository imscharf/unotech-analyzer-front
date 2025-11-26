import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={!isLoading ? handleClick : undefined}
      onDragOver={!isLoading ? handleDragOver : undefined}
      onDragLeave={!isLoading ? handleDragLeave : undefined}
      onDrop={!isLoading ? handleDrop : undefined}
      className={`
        relative group cursor-pointer 
        flex flex-col items-center justify-center 
        w-full max-w-2xl h-72
        rounded-[2rem] border-2 border-dashed 
        transition-all duration-300 ease-in-out
        ${isLoading ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50' : 
          isDragging 
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01] shadow-xl shadow-blue-500/10' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white shadow-xl shadow-slate-200/50'
        }
      `}
    >
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-blue-500 font-medium animate-pulse">Processando dados...</p>
        </div>
      ) : (
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Upload do Arquivo JMeter
          </h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Arraste seu arquivo <span className="font-mono text-blue-600 bg-blue-50 px-1 rounded">.csv</span> aqui ou clique para selecionar do computador
          </p>
        </div>
      )}
    </div>
  );
};