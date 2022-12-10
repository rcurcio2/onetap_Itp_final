import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import RoleBasedGuard from '../auth/RoleBasedGuard';

// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config';
//
import { Page404, Dashboard, ProfilePage, AdminPage, LoginPage, DevicePage } from './elements';


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'dash', children: [
            { path: '', element: <Dashboard /> },
            { path: ':deviceName/pour', element: <DevicePage /> }, 
          ]
        },
        { path: 'profile', element: <ProfilePage /> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/admin" replace />, index: true },
            {
              path: 'admin', element: (
                <RoleBasedGuard roles={['Admin']}>
                  <AdminPage />
                </RoleBasedGuard>
              )
            },
            {
              path: ':uid/edit', element: (
                <RoleBasedGuard roles={['Admin']}>
                  <ProfilePage />
                </RoleBasedGuard>
              ), 
            }
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
