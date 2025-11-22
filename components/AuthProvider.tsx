
import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USER } from '../constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start null to force usage of login flow
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    // Simulate network delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(MOCK_USER);
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Create a new mock user based on input
        const newUser: User = {
            ...MOCK_USER,
            id: `u-${Date.now()}`,
            name: name,
            email: email,
            role: UserRole.MEMBER,
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            expertise: ['Novice'],
        };
        setUser(newUser);
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
  };
  
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
