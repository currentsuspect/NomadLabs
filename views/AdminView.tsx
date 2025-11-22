
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNotification } from '../components/NotificationProvider';
import { ShieldAlert, Users, FileText, Settings, Activity, Search, Trash2, Edit, Plus, X, Save, Layout, Star, Pin, Check, BarChart3, Globe, Lock, Loader2, Shield, Key, Ban, Cloud } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Post, PostStatus, Tag, User, UserRole } from '../types';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cms' | 'users' | 'settings'>('dashboard');
  
  // Data State
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch real data on mount
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      refreshData();
    }
  }, [user]);

  const refreshData = async () => {
    setLoading(true);
    const [postData, userData] = await Promise.all([
        api.posts.list(),
        api.users.getAll()
    ]);
    setPosts(postData);
    setUsers(userData);
    setLoading(false);
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-mono">
        <div className="p-6 rounded-full bg-red-500/10 mb-6">
          <ShieldAlert size={64} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">RESTRICTED AREA</h2>
        <p className="mb-6">Clearance Level: ADMIN required.</p>
        <div className="text-xs font-mono text-slate-600">ERROR_CODE: 403_FORBIDDEN</div>
      </div>
    );
  }

  // --- CMS Actions ---

  const toggleFeatured = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    
    const updatedPost = { ...post, featured: !post.featured };
    
    // Optimistic update
    setPosts(posts.map(p => p.id === id ? updatedPost : p));
    await api.posts.update(updatedPost);
    addNotification({ type: 'info', title: 'Layout Updated', message: 'Homepage priority updated.' });
  };

  const togglePinned = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const updatedPost = { ...post, pinned: !post.pinned };
    setPosts(posts.map(p => p.id === id ? updatedPost : p));
    await api.posts.update(updatedPost);
    addNotification({ type: 'info', title: 'Layout Updated', message: 'List priority updated.' });
  };

  const handleSavePost = async () => {
    if (!editingPost) return;
    setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
    await api.posts.update(editingPost);
    setEditingPost(null);
    addNotification({ type: 'success', title: 'Database Updated', message: `Entry "${editingPost.slug}" modified successfully.` });
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('CONFIRM DELETION: This action is irreversible.')) {
      setPosts(posts.filter(p => p.id !== id));
      await api.posts.delete(id);
      addNotification({ type: 'warning', title: 'Content Removed', message: 'Record purged from database.' });
    }
  };

  // --- User Management Actions ---
  
  const handleUserRoleChange = async (userId: string, newRole: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUser = { ...targetUser, role: newRole as UserRole };
    setUsers(users.map(u => u.id === userId ? updatedUser : u));
    await api.users.update(updatedUser);
    addNotification({ type: 'success', title: 'Permissions Updated', message: `User ${targetUser.name} is now ${newRole}` });
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
        addNotification({ type: 'error', title: 'Action Denied', message: 'You cannot delete your own admin account.' });
        return;
    }
    if (window.confirm('Are you sure you want to delete this user? This will likely orphan their posts.')) {
        await api.users.delete(userId);
        setUsers(users.filter(u => u.id !== userId));
        addNotification({ type: 'warning', title: 'User Removed', message: 'User purged from database.' });
    }
  };

  // --- Render Helpers ---

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-120px)] gap-8 fade-in">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
        <div className="px-4 py-4 mb-4 border-b border-slate-800">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Control Panel</h2>
        </div>
        <SidebarItem id="dashboard" icon={Activity} label="System Status" />
        <SidebarItem id="cms" icon={Layout} label="Content Manager" />
        <SidebarItem id="users" icon={Users} label="User Directory" />
        <SidebarItem id="settings" icon={Settings} label="Platform Config" />
        
        <div className="mt-8 px-4">
           <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
             <div className="flex justify-between items-center mb-2">
               <h3 className="text-xs font-bold text-white">Database Status</h3>
               <Cloud size={12} className="text-emerald-400" />
             </div>
             <div className="flex items-center gap-2 mb-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-xs text-emerald-400 font-mono">CONNECTED</span>
             </div>
             <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
               <span>PROVIDER</span>
               <span>SUPABASE</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#0B1221] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="p-8 animate-in fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Registered Users', val: users.length.toString(), icon: Users, color: 'text-sky-400' },
                { label: 'Total Posts', val: posts.length.toString(), icon: FileText, color: 'text-indigo-400' },
                { label: 'Cloud Status', val: 'Active', icon: Cloud, color: 'text-emerald-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="text-3xl font-mono font-bold text-white">{stat.val}</div>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-800 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Activity Log</h3>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Check size={12} /> System Healthy</span>
                </div>
              </div>
              <div className="space-y-4">
                 {posts.slice(0, 5).map(p => (
                   <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                     <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-slate-300">New post published: <span className="font-bold text-white">{p.title}</span></span>
                     </div>
                     <span className="text-xs text-slate-500 font-mono">{p.publishedAt}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* CMS View */}
        {activeTab === 'cms' && (
          <div className="flex flex-col h-full animate-in fade-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h2 className="text-xl font-bold text-white">Content Manager</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Manage visibility, layout priority, and metadata.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search posts..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary w-64"
                  />
                </div>
                <Button size="sm" onClick={refreshData} title="Refresh Data"><Activity size={14} className="mr-2" /> Refresh</Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {loading ? (
                 <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-500" /></div>
              ) : filteredPosts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                   <FileText size={48} className="mb-4 opacity-20" />
                   <p>No posts found.</p>
                 </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950/80 text-slate-500 font-mono text-[10px] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3">Content Entity</th>
                      <th className="px-6 py-3">Author</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-800/30 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                              <button 
                                onClick={() => toggleFeatured(post.id)}
                                title="Toggle Featured (Hero)"
                                className={`p-1.5 rounded transition-colors ${post.featured ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-800 text-slate-600 hover:text-slate-400'}`}
                              >
                                <Star size={14} className={post.featured ? "fill-current" : ""} />
                              </button>
                              <button 
                                onClick={() => togglePinned(post.id)}
                                title="Toggle Pinned (Top of List)"
                                className={`p-1.5 rounded transition-colors ${post.pinned ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40' : 'bg-slate-800 text-slate-600 hover:text-slate-400'}`}
                              >
                                <Pin size={14} className={post.pinned ? "fill-current" : ""} />
                              </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-200">{post.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 font-mono truncate max-w-[300px]">/{post.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                              {post.author.name.charAt(0)}
                            </div>
                            {post.author.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            post.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingPost(post)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeletePost(post.id)} className="p-2 hover:bg-red-900/30 rounded-full text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users View */}
        {activeTab === 'users' && (
          <div className="flex flex-col h-full animate-in fade-in">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h2 className="text-xl font-bold text-white">User Directory</h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">Manage user roles, permissions, and accounts.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary w-64"
                  />
                </div>
                <Button size="sm" onClick={refreshData}><Activity size={14} className="mr-2" /> Refresh</Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950/80 text-slate-500 font-mono text-[10px] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3">User Identity</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Stats</th>
                      <th className="px-6 py-3 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 group transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-700 overflow-hidden">
                                {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} /> : <div className="h-full w-full bg-slate-600" />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-200">{u.name}</div>
                                <div className="text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <select 
                                value={u.role}
                                onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                                className={`bg-transparent border border-slate-700 rounded px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none ${
                                    u.role === 'ADMIN' ? 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10' : 
                                    u.role === 'REVIEWER' ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10' : 
                                    'text-slate-300'
                                }`}
                                disabled={u.id === user.id} // Prevent demoting self
                            >
                                <option value="MEMBER">Member</option>
                                <option value="AUTHOR">Author</option>
                                <option value="REVIEWER">Reviewer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-xs text-slate-500">
                                <span className="block">Following: {u.followingUsers.length}</span>
                                <span className="block">Expertise: {u.expertise.length}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            {u.id !== user.id && (
                                <button 
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                    title="Delete User"
                                >
                                    <Ban size={16} />
                                </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {/* Settings View (Placeholder) */}
        {activeTab === 'settings' && (
           <div className="flex items-center justify-center h-full text-slate-500">
             <div className="text-center max-w-md">
               <Settings size={48} className="mx-auto mb-4 opacity-20" />
               <h3 className="text-xl font-bold text-white mb-2">Platform Configuration</h3>
               <p className="mb-6">Global settings for the instance are configured via environment variables in this version.</p>
               <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-left font-mono text-xs text-slate-400">
                 <div>API_VERSION: v1</div>
                 <div>DB_PROVIDER: Supabase</div>
                 <div>THEME: Dark Mode</div>
               </div>
             </div>
           </div>
        )}
      </main>

      {/* CMS Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-slate-800 p-6">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Metadata</h3>
                <div className="text-xs font-mono text-slate-500">ID: {editingPost.id.toUpperCase()}</div>
              </div>
              <button onClick={() => setEditingPost(null)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Headline Title</label>
                   <input 
                     type="text" 
                     value={editingPost.title}
                     onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                     className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                   />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Publication Status</label>
                    <select 
                      value={editingPost.status}
                      onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as PostStatus })}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Slug</label>
                 <div className="flex">
                   <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-slate-800 bg-slate-900 text-slate-500 text-xs font-mono">
                     nomadlabs.dev/read/
                   </span>
                   <input 
                     type="text" 
                     value={editingPost.slug}
                     onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                     className="flex-1 bg-slate-950 border border-slate-800 rounded-r p-2 text-sm text-white font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Abstract / Subtitle</label>
                 <textarea 
                   value={editingPost.abstract || editingPost.subtitle || ''}
                   onChange={(e) => setEditingPost({ ...editingPost, abstract: e.target.value })}
                   className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white h-24 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                 />
               </div>

               <div className="grid grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                 <div className="flex items-start gap-3">
                   <button 
                     onClick={() => setEditingPost({...editingPost, featured: !editingPost.featured})}
                     className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors ${editingPost.featured ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 bg-transparent'}`}
                   >
                     {editingPost.featured && <Check size={12} />}
                   </button>
                   <div>
                     <div className="text-sm font-bold text-white">Featured Content</div>
                     <div className="text-xs text-slate-500">Display prominently in the Hero section. Ideal for major papers.</div>
                   </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <button 
                     onClick={() => setEditingPost({...editingPost, pinned: !editingPost.pinned})}
                     className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors ${editingPost.pinned ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-600 bg-transparent'}`}
                   >
                     {editingPost.pinned && <Check size={12} />}
                   </button>
                   <div>
                     <div className="text-sm font-bold text-white">Pinned Post</div>
                     <div className="text-xs text-slate-500">Stick to the top of the standard feed lists.</div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
               <Button variant="ghost" onClick={() => setEditingPost(null)}>Cancel</Button>
               <Button onClick={handleSavePost}>
                 <Save size={16} className="mr-2" /> Save Changes
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
