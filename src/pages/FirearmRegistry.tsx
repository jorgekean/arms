import React, { useState, useEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useFirearmStore } from '../store/useFirearmStore';
import type { Firearm } from '../types/database';
import { DataTable } from '../components/ui/DataTable';
import { RegisterFirearmSheet } from '../features/registry/RegisterFirearmSheet';
import { Plus, Search } from 'lucide-react';
import { calculateAge } from '../utils/date';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../utils/hooks';

export function FirearmRegistry() {
  const fetchPaginatedFirearms = useFirearmStore(state => state.fetchPaginatedFirearms);
  const firearmsList = useFirearmStore(state => state.firearms); // For re-fetching if global state changes
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const navigate = useNavigate();

  const [data, setData] = useState<Firearm[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  useEffect(() => {
    let active = true;
    const load = async () => {
      const result = await fetchPaginatedFirearms({ 
        pageIndex: pagination.pageIndex, 
        pageSize: pagination.pageSize, 
        search: debouncedSearch 
      });
      if (active) {
        setData(result.data);
        setTotalCount(result.totalCount);
      }
    };
    load();
    return () => { active = false; };
  }, [fetchPaginatedFirearms, pagination, debouncedSearch, firearmsList]);

  // Reset to page 0 when search changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch]);

  const columns: ColumnDef<Firearm>[] = [
    { accessorKey: 'serialNumber', header: 'Serial No.' },
    { accessorKey: 'make', header: 'Make' },
    { accessorKey: 'model', header: 'Model' },
    { accessorKey: 'caliber', header: 'Caliber' },
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
      header: 'Age',
      cell: ({ row }) => <span>{calculateAge(row.original.acquisitionDate)}</span>
    },
    { 
      header: 'Custody',
      cell: ({ row }) => <span>{row.original.assigneePersonnelId || row.original.currentLocation || 'Unknown'}</span>
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 transition-colors">
        <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Firearm Registry</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage the complete inventory of PNP weapons.</p>
        </div>
        <button 
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-2 bg-pnp-navy dark:bg-slate-800 hover:bg-pnp-navy-light dark:hover:bg-slate-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm cursor-pointer"
        >
          <Plus size={18} />
          Register Firearm
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by serial number, make, model, or assignee..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 transition-all dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-slate-100 dark:border-slate-700/50 rounded-2xl overflow-hidden">
        <DataTable 
          columns={columns} 
          data={data} 
          onRowClick={(row) => navigate(`/registry/${row.id}`)}
          manualPagination={true}
          pageCount={Math.ceil(totalCount / pagination.pageSize)}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      <RegisterFirearmSheet 
        open={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen} 
      />
    </div>
  );
}
