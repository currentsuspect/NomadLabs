
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on startup
    const initSession = async () => {
      try {
        const currentUser = await api.users.getCurrent();
        setUser(currentUser);
      } catch (e) {
        console.error("Auth Init Error", e);
      } finally {
        setIsLoading(false);
      }
    };
    initSession();

    // 2. Listen for Auth changes (Sign In, Sign Out, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const currentUser = await api.users.getCurrent();
        setUser(currentUser);
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!email || !password) throw new Error('Credentials missing');
      await api.users.login(email, password);
      // Note: onAuthStateChange will handle state update
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await api.users.loginWithGoogle();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await api.users.register(name, email, password);
      // Note: onAuthStateChange will handle state update
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await api.users.logout();
  };
  
  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      // Optimistic update
      setUser(updatedUser);
      try {
        await api.users.update(updatedUser);
      } catch (e) {
        // Revert on fail
        console.error("Failed to update user", e);
        const fresh = await api.users.getCurrent();
        setUser(fresh);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, signup, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
