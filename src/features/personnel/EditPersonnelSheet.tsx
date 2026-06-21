import React, { useState, useEffect } from 'react';
import { usePersonnelStore } from '../../store/usePersonnelStore';
import type { Personnel, PersonnelStatus } from '../../types/database';
import { Sheet } from '../../components/ui/Sheet';

export function EditPersonnelSheet({ 
  personnelId, 
  open, 
  onOpenChange 
}: { 
  personnelId: string | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  const personnelList = usePersonnelStore(state => state.personnel);
  const addPersonnel = usePersonnelStore(state => state.addPersonnel);
  const updatePersonnel = usePersonnelStore(state => state.updatePersonnel);

  const [formData, setFormData] = useState<Partial<Personnel>>({});

  useEffect(() => {
    if (open) {
      if (personnelId) {
        const p = personnelList.find(x => x.id === personnelId);
        if (p) setFormData(p);
      } else {
        setFormData({
          badgeNumber: '',
          rank: 'Patrolman',
          firstName: '',
          lastName: '',
          unit: '',
          status: 'Active',
          contactNumber: ''
        });
      }
    }
  }, [open, personnelId, personnelList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personnelId) {
      updatePersonnel(personnelId, formData);
    } else {
      addPersonnel(formData as Omit<Personnel, 'id'>);
    }
    onOpenChange(false);
  };

  const isEditing = !!personnelId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={isEditing ? 'Edit Personnel' : 'Add New Personnel'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Badge / ID Number</label>
          <input required type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
            value={formData.badgeNumber || ''} onChange={e => setFormData({...formData, badgeNumber: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
            <input required type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
              value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
            <input required type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
              value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rank</label>
            <input required type="text" placeholder="e.g. Police Major" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
              value={formData.rank || ''} onChange={e => setFormData({...formData, rank: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit / Division</label>
            <input required type="text" placeholder="e.g. CIDG" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
              value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
              value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value as PersonnelStatus})}>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Retired">Retired</option>
              <option value="AWOL">AWOL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
            <input required type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none dark:text-white" 
              value={formData.contactNumber || ''} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3">
          <button type="button" onClick={() => onOpenChange(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">Cancel</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-pnp-navy dark:bg-blue-600 hover:bg-pnp-navy-light dark:hover:bg-blue-500 rounded-xl transition-colors shadow-sm cursor-pointer">Save Personnel</button>
        </div>
      </form>
    </Sheet>
  );
}
