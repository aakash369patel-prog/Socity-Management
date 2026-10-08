import { SocietyForm } from '../../components/admin/SocietyForm';
import { useAuth } from '../../context/AuthContext';
import { useSocietiesAdmin } from '../../hooks/useSocietiesAdmin';

export function SocietiesPage() {
  const { user, setCurrentSociety } = useAuth();
  const { societies, loading, error, reload, add, remove } = useSocietiesAdmin();

  if (user?.role !== 'super_admin') {
    return <p className="p-8 text-slate-600">Platform admin access only.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Societies</h1>
        <p className="text-slate-600">Manage RWAs on the platform. Use the header switcher to set working context.</p>
      </header>

      <SocietyForm onSubmit={add} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-between">
          <h2 className="text-lg font-semibold">All societies</h2>
          <button type="button" onClick={() => void reload()} className="text-sm text-slate-600">
            Refresh
          </button>
        </div>
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <ul className="divide-y divide-slate-100">
          {societies.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="text-sm text-slate-500">{s.address}</p>
                <p className="text-xs text-slate-400">
                  {s.registration_number ?? 'No reg. no.'} · {s.units_count ?? 0} units · {s.users_count ?? 0} users
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  onClick={() => void setCurrentSociety(s.id)}
                >
                  Work in this society
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-700"
                  onClick={() => void remove(s.id)}
                >
                  Archive
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
