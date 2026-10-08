import { useState } from 'react';
import type { AuthUser } from '../../types/auth';
import type { MemberType, Unit, UnitOccupancy } from '../../types/unit';

interface Props {
  units: Unit[];
  residents: AuthUser[];
  loading: boolean;
  error: string | null;
  onStatusChange: (unitId: number, status: UnitOccupancy) => Promise<void>;
  onRemove: (unitId: number) => Promise<void>;
  onLinkMember: (unitId: number, userId: number, type: MemberType) => Promise<void>;
  onUnlinkMember: (unitId: number, userId: number) => Promise<void>;
  onRefresh: () => void;
}

export function UnitList({
  units,
  residents,
  loading,
  error,
  onStatusChange,
  onRemove,
  onLinkMember,
  onUnlinkMember,
  onRefresh,
}: Props) {
  const [linkUnitId, setLinkUnitId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [memberType, setMemberType] = useState<MemberType>('owner');

  const submitLink = async (unitId: number) => {
    if (!selectedUser) return;
    await onLinkMember(unitId, Number(selectedUser), memberType);
    setLinkUnitId(null);
    setSelectedUser('');
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Units</h2>
        <button type="button" onClick={onRefresh} className="text-sm text-slate-600">
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="space-y-4">
        {units.map((unit) => (
          <li key={unit.id} className="rounded-lg border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{unit.label}</p>
                <p className="text-xs text-slate-500">
                  Floor {unit.floor ?? '—'} · {unit.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  value={unit.status}
                  onChange={(e) =>
                    void onStatusChange(unit.id, e.target.value as UnitOccupancy)
                  }
                >
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                </select>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  onClick={() => setLinkUnitId(unit.id)}
                >
                  Link resident
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-700"
                  onClick={() => void onRemove(unit.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            {linkUnitId === unit.id && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <select
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select resident</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.email})
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value as MemberType)}
                >
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-sm text-white"
                  onClick={() => void submitLink(unit.id)}
                >
                  Save link
                </button>
              </div>
            )}

            {unit.members && unit.members.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {unit.members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2">
                    <span>
                      {m.name} · {m.type} · {m.email}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => void onUnlinkMember(unit.id, m.id)}
                    >
                      Unlink
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {!loading && units.length === 0 && (
        <p className="text-sm text-slate-500">No units defined yet.</p>
      )}
    </section>
  );
}
