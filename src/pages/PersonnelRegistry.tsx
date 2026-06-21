import React, { useEffect, useState } from 'react';
import { usePersonnelStore } from '../store/usePersonnelStore';
import { Users, Search, Plus } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { EditPersonnelSheet } from '../features/personnel/EditPersonnelSheet';
import type { ColumnDef } from '@tanstack/react-table';
import type { Personnel } from '../types/database';
import { useDebounce } from '../utils/hooks';

export function PersonnelRegistry() {
  const { seedDataIfNeeded, fetchPaginatedPersonnel, personnel: personnelList } = usePersonnelStore();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string | null>(null);

  const [data, setData] = useState<Personnel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    seedDataIfNeeded();
  }, [seedDataIfNeeded]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const result = await fetchPaginatedPersonnel({
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
  }, [fetchPaginatedPersonnel, pagination, debouncedSearch, personnelList]);

  // Reset to page 0 when search changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch]);

  const columns: ColumnDef<Personnel>[] = [
    { accessorKey: 'badgeNumber', header: 'Badge No.' },
    { 
      header: 'Name',
      cell: ({ row }) => <span className="font-bold">{row.original.firstName} {row.original.lastName}</span>
    },
    { accessorKey: 'rank', header: 'Rank' },
    { accessorKey: 'unit', header: 'Unit/Division' },
    { 
      accessorKey: 'status', 
      header: 'Duty Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const colors: Record<string, string> = {
          Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          Suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          Retired: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
          AWOL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-slate-100 text-slate-800'}`}>{status}</span>;
      }
    },
    { accessorKey: 'contactNumber', header: 'Contact' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Personnel Registry</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage officer profiles, statuses, and contact information.</p>
        </div>
        <button 
          onClick={() => { setSelectedPersonnelId(null); setIsSheetOpen(true); }}
          className="flex items-center gap-2 bg-pnp-navy dark:bg-blue-600 hover:bg-pnp-navy-light dark:hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer font-semibold text-sm"
        >
          <Plus size={18} /> Add Personnel
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by badge number or name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 transition-all dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
          <DataTable 
            columns={columns} 
            data={data} 
            onRowClick={(row) => { setSelectedPersonnelId(row.id); setIsSheetOpen(true); }}
            manualPagination={true}
            pageCount={Math.ceil(totalCount / pagination.pageSize)}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      </div>

      <EditPersonnelSheet 
        personnelId={selectedPersonnelId} 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
      />
    </div>
  );
}
