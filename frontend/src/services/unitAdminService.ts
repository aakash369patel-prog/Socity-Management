import { apiClient } from './apiClient';
import type { AttachMemberPayload, Unit, UnitPayload } from '../types/unit';
import type { AuthUser } from '../types/auth';

export async function fetchUnitsAdmin(): Promise<Unit[]> {
  const { data } = await apiClient.get<{ data: Unit[] }>('/units');
  return data.data;
}

export async function createUnit(payload: UnitPayload): Promise<Unit> {
  const { data } = await apiClient.post<{ data: Unit }>('/units', payload);
  return data.data;
}

export async function updateUnit(id: number, payload: Partial<UnitPayload>): Promise<Unit> {
  const { data } = await apiClient.patch<{ data: Unit }>(`/units/${id}`, payload);
  return data.data;
}

export async function deleteUnit(id: number): Promise<void> {
  await apiClient.delete(`/units/${id}`);
}

export async function attachUnitMember(unitId: number, payload: AttachMemberPayload): Promise<Unit> {
  const { data } = await apiClient.post<{ data: Unit }>(`/units/${unitId}/members`, payload);
  return data.data;
}

export async function detachUnitMember(unitId: number, userId: number): Promise<Unit> {
  const { data } = await apiClient.delete<{ data: Unit }>(`/units/${unitId}/members/${userId}`);
  return data.data;
}

export async function fetchSocietyResidents(): Promise<AuthUser[]> {
  const { data } = await apiClient.get<{ data: AuthUser[] }>('/users/residents');
  return data.data;
}
