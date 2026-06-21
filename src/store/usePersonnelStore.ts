import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Personnel, PersonnelStatus } from '../types/database';

interface PersonnelState {
  personnel: Personnel[];
  addPersonnel: (p: Omit<Personnel, 'id'>) => void;
  updatePersonnel: (id: string, updates: Partial<Omit<Personnel, 'id'>>) => void;
  seedDataIfNeeded: () => void;
}

const initialData: Personnel[] = [
  { id: 'pnp-101', badgeNumber: 'PNP-101', rank: 'Patrolman', firstName: 'Juan', lastName: 'Dela Cruz', unit: 'Traffic Division', status: 'Active', contactNumber: '0917-123-4567' },
  { id: 'pnp-102', badgeNumber: 'PNP-102', rank: 'Police Corporal', firstName: 'Maria', lastName: 'Santos', unit: 'CIDG', status: 'Active', contactNumber: '0918-987-6543' },
  { id: 'pnp-103', badgeNumber: 'PNP-103', rank: 'Police Major', firstName: 'Roberto', lastName: 'Reyes', unit: 'Special Action Force', status: 'Active', contactNumber: '0919-555-1234' },
  { id: 'pnp-104', badgeNumber: 'PNP-104', rank: 'Patrolman', firstName: 'Carlos', lastName: 'Garcia', unit: 'Mobile Patrol', status: 'Suspended', contactNumber: '0920-111-2222' },
  { id: 'pnp-105', badgeNumber: 'PNP-105', rank: 'Police Sergeant', firstName: 'Elena', lastName: 'Bautista', unit: 'Intelligence', status: 'Retired', contactNumber: '0922-333-4444' }
];

export const usePersonnelStore = create<PersonnelState>()(
  persist(
    (set) => ({
      personnel: [],

      addPersonnel: (p) => set((state) => {
        const newPersonnel: Personnel = { ...p, id: `pnp-${Date.now()}` };
        return { personnel: [...state.personnel, newPersonnel] };
      }),

      updatePersonnel: (id, updates) => set((state) => ({
        personnel: state.personnel.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      seedDataIfNeeded: () => set((state) => {
        if (state.personnel.length === 0) {
          return { personnel: initialData };
        }
        return state;
      })
    }),
    {
      name: 'arms-personnel-storage',
    }
  )
);
