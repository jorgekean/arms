import React, { useState, useEffect } from 'react';
import { useFirearmStore } from '../../store/useFirearmStore';
import { Sheet } from '../../components/ui/Sheet';
import type { Firearm } from '../../types/database';

export function EditFirearmSheet({ firearm, open, onOpenChange }: { firearm: Firearm, open: boolean, onOpenChange: (open: boolean) => void }) {
  const updateFirearm = useFirearmStore(state => state.updateFirearm);
  
  const [formData, setFormData] = useState({
    serialNumber: '',
    make: '',
    model: '',
    caliber: '',
    acquisitionDate: '',
    maintenanceIntervalMonths: '' as number | '',
    nextMaintenanceDate: '',
  });

  useEffect(() => {
    if (firearm && open) {
      setFormData({
        serialNumber: firearm.serialNumber || '',
        make: firearm.make || '',
        model: firearm.model || '',
        caliber: firearm.caliber || '',
        acquisitionDate: firearm.acquisitionDate || '',
        maintenanceIntervalMonths: firearm.maintenanceIntervalMonths || '',
        nextMaintenanceDate: firearm.nextMaintenanceDate || '',
      });
    }
  }, [firearm, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirearm(firearm.id, {
      ...formData,
      maintenanceIntervalMonths: formData.maintenanceIntervalMonths === '' ? null : Number(formData.maintenanceIntervalMonths),
      nextMaintenanceDate: formData.nextMaintenanceDate || null,
    }, 'Admin User');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Edit Firearm Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Make</label>
          <input required type="text" placeholder="e.g. Glock" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model</label>
          <input required type="text" placeholder="e.g. 17 Gen4" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Caliber</label>
          <input required type="text" placeholder="e.g. 9mm" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={formData.caliber} onChange={e => setFormData({...formData, caliber: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Serial Number</label>
          <input required type="text" placeholder="e.g. PNP-2023-001" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Acquisition Date</label>
          <input required type="date" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white dark:[color-scheme:dark]" value={formData.acquisitionDate} onChange={e => setFormData({...formData, acquisitionDate: e.target.value})} />
        </div>
        
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <h3 className="text-sm font-bold text-pnp-navy dark:text-blue-400 mb-4">Maintenance Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maintenance Interval (Months)</label>
                <input type="number" min="1" placeholder="e.g. 6" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white" value={formData.maintenanceIntervalMonths} onChange={e => setFormData({...formData, maintenanceIntervalMonths: e.target.value === '' ? '' : Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Next Maintenance Due</label>
                <input type="date" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white dark:[color-scheme:dark]" value={formData.nextMaintenanceDate} onChange={e => setFormData({...formData, nextMaintenanceDate: e.target.value})} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3">
          <button type="button" onClick={() => onOpenChange(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-pnp-navy dark:bg-blue-900 hover:bg-pnp-navy-light dark:hover:bg-blue-800 rounded-xl transition-colors shadow-sm cursor-pointer">Save Changes</button>
        </div>
      </form>
    </Sheet>
  );
}
