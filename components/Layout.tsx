
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useNotification } from './NotificationProvider';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { 
  Bell, 
  User as UserIcon, 
  Settings,
  Github,
  Twitter,
  MessageCircle,
  Menu,
  X,
  LogOut,
  PenTool,
  Shield,
  Check,
  Trash2,
  UserCircle
} from 'lucide-react';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { addNotification, history, unreadCount, markAllAsRead, clearHistory } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) 
      ? "text-primary bg-indigo-500/10" 
      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50";
  };

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
    navigate('/');
    addNotification({
      type: 'info',
      title: 'Signed Out',
      message: 'Come back soon!',
      duration: 3000
    });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-primary/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white hover:opacity-90 transition-opacity">
              <div className="h-8 w-8">
                <Logo className="w-full h-full" />
              </div>
              <span className="hidden sm:inline">Nomad Labs</span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/explore" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/explore')}`}
              >
                Explore
              </Link>
              <Link 
                to="/lab" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/lab')}`}
              >
                Lab Notes
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive('/about')}`}
              >
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    className="hidden sm:block text-slate-400 hover:text-white transition-colors relative group p-1"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                      <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                          <h3 className="text-sm font-bold text-white">Notifications</h3>
                          <div className="flex gap-2">
                            {unreadCount > 0 && (
                              <button onClick={markAllAsRead} className="text-xs text-primary hover:text-indigo-400" title="Mark all as read">
                                <Check size={14} />
                              </button>
                            )}
                            {history.length > 0 && (
                              <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-red-400" title="Clear all">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="max-h-[300px] overflow-y-auto">
                          {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-800">
                              {history.map(n => (
                                <div key={n.id} className={`p-4 hover:bg-slate-800/50 transition-colors ${!n.read ? 'bg-slate-800/20' : ''}`}>
                                  <div className="flex gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-slate-600'}`} />
                                    <div>
                                      <h4 className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</h4>
                                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                                      <span className="text-[10px] text-slate-600 mt-2 block">{n.timestamp?.toLocaleTimeString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* User Menu */}
                <div className="relative">
                  <div 
                    className="h-8 w-8 rounded-full bg-slate-800 overflow-hidden ring-2 ring-slate-800 hover:ring-primary cursor-pointer transition-all"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                     {user.avatarUrl ? (
                       <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                     ) : (
                       <UserIcon className="h-full w-full p-1.5 text-slate-400" />
                     )}
                  </div>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 py-2 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-slate-800 mb-2">
                          <p className="text-sm font-bold text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {user.role === 'ADMIN' && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircle size={16} className="mr-3 text-slate-500" /> Your Profile
                        </Link>

                        <Link 
                          to="/lab/new" 
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <PenTool size={16} className="mr-3 text-slate-500" /> New Lab Note
                        </Link>
                        
                        {user.role === 'ADMIN' && (
                          <Link 
                            to="/admin" 
                            className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield size={16} className="mr-3 text-slate-500" /> Admin Panel
                          </Link>
                        )}
                        
                        <div className="my-2 border-t border-slate-800"></div>
                        
                        <button 
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" /> Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/auth">
                 <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3 animate-in slide-in-from-top-5">
            <Link 
              to="/explore" 
              className="block px-4 py-2 rounded-md hover:bg-slate-900 text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore Research
            </Link>
            <Link 
              to="/lab" 
              className="block px-4 py-2 rounded-md hover:bg-slate-900 text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lab Notes
            </Link>
            <Link 
              to="/about" 
              className="block px-4 py-2 rounded-md hover:bg-slate-900 text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Nomad Labs
            </Link>
            {!user && (
              <div className="pt-2 border-t border-slate-800 mt-2">
                 <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button className="w-full">Sign In</Button>
                 </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-300px)]">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 mt-20">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm text-slate-400">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-bold text-white mb-4">
              <div className="h-5 w-5">
                 <Logo className="w-full h-full" />
              </div>
              Nomad Labs
            </div>
            <p className="max-w-xs mb-6 leading-relaxed">
              Pushing the boundaries of music technology, digital signal processing, and audio performance optimization.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Twitter size={18} /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Github size={18} /></a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><MessageCircle size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Research</h4>
            <ul className="space-y-2">
              <li><Link to="/explore" className="hover:text-primary transition-colors">Papers</Link></li>
              <li><Link to="/explore" className="hover:text-primary transition-colors">Experiments</Link></li>
              <li><Link to="/lab" className="hover:text-primary transition-colors">Lab Notes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2">
              <li><Link to="/guidelines" className="hover:text-primary transition-colors">Guidelines</Link></li>
              <li><Link to="/submit-research" className="hover:text-primary transition-colors">Submit Research</Link></li>
              <li><Link to="/fellowships" className="hover:text-primary transition-colors">Fellowships</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
