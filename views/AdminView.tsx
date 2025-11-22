import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNotification } from '../components/NotificationProvider';
import { ShieldAlert, Users, FileText, Settings, Activity, Search, Trash2, Edit, Plus, X, Save, Layout, Star, Pin, Check, BarChart3, Globe, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MOCK_POSTS } from '../constants';
import { Post, PostStatus, Tag } from '../types';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cms' | 'users' | 'settings'>('dashboard');
  
  // Local state for managing posts (simulating DB updates)
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleAction = (action: string) => {
    addNotification({
      type: 'success',
      title: 'System Update',
      message: `${action} executed successfully.`
    });
  };

  const toggleFeatured = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        // If we are featuring this one, unfeature others if we want single featured behavior, 
        // but for now let's assume multiple can be flagged but logic picks first.
        return { ...p, featured: !p.featured };
      }
      // Optional: Unfeature others to enforce single hero
      // if (p.featured) return { ...p, featured: false };
      return p;
    }));
    addNotification({ type: 'info', title: 'Layout Updated', message: 'Homepage priority updated.' });
  };

  const togglePinned = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p));
    addNotification({ type: 'info', title: 'Layout Updated', message: 'List priority updated.' });
  };

  const handleSavePost = () => {
    if (!editingPost) return;
    setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
    setEditingPost(null);
    addNotification({
      type: 'success',
      title: 'Database Updated',
      message: `Entry "${editingPost.slug}" modified successfully.`
    });
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('CONFIRM DELETION: This action is irreversible.')) {
      setPosts(posts.filter(p => p.id !== id));
      addNotification({
        type: 'warning',
        title: 'Content Removed',
        message: 'Record purged from database.'
      });
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
             <h3 className="text-xs font-bold text-white mb-2">Storage Usage</h3>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[34%]"></div>
             </div>
             <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
               <span>34% USED</span>
               <span>2.4GB / 7GB</span>
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
                { label: 'Active Sessions', val: '42', icon: Users, color: 'text-sky-400' },
                { label: 'Request Rate', val: '128ms', icon: Activity, color: 'text-emerald-400' },
                { label: 'Total Content', val: posts.length.toString(), icon: FileText, color: 'text-indigo-400' }
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
                <h3 className="text-lg font-bold text-white">Traffic Analytics</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-slate-800 text-xs text-white">24h</button>
                  <button className="px-3 py-1 rounded bg-transparent text-xs text-slate-500 hover:text-white">7d</button>
                </div>
              </div>
              <div className="h-48 flex items-end gap-2">
                 {[30, 45, 35, 60, 55, 70, 80, 65, 50, 75, 90, 60].map((h, i) => (
                   <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                      <div className="absolute bottom-0 w-full h-1 bg-indigo-500/50"></div>
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
                    placeholder="Search database..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary w-64"
                  />
                </div>
                <Button size="sm"><Plus size={14} className="mr-2" /> Create New</Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
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
            </div>
          </div>
        )}

        {/* Placeholder for Users/Settings to keep code valid but concise */}
        {(activeTab === 'users' || activeTab === 'settings') && (
           <div className="flex items-center justify-center h-full text-slate-500">
             <div className="text-center">
               <Settings size={48} className="mx-auto mb-4 opacity-20" />
               <p>Module under maintenance.</p>
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