import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, AlumniProfile } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: (role: 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'ALUMNI') => Promise<void>;
  register: (formData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<AlumniProfile>) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isContentManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gcrjy_auth_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to authenticate session:', error);
      localStorage.removeItem('gcrjy_auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const newToken = res.data.token;
      localStorage.setItem('gcrjy_auth_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  const demoLogin = async (role: 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'ALUMNI') => {
    let email = 'admin@gcrjy.ac.in';
    let password = 'Admin@GCRJY2026';

    if (role === 'CONTENT_MANAGER') {
      email = 'editor@gcrjy.ac.in';
      password = 'Editor@GCRJY2026';
    } else if (role === 'ALUMNI') {
      email = 'ramesh.sharma@alumni.gcrjy.ac.in';
      password = 'Alumni@2026';
    }

    await login(email, password);
  };

  const register = async (formData: any) => {
    try {
      const res = await api.post('/auth/register', formData);
      const newToken = res.data.token;
      localStorage.setItem('gcrjy_auth_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('gcrjy_auth_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const updateProfile = async (data: Partial<AlumniProfile>) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (user) {
        setUser({ ...user, profile: res.data.profile });
      }
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  };

  const isAuthenticated = !!user;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isContentManager = isAdmin || user?.role === 'CONTENT_MANAGER';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        updateProfile,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isContentManager,
      }}
    >
      {children}
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
