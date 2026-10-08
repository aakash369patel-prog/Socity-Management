import type { UnitSummary } from './visitor';

export type InvoiceStatus = 'paid' | 'unpaid';

export interface Invoice {
  id: number;
  society_id: number;
  unit_id: number;
  invoice_number: string;
  amount: string;
  due_date: string;
  status: InvoiceStatus;
  paid_at: string | null;
  unit?: UnitSummary;
}

export interface InvoicePayload {
  unit_id: number;
  invoice_number: string;
  amount: number;
  due_date: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
