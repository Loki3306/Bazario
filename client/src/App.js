import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopDetails from './pages/ShopDetails';
import Dashboard from './pages/Dashboard';
import CreateShop from './pages/CreateShop'; // <-- 1. IMPORT
import EditShop from './pages/EditShop';   // <-- 2. IMPORT

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop/:id" element={<ShopDetails />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireMerchant>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* 3. ADD THESE TWO NEW ROUTES */}
              <Route 
                path="/shop/create" 
                element={
                  <ProtectedRoute requireMerchant>
                    <CreateShop />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shop/edit/:id" 
                element={
                  <ProtectedRoute requireMerchant>
                    <EditShop />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;