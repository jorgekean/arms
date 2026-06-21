import React, { useState, useMemo } from 'react';
import { useFirearmStore } from '../store/useFirearmStore';
import { usePersonnelStore } from '../store/usePersonnelStore';
import { Search, UserCheck, Layers, ShieldCheck, CornerDownRight } from 'lucide-react';
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import type { Firearm } from '../types/database';
import { DataTable } from '../components/ui/DataTable';
import { BulkStatusChangeSheet } from '../features/operations/BulkStatusChangeSheet';
import { calculateAge } from '../utils/date';
import { useNavigate } from 'react-router-dom';

export function Operations() {
  const firearms = useFirearmStore(state => state.firearms);
  const updateStatus = useFirearmStore(state => state.updateStatus);
  const personnel = usePersonnelStore(state => state.personnel);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'audit' | 'bulk'>('audit');

  // Audit State
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  
  // Bulk State
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const selectedPersonnel = useMemo(() => personnel.find(p => p.id === selectedPersonnelId), [personnel, selectedPersonnelId]);

  const auditResults = useMemo(() => {
    if (!selectedPersonnel) return [];
    
    return firearms.filter(f => 
      f.currentStatus === 'Deployed' && 
      f.assigneePersonnelId && 
      f.assigneePersonnelId.includes(selectedPersonnel.badgeNumber)
    );
  }, [firearms, selectedPersonnel]);

  const bulkFirearms = useMemo(() => {
    if (statusFilter === 'All') return firearms;
    return firearms.filter(f => f.currentStatus === statusFilter);
  }, [firearms, statusFilter]);

  const handleClearCustody = (id: string) => {
    updateStatus(id, 'Available', 'Camp Crame Armory', 'Admin User');
  };

  const bulkColumns: ColumnDef<Firearm>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="px-1">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-pnp-navy focus:ring-pnp-navy dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 text-pnp-navy focus:ring-pnp-navy dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    },
    { accessorKey: 'serialNumber', header: 'Serial No.' },
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'model', header: 'Model' },
    { 
      accessorKey: 'currentStatus', 
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.currentStatus;
        const colors: Record<string, string> = {
          Available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          Deployed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          Maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          Retired: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || colors.Retired}`}>{status}</span>;
      }
    },
    { 
      header: 'Custody',
      cell: ({ row }) => <span className="truncate max-w-[150px] inline-block">{row.original.assigneePersonnelId || row.original.currentLocation || 'Unknown'}</span>
    }
  ];

  const selectedFirearmIds = useMemo(() => {
    return Object.keys(rowSelection).map(index => bulkFirearms[parseInt(index)].id);
  }, [rowSelection, bulkFirearms]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'audit' ? 'border-pnp-navy text-pnp-navy dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2">
            <UserCheck size={18} /> Personnel Custody Audit
          </div>
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'bulk' ? 'border-pnp-navy text-pnp-navy dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
        >
          <div className="flex items-center gap-2">
            <Layers size={18} /> Bulk Operations
          </div>
        </button>
      </div>

      {activeTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 transition-colors">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Audit Personnel Custody</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Search for an officer to view all firearms currently deployed to them and process immediate returns.</p>
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 transition-all dark:text-white appearance-none"
                  value={selectedPersonnelId}
                  onChange={e => setSelectedPersonnelId(e.target.value)}
                >
                  <option value="" disabled>Select officer...</option>
                  {personnel.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.rank} {p.lastName}, {p.firstName} ({p.badgeNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedPersonnel && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 transition-colors">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Assigned Firearms ({auditResults.length})
              </h3>
              
              {auditResults.length > 0 ? (
                <div className="space-y-3">
                  {auditResults.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{f.make} {f.model}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{f.serialNumber}</span>
                            <span>•</span>
                            <span>Deployed: {calculateAge(f.acquisitionDate)}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleClearCustody(f.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors text-sm font-semibold cursor-pointer"
                      >
                        <CornerDownRight size={16} /> Return to Armory
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  No deployed firearms found for this personnel.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Bulk Operations</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Select multiple firearms to update their status or custody simultaneously.</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                className="p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 focus:outline-none transition-all dark:text-white text-sm"
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setRowSelection({}); // Clear selection on filter change
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Deployed">Deployed</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {selectedFirearmIds.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 mb-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <p className="text-blue-800 dark:text-blue-300 font-medium">
                {selectedFirearmIds.length} firearm{selectedFirearmIds.length > 1 ? 's' : ''} selected
              </p>
              <button 
                onClick={() => setIsBulkSheetOpen(true)}
                className="bg-pnp-navy dark:bg-blue-600 hover:bg-pnp-navy-light dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Bulk Update Status
              </button>
            </div>
          )}

          <div className="border border-slate-100 dark:border-slate-700/50 rounded-2xl overflow-hidden">
            <DataTable 
              columns={bulkColumns} 
              data={bulkFirearms} 
              onRowClick={(row) => navigate(`/registry/${row.id}`)}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
        </div>
      )}

      <BulkStatusChangeSheet 
        firearmIds={selectedFirearmIds}
        open={isBulkSheetOpen}
        onOpenChange={setIsBulkSheetOpen}
        onComplete={() => setRowSelection({})}
      />
    </div>
  );
}
