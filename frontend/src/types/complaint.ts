import type { AuthUser } from './auth';

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved';

export interface Complaint {
  id: number;
  society_id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  assigned_to: number | null;
  resolved_at: string | null;
  reporter?: AuthUser;
  assignee?: AuthUser | null;
  created_at?: string;
}

export interface ComplaintPayload {
  title: string;
  description: string;
  category: string;
}

export interface ComplaintUpdatePayload {
  status?: ComplaintStatus;
  assigned_to?: number | null;
}

export interface PaginatedComplaints {
  data: Complaint[];
}
