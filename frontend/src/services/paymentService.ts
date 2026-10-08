import { apiClient } from './apiClient';
import type { PaginatedLedger, Payment, RecordPaymentPayload } from '../types/ledger';

export async function recordPayment(payload: RecordPaymentPayload): Promise<Payment> {
  const { data } = await apiClient.post<{ data: Payment }>('/payments', payload);
  return data.data;
}

export async function fetchPayments(invoiceId?: number): Promise<Payment[]> {
  const { data } = await apiClient.get<{ data: Payment[] }>('/payments', {
    params: invoiceId ? { invoice_id: invoiceId } : undefined,
  });
  return data.data;
}

export async function fetchLedger(unitId?: number): Promise<PaginatedLedger> {
  const { data } = await apiClient.get<PaginatedLedger>('/ledger', {
    params: unitId ? { unit_id: unitId } : undefined,
  });
  return data;
}
