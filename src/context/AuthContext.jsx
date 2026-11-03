import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cp_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cp_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuth = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('cp_user', JSON.stringify(userData));
    localStorage.setItem('cp_token', accessToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cp_user');
    localStorage.removeItem('cp_token');
  };

  const checkAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('cp_token');
    if (!currentToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('cp_user', JSON.stringify(res.user));
      } else {
        clearAuth();
      }
    } catch (err) {
      console.warn('Session verification error:', err.message);
      // Keep local session if backend had transient offline issue
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password, role) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({ email, password, role });
      if (res.success) {
        saveAuth(res.user, res.accessToken);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const registerCandidate = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authAPI.registerCandidate(formData);
      if (res.success) {
        saveAuth(res.user, res.accessToken);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const registerCompany = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authAPI.registerCompany(formData);
      if (res.success) {
        saveAuth(res.user, res.accessToken);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
    }
  };

  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('cp_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user && !!token,
        isLoading,
        token,
        login,
        registerCandidate,
        registerCompany,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
