import React, { useState, useCallback } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell, ReferenceLine
} from 'recharts';
import { UploadZone } from './UploadZone';
import { analyzeFile } from '../services/api';

// 1. Definindo a nova tipagem baseada no JSON da imagem
interface Previsao {
  janela_minutos: number;
  consumo_medio_previsto: number;
  tendencia: string;
}

interface AnalysisData {
  consumo_ultimo_minuto_medio: number;
  previsoes: Previsao[];
}

// 2. Cores baseadas na tendência
const getTrendColor = (trend: string) => {
  if (trend.toLowerCase().includes('aumento')) return '#f59e0b'; // Amber/Orange
  if (trend.toLowerCase().includes('queda')) return '#10b981';   // Emerald/Green
  return '#3b82f6'; // Blue default
};

// 3. Tooltip Customizado para o novo formato
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-2xl text-sm ring-1 ring-slate-100">
        <p className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">
          Janela: {data.janela_minutos} minutos
        </p>
        <div className="space-y-2">
           <div className="flex justify-between gap-4">
              <span className="text-slate-500">Previsto:</span>
              <span className="font-mono font-bold text-slate-800">
                {Number(data.consumo_medio_previsto).toFixed(2)}
              </span>
           </div>
           <div className="flex justify-between gap-4 items-center">
              <span className="text-slate-500">Tendência:</span>
              <span className="font-bold px-2 py-0.5 rounded-full text-xs text-white" 
                style={{ backgroundColor: getTrendColor(data.tendencia) }}>
                {data.tendencia}
              </span>
           </div>
        </div>
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
      // Assumindo que a API agora retorna o novo formato JSON
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

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[60vh] animate-fade-in">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600 max-w-md w-full shadow-sm">
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        <UploadZone onFileSelect={handleFileSelect} isLoading={loading} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Análise Preditiva</h2>
          <p className="text-slate-500 text-sm mt-1">Comparativo de consumo atual vs. janelas futuras.</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600 rounded-full transition-all shadow-sm hover:shadow-md font-medium text-sm group"
        >
          Nova Análise
        </button>
      </div>

      {/* Grid de KPIs (Indicadores) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card: Consumo Atual */}
        <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-center">
            <span className="text-slate-400 text-sm font-medium mb-1">Consumo Médio (Último Min)</span>
            <div className="text-4xl font-bold font-mono">
                {data.consumo_ultimo_minuto_medio.toFixed(1)}
            </div>
            <span className="text-xs text-slate-400 mt-2">Referência Base</span>
        </div>

        {/* Cards das Previsões */}
        {data.previsoes.map((prev, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-slate-500 text-sm font-bold bg-slate-50 px-2 py-1 rounded-lg">
                        {prev.janela_minutos} Minutos
                    </span>
                    {prev.tendencia.includes("Aumento") ? (
                        <span className="text-amber-500 bg-amber-50 p-1.5 rounded-full">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </span>
                    ) : (
                        <span className="text-emerald-500 bg-emerald-50 p-1.5 rounded-full">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                        </span>
                    )}
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-800 font-mono mb-1">
                        {prev.consumo_medio_previsto.toFixed(1)}
                    </div>
                    <span className={`text-xs font-bold ${prev.tendencia.includes("Aumento") ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {prev.tendencia}
                    </span>
                </div>
            </div>
        ))}
      </div>

      {/* Chart: Previsões vs Atual */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-white">
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800">Projeção de Consumo</h3>
            <p className="text-sm text-slate-400">Linha tracejada indica o consumo médio atual.</p>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.previsoes} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              
              <XAxis 
                dataKey="janela_minutos" 
                tickFormatter={(val) => `${val} min`}
                stroke="#94a3b8" 
                tick={{fontSize: 12, fill: '#64748b'}} 
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                stroke="#94a3b8" 
                tick={{fontSize: 12, fill: '#64748b'}} 
                tickLine={false}
                axisLine={false}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
              
              {/* Linha de referência do valor atual */}
              <ReferenceLine 
                y={data.consumo_ultimo_minuto_medio} 
                stroke="#334155" 
                strokeDasharray="3 3"
                label={{ value: 'Atual ', position: 'right', fill: '#334155', fontSize: 12 }} 
              />

              <Bar 
                dataKey="consumo_medio_previsto" 
                radius={[8, 8, 0, 0]}
                barSize={60}
              >
                {data.previsoes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTrendColor(entry.tendencia)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;