import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useRoutes, useLocation } from 'react-router-dom';

import { getRouteFromRole } from 'src/utils/routeAccess';

import DashboardLayout from 'src/layouts/dashboard';
import MarketCallFormPage from 'src/pages/marketcall/martketcall-form';
import MarketCallDetailsPage from 'src/pages/marketcall/marketcall-details';
import ProfileMarketCallDetailsPage from 'src/pages/profilemarketcall/profile-marketcall-details';
import MarketCallConfirmationPage from 'src/pages/marketcall/marketcall-confirmation';
import ProfilePage from 'src/pages/profile/profile';
import RegisterPage from 'src/pages/auth/register';
import { ROLES } from 'src/enums';

export const IndexPage = lazy(() => import('src/pages/app'));
export const MarketCallPage = lazy(() => import('src/pages/marketcall/marketcall'));
export const UserPage = lazy(() => import('src/pages/user/user'));
export const OrganizationPage = lazy(() => import('src/pages/organization'));
export const UserFormPage = lazy(() => import('src/pages/user/user-form'));
export const OrgFormPage = lazy(() => import('src/pages/org-register'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LoginPage = lazy(() => import('src/pages/auth/login'));
export const ForgotPasswordPage = lazy(() => import('src/pages/auth/forgot-password'));
export const ChangePasswordPage = lazy(() => import('src/pages/auth/change-password'));
export const ClientResponses = lazy(() => import('src/pages/responses'));
export const HedgeOSPage = lazy(() => import('src/pages/externals/hedgeOS'));
export const CGPUPage = lazy(() => import('src/pages/externals/cGPU'));
export const TaskPage = lazy(() => import('src/pages/task/task'));
export const TaskFormPage = lazy(() => import('src/pages/task/task-form'));
export const AnalystTaskPage = lazy(() => import('src/pages/analyst-task/analyst-task'));
export const KYCPage = lazy(() => import('src/pages/kyc/kyc'));

// ----------------------------------------------------------------------

export default function Router() {
  const auth = useSelector((state) => state?.user?.auth);
  const user = useSelector((state) => state?.user?.details);
  const role = user?.role;
  const ekyc = user?.kyc?.ekyc;
  const esign = user?.kyc?.esign;
  const kyc = ekyc && esign;
  const location = useLocation();

  const protectedRoutes = [
    { path: 'user', element: <UserPage /> },
    { path: 'organization', element: <OrganizationPage /> },
    { path: 'market-call/:type?/:marketState?/:view?', element: <MarketCallPage />, index: true },
    { path: 'market-call/confirmation', element: <MarketCallConfirmationPage /> },
    { path: 'market-call/add', element: <MarketCallFormPage /> },
    { path: 'user/add', element: <UserFormPage /> },
    { path: 'organization/add', element: <OrgFormPage /> },
    { path: 'responses', element: <ClientResponses /> },
    { path: 'task', element: <TaskPage /> },
    { path: 'analyst-task', element: <AnalystTaskPage /> },
    { path: 'task/add', element: <TaskFormPage /> },
    { path: 'hedgeOS', element: <HedgeOSPage /> },
    { path: 'cGPU', element: <CGPUPage /> },
  ];

  console.log(esign, role);
  const rootElement = () => {
    let component = <Navigate to="/login" state={{ from: location }} />;
    if (auth && role === ROLES.CLIENT && !kyc) {
      component = <Navigate to="/kyc" state={{ from: location }} />;
    } else if (auth) {
      component = (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      );
    }
    return component;
  };

  const routes = useRoutes([
    {
      element: rootElement(),
      children: [
        // Default route
        { element: <Navigate to="/market-call" state={{ from: location }} />, index: true },

        // Market Call Details route, with authentication check
        {
          path: 'market-call/details/:id/:response?',
          element: auth ? (
            <MarketCallDetailsPage />
          ) : (
            <Navigate to="/login" state={{ from: location }} />
          ),
        },
        {
          path: 'profile/market-call/details/:id/:response?',
          element: auth ? (
            <ProfileMarketCallDetailsPage />
          ) : (
            <Navigate to="/login" state={{ from: location }} />
          ),
        },

        // Protected routes based on user role
        ...getRouteFromRole(user?.role, protectedRoutes),
      ],
    },
    {
      path: 'profile/:id',
      element: (
        <DashboardLayout>
          <Suspense>
            <ProfilePage />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: 'login',
      element: !auth ? (
        <LoginPage />
      ) : (
        <Navigate to={location.state ? location.state?.from?.pathname : '/'} />
      ),
    },
    {
      path: 'forgot-password',
      element: <ForgotPasswordPage />,
    },
    {
      path: 'register',
      element: <RegisterPage state={{ from: location }} />,
    },
    {
      path: 'change-password',
      element: <ChangePasswordPage />,
    },
    {
      path: 'kyc',
      element: !kyc ? (
        <KYCPage />
      ) : (
        <Navigate to={location.state ? location.state?.from?.pathname : '/'} />
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" state={{ from: location }} replace />,
    },
  ]);

  return routes;
}
