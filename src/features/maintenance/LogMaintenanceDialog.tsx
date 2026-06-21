import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useFirearmStore } from '../../store/useFirearmStore';

export function LogMaintenanceDialog({ firearmId, open, onOpenChange }: { firearmId: string, open: boolean, onOpenChange: (open: boolean) => void }) {
  const addMaintenanceLog = useFirearmStore(state => state.addMaintenanceLog);
  const [logType, setLogType] = useState('Routine Inspection');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaintenanceLog({
      firearmId,
      logType,
      details,
      performedBy: 'Armorer Admin'
    });
    onOpenChange(false);
    setDetails('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold text-slate-800">Armorer's Log Entry</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 cursor-pointer">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Log Type</label>
              <select className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none bg-white" value={logType} onChange={e => setLogType(e.target.value)}>
                <option>Routine Inspection</option>
                <option>Cleaning</option>
                <option>Parts Replacement</option>
                <option>Repair</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
              <textarea required rows={4} className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={details} onChange={e => setDetails(e.target.value)} />
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer">Cancel</button>
              </Dialog.Close>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-pnp-navy hover:bg-pnp-navy-light rounded-md cursor-pointer">Save Log</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
