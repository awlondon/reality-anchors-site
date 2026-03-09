import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { AuthGuard, AdminGuard } from './components/AuthGuard';
import Layout from './components/Layout';

// Public pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import OnboardingSuccess from './pages/OnboardingSuccess';

// Authenticated pages
import Dashboard from './pages/Dashboard';
import Subscription from './pages/Subscription';
import Billing from './pages/Billing';
import Seats from './pages/Seats';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';

// Admin pages
import AdminRetention from './pages/AdminRetention';
import AdminOrgDetail from './pages/AdminOrgDetail';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/success" element={<OnboardingSuccess />} />

          {/* Authenticated routes */}
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/seats" element={<Seats />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />

              {/* Admin routes */}
              <Route element={<AdminGuard />}>
                <Route path="/admin" element={<AdminRetention />} />
                <Route path="/admin/org/:orgId" element={<AdminOrgDetail />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
