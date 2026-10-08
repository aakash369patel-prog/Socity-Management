import { FormEvent, useState } from 'react';
import type { ComplaintPayload } from '../../types/complaint';

const CATEGORIES = ['Plumbing', 'Electrical', 'Lift', 'Security', 'Common area', 'Other'];

interface Props {
  onSubmit: (payload: ComplaintPayload) => Promise<void>;
}

export function ComplaintCreateForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await onSubmit({ title, description, category });
      setTitle('');
      setDescription('');
      setMessage('Complaint submitted.');
    } catch {
      setMessage('Could not submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Raise a complaint</h2>

      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Category
        <select
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      {message && <p className="text-sm text-slate-600">{message}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit complaint'}
      </button>
    </form>
  );
}
