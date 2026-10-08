import { apiClient } from './apiClient';
import type {
  Complaint,
  ComplaintPayload,
  ComplaintUpdatePayload,
  PaginatedComplaints,
} from '../types/complaint';
import type { AuthUser } from '../types/auth';

export async function fetchComplaints(params?: {
  status?: string;
}): Promise<PaginatedComplaints> {
  const { data } = await apiClient.get<PaginatedComplaints>('/complaints', { params });
  return data;
}

export async function createComplaint(payload: ComplaintPayload): Promise<Complaint> {
  const { data } = await apiClient.post<{ data: Complaint }>('/complaints', payload);
  return data.data;
}

export async function updateComplaint(
  id: number,
  payload: ComplaintUpdatePayload
): Promise<Complaint> {
  const { data } = await apiClient.patch<{ data: Complaint }>(`/complaints/${id}`, payload);
  return data.data;
}

export async function fetchAssignableUsers(): Promise<AuthUser[]> {
  const { data } = await apiClient.get<{ data: AuthUser[] }>('/users/assignable');
  return data.data;
}
