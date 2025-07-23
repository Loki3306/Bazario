import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- THIS LINE IS FIXED
import { api, setAuthToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMerchant, setIsMerchant] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token); // <-- THIS USAGE IS FIXED
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setAuthToken(token);
            const response = await api.get('/auth/me');
            setUser(response.data.user);
            setIsAuthenticated(true);
            setIsMerchant(response.data.user.role === 'merchant');
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setIsMerchant(user.role === 'merchant');
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setIsMerchant(user.role === 'merchant');

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsMerchant(false);
  };

  const value = {
    user,
    isAuthenticated,
    isMerchant,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};