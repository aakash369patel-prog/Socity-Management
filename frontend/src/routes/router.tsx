import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/routing/ProtectedRoute';
import { RoleRoute } from '../components/routing/RoleRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { InvoicesPage } from '../pages/admin/InvoicesPage';
import { LedgerPage } from '../pages/finance/LedgerPage';
import { SocietiesPage } from '../pages/admin/SocietiesPage';
import { UnitsPage } from '../pages/admin/UnitsPage';
import { ComplaintsPage } from '../pages/complaints/ComplaintsPage';
import { GuardDashboard } from '../pages/guard/GuardDashboard';
import { VehiclesPage } from '../pages/gate/VehiclesPage';
import { VisitorPassesPage } from '../pages/gate/VisitorPassesPage';
import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          {
            element: (
              <RoleRoute
                allowed={['guard', 'society_admin', 'super_admin']}
                redirectTo="/"
              />
            ),
            children: [{ path: '/guard', element: <GuardDashboard /> }],
          },
          {
            element: (
              <RoleRoute
                allowed={['society_admin', 'super_admin', 'resident']}
                redirectTo="/"
              />
            ),
            children: [
              { path: '/visitor-passes', element: <VisitorPassesPage /> },
              { path: '/vehicles', element: <VehiclesPage /> },
            ],
          },
          {
            element: (
              <RoleRoute
                allowed={['society_admin', 'super_admin', 'resident']}
                redirectTo="/"
              />
            ),
            children: [
              { path: '/invoices', element: <InvoicesPage /> },
              { path: '/ledger', element: <LedgerPage /> },
            ],
          },
          {
            element: (
              <RoleRoute
                allowed={['society_admin', 'super_admin', 'resident']}
                redirectTo="/"
              />
            ),
            children: [{ path: '/complaints', element: <ComplaintsPage /> }],
          },
          {
            element: (
              <RoleRoute allowed={['society_admin', 'super_admin']} redirectTo="/" />
            ),
            children: [{ path: '/units', element: <UnitsPage /> }],
          },
          {
            element: <RoleRoute allowed={['super_admin']} redirectTo="/" />,
            children: [{ path: '/societies', element: <SocietiesPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
