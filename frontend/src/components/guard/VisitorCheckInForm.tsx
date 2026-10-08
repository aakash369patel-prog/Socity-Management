import { FormEvent, useState } from 'react';
import type { VisitorCheckInPayload } from '../../types/visitor';

interface Props {
  onSubmit: (payload: VisitorCheckInPayload) => Promise<void>;
  unitOptions?: { id: number; label: string }[];
}

const initialForm: VisitorCheckInPayload = {
  name: '',
  phone: '',
  purpose: '',
  vehicle_number: '',
  unit_id: undefined,
  entry_type: 'guest',
  vendor_name: '',
};

export function VisitorCheckInForm({ onSubmit, unitOptions = [] }: Props) {
  const [form, setForm] = useState<VisitorCheckInPayload>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await onSubmit({
        ...form,
        unit_id: form.unit_id ? Number(form.unit_id) : null,
        vehicle_number: form.vehicle_number?.trim() || undefined,
        entry_type: form.entry_type ?? 'guest',
        vendor_name:
          form.entry_type === 'delivery' ? form.vendor_name?.trim() || undefined : undefined,
      });
      setForm(initialForm);
      setMessage('Visitor checked in successfully.');
    } catch {
      setMessage('Check-in failed. Please verify details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Log visitor entry</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Visitor name
          <input
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            required
            type="tel"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Visiting unit (optional)
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.unit_id ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                unit_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">— Society / common area —</option>
            {unitOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Entry type
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.entry_type ?? 'guest'}
            onChange={(e) =>
              setForm({
                ...form,
                entry_type: e.target.value as VisitorCheckInPayload['entry_type'],
              })
            }
          >
            <option value="guest">Guest</option>
            <option value="delivery">Delivery</option>
          </select>
        </label>

        {form.entry_type === 'delivery' && (
          <label className="block text-sm font-medium text-slate-700">
            Vendor / company
            <input
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.vendor_name ?? ''}
              onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
              placeholder="Swiggy, Amazon, etc."
            />
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Vehicle number
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.vehicle_number ?? ''}
            onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Purpose
          <textarea
            required
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
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
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Check in visitor'}
      </button>
    </form>
  );
}
