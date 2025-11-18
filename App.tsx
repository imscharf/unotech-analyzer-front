import React from 'react';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 selection:bg-indigo-500/30">
      {/* Navigation Bar */}
      <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 p-1.5 rounded-lg shadow-inner shadow-indigo-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
                JMeter<span className="text-indigo-400">Analyzer</span>
              </h1>
            </div>
            <div className="flex items-center">
              <a href="#" className="text-sm font-medium text-zinc-400 hover:text-indigo-400 transition-colors">
                Documentação
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} JMeter Performance Analytics.
          </p>
          <p className="text-zinc-500 text-xs">
            v1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;