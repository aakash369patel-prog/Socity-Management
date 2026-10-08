import { FormEvent, useState } from 'react';
import type { Invoice } from '../../types/invoice';
import type { RecordPaymentPayload } from '../../types/ledger';

const METHODS: RecordPaymentPayload['method'][] = ['cash', 'bank_transfer', 'upi', 'razorpay'];

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
  onSubmit: (payload: RecordPaymentPayload) => Promise<void>;
}

export function RecordPaymentModal({ invoice, onClose, onSubmit }: Props) {
  const [method, setMethod] = useState<RecordPaymentPayload['method']>('upi');
  const [notes, setNotes] = useState('');
  const [gatewayRef, setGatewayRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        invoice_id: invoice.id,
        amount: Number(invoice.amount),
        method,
        notes: notes || undefined,
        gateway_ref: method === 'razorpay' ? gatewayRef || undefined : undefined,
      });
      onClose();
    } catch {
      setError('Payment failed. Amount must match invoice total.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-slate-900">Record payment</h2>
        <p className="text-sm text-slate-600">
          {invoice.invoice_number} · ₹{invoice.amount}
        </p>

        <label className="block text-sm font-medium text-slate-700">
          Method
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={method}
            onChange={(e) => setMethod(e.target.value as RecordPaymentPayload['method'])}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        {method === 'razorpay' && (
          <label className="block text-sm font-medium text-slate-700">
            Razorpay payment ID
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={gatewayRef}
              onChange={(e) => setGatewayRef(e.target.value)}
              placeholder="pay_..."
            />
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Notes
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Confirm payment'}
          </button>
        </div>
      </form>
    </div>
  );
}
