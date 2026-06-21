import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { Firearm, MaintenanceLog, CustodyLog, FirearmStatus } from '../types/database';

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface FirearmState {
  firearms: Firearm[];
  maintenanceLogs: MaintenanceLog[];
  custodyLogs: CustodyLog[];
  
  // Actions
  addFirearm: (firearm: Omit<Firearm, 'id'>, handledBy: string) => void;
  updateStatus: (firearmId: string, status: FirearmStatus, locationOrAssignee: string, handledBy: string) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'logDate'>, overrideNextMaintenanceDate?: string) => void;
  updateFirearm: (id: string, updates: Partial<Omit<Firearm, 'id'>>, handledBy: string) => void;
  bulkUpdateStatus: (firearmIds: string[], status: FirearmStatus, locationOrAssignee: string, handledBy: string) => void;
  seedDataIfNeeded: () => void;
}

const SEED_FIREARMS: Firearm[] = [
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0',
    serialNumber: 'PNP-2023-001',
    make: 'Glock',
    model: '17 Gen4',
    caliber: '9mm',
    acquisitionDate: '2023-01-15',
    currentStatus: 'Deployed',
    currentLocation: null,
    assigneePersonnelId: 'Patrolman Dela Cruz, Juan (PNP-101)',
    totalRoundsFired: 1250,
    maintenanceIntervalMonths: 6,
    nextMaintenanceDate: '2026-07-15'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef1',
    serialNumber: 'PNP-2021-042',
    make: 'Colt',
    model: 'M4 Carbine',
    caliber: '5.56x45mm',
    acquisitionDate: '2021-06-10',
    currentStatus: 'Available',
    currentLocation: 'Camp Crame Armory Rack A1',
    assigneePersonnelId: null,
    totalRoundsFired: 500,
    maintenanceIntervalMonths: 12,
    nextMaintenanceDate: '2026-10-10'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef2',
    serialNumber: 'PNP-2018-112',
    make: 'Beretta',
    model: '92FS',
    caliber: '9mm',
    acquisitionDate: '2018-03-22',
    currentStatus: 'Maintenance',
    currentLocation: 'Armory Repair Bay',
    assigneePersonnelId: null,
    totalRoundsFired: 3450,
    maintenanceIntervalMonths: 6,
    nextMaintenanceDate: '2026-05-22'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef3',
    serialNumber: 'PNP-2019-088',
    make: 'Remington',
    model: '870 Police Magnum',
    caliber: '12 Gauge',
    acquisitionDate: '2019-08-05',
    currentStatus: 'Available',
    currentLocation: 'Camp Crame Armory Rack B2',
    assigneePersonnelId: null,
    totalRoundsFired: 150,
    maintenanceIntervalMonths: null,
    nextMaintenanceDate: null
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef4',
    serialNumber: 'PNP-2022-304',
    make: 'Norinco',
    model: 'CQ-A',
    caliber: '5.56x45mm',
    acquisitionDate: '2022-11-12',
    currentStatus: 'Deployed',
    currentLocation: null,
    assigneePersonnelId: 'Police Corporal Santos, Maria (PNP-102)',
    totalRoundsFired: 890,
    maintenanceIntervalMonths: 6,
    nextMaintenanceDate: '2026-06-25'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef5',
    serialNumber: 'PNP-2024-015',
    make: 'Sig Sauer',
    model: 'P320',
    caliber: '9mm',
    acquisitionDate: '2024-02-28',
    currentStatus: 'Deployed',
    currentLocation: null,
    assigneePersonnelId: 'Patrolman Garcia, Carlos (PNP-104)',
    totalRoundsFired: 300,
    maintenanceIntervalMonths: 12,
    nextMaintenanceDate: '2027-02-28'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef6',
    serialNumber: 'PNP-2020-099',
    make: 'IWI',
    model: 'Tavor X95',
    caliber: '5.56x45mm',
    acquisitionDate: '2020-09-15',
    currentStatus: 'Available',
    currentLocation: 'Camp Crame Armory Rack A3',
    assigneePersonnelId: null,
    totalRoundsFired: 2100,
    maintenanceIntervalMonths: 6,
    nextMaintenanceDate: '2026-04-15'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef7',
    serialNumber: 'PNP-2010-004',
    make: 'Heckler & Koch',
    model: 'MP5A3',
    caliber: '9mm',
    acquisitionDate: '2010-05-10',
    currentStatus: 'Retired',
    currentLocation: 'Deep Storage Vault',
    assigneePersonnelId: null,
    totalRoundsFired: 15400,
    maintenanceIntervalMonths: null,
    nextMaintenanceDate: null
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef8',
    serialNumber: 'PNP-2025-022',
    make: 'Glock',
    model: '19 Gen5',
    caliber: '9mm',
    acquisitionDate: '2025-01-10',
    currentStatus: 'Deployed',
    currentLocation: null,
    assigneePersonnelId: 'PO2 Leo Cruz',
    totalRoundsFired: 450,
    maintenanceIntervalMonths: 6,
    nextMaintenanceDate: '2026-07-10'
  },
  {
    id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef9',
    serialNumber: 'PNP-2016-077',
    make: 'Mossberg',
    model: '500 Tactical',
    caliber: '12 Gauge',
    acquisitionDate: '2016-10-30',
    currentStatus: 'Maintenance',
    currentLocation: 'Armory Repair Bay',
    assigneePersonnelId: null,
    totalRoundsFired: 1890,
    maintenanceIntervalMonths: 12,
    nextMaintenanceDate: '2026-06-20'
  }
];

