import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requireMerchant = false }) => {
  const { user, loading, isAuthenticated, isMerchant } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireMerchant && !isMerchant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You need a merchant account to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;