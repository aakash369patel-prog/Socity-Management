import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';

interface Props {
  allowed: UserRole[];
  redirectTo?: string;
}

export function RoleRoute({ allowed, redirectTo = '/' }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
