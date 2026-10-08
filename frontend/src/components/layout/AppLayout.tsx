import { Link, Outlet } from 'react-router-dom';
import { SocietySwitcher } from '../admin/SocietySwitcher';
import { useAuth } from '../../context/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold text-slate-900">
              Society MS
            </Link>
            {(user?.role === 'guard' ||
              user?.role === 'society_admin' ||
              user?.role === 'super_admin') && (
              <Link to="/guard" className="text-sm text-slate-600 hover:text-slate-900">
                Gate console
              </Link>
            )}
            {(user?.role === 'society_admin' ||
              user?.role === 'super_admin' ||
              user?.role === 'resident') && (
              <>
                <Link to="/invoices" className="text-sm text-slate-600 hover:text-slate-900">
                  Invoices
                </Link>
                <Link to="/ledger" className="text-sm text-slate-600 hover:text-slate-900">
                  Ledger
                </Link>
                <Link to="/complaints" className="text-sm text-slate-600 hover:text-slate-900">
                  Helpdesk
                </Link>
                <Link to="/visitor-passes" className="text-sm text-slate-600 hover:text-slate-900">
                  Passes
                </Link>
                <Link to="/vehicles" className="text-sm text-slate-600 hover:text-slate-900">
                  Vehicles
                </Link>
              </>
            )}
            {(user?.role === 'society_admin' || user?.role === 'super_admin') && (
              <Link to="/units" className="text-sm text-slate-600 hover:text-slate-900">
                Units
              </Link>
            )}
            {user?.role === 'super_admin' && (
              <Link to="/societies" className="text-sm text-slate-600 hover:text-slate-900">
                Societies
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <SocietySwitcher />
            <span>{user?.name}</span>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
