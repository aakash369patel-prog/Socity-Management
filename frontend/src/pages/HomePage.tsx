import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Signed in as <strong>{user?.name}</strong> ({user?.role})
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {(user?.role === 'guard' ||
          user?.role === 'society_admin' ||
          user?.role === 'super_admin') && (
          <Link
            to="/guard"
            className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Open gate console
          </Link>
        )}
        {(user?.role === 'society_admin' ||
          user?.role === 'super_admin' ||
          user?.role === 'resident') && (
          <>
            <Link
              to="/invoices"
              className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              View invoices
            </Link>
            <Link
              to="/complaints"
              className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-white"
            >
              Helpdesk
            </Link>
          </>
        )}
        {(user?.role === 'society_admin' || user?.role === 'super_admin') && (
          <Link
            to="/units"
            className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-white"
          >
            Manage units
          </Link>
        )}
        {user?.role === 'super_admin' && (
          <Link
            to="/societies"
            className="inline-block rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100"
          >
            Platform societies
          </Link>
        )}
      </div>
    </div>
  );
}