export const useFirearmStore = create<FirearmState>()(
  persist(
    (set, get) => ({
      firearms: [],
      maintenanceLogs: [],
      custodyLogs: [],

      addFirearm: (firearmData, handledBy) => set((state) => {
        const newFirearm: Firearm = {
          totalRoundsFired: 0,
          ...firearmData,
          id: crypto.randomUUID()
        };
        
        const custodyLog: CustodyLog = {
          id: crypto.randomUUID(),
          firearmId: newFirearm.id,
          actionDate: new Date().toISOString(),
          actionType: 'Registration',
          locationOrAssignee: newFirearm.currentLocation || newFirearm.assigneePersonnelId || 'Camp Crame Armory',
          handledBy
        };

        return {
          firearms: [...state.firearms, newFirearm],
          custodyLogs: [...state.custodyLogs, custodyLog]
        };
      }),

      updateStatus: (firearmId, status, locationOrAssignee, handledBy) => set((state) => {
        const firearms = state.firearms.map(f => {
          if (f.id === firearmId) {
            return {
              ...f,
              currentStatus: status,
              currentLocation: status === 'Available' || status === 'Maintenance' || status === 'Retired' ? locationOrAssignee : null,
              assigneePersonnelId: status === 'Deployed' ? locationOrAssignee : null
            };
          }
          return f;
        });

        const custodyLog: CustodyLog = {
          id: crypto.randomUUID(),
          firearmId,
          actionDate: new Date().toISOString(),
          actionType: `Status Change: ${status}`,
          locationOrAssignee,
          handledBy
        };

        return { firearms, custodyLogs: [...state.custodyLogs, custodyLog] };
      }),

      updateFirearm: (id, updates, handledBy) => set((state) => {
        const firearms = state.firearms.map(f => {
          if (f.id === id) {
            return { ...f, ...updates };
          }
          return f;
        });

        const custodyLog: CustodyLog = {
          id: crypto.randomUUID(),
          firearmId: id,
          actionDate: new Date().toISOString(),
          actionType: 'Record Updated',
          locationOrAssignee: state.firearms.find(f => f.id === id)?.currentLocation || state.firearms.find(f => f.id === id)?.assigneePersonnelId || 'System',
          handledBy
        };

        return { firearms, custodyLogs: [...state.custodyLogs, custodyLog] };
      }),

      bulkUpdateStatus: (firearmIds, status, locationOrAssignee, handledBy) => set((state) => {
        const firearms = state.firearms.map(f => {
          if (firearmIds.includes(f.id)) {
            return {
              ...f,
              currentStatus: status,
              currentLocation: status === 'Available' || status === 'Maintenance' || status === 'Retired' ? locationOrAssignee : null,
              assigneePersonnelId: status === 'Deployed' ? locationOrAssignee : null
            };
          }
          return f;
        });

        const actionDate = new Date().toISOString();
        const newLogs: CustodyLog[] = firearmIds.map(id => ({
          id: crypto.randomUUID(),
          firearmId: id,
          actionDate,
          actionType: `Bulk Status Change: ${status}`,
          locationOrAssignee,
          handledBy
        }));

        return { firearms, custodyLogs: [...state.custodyLogs, ...newLogs] };
      }),

      addMaintenanceLog: (logData, overrideNextMaintenanceDate) => set((state) => {
        const newLog: MaintenanceLog = {
          ...logData,
          id: crypto.randomUUID(),
          logDate: new Date().toISOString()
        };
        
        const firearms = state.firearms.map(f => {
          if (f.id === logData.firearmId) {
            const totalRoundsFired = (f.totalRoundsFired || 0) + (logData.roundsAdded || 0);
            
            let nextMaintenanceDate = f.nextMaintenanceDate;
            if (overrideNextMaintenanceDate) {
              nextMaintenanceDate = overrideNextMaintenanceDate;
            } else if (f.maintenanceIntervalMonths) {
              const nextDate = new Date();
              nextDate.setMonth(nextDate.getMonth() + f.maintenanceIntervalMonths);
              nextMaintenanceDate = nextDate.toISOString().split('T')[0];
            }
            
            return {
              ...f,
              totalRoundsFired,
              nextMaintenanceDate
            };
          }
          return f;
        });

        return { 
          maintenanceLogs: [...state.maintenanceLogs, newLog],
          firearms
        };
      }),

      seedDataIfNeeded: () => {
        // Force reseed if less than 10 items to showcase new features
        if (get().firearms.length < 10) {
          set({
            firearms: SEED_FIREARMS,
            maintenanceLogs: [], // Clear old maintenance logs to avoid orphan references
            custodyLogs: SEED_FIREARMS.map(f => ({
              id: crypto.randomUUID(),
              firearmId: f.id,
              actionDate: f.acquisitionDate + 'T00:00:00Z',
              actionType: 'Initial System Seed',
              locationOrAssignee: f.currentLocation || f.assigneePersonnelId || 'System',
              handledBy: 'Admin'
            }))
          });
        }
      }
    }),
    {
      name: 'firearm-registry-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
