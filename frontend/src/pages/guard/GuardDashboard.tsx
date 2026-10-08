import { PassRedeemForm } from '../../components/guard/PassRedeemForm';
import { VisitorCheckInForm } from '../../components/guard/VisitorCheckInForm';
import { useAuth } from '../../context/AuthContext';
import { useUnits } from '../../hooks/useUnits';
import { useVisitors } from '../../hooks/useVisitors';

export function GuardDashboard() {
  const { user } = useAuth();
  const { visitors, loading, error, checkIn, checkOut, redeemPass, reload } = useVisitors(true);
  const { unitOptions } = useUnits();

  if (user?.role !== 'guard' && user?.role !== 'society_admin' && user?.role !== 'super_admin') {
    return (
      <p className="p-8 text-slate-600">This dashboard is for gate security staff only.</p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Gate console</h1>
        <p className="text-slate-600">Welcome, {user?.name}. Log entries and check-outs.</p>
      </header>

      <PassRedeemForm onRedeem={redeemPass} />

      <VisitorCheckInForm onSubmit={checkIn} unitOptions={unitOptions} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Currently inside</h2>
          <button
            type="button"
            onClick={() => void reload()}
            className="text-sm text-emerald-700 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <ul className="divide-y divide-slate-100">
          {visitors.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-slate-900">{v.name}</p>
                <p className="text-sm text-slate-500">
                  {v.unit?.label ?? 'Common'} · {v.phone} · {v.entry_type ?? 'guest'}
                  {v.vendor_name ? ` · ${v.vendor_name}` : ''} · {v.purpose}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void checkOut(v.id)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                Check out
              </button>
            </li>
          ))}
          {!loading && visitors.length === 0 && (
            <li className="py-4 text-sm text-slate-500">No visitors inside the gate.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
