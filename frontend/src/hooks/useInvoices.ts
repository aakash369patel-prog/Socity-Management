import { useCallback, useEffect, useState } from 'react';
import { createInvoice, fetchInvoices } from '../services/invoiceService';
import { recordPayment } from '../services/paymentService';
import type { RecordPaymentPayload } from '../types/ledger';
import type { Invoice, InvoicePayload } from '../types/invoice';

export function useInvoices(statusFilter?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchInvoices(
        statusFilter ? { status: statusFilter } : undefined
      );
      setInvoices(result.data ?? []);
    } catch {
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const addInvoice = async (payload: InvoicePayload) => {
    const invoice = await createInvoice(payload);
    setInvoices((prev) => [invoice, ...prev]);
    return invoice;
  };

  const payInvoice = async (payload: RecordPaymentPayload) => {
    await recordPayment(payload);
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === payload.invoice_id ? { ...inv, status: 'paid' as const } : inv
      )
    );
  };

  return { invoices, loading, error, reload: load, addInvoice, payInvoice };
}
