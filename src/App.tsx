import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CallProvider } from './context/CallContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePassword from './components/ChangePassword';
import Login from './features/auth/Login';
import MainLayout from './layouts/MainLayout';
import CustomerList from './features/customers/CustomerList';
import CustomerProfile from './features/customers/CustomerProfile';
import Analytics from './features/analytics/Analytics';
import Settings from './features/settings/Settings';
import Dialer from './features/calling/Dialer';
import './index.css';

// Inner component that has access to auth context
const AppContent = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<CustomerList />} />
          <Route path="customers/:id" element={<CustomerProfile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Dialer />

      {/* Forced password change modal */}
      {currentUser?.mustChangePassword && (
        <ChangePassword isOpen={true} forced={true} />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CallProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CallProvider>
    </AuthProvider>
  );
}

export default App;
