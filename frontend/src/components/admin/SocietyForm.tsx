import { FormEvent, useState } from 'react';
import type { SocietyPayload } from '../../types/society';

interface Props {
  onSubmit: (payload: SocietyPayload) => Promise<void>;
}

export function SocietyForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await onSubmit({
        name: name.trim(),
        address: address.trim(),
        registration_number: registrationNumber.trim() || null,
      });
      setName('');
      setAddress('');
      setRegistrationNumber('');
      setMessage('Society created.');
    } catch {
      setMessage('Could not create society.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Register society</h2>
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Address
        <textarea required rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Registration number
        <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
      </label>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <button type="submit" disabled={submitting} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50">
        {submitting ? 'Saving…' : 'Create society'}
      </button>
    </form>
  );
}
