
import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useNotification } from '../components/NotificationProvider';
import { Lock, Mail, User, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [searchParams] = useSearchParams();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        if (!email || !password) {
            addNotification({ type: 'error', title: 'Error', message: 'Please provide email and password.' });
            return;
        }
        await login(email, password);
        addNotification({ type: 'success', title: 'Access Granted', message: 'Welcome back to Nomad Labs.' });
      } else {
        if (!name || !email || !password) {
            addNotification({ type: 'error', title: 'Error', message: 'All fields are required.' });
            return;
        }
        await signup(name, email, password);
        addNotification({ type: 'success', title: 'Account Created', message: 'Your clearance level is: MEMBER.' });
      }
      
      // Redirect
      const from = searchParams.get('from') || '/';
      navigate(from);
    } catch (error) {
      addNotification({ type: 'error', title: 'Authentication Failed', message: 'Invalid credentials.' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 fade-in">
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="relative bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner ring-1 ring-slate-700">
                <ShieldCheck className="text-indigo-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {mode === 'login' ? 'Lab Access' : 'New Researcher'}
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                {mode === 'login' 
                  ? 'Enter your credentials to access the facility.' 
                  : 'Join the collective to publish and collaborate.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-950/50 p-1 rounded-lg mb-6 border border-slate-800">
              <button 
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${mode === 'login' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${mode === 'register' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1 animate-in slide-in-from-left-2 fade-in duration-200">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Dr. Alex Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input 
                    type="email" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="researcher@nomadlabs.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input 
                    type="password" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6 h-11 bg-indigo-600 hover:bg-indigo-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {mode === 'login' ? 'Unlock Access' : 'Initialize Account'} <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </form>

            {mode === 'login' && (
              <div className="mt-6 text-center">
                 <a href="#" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">Forgot credentials?</a>
              </div>
            )}
          </div>
          
          {/* Footer Status */}
          <div className="bg-slate-950 px-8 py-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-wider">
             <span>Secure Connection</span>
             <span className="flex items-center gap-1 text-emerald-500"><Lock size={10} /> TLS 1.3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
