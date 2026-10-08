import type { Invoice } from '../../types/invoice';

interface Props {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  canRecordPayment: boolean;
  onRecordPayment?: (invoice: Invoice) => void;
  onRefresh?: () => void;
}

function StatusBadge({ status }: { status: Invoice['status'] }) {
  const styles =
    status === 'paid'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-amber-100 text-amber-900';
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}

export function InvoiceList({
  invoices,
  loading,
  error,
  canRecordPayment,
  onRecordPayment,
  onRefresh,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Invoices</h2>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Refresh
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-4 font-medium">Number</th>
              <th className="py-2 pr-4 font-medium">Unit</th>
              <th className="py-2 pr-4 font-medium">Amount</th>
              <th className="py-2 pr-4 font-medium">Due</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              {canRecordPayment && <th className="py-2 font-medium">Action</th>}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-900">{inv.invoice_number}</td>
                <td className="py-3 pr-4 text-slate-600">
                  {inv.unit?.label ??
                    (inv.unit
                      ? `${inv.unit.block_name} - ${inv.unit.flat_number}`
                      : `#${inv.unit_id}`)}
                </td>
                <td className="py-3 pr-4 text-slate-900">₹{inv.amount}</td>
                <td className="py-3 pr-4 text-slate-600">{inv.due_date}</td>
                <td className="py-3 pr-4">
                  <StatusBadge status={inv.status} />
                </td>
                {canRecordPayment && (
                  <td className="py-3">
                    {inv.status === 'unpaid' && onRecordPayment ? (
                      <button
                        type="button"
                        onClick={() => onRecordPayment(inv)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                      >
                        Record payment
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && invoices.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">No invoices yet.</p>
      )}
    </section>
  );
}
