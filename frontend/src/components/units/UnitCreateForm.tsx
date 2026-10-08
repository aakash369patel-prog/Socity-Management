import { FormEvent, useState } from 'react';
import type { UnitOccupancy, UnitPayload } from '../../types/unit';

interface Props {
  onSubmit: (payload: UnitPayload) => Promise<void>;
}

export function UnitCreateForm({ onSubmit }: Props) {
  const [blockName, setBlockName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [status, setStatus] = useState<UnitOccupancy>('vacant');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await onSubmit({
        block_name: blockName.trim(),
        flat_number: flatNumber.trim(),
        floor: floor === '' ? null : Number(floor),
        status,
      });
      setBlockName('');
      setFlatNumber('');
      setFloor('');
      setStatus('vacant');
      setMessage('Unit added.');
    } catch {
      setMessage('Could not add unit (duplicate block/flat?).');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add unit</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Block
          <input
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Flat number
          <input
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Floor
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as UnitOccupancy)}
          >
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>
        </label>
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Create unit'}
      </button>
    </form>
  );
}
