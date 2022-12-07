import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

export const Dashboard = Loadable(lazy(() => import('../pages/Dashboard')));
export const ProfilePage = Loadable(lazy(() => import('../pages/Profile')));
export const AdminPage = Loadable(lazy(() => import('../pages/Admin')));
export const DevicePage = Loadable(lazy(() => import('../pages/DevicePage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
