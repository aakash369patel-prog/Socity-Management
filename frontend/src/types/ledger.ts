import type { UnitSummary } from './visitor';

export interface LedgerEntry {
  id: number;
  society_id: number;
  unit_id: number;
  entry_date: string;
  description: string;
  debit: string;
  credit: string;
  reference_type: string;
  reference_id: number;
  unit?: UnitSummary;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: string;
  method: string;
  status: string;
  paid_at: string | null;
  notes: string | null;
}

export interface RecordPaymentPayload {
  invoice_id: number;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'upi' | 'razorpay';
  notes?: string;
  gateway_ref?: string;
}

export interface PaginatedLedger {
  data: LedgerEntry[];
}
