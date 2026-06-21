import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useFirearmStore } from '../../store/useFirearmStore';

export function RegisterFirearmDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const addFirearm = useFirearmStore(state => state.addFirearm);
  
  const [formData, setFormData] = useState({
    serialNumber: '',
    make: '',
    model: '',
    caliber: '',
    acquisitionDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFirearm({
      ...formData,
      currentStatus: 'Available',
      currentLocation: 'Camp Crame Armory',
      assigneePersonnelId: null
    }, 'Admin User');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out fade-in fade-out z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out zoom-in-95 zoom-out-95">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold text-slate-800">Register Firearm (Birth Certificate)</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
              <input required type="text" className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Caliber</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={formData.caliber} onChange={e => setFormData({...formData, caliber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Date</label>
                <input required type="date" className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-pnp-navy focus:outline-none" value={formData.acquisitionDate} onChange={e => setFormData({...formData, acquisitionDate: e.target.value})} />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer">Cancel</button>
              </Dialog.Close>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-pnp-navy hover:bg-pnp-navy-light rounded-md transition-colors cursor-pointer">Register Asset</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
