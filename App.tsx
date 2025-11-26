import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-500/30">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Nova Logo UnoTech */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                </svg>
              </div>
              
              {/* Tipografia UnoTech */}
              <div className="flex flex-col justify-center -space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                  Uno<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Tech</span>
                </h1>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-widest ml-0.5">
                  Analytics
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} UnoTech Analytics. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;