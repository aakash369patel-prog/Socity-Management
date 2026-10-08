import { useEffect } from 'react';
import type { AuthUser } from '../../types/auth';
import type { Complaint, ComplaintStatus } from '../../types/complaint';

interface Props {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  assignable: AuthUser[];
  onLoadAssignable: () => void;
  onUpdate: (id: number, status: ComplaintStatus, assignedTo: number | null) => Promise<void>;
  onRefresh: () => void;
}

const STATUS_LABEL: Record<ComplaintStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

function badgeClass(status: ComplaintStatus): string {
  if (status === 'resolved') return 'bg-emerald-100 text-emerald-800';
  if (status === 'in_progress') return 'bg-blue-100 text-blue-800';
  return 'bg-amber-100 text-amber-900';
}

export function ComplaintList({
  complaints,
  loading,
  error,
  isAdmin,
  assignable,
  onLoadAssignable,
  onUpdate,
  onRefresh,
}: Props) {
  useEffect(() => {
    if (isAdmin) {
      void onLoadAssignable();
    }
  }, [isAdmin, onLoadAssignable]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Complaints</h2>
        <button type="button" onClick={onRefresh} className="text-sm text-slate-600 hover:text-slate-900">
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="space-y-4">
        {complaints.map((c) => (
          <li key={c.id} className="rounded-lg border border-slate-100 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{c.title}</p>
                <p className="text-xs text-slate-500">
                  {c.category}
                  {c.reporter?.name ? ` · ${c.reporter.name}` : ''}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(c.status)}`}>
                {STATUS_LABEL[c.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.description}</p>

            {isAdmin && (
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  value={c.status}
                  onChange={(e) =>
                    void onUpdate(c.id, e.target.value as ComplaintStatus, c.assigned_to)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  value={c.assigned_to ?? ''}
                  onChange={(e) =>
                    void onUpdate(
                      c.id,
                      c.status,
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">Unassigned</option>
                  {assignable.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!loading && complaints.length === 0 && (
        <p className="text-sm text-slate-500">No complaints yet.</p>
      )}
    </section>
  );
}
