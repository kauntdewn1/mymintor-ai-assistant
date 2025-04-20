import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('AuthContext - Initializing auth check');
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('AuthContext - Token found:', !!token);
        
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('AuthContext - User data:', response.data);
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('AuthContext - Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log('AuthContext - Attempting login');
    try {
      const response = await axios.post('/api/auth/login', credentials);
      console.log('AuthContext - Login successful:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('AuthContext - Login failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext - Logging out');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 