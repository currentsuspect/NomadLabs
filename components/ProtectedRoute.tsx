
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { UserRole } from '../types';
import { Loader2, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  // 1. Check Authentication
  if (!user) {
    // Redirect them to the /auth page, but save the current location they were trying to go to
    return <Navigate to={`/auth?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Check Role Access (Authorization)
  if (requiredRole) {
    // Hierarchy check: ADMIN can access everything
    const hasPermission = user.role === requiredRole || user.role === UserRole.ADMIN;
    
    if (!hasPermission) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
          <div className="p-4 bg-red-500/10 rounded-full mb-4 border border-red-500/20">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 max-w-md mb-6">
            Your security clearance ({user.role}) is insufficient to access this restricted area.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Return Previous Page
          </button>
        </div>
      );
    }
  }

  return <>{children}</>;
};
