import { apiClient } from './apiClient';
import type { PaginatedResponse, Visitor, VisitorCheckInPayload } from '../types/visitor';

export async function fetchVisitors(params?: {
  status?: string;
  inside_only?: boolean;
  page?: number;
}): Promise<PaginatedResponse<Visitor>> {
  const { data } = await apiClient.get<PaginatedResponse<Visitor>>('/visitors', { params });
  return data;
}

export async function checkInVisitor(payload: VisitorCheckInPayload): Promise<Visitor> {
  const { data } = await apiClient.post<{ data: Visitor }>('/visitors/check-in', payload);
  return data.data;
}

export async function checkOutVisitor(visitorId: number): Promise<Visitor> {
  const { data } = await apiClient.post<{ data: Visitor }>(
    `/visitors/${visitorId}/check-out`
  );
  return data.data;
}
