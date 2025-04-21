import './App.css';
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import RequireAuth from './auth/require-auth';
import { CssBaseline } from '@mui/material';

const Login = lazy(() => import('./pages/login/login'));
const Layout = lazy(() => import('./pages/layout/layout'));
const ForgotPassword = lazy(() => import('./pages/forgot-password/forgot-password'));
const SystemDefinition = lazy(() => import('./pages/system-definition/system-definition'));
// const Dashboard = lazy(() => import('./pages/dashboards/dashboard'));
// const LandingWorldMap = lazy(() => import('./pages/landing-world-map/landing-world-map'));
// const SMTDashboard = lazy(() => import('./pages/dashboards/smt-dashboard/smt-dashboard'));
// const RealTimeDashboard = lazy(() => import('./pages/dashboards/real-time-dashboard/real-time-dashboard'));
// const MicrostopDashboard = lazy(() => import('./pages/dashboards/microstop-dashboard/microstop-dashboard'));
// const BreakdownAnalysisDashboard = lazy(() => import('./pages/dashboards/breakdown-analysis/breakdown-dashboard'));
// const BreakdownDashboard2 = lazy(() => import('./pages/dashboards/breakdown-dashboard/breakdown-dashboard'));
// const OeeAcceleratorDashboard = lazy(() => import('./pages/dashboards/oee-accelerator-dashboard/oee-accelerator-dashboard'));
// const ProdLineStateTimeDashboard = lazy(() => import('./pages/dashboards/prod-line-state-time-dashboard/prod-line-state-time-dashboard'));
const UserManagement = lazy(() => import('./pages/user-management/user-management'));
const UserForm = lazy(() => import('./pages/user-management/user-form'));

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <ToastContainer style={{ zIndex: 10000 }} />
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path='/usermgmt' element={<UserManagement />} /> */}
          {/* <Route path="/usermgmt" element={<Layout />}>
            <Route index element={<UserManagement />} />
          </Route> */}

          <Route path="/" element={<Layout equipments={[]} />}>
            <Route path="usermgmt" element={<UserManagement />} />
            {/* Add more child routes here if needed */}
          </Route>
          {/* <Route path='/oee' element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="" element={<Navigate to="dashboard" />} />
            <Route path="userForm" element={<UserForm />} />
            <Route path='systemdefinition' element={<SystemDefinition />} />
          </Route> */}
          {/* <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='*' element={<NoMatch />} /> */}
        </Routes>
      </Suspense>
    </Router>
  );
}

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

export default App;
