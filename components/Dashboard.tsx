import React, { useState, useCallback } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { AnalysisData } from '../types';
import { analyzeFile } from '../services/api';
import { UploadZone } from './UploadZone';

// Custom Tooltip for Recharts (Light Mode)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-2xl text-sm ring-1 ring-slate-100">
        <p className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">Tempo: {Number(label).toFixed(2)}s</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-white" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-500 capitalize">{entry.name}:</span>
            <span className="font-mono font-bold text-slate-800">
              {Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeFile(file);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao processar o arquivo.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  const mainData = data?.dados.t.map((t, i) => ({
    t,
    elapsed: data.dados.elapsed[i],
    predito: data.dados.predito[i],
  })) || [];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] animate-fade-in">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600 max-w-md w-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        <UploadZone onFileSelect={handleFileSelect} isLoading={loading} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resultados da Análise</h2>
          <p className="text-slate-500 text-sm mt-1">Visualização de dados processados.</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 rounded-full transition-all shadow-sm hover:shadow-md font-medium text-sm group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Nova Análise
        </button>
      </div>

      {/* Main Charts Grid - Agora contendo apenas o gráfico principal solicitado */}
      <div className="w-full">
        
        {/* Chart: Anomalias */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-white">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Anomalias
              </h3>
              {/* Subtítulo removido conforme solicitado */}
            </div>
            {/* Visual Indicator - Renomeado */}
            <div className="flex gap-4 text-xs font-medium">
               <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Anomalias</div>
               <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400"></span> Predições</div>
            </div>
          </div>
          
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorElapsed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPredito" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="t" 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12, fill: '#64748b'}} 
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Tempo (s)", position: "insideBottomRight", offset: -10, fill: "#94a3b8", fontSize: 12 }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12, fill: '#64748b'}} 
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "ms", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ display: 'none' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="elapsed" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorElapsed)" 
                  name="Anomalias"
                />
                <Area 
                  type="monotone" 
                  dataKey="predito" 
                  stroke="#06b6d4" 
                  strokeWidth={3} 
                  strokeDasharray="4 4"
                  fill="url(#colorPredito)"
                  name="Predições" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;