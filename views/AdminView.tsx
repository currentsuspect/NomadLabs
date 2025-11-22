import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNotification } from '../components/NotificationProvider';
import { ShieldAlert, Users, FileText, Settings, Activity, Search, MoreVertical, Trash2, Edit, Plus, X, Save, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MOCK_POSTS } from '../constants';
import { Post, PostStatus } from '../types';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content'>('dashboard');
  
  // Local state for managing posts (simulating DB updates)
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <ShieldAlert size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p>You do not have permission to view this area.</p>
      </div>
    );
  }

  const handleAction = (action: string) => {
    addNotification({
      type: 'success',
      title: 'Action Successful',
      message: `${action} completed successfully.`
    });
  };

  const handleEditPost = (post: Post) => {
    setEditingPost({ ...post });
  };

  const handleSavePost = () => {
    if (!editingPost) return;
    
    setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
    setEditingPost(null);
    addNotification({
      type: 'success',
      title: 'Content Updated',
      message: `"${editingPost.title}" has been updated successfully.`
    });
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
      addNotification({
        type: 'info',
        title: 'Content Deleted',
        message: 'The post has been removed.'
      });
    }
  };

  return (
    <div className="fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="text-slate-400" /> Admin Console
          </h1>
          <p className="text-slate-400 mt-1">Manage system wide settings, users, and content moderation.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          {['dashboard', 'users', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={64} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Total Users</h3>
              </div>
              <div className="text-3xl font-bold text-white">1,248</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <Activity size={12} /> +12% this month
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={64} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Content Items</h3>
              </div>
              <div className="text-3xl font-bold text-white">{posts.length}</div>
              <div className="text-xs text-slate-500 mt-2">Papers, Articles, Notes</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert size={64} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">System Status</h3>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-white">Healthy</div>
              <div className="text-xs text-emerald-400 mt-2">All services operational</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-semibold text-white">Recent Activity Log</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-slate-800">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                  <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">
                      {i === 1 ? 'System Update' : i === 2 ? 'New User Registration' : 'Content Published'}
                    </p>
                    <p className="text-xs text-slate-500">2 hours ago • ID: #{Math.random().toString(16).slice(2, 8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between mb-4">
             <div className="relative w-64">
               <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
               <input 
                 type="text" 
                 placeholder="Search users..." 
                 className="w-full bg-slate-900 border border-slate-800 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:outline-none"
               />
             </div>
             <Button size="sm"><Plus size={16} className="mr-2" /> Add User</Button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-slate-800/50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                          U{i}
                        </div>
                        <div>
                          <div className="font-medium text-white">User {i}</div>
                          <div className="text-xs text-slate-500">user{i}@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select className="bg-transparent border-none text-slate-300 text-sm focus:ring-0 cursor-pointer">
                        <option>MEMBER</option>
                        <option>AUTHOR</option>
                        <option>ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${i % 3 === 0 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {i % 3 === 0 ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:text-white" title="Edit" onClick={() => handleAction('Edit User')}><Edit size={14} /></button>
                        <button className="p-1 hover:text-red-400" title="Delete" onClick={() => handleAction('Delete User')}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Management */}
      {activeTab === 'content' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/50 group transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded text-xs bg-slate-800">{post.type}</span>
                    </td>
                    <td className="px-6 py-4">{post.author.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        post.status === 'PUBLISHED' ? 'text-emerald-400 bg-emerald-900/20' : 'text-orange-400 bg-orange-900/20'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:text-white" onClick={() => handleEditPost(post)}><Edit size={14} /></button>
                        <button className="p-1 hover:text-red-400" onClick={() => handleDeletePost(post.id)}><Trash2 size={14} /></button>
                        <button className="p-1 hover:text-white" onClick={() => handleAction('More Options')}><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Edit Content</h3>
              <button onClick={() => setEditingPost(null)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Slug</label>
                <input 
                  type="text" 
                  value={editingPost.slug}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select 
                    value={editingPost.status}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as PostStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-primary"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Read Time (min)</label>
                  <input 
                    type="number" 
                    value={editingPost.readTimeMinutes}
                    onChange={(e) => setEditingPost({ ...editingPost, readTimeMinutes: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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