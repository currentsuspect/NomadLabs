import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { ShieldAlert, Users, FileText } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <ShieldAlert size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p>You do not have permission to view this area.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Console</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Total Users</h3>
            <Users size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-white">1,248</div>
          <div className="text-xs text-emerald-400 mt-2">+12% this month</div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Pending Reviews</h3>
            <FileText size={20} className="text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-white">8</div>
          <div className="text-xs text-slate-500 mt-2">Requires attention</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="font-semibold text-white">Recent User Registrations</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-white">User {i}</td>
                <td className="px-6 py-4">MEMBER</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Active</span></td>
                <td className="px-6 py-4">Oct {i + 10}, 2023</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};