import React, { useMemo, useEffect } from 'react';
import { useFirearmStore } from '../store/useFirearmStore';
import { usePersonnelStore } from '../store/usePersonnelStore';
import { Crosshair, ShieldCheck, Wrench, Archive, Activity, CalendarClock, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatDateTime, formatDate } from '../utils/date';
import { Link } from 'react-router-dom';
import { addDays, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const details = data.details;
    const detailKeys = Object.keys(details);

    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl text-sm min-w-[150px]">
        <p className="font-bold text-slate-800 dark:text-white mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">{label} (Total: {data.count})</p>
        {detailKeys.length > 0 ? (
          <ul className="space-y-1">
            {detailKeys.map(key => (
              <li key={key} className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
                <span>{key}</span>
                <span className="font-semibold text-slate-800 dark:text-white">{details[key]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 dark:text-slate-500 italic text-xs">No pending repairs</p>
        )}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const firearms = useFirearmStore(state => state.firearms);
  const custodyLogs = useFirearmStore(state => state.custodyLogs);
  const maintenanceLogs = useFirearmStore(state => state.maintenanceLogs);
  const personnel = usePersonnelStore(state => state.personnel);
  const seedPersonnelData = usePersonnelStore(state => state.seedDataIfNeeded);

  useEffect(() => {
    seedPersonnelData();
  }, [seedPersonnelData]);

  const suspendedHolders = useMemo(() => {
    return firearms.filter(f => 
      f.currentStatus === 'Deployed' && 
      f.assigneePersonnelId && 
      personnel.some(p => p.status === 'Suspended' && f.assigneePersonnelId!.includes(p.badgeNumber))
    );
  }, [firearms, personnel]);

  const stats = useMemo(() => {
    return [
      { 
        title: 'Available / Total', 
        value: `${firearms.filter(f => f.currentStatus === 'Available').length} / ${firearms.length}`, 
        icon: Crosshair, 
        color: 'text-blue-600 dark:text-blue-400', 
        bg: 'bg-blue-100 dark:bg-blue-900/30' 
      },
      { 
        title: 'Deployed', 
        value: firearms.filter(f => f.currentStatus === 'Deployed').length, 
        icon: ShieldCheck, 
        color: 'text-green-600 dark:text-green-400', 
        bg: 'bg-green-100 dark:bg-green-900/30' 
      },
      { 
        title: 'In Maintenance', 
        value: firearms.filter(f => f.currentStatus === 'Maintenance').length, 
        icon: Wrench, 
        color: 'text-yellow-600 dark:text-yellow-400', 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30' 
      },
      { 
        title: 'Retired', 
        value: firearms.filter(f => f.currentStatus === 'Retired').length, 
        icon: Archive, 
        color: 'text-slate-600 dark:text-slate-400', 
        bg: 'bg-slate-100 dark:bg-slate-800' 
      },
    ];
  }, [firearms]);

  // Get recent custody events
  const recentCustody = useMemo(() => {
    return [...custodyLogs]
      .sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime())
      .slice(0, 5);
  }, [custodyLogs]);

  // Get recent maintenance events
  const recentMaintenance = useMemo(() => {
    return [...maintenanceLogs]
      .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime())
      .slice(0, 5);
  }, [maintenanceLogs]);

  const upcomingMaintenance = useMemo(() => {
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return firearms
      .filter(f => f.nextMaintenanceDate && isBefore(new Date(f.nextMaintenanceDate), thirtyDaysFromNow))
      .sort((a, b) => new Date(a.nextMaintenanceDate!).getTime() - new Date(b.nextMaintenanceDate!).getTime())
      .slice(0, 5);
  }, [firearms]);

  const maintenanceTrends = useMemo(() => {
    const today = startOfDay(new Date());
    
    let bucket1 = 0; // 0-3 Days
    let bucket2 = 0; // 4-7 Days
    let bucket3 = 0; // 8-10 Days
    let bucket4 = 0; // 11-15 Days

    const b1Details: Record<string, number> = {};
    const b2Details: Record<string, number> = {};
    const b3Details: Record<string, number> = {};
    const b4Details: Record<string, number> = {};

    const addDetail = (details: Record<string, number>, label: string) => {
      details[label] = (details[label] || 0) + 1;
    };

    firearms.forEach(f => {
      if (!f.nextMaintenanceDate) return;
      const nextDate = startOfDay(new Date(f.nextMaintenanceDate));
      const diffDays = differenceInDays(nextDate, today);
      
      if (diffDays <= 3) {
        bucket1++;
        if (diffDays < 0) addDetail(b1Details, 'Past Due');
        else if (diffDays === 0) addDetail(b1Details, 'Today');
        else if (diffDays === 1) addDetail(b1Details, 'Tomorrow');
        else addDetail(b1Details, `In ${diffDays} Days`);
      }
      else if (diffDays >= 4 && diffDays <= 7) {
        bucket2++;
        addDetail(b2Details, `In ${diffDays} Days`);
      }
      else if (diffDays >= 8 && diffDays <= 10) {
        bucket3++;
        addDetail(b3Details, `In ${diffDays} Days`);
      }
      else if (diffDays >= 11 && diffDays <= 15) {
        bucket4++;
        addDetail(b4Details, `In ${diffDays} Days`);
      }
    });

    return [
      { name: '0-3 Days', count: bucket1, details: b1Details },
      { name: '4-7 Days', count: bucket2, details: b2Details },
      { name: '8-10 Days', count: bucket3, details: b3Details },
      { name: '11-15 Days', count: bucket4, details: b4Details }
    ];
  }, [firearms]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {suspendedHolders.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 shadow-sm">
          <div className="mt-0.5 text-red-600 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-red-800 dark:text-red-300 font-bold text-sm">Critical Security Alert: Suspended Officers with Deployed Weapons</h3>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">
              There {suspendedHolders.length === 1 ? 'is' : 'are'} {suspendedHolders.length} active weapon{suspendedHolders.length === 1 ? '' : 's'} assigned to personnel currently marked as Suspended. Immediate retrieval is required.
            </p>
            <div className="mt-3 space-y-2">
              {suspendedHolders.map(f => (
                <div key={f.id} className="bg-white/60 dark:bg-slate-900/50 border border-red-100 dark:border-red-800/30 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-red-900 dark:text-red-200 text-sm">{f.assigneePersonnelId}</span>
                    <span className="text-xs text-red-700 dark:text-red-400 ml-2 block sm:inline mt-1 sm:mt-0">
                      holding {f.make} {f.model} ({f.serialNumber})
                    </span>
                  </div>
                  <Link to={`/registry/${f.id}`} className="text-xs font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-3 py-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/80 transition-colors shrink-0">
                    Review Custody
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Lifecycle Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">National Headquarters - Camp Crame Armory Status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-6 lg:col-span-1">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-5 flex items-center gap-4 hover:shadow-md transition-shadow flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-tight mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white leading-none">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 flex flex-col lg:col-span-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-pnp-navy dark:text-blue-400" /> Upcoming Repair Trends
          </h2>
          <div className="flex-1 h-[250px] min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Repairs Due"
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} 
                  activeDot={{r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <CalendarClock size={20} className="text-red-500" /> Urgent Maintenance
          </h2>
          <div className="space-y-4">
            {upcomingMaintenance.length > 0 ? upcomingMaintenance.map((f) => {
              const isPastDue = isBefore(new Date(f.nextMaintenanceDate!), new Date());
              return (
                <div key={f.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/registry/${f.id}`} className="text-sm font-bold text-pnp-navy dark:text-blue-400 hover:underline">
                      {f.make} {f.model} ({f.serialNumber})
                    </Link>
                  </div>
                  <p className={`text-sm font-bold mt-1 ${isPastDue ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-500'}`}>
                    {isPastDue ? 'Past Due:' : 'Due:'} {formatDate(f.nextMaintenanceDate!)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Rounds: {f.totalRoundsFired || 0}</p>
                </div>
              );
            }) : <p className="text-sm text-slate-500 dark:text-slate-400">No firearms due for maintenance.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-pnp-navy dark:text-blue-400" /> Recent Custody
          </h2>
          <div className="space-y-4">
            {recentCustody.length > 0 ? recentCustody.map((log) => {
              const firearm = firearms.find(f => f.id === log.firearmId);
              return (
                <div key={log.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/registry/${log.firearmId}`} className="text-sm font-bold text-pnp-navy dark:text-blue-400 hover:underline">
                      {firearm ? `${firearm.make} ${firearm.model} (${firearm.serialNumber})` : 'Unknown Firearm'}
                    </Link>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatDateTime(log.actionDate)}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{log.actionType}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">To: {log.locationOrAssignee} • By: {log.handledBy}</p>
                </div>
              );
            }) : <p className="text-sm text-slate-500 dark:text-slate-400">No recent custody logs.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Wrench size={20} className="text-pnp-gold" /> Armorer Logs
          </h2>
          <div className="space-y-4">
            {recentMaintenance.length > 0 ? recentMaintenance.map((log) => {
              const firearm = firearms.find(f => f.id === log.firearmId);
              return (
                <div key={log.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/registry/${log.firearmId}`} className="text-sm font-bold text-pnp-navy dark:text-blue-400 hover:underline">
                      {firearm ? `${firearm.make} ${firearm.model} (${firearm.serialNumber})` : 'Unknown Firearm'}
                    </Link>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{formatDateTime(log.logDate)}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{log.logType}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{log.details}</p>
                </div>
              );
            }) : <p className="text-sm text-slate-500 dark:text-slate-400">No recent maintenance logs.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
