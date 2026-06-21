import React, { useState } from 'react';
import { useFirearmStore } from '../../store/useFirearmStore';
import { Sheet } from '../../components/ui/Sheet';

export function LogMaintenanceSheet({ firearmId, open, onOpenChange }: { firearmId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
  const addMaintenanceLog = useFirearmStore(state => state.addMaintenanceLog);
  const [logType, setLogType] = useState('Routine Inspection');
  const [details, setDetails] = useState('');
  const [roundsAdded, setRoundsAdded] = useState<number | ''>('');
  const [overrideNextDate, setOverrideNextDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceLog({
      firearmId,
      logType,
      details,
      roundsAdded: roundsAdded === '' ? 0 : Number(roundsAdded),
      performedBy: 'Armorer Chief'
    }, overrideNextDate || undefined);
    onOpenChange(false);
    setDetails('');
    setRoundsAdded('');
    setOverrideNextDate('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Log Maintenance">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maintenance Type</label>
          <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={logType} onChange={e => setLogType(e.target.value)}>
            <option value="Routine Inspection">Routine Inspection</option>
            <option value="Cleaning">Cleaning & Lubrication</option>
            <option value="Repair">Part Repair / Replacement</option>
            <option value="Test Fire">Test Fire</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Notes</label>
          <textarea required rows={3} placeholder="Describe the maintenance performed..." className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all resize-none dark:text-white" value={details} onChange={e => setDetails(e.target.value)} />
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rounds Fired</label>
            <input type="number" min="0" placeholder="e.g. 50" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={roundsAdded} onChange={e => setRoundsAdded(e.target.value === '' ? '' : Number(e.target.value))} />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Since last maintenance</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Schedule Next</label>
            <input type="date" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white dark:[color-scheme:dark]" value={overrideNextDate} onChange={e => setOverrideNextDate(e.target.value)} />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Leave empty to use default interval</p>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3">
          <button type="button" onClick={() => onOpenChange(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-pnp-navy dark:bg-blue-900 hover:bg-pnp-navy-light dark:hover:bg-blue-800 rounded-xl transition-colors shadow-sm cursor-pointer">Save Log</button>
        </div>
      </form>
    </Sheet>
  );
}
