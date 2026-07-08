import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import React from 'react';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
      <Routes>
        {/* Admin — no site header/footer */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Public routes — wrapped in Layout (header + footer) */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#fff8ef] text-[#28140f] transition-colors duration-200 dark:bg-[#120b0a] dark:text-[#fff7ed]">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
              <WhatsAppFloat />
            </div>
          }
        />
      </Routes>
    </Router>
    </CartProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
