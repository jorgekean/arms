import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFirearmStore } from '../store/useFirearmStore';
import { ArrowLeft, Edit, Wrench, Activity, UserCircle2, Clock, Settings } from 'lucide-react';
import { calculateAge, formatDateTime, formatDate } from '../utils/date';
import { StatusChangeSheet } from '../features/registry/StatusChangeSheet';
import { LogMaintenanceSheet } from '../features/maintenance/LogMaintenanceSheet';
import { EditFirearmSheet } from '../features/registry/EditFirearmSheet';

const TimelineEvent = ({ date, title, subtitle, handledBy, isLatest }: { date: string, title: string, subtitle: string, handledBy: string, isLatest?: boolean }) => (
  <div className="relative pl-8 pb-5 group">
    {/* Vertical Line */}
    <div className="absolute left-[11px] top-[28px] bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 group-last:bg-transparent dark:group-last:bg-transparent" />
    
    {/* Dot */}
    <div className={`absolute left-[5px] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-slate-50 dark:ring-slate-900 ${isLatest ? 'bg-pnp-navy dark:bg-blue-500 shadow-sm' : 'bg-slate-300 dark:bg-slate-600'} z-10`} />
    
    {/* Content Card (Compact Social Post Style) */}
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/60 dark:border-slate-700 hover:shadow-md transition-shadow relative">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-slate-600 shadow-sm mt-0.5">
          <UserCircle2 size={18} strokeWidth={1.5} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{handledBy}</p>
              <p className="text-[13px] font-semibold text-pnp-navy dark:text-blue-400 leading-tight mt-0.5">{title}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md shrink-0 border border-slate-100 dark:border-slate-700/50">
              <Clock size={12} /> {date}
            </p>
          </div>
          <div className="text-[13px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700/50 leading-relaxed shadow-inner">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export function FirearmDetail() {
  const { id } = useParams();
  const firearm = useFirearmStore(state => state.firearms.find(f => f.id === id));
  
  const allCustodyLogs = useFirearmStore(state => state.custodyLogs);
  const allMaintenanceLogs = useFirearmStore(state => state.maintenanceLogs);

  const custodyLogs = useMemo(() => {
    return allCustodyLogs.filter(l => l.firearmId === id).sort((a,b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime());
  }, [allCustodyLogs, id]);

  const maintenanceLogs = useMemo(() => {
    return allMaintenanceLogs.filter(l => l.firearmId === id).sort((a,b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());
  }, [allMaintenanceLogs, id]);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!firearm) return <div className="p-6 text-slate-500">Firearm not found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Link to="/registry" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-pnp-navy dark:hover:text-blue-400 transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Registry
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-apple p-8 mb-6 relative overflow-hidden transition-colors">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-700 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{firearm.make} {firearm.model}</h1>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${firearm.currentStatus === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : firearm.currentStatus === 'Deployed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : firearm.currentStatus === 'Maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                {firearm.currentStatus}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-900/50 inline-block px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700/50">SN: {firearm.serialNumber}</p>
          </div>
          
          <div className="flex gap-3 flex-wrap justify-end">
            <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl transition-colors text-sm font-semibold cursor-pointer">
              <Settings size={16} /> Edit Details
            </button>
            <button onClick={() => setIsStatusOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-xl transition-colors text-sm font-semibold cursor-pointer">
              <Edit size={16} /> Update Custody
            </button>
            <button onClick={() => setIsMaintenanceOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-pnp-navy dark:bg-slate-800 hover:bg-pnp-navy-light dark:hover:bg-slate-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm cursor-pointer">
              <Wrench size={16} /> Log Maintenance
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Caliber</p>
            <p className="font-semibold text-slate-800 dark:text-white text-lg">{firearm.caliber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Total Rounds</p>
            <p className="font-semibold text-slate-800 dark:text-white text-lg">{firearm.totalRoundsFired || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Acquired / Age</p>
            <p className="font-semibold text-slate-800 dark:text-white text-lg">{formatDate(firearm.acquisitionDate)} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({calculateAge(firearm.acquisitionDate)})</span></p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Location / Assignee</p>
            <p className="font-semibold text-slate-800 dark:text-white text-lg truncate" title={firearm.assigneePersonnelId || firearm.currentLocation || 'Unknown'}>{firearm.assigneePersonnelId || firearm.currentLocation || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Maintenance Due</p>
            <p className={`font-semibold text-lg ${firearm.nextMaintenanceDate && new Date(firearm.nextMaintenanceDate) < new Date() ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
              {firearm.nextMaintenanceDate ? formatDate(firearm.nextMaintenanceDate) : 'Unscheduled'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-1">Interval</p>
            <p className="font-semibold text-slate-800 dark:text-white text-lg">{firearm.maintenanceIntervalMonths ? `Every ${firearm.maintenanceIntervalMonths} mo` : 'Manual'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2 pb-4">
            <Activity className="text-pnp-navy dark:text-blue-400" size={20} /> Immutable Audit Trail
          </h2>
          <div className="py-2">
            {custodyLogs.map((log, index) => (
              <TimelineEvent 
                key={log.id}
                isLatest={index === 0}
                date={formatDateTime(log.actionDate)}
                title={log.actionType}
                subtitle={`Location / Assignee: ${log.locationOrAssignee}`}
                handledBy={log.handledBy}
              />
            ))}
            {custodyLogs.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <p>No custody history recorded.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2 pb-4">
            <Wrench className="text-pnp-gold" size={20} /> Armorer's Log
          </h2>
          <div className="py-2">
            {maintenanceLogs.map((log, index) => (
              <TimelineEvent 
                key={log.id}
                isLatest={index === 0}
                date={formatDateTime(log.logDate)}
                title={log.logType}
                subtitle={log.details}
                handledBy={log.performedBy}
              />
            ))}
            {maintenanceLogs.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <p>No maintenance history recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusChangeSheet 
        firearmId={firearm.id} 
        currentStatus={firearm.currentStatus} 
        open={isStatusOpen} 
        onOpenChange={setIsStatusOpen} 
      />
      <LogMaintenanceSheet 
        firearmId={firearm.id} 
        open={isMaintenanceOpen} 
        onOpenChange={setIsMaintenanceOpen} 
      />
      <EditFirearmSheet 
        firearm={firearm}
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />
    </div>
  );
}
