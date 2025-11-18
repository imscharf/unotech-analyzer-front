import React, { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { AnalysisData } from '../types';
import { analyzeFile } from '../services/api';
import { UploadZone } from './UploadZone';
import { StatsCard } from './StatsCard';

// Custom Tooltip for Recharts (Dark Mode)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 p-4 border border-zinc-700 shadow-2xl rounded-xl text-sm">
        <p className="font-semibold text-zinc-300 mb-2">Tempo: {Number(label).toFixed(2)}s</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }}></div>
            <span className="text-zinc-400 capitalize">{entry.name}:</span>
            <span className="font-mono font-medium text-zinc-100">
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

  // Transform data for charts
  const mainData = data?.dados.t.map((t, i) => ({
    t,
    elapsed: data.dados.elapsed[i],
    predito: data.dados.predito[i],
  })) || [];

  const futureData = data?.dados.future_t.map((t, i) => ({
    t,
    predito: data.dados.future_pred[i],
  })) || [];

  const errorData = data?.dados.t.map((t, i) => ({
    t,
    erro: data.dados.erro[i],
  })) || [];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] animate-fade-in">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center text-rose-400 max-w-md w-full">
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Resultados da Análise</h2>
          <p className="text-zinc-500 text-sm mt-1">Métricas de performance e modelagem preditiva.</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800 text-zinc-300 hover:text-indigo-400 rounded-xl transition-all shadow-lg shadow-black/20 font-medium text-sm group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Analisar Novo Arquivo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Score R²" 
          value={data.r2.toFixed(4)} 
          color="indigo" 
        />
        <StatsCard 
          label="RMSE (Erro)" 
          value={`${data.rmse.toFixed(2)} ms`} 
          color="rose" 
        />
        <StatsCard 
          label="Coeficiente" 
          value={data.coeficiente.toFixed(4)} 
          color="emerald" 
        />
      </div>

      {/* Main Charts Grid */}
      <div className="space-y-8">
        
        {/* Chart 1: Actual vs Predicted */}
        <div className="bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-lg shadow-black/20 border border-zinc-800">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
              Real vs Predito
            </h3>
            <p className="text-zinc-500 text-sm ml-3 mt-1">Comparação do tempo decorrido real com o modelo de regressão.</p>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorElapsed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="t" 
                  stroke="#52525b" 
                  tick={{fontSize: 12, fill: '#71717a'}} 
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Tempo (s)", position: "insideBottomRight", offset: -10, fill: "#52525b", fontSize: 12 }} 
                />
                <YAxis 
                  stroke="#52525b" 
                  tick={{fontSize: 12, fill: '#71717a'}} 
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "ms", angle: -90, position: "insideLeft", fill: "#52525b", fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-zinc-400">{value}</span>}/>
                <Area 
                  type="monotone" 
                  dataKey="elapsed" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorElapsed)" 
                  name="Real (Observado)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#818cf8" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predito" 
                  stroke="#fbbf24" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false} 
                  name="Predição do Modelo" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 2: Residuals */}
          <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-100 mb-2">Resíduos do Modelo</h3>
            <p className="text-zinc-500 text-sm mb-6">Diferença entre valores observados e preditos.</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={errorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis stroke="#52525b" tick={{fontSize: 11, fill: '#71717a'}} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="erro" 
                    stroke="#a78bfa" 
                    strokeWidth={2}
                    dot={false} 
                    name="Erro" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Future Trend */}
          <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-100 mb-2">Previsão de Tendência</h3>
            <p className="text-zinc-500 text-sm mb-6">Performance projetada baseada na regressão.</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={futureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis stroke="#52525b" tick={{fontSize: 11, fill: '#71717a'}} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="predito" 
                    stroke="#f43f5e" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Previsão" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;