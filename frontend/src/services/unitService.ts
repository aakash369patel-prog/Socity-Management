import { apiClient } from './apiClient';
import type { UnitSummary } from '../types/visitor';

export async function fetchUnits(): Promise<UnitSummary[]> {
  const { data } = await apiClient.get<{ data: UnitSummary[] }>('/units');
  return data.data;
}
