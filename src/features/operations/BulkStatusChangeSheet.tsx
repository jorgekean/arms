import React, { useState } from 'react';
import { useFirearmStore } from '../../store/useFirearmStore';
import { usePersonnelStore } from '../../store/usePersonnelStore';
import type { FirearmStatus } from '../../types/database';
import { Sheet } from '../../components/ui/Sheet';

export function BulkStatusChangeSheet({ firearmIds, open, onOpenChange, onComplete }: { firearmIds: string[], open: boolean, onOpenChange: (open: boolean) => void, onComplete: () => void }) {
  const bulkUpdateStatus = useFirearmStore(state => state.bulkUpdateStatus);
  const personnel = usePersonnelStore(state => state.personnel);
  const [status, setStatus] = useState<FirearmStatus>('Available');
  const [locationOrAssignee, setLocationOrAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bulkUpdateStatus(firearmIds, status, locationOrAssignee, 'Admin User');
    onOpenChange(false);
    setLocationOrAssignee('');
    onComplete();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={`Bulk Update (${firearmIds.length} items)`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            You are about to change the custody/status for <strong>{firearmIds.length}</strong> firearms simultaneously. This action will be logged for each firearm individually.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Status for All</label>
          <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={status} onChange={e => setStatus(e.target.value as FirearmStatus)}>
            <option value="Available">Available (Armory)</option>
            <option value="Deployed">Deployed (Issued)</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {status === 'Deployed' ? 'Assignee Personnel ID (for all)' : 'Location details (for all)'}
          </label>
          {status === 'Deployed' ? (
            <select required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={locationOrAssignee} onChange={e => setLocationOrAssignee(e.target.value)}>
              <option value="" disabled>Select personnel...</option>
              {personnel.map(p => (
                <option key={p.id} value={`${p.rank} ${p.lastName}, ${p.firstName} (${p.badgeNumber})`} disabled={p.status === 'Suspended'}>
                  {p.rank} {p.lastName}, {p.firstName} - {p.badgeNumber} {p.status === 'Suspended' ? '(SUSPENDED)' : ''}
                </option>
              ))}
            </select>
          ) : (
            <input required type="text" placeholder="e.g. Main Armory Rack B" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={locationOrAssignee} onChange={e => setLocationOrAssignee(e.target.value)} />
          )}
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3">
          <button type="button" onClick={() => onOpenChange(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-pnp-navy dark:bg-blue-900 hover:bg-pnp-navy-light dark:hover:bg-blue-800 rounded-xl transition-colors shadow-sm cursor-pointer">Confirm Bulk Update</button>
        </div>
      </form>
    </Sheet>
  );
}
