
import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useNotification } from '../components/NotificationProvider';
import { Lock, Mail, User, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

// Google Icon SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
    </g>
  </svg>
);

export const AuthView: React.FC = () => {
  const { login, loginWithGoogle, signup, isLoading } = useAuth();
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
        addNotification({ type: 'success', title: 'Account Created', message: 'Please check your email for verification if required.' });
      }
      
      // Redirect
      const from = searchParams.get('from') || '/';
      navigate(from);
    } catch (error: any) {
      console.error(error);
      let msg = 'Authentication failed.';
      if (error.message) msg = error.message;
      if (error.message.includes('Invalid login')) msg = 'Incorrect email or password.';
      
      addNotification({ type: 'error', title: 'Authentication Failed', message: msg });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Note: OAuth redirects away from the page, so no notification needed immediately here.
    } catch (e: any) {
      addNotification({ type: 'error', title: 'Connection Error', message: e.message || 'Could not connect to identity provider.' });
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

            {/* OAuth Provider */}
            <Button 
              variant="secondary" 
              className="w-full mb-6 flex items-center gap-3 bg-white text-slate-900 hover:bg-slate-100 border-transparent h-12"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0B1221] px-2 text-slate-500 font-bold tracking-wider">Or continue with email</span>
              </div>
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
                className="w-full mt-2 h-11 bg-indigo-600 hover:bg-indigo-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {mode === 'login' ? 'Unlock Access' : 'Initialize Account'} <ArrowRight size={16} />
                  </div>
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
               <p className="text-sm text-slate-400">
                 {mode === 'login' ? "Don't have an account? " : "Already have an ID? "}
                 <button 
                   className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline"
                   onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                 >
                   {mode === 'login' ? 'Register' : 'Sign In'}
                 </button>
               </p>
            </div>
          </div>
          
          {/* Footer Status */}
          <div className="bg-slate-950 px-8 py-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-wider">
             <span>Identity Provider</span>
             <span className="flex items-center gap-1 text-emerald-500"><Lock size={10} /> Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
