import { useState } from 'react';
import { ComplaintCreateForm } from '../../components/complaints/ComplaintCreateForm';
import { ComplaintList } from '../../components/complaints/ComplaintList';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../hooks/useComplaints';
import type { ComplaintStatus } from '../../types/complaint';

export function ComplaintsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');
  const isAdmin = user?.role === 'society_admin' || user?.role === 'super_admin';

  const filter = statusFilter === 'all' ? undefined : statusFilter;
  const {
    complaints,
    assignable,
    loading,
    error,
    reload,
    loadAssignable,
    addComplaint,
    patchComplaint,
  } = useComplaints(filter);

  const handleUpdate = async (id: number, status: ComplaintStatus, assignedTo: number | null) => {
    await patchComplaint(id, { status, assigned_to: assignedTo });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Helpdesk</h1>
          <p className="text-slate-600">
            {isAdmin
              ? 'Track resident complaints and update workflow status.'
              : 'Report maintenance issues for your society.'}
          </p>
        </div>
        <label className="text-sm text-slate-600">
          Status
          <select
            className="ml-2 rounded-lg border border-slate-300 px-2 py-1"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as 'all' | ComplaintStatus)
            }
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      </header>

      {!isAdmin && <ComplaintCreateForm onSubmit={addComplaint} />}

      {isAdmin && (
        <p className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
          Admins manage complaints below. Residents submit new tickets from their account.
        </p>
      )}

      {(user?.role === 'resident' || isAdmin) && (
        <ComplaintList
          complaints={complaints}
          loading={loading}
          error={error}
          isAdmin={isAdmin}
          assignable={assignable}
          onLoadAssignable={() => void loadAssignable()}
          onUpdate={handleUpdate}
          onRefresh={() => void reload()}
        />
      )}

      {user?.role === 'guard' && (
        <p className="text-slate-600">Gate staff cannot access the helpdesk module.</p>
      )}
    </div>
  );
}
