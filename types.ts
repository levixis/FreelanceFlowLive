export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  hourlyRate: number;
  color: string;
  currency: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  startTime: string; // ISO string
  endTime: string | null; // ISO string, null if currently running
  description: string;
  billable: boolean;
}

export interface AppState {
  clients: Client[];
  projects: Project[];
  timeEntries: TimeEntry[];
  activeTimerId: string | null;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid';

export interface InvoiceData {
  clientId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  totalAmount: number;
  summary?: string;
}