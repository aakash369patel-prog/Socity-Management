import { apiClient } from './apiClient';
import type { VisitorPass, VisitorPassPayload, Vehicle, VehiclePayload } from '../types/gate';
import type { Visitor } from '../types/visitor';

export async function fetchVisitorPasses(): Promise<VisitorPass[]> {
  const { data } = await apiClient.get<{ data: VisitorPass[] }>('/visitor-passes');
  return data.data;
}

export async function createVisitorPass(payload: VisitorPassPayload): Promise<VisitorPass> {
  const { data } = await apiClient.post<{ data: VisitorPass }>('/visitor-passes', payload);
  return data.data;
}

export async function revokeVisitorPass(id: number): Promise<VisitorPass> {
  const { data } = await apiClient.post<{ data: VisitorPass }>(`/visitor-passes/${id}/revoke`);
  return data.data;
}

export async function redeemVisitorPass(passCode: string): Promise<Visitor> {
  const { data } = await apiClient.post<{ data: Visitor }>('/visitor-passes/redeem', {
    pass_code: passCode,
  });
  return data.data;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<{ data: Vehicle[] }>('/vehicles');
  return data.data;
}

export async function registerVehicle(payload: VehiclePayload): Promise<Vehicle> {
  const { data } = await apiClient.post<{ data: Vehicle }>('/vehicles', payload);
  return data.data;
}

export async function removeVehicle(id: number): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}
