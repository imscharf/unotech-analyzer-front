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
        w-full max-w-2xl h-64 
        rounded-3xl border border-dashed 
        transition-all duration-300 ease-in-out
        ${isLoading ? 'opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/50' : 
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-900 bg-zinc-900/50 shadow-lg shadow-black/20'
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
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-medium animate-pulse">Analisando dados...</p>
        </div>
      ) : (
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-zinc-800 text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 border border-zinc-700 group-hover:border-indigo-500/30 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">
            Upload CSV do JMeter
          </h3>
          <p className="text-zinc-500 text-sm mb-4">
            Arraste e solte seu arquivo aqui, ou clique para buscar
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-400">
            Formato suportado: .csv
          </span>
        </div>
      )}
    </div>
  );
};