import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('AuthContext - Initializing auth check');
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        console.log('AuthContext - Token found:', !!token);
        
        if (token) {
          const userData = JSON.parse(atob(token));
          if (userData.email === 'admin@flowoff.com.br') {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
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
    
    // Verifica apenas as credenciais do admin
    if (credentials.email === 'admin@flowoff.com.br' && credentials.password === 'admin123') {
      const adminUser = {
        id: 1,
        name: 'Administrador',
        email: 'admin@flowoff.com.br',
        role: 'admin'
      };
      
      const token = btoa(JSON.stringify(adminUser));
      localStorage.setItem('token', token);
      setUser(adminUser);
      setIsAuthenticated(true);
      console.log('AuthContext - Admin login successful');
      return true;
    }

    console.log('AuthContext - Invalid credentials');
    return false;
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