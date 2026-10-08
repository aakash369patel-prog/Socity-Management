import { useMemo, useState } from 'react';
import { InvoiceCreateForm } from '../../components/admin/InvoiceCreateForm';
import { InvoiceList } from '../../components/admin/InvoiceList';
import { RecordPaymentModal } from '../../components/admin/RecordPaymentModal';
import type { Invoice } from '../../types/invoice';
import { useAuth } from '../../context/AuthContext';
import { useInvoices } from '../../hooks/useInvoices';
import { useUnits } from '../../hooks/useUnits';

export function InvoicesPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const filterParam = statusFilter === 'all' ? undefined : statusFilter;
  const { invoices, loading, error, reload, addInvoice, payInvoice } = useInvoices(filterParam);
  const [payTarget, setPayTarget] = useState<Invoice | null>(null);

  const isAdmin = user?.role === 'society_admin' || user?.role === 'super_admin';
  const { unitOptions, loading: unitsLoading } = useUnits(isAdmin);

  const adminUnitOptions = useMemo(() => unitOptions, [unitOptions]);

  if (user?.role === 'guard') {
    return (
      <p className="p-8 text-slate-600">You do not have access to billing.</p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maintenance invoices</h1>
          <p className="text-slate-600">
            {isAdmin
              ? 'Create bills and record payments for society units.'
              : 'View invoices for your linked units.'}
          </p>
        </div>
        <label className="text-sm text-slate-600">
          Filter
          <select
            className="ml-2 rounded-lg border border-slate-300 px-2 py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
          >
            <option value="all">All</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </label>
      </header>

      {isAdmin && !unitsLoading && (
        <InvoiceCreateForm unitOptions={adminUnitOptions} onSubmit={addInvoice} />
      )}

      <InvoiceList
        invoices={invoices}
        loading={loading}
        error={error}
        canRecordPayment={isAdmin}
        onRecordPayment={isAdmin ? setPayTarget : undefined}
        onRefresh={() => void reload()}
      />

      <RecordPaymentModal
        invoice={payTarget}
        onClose={() => setPayTarget(null)}
        onSubmit={payInvoice}
      />
    </div>
  );
}
