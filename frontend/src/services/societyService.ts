import { apiClient } from './apiClient';
import type { AuthUser } from '../types/auth';
import type { Society, SocietyPayload } from '../types/society';

export async function fetchSocieties(): Promise<Society[]> {
  const { data } = await apiClient.get<{ data: Society[] }>('/societies');
  return data.data;
}

export async function createSociety(payload: SocietyPayload): Promise<Society> {
  const { data } = await apiClient.post<{ data: Society }>('/societies', payload);
  return data.data;
}

export async function updateSociety(id: number, payload: Partial<SocietyPayload>): Promise<Society> {
  const { data } = await apiClient.patch<{ data: Society }>(`/societies/${id}`, payload);
  return data.data;
}

export async function deleteSociety(id: number): Promise<void> {
  await apiClient.delete(`/societies/${id}`);
}

export async function switchCurrentSociety(societyId: number): Promise<AuthUser> {
  const { data } = await apiClient.put<{ data: AuthUser }>('/user/current-society', {
    society_id: societyId,
  });
  return data.data;
}
