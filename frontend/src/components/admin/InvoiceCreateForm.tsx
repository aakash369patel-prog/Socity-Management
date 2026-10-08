import { FormEvent, useState } from 'react';
import type { InvoicePayload } from '../../types/invoice';

interface Props {
  unitOptions: { id: number; label: string }[];
  onSubmit: (payload: InvoicePayload) => Promise<void>;
}

function defaultDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return d.toISOString().slice(0, 10);
}

export function InvoiceCreateForm({ unitOptions, onSubmit }: Props) {
  const [unitId, setUnitId] = useState<number | ''>('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (unitId === '') {
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await onSubmit({
        unit_id: unitId,
        invoice_number: invoiceNumber.trim(),
        amount: Number(amount),
        due_date: dueDate,
      });
      setInvoiceNumber('');
      setAmount('');
      setDueDate(defaultDueDate());
      setMessage('Invoice created.');
    } catch {
      setMessage('Could not create invoice. Check number uniqueness and fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Create maintenance invoice</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Unit
          <select
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Select unit</option>
            {unitOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Invoice number
          <input
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="INV-2026-04-001"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Amount (₹)
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Due date
          <input
            required
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>

      {message && (
        <p className="text-sm text-slate-600" role="status">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? 'Creating…' : 'Create invoice'}
      </button>
    </form>
  );
}
