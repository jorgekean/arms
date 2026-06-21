import React, { useState } from 'react';
import { FileText, Link as LinkIcon, History, AlertCircle } from 'lucide-react';
import { PersonnelClearanceReport } from '../features/reports/PersonnelClearanceReport';

export function Reports() {
  const [activeReport, setActiveReport] = useState('clearance');

  const navItems = [
    { id: 'clearance', name: 'Personnel Clearance', icon: FileText, desc: 'Generate property accountability forms' },
    { id: 'chain-of-custody', name: 'Chain of Custody', icon: History, desc: 'Historical timeline for investigations' },
    { id: 'overdue-maintenance', name: 'Overdue Maintenance', icon: AlertCircle, desc: 'Critical safety compliance' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Vertical Navigation */}
      <div className="w-full md:w-72 flex flex-col gap-2 shrink-0 overflow-y-auto pr-2 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 px-2">Reports Hub</h1>
        
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeReport === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveReport(item.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl transition-all text-left ${isActive ? 'bg-pnp-navy dark:bg-[#10182b] text-white shadow-md ring-1 ring-pnp-navy/50' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-sm border border-transparent dark:border-slate-700/50'}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-pnp-gold backdrop-blur-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className={`font-bold ${isActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{item.name}</p>
                <p className={`text-xs mt-1 leading-tight ${isActive ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col pb-6">
        {activeReport === 'clearance' && <PersonnelClearanceReport />}
        {activeReport === 'chain-of-custody' && (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-apple flex items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
            <div>
              <History size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Chain of Custody Module</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">This report module is currently under development. Please check back in a future update.</p>
            </div>
          </div>
        )}
        {activeReport === 'overdue-maintenance' && (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-apple flex items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
            <div>
              <AlertCircle size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Overdue Maintenance Module</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">This report module is currently under development. Please check back in a future update.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
