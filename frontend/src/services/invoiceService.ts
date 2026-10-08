import { apiClient } from './apiClient';
import type { Invoice, InvoicePayload, PaginatedResponse } from '../types/invoice';

export async function fetchInvoices(params?: {
  status?: string;
  page?: number;
}): Promise<PaginatedResponse<Invoice>> {
  const { data } = await apiClient.get<PaginatedResponse<Invoice>>('/invoices', { params });
  return data;
}

export async function createInvoice(payload: InvoicePayload): Promise<Invoice> {
  const { data } = await apiClient.post<{ data: Invoice }>('/invoices', payload);
  return data.data;
}

/** @deprecated Prefer recordPayment via paymentService for ledger accuracy */
export async function markInvoicePaid(invoiceId: number): Promise<Invoice> {
  const { data } = await apiClient.patch<{ data: Invoice }>(`/invoices/${invoiceId}`, {
    status: 'paid',
  });
  return data.data;
}
