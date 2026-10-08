import axios from 'axios';
import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function loginErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      const base = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8002/api/v1';
      return `Cannot reach API at ${base}. Start backend: cd backend_staging && php artisan serve --port=8002`;
    }
    if (err.response.status === 401) {
      return 'Invalid email or password.';
    }
    return err.response.data?.message ?? `Login failed (${err.response.status}).`;
  }
  return 'Login failed.';
}

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('guard@demo.local');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <p className="mb-2 font-medium text-slate-800">
            Demo accounts — password for all: <code className="rounded bg-white px-1">password</code>
          </p>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-1 pr-2">Role</th>
                <th className="pb-1">Email (ID)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-0.5 pr-2">Super Admin</td>
                <td>
                  <button
                    type="button"
                    className="text-indigo-700 hover:underline"
                    onClick={() => setEmail('super@demo.local')}
                  >
                    super@demo.local
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 pr-2">Society Admin</td>
                <td>
                  <button
                    type="button"
                    className="text-indigo-700 hover:underline"
                    onClick={() => setEmail('admin@demo.local')}
                  >
                    admin@demo.local
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 pr-2">Guard</td>
                <td>
                  <button
                    type="button"
                    className="text-indigo-700 hover:underline"
                    onClick={() => setEmail('guard@demo.local')}
                  >
                    guard@demo.local
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 pr-2">Resident</td>
                <td>
                  <button
                    type="button"
                    className="text-indigo-700 hover:underline"
                    onClick={() => setEmail('resident@demo.local')}
                  >
                    resident@demo.local
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">
          API: {import.meta.env.VITE_API_URL ?? '/api/v1 (proxied to port 8002)'}
        </p>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
