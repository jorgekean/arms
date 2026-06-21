export type FirearmStatus = 'Available' | 'Deployed' | 'Maintenance' | 'Retired';
export type PersonnelStatus = 'Active' | 'Suspended' | 'Retired' | 'AWOL';

export interface Firearm {
  id: string; // GUID
  serialNumber: string;
  make: string;
  model: string;
  caliber: string;
  acquisitionDate: string; // ISO Date (YYYY-MM-DD)
  currentStatus: FirearmStatus;
  currentLocation: string | null;
  assigneePersonnelId: string | null;
  totalRoundsFired?: number;
  nextMaintenanceDate?: string | null; // ISO Date (YYYY-MM-DD)
  maintenanceIntervalMonths?: number | null; // e.g. 6 for bi-annual
}

export interface MaintenanceLog {
  id: string; // GUID
  firearmId: string; // GUID
  logDate: string; // ISO datetime
  logType: string;
  details: string;
  performedBy: string;
  roundsAdded?: number;
  assignedTo?: string;
  cost?: number;
}

export interface Personnel {
  id: string; // Badge Number or internal ID
  badgeNumber: string;
  rank: string;
  firstName: string;
  lastName: string;
  unit: string;
  status: PersonnelStatus;
  contactNumber: string;
}

export interface CustodyLog {
  id: string; // GUID
  firearmId: string; // GUID
  actionDate: string; // ISO datetime
  actionType: string;
  locationOrAssignee: string;
  handledBy: string;
}
