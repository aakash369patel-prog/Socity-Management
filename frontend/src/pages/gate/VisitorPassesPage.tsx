import { FormEvent, useEffect, useState } from 'react';
import {
  createVisitorPass,
  fetchVisitorPasses,
  revokeVisitorPass,
} from '../../services/gateService';
import { useUnits } from '../../hooks/useUnits';
import type { VisitorPass } from '../../types/gate';

function defaultWindow() {
  const from = new Date();
  const until = new Date();
  until.setDate(until.getDate() + 1);
  return {
    from: from.toISOString().slice(0, 16),
    until: until.toISOString().slice(0, 16),
  };
}

export function VisitorPassesPage() {
  const { unitOptions } = useUnits(true);
  const [passes, setPasses] = useState<VisitorPass[]>([]);
  const [unitId, setUnitId] = useState<number | ''>('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [window, setWindow] = useState(defaultWindow);
  const [message, setMessage] = useState<string | null>(null);

  const load = () => {
    fetchVisitorPasses().then(setPasses).catch(() => setPasses([]));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (unitId === '') return;
    const pass = await createVisitorPass({
      unit_id: unitId,
      guest_name: guestName,
      guest_phone: guestPhone,
      valid_from: new Date(window.from).toISOString(),
      valid_until: new Date(window.until).toISOString(),
      max_entries: 1,
    });
    setMessage(`Pass created: ${pass.pass_code} (share with guest)`);
    setGuestName('');
    setGuestPhone('');
    load();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Visitor passes</h1>
        <p className="text-slate-600">Pre-approve guests with a time-bound gate code.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Create pass</h2>
        <select
          required
          className="w-full rounded-lg border px-3 py-2"
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
        <input
          required
          placeholder="Guest name"
          className="w-full rounded-lg border px-3 py-2"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
        <input
          required
          placeholder="Guest phone"
          className="w-full rounded-lg border px-3 py-2"
          value={guestPhone}
          onChange={(e) => setGuestPhone(e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Valid from
            <input
              type="datetime-local"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={window.from}
              onChange={(e) => setWindow({ ...window, from: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Valid until
            <input
              type="datetime-local"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={window.until}
              onChange={(e) => setWindow({ ...window, until: e.target.value })}
            />
          </label>
        </div>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Generate pass
        </button>
      </form>

      <ul className="divide-y rounded-xl border bg-white p-4 shadow-sm">
        {passes.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
            <div>
              <p className="font-medium">
                {p.guest_name} · <span className="font-mono text-indigo-700">{p.pass_code}</span>
              </p>
              <p className="text-xs text-slate-500">
                {p.status} · used {p.entries_used}/{p.max_entries}
              </p>
            </div>
            {p.status === 'active' && (
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() => void revokeVisitorPass(p.id).then(load)}
              >
                Revoke
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
