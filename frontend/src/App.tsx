import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import StorePage from './pages/StorePage';
import CheckoutPage from './pages/CheckoutPage';
import LiveTracking from './pages/LiveTracking';
import InventoryPage from './pages/InventoryPage';
import AdminPortal from './pages/AdminPortal';
import ProfilePage from './pages/ProfilePage';
import ShopProfilePage from './pages/ShopProfilePage';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      {/* Publicly accessible browsing */}
      <Route path="/" element={user?.role === 'shop_owner' ? <Navigate to="/inventory" /> : <Dashboard />} />
      <Route path="/shop/:id" element={<StorePage />} />
      
      {/* Protected Customer Routes */}
      <Route path="/checkout" element={<PrivateRoute roles={['customer']}><CheckoutPage /></PrivateRoute>} />
      <Route path="/tracking/:id" element={<PrivateRoute roles={['customer']}><LiveTracking /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute roles={['customer']}><ProfilePage /></PrivateRoute>} />
      
      {/* Business Routes */}
      <Route path="/inventory" element={<PrivateRoute roles={['shop_owner']}><InventoryPage /></PrivateRoute>} />
      <Route path="/shop-profile" element={<PrivateRoute roles={['shop_owner']}><ShopProfilePage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPortal /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
