import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('nomad_session_user');
    if (storedUserId) {
      api.users.get(storedUserId).then(foundUser => {
        if (foundUser) setUser(foundUser);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    if (!email) {
      setIsLoading(false);
      throw new Error('Email required');
    }
    
    const foundUser = await api.users.login(email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('nomad_session_user', foundUser.id);
    } else {
      setIsLoading(false);
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const newUser: User = {
        id: `u-${Date.now()}`,
        name: name,
        email: email,
        role: UserRole.MEMBER,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        expertise: ['Researcher'],
        bio: 'New member of the lab.',
        followingTags: [],
        followingUsers: []
    };
    
    await api.users.register(newUser);
    setUser(newUser);
    localStorage.setItem('nomad_session_user', newUser.id);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nomad_session_user');
  };
  
  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await api.users.update(updatedUser);
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