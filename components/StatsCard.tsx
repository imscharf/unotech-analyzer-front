import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: string; // Optional visual indicator
  color?: "indigo" | "emerald" | "rose" | "amber";
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  // Helper to get the progress bar color without 'text' prefix
  const getBarColor = (c: string) => {
      switch(c) {
          case 'indigo': return 'bg-indigo-500';
          case 'emerald': return 'bg-emerald-500';
          case 'rose': return 'bg-rose-500';
          case 'amber': return 'bg-amber-500';
          default: return 'bg-indigo-500';
      }
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-all duration-200">
      <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">{label}</span>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-3xl font-bold text-zinc-100`}>{value}</span>
      </div>
      <div className={`mt-4 h-1 w-full rounded-full bg-zinc-800`}>
        <div className={`h-1 rounded-full ${getBarColor(color)} w-2/3 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}></div>
      </div>
    </div>
  );
};