import { useContext } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';


import RequireAuth from './requireAuth';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
// context
import { AuthContext } from './context/auth-context';


import UsersPage from './pages/Users_Page';

import LoginPage from './pages/LoginPage';
// import SignUpPage from './pages/SignUpPage';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import Page404 from './pages/Page404';
import EditUserPage from './pages/EditUserPage';
import EditAdminPage from './pages/EditAdminPage';

import Logout from './sections/auth/logout/Logout';
import AdminProfile from './sections/admin/Profile/AdminProfile';
import NewAdminPage from './pages/NewAdminPage';

import UserAttendancePage from './pages/UserAttendancePage';
import AdminPage from './pages/AdminPage';
import NewUserPage from './pages/NewUserPage';

import DepartmentPage from './pages/DepartmentPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Profile from './pages/Profile';

// ----------------------------------------------------------------------

export default function Router() {
const auth = useContext(AuthContext);
const {isLoggedIn, token} = auth


  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <RequireAuth><DashboardAppPage /></RequireAuth> },
        { path: 'members', element: <RequireAuth><UsersPage /></RequireAuth> },
      ],
    },
    {
      path: '/auth',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/auth/login" />, index: true },
        { path: 'login', element: <LoginPage /> },
        { path: 'forgotPassword', element: <ForgotPasswordPage /> },
        // {  path: 'register', element: <SignUpPage /> },
        { path: 'resetPassword/:id/:id', element: <ResetPasswordPage /> },
        {path: 'logout', element: <Logout /> },
      ],
    },

    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/user/profile" />, index: true },
        { path: 'profile/:id', element: <RequireAuth><Profile /></RequireAuth> },
        { path: 'edit/:id', element: <RequireAuth><EditUserPage /></RequireAuth> },
      ],
    },
    {
      path: '/attendance',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/attendance/list" />, index: true },
        { path: 'list', element: <RequireAuth><UserAttendancePage /></RequireAuth> },
      ],
    },
    // {
    //   path: '/scan',
    //   element: <DashboardLayout />,
    //   children: [
    //     { element: <Navigate to="/scan/qrcode" />, index: true },
    //     { path: 'qrcode', element: <RequireAuth><ScanQRCode /></RequireAuth> },
    //   ],
    // },
    {
      path: '/new',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/new/user" />, index: true },
        { path: 'user', element: <RequireAuth><NewUserPage /></RequireAuth> },
      ],
    },
    {
      path: '/create',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/create/dept" />, index: true },
        { path: 'dept', element: <RequireAuth><DepartmentPage /></RequireAuth> },
      ],
    },
    
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/admin/index" />, index: true },
        { path: 'index', element: <RequireAuth> <AdminPage /> </RequireAuth> },
        { path: 'create', element: <RequireAuth> <NewAdminPage /> </RequireAuth> },
        { path: 'profile/:id', element: <RequireAuth><AdminProfile /></RequireAuth> },
        { path: 'edit/:id', element: <RequireAuth> <EditAdminPage /> </RequireAuth> },
        
      ],
    },
   
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/auth/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
