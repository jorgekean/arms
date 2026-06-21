import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useFirearmStore } from '../../store/useFirearmStore';
import type { FirearmStatus } from '../../types/database';

export function StatusChangeDialog({ firearmId, currentStatus, open, onOpenChange }: { firearmId: string, currentStatus: FirearmStatus, open: boolean, onOpenChange: (open: boolean) => void }) {
  const updateStatus = useFirearmStore(state => state.updateStatus);
  const [status, setStatus] = useState<FirearmStatus>(currentStatus);
  const [locationOrAssignee, setLocationOrAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(firearmId, status, locationOrAssignee, 'Admin User');
    onOpenChange(false);
    setLocationOrAssignee('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold text-slate-800">Change Status / Custody</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 cursor-pointer">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Status</label>
              <select className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none bg-white" value={status} onChange={e => setStatus(e.target.value as FirearmStatus)}>
                <option value="Available">Available (Armory)</option>
                <option value="Deployed">Deployed (Issued)</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {status === 'Deployed' ? 'Assignee Personnel ID' : 'Location details'}
              </label>
              <input required type="text" placeholder={status === 'Deployed' ? 'e.g. PO3 Dela Cruz' : 'e.g. Rack A1'} className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={locationOrAssignee} onChange={e => setLocationOrAssignee(e.target.value)} />
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer">Cancel</button>
              </Dialog.Close>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-pnp-navy hover:bg-pnp-navy-light rounded-md cursor-pointer">Update Custody</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
