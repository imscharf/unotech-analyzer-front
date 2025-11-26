import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  type?: "primary" | "neutral" | "accent";
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, type = "primary" }) => {
  
  const styles = {
    primary: {
        gradient: "from-blue-600 to-blue-400",
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-900"
    },
    neutral: {
        gradient: "from-slate-600 to-slate-400",
        bg: "bg-slate-50",
        border: "border-slate-100",
        text: "text-slate-900"
    },
    accent: {
        gradient: "from-cyan-500 to-sky-400",
        bg: "bg-cyan-50",
        border: "border-cyan-100",
        text: "text-cyan-900"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`p-6 rounded-3xl bg-white shadow-lg shadow-slate-200/50 border ${currentStyle.border} flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex justify-between items-start">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentStyle.gradient}`}></div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-4xl font-bold tracking-tight ${currentStyle.text}`}>{value}</span>
      </div>
      
      {/* Decorative bar */}
      <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${currentStyle.gradient} w-2/3 opacity-80`}></div>
      </div>
    </div>
  );
};