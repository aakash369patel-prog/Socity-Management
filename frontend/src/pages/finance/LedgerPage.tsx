import { Link } from 'react-router-dom';
import { useLedger } from '../../hooks/useLedger';

export function LedgerPage() {
  const { entries, loading, error, balance, reload } = useLedger();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Unit ledger</h1>
          <p className="text-slate-600">Debits (charges) and credits (payments) per maintenance cycle.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Net balance (debits − credits)</p>
          <p className="text-xl font-semibold text-slate-900">₹{balance.toFixed(2)}</p>
        </div>
      </header>

      <p className="text-sm text-slate-600">
        <Link to="/invoices" className="text-emerald-700 hover:underline">
          Back to invoices
        </Link>
      </p>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-between">
          <h2 className="font-semibold text-slate-900">Entries</h2>
          <button type="button" onClick={() => void reload()} className="text-sm text-slate-600">
            Refresh
          </button>
        </div>
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2">Date</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Debit</th>
              <th className="py-2 text-right">Credit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-slate-100">
                <td className="py-2">{e.entry_date}</td>
                <td className="py-2">{e.unit?.label ?? e.unit_id}</td>
                <td className="py-2">{e.description}</td>
                <td className="py-2 text-right">{Number(e.debit) > 0 ? `₹${e.debit}` : '—'}</td>
                <td className="py-2 text-right">{Number(e.credit) > 0 ? `₹${e.credit}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && entries.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">No ledger entries yet.</p>
        )}
      </section>
    </div>
  );
}
