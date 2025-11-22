
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNotification } from '../components/NotificationProvider';
import { Button } from '../components/ui/Button';
import { MOCK_POSTS, MOCK_USER } from '../constants';
import { PostCard } from '../components/PostCard';
import { User, Edit2, MapPin, Link as LinkIcon, Mail, Camera, Save, X, Shield, Hash, UserMinus, UserPlus, Check, FileText, Clock, Edit } from 'lucide-react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { User as UserType } from '../types';

export const UserProfileView: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'drafts' | 'network'>('posts');
  
  const isOwnProfile = !userId || (authUser && authUser.id === userId);
  
  const profileUser: UserType | null = isOwnProfile 
    ? authUser 
    : (MOCK_POSTS.find(p => p.authorId === userId)?.author || 
       (userId === MOCK_USER.id ? MOCK_USER : null));

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profileUser) {
      setName(profileUser.name);
      setBio(profileUser.bio || '');
      setExpertiseInput(profileUser.expertise.join(', '));
      setAvatarUrl(profileUser.avatarUrl || '');
    }
  }, [profileUser]);

  if (!profileUser) {
    return <div className="text-center py-20 text-slate-500">User not found.</div>;
  }

  // Filter posts
  const publishedPosts = MOCK_POSTS.filter(p => p.authorId === profileUser.id && p.status === 'PUBLISHED');
  const draftPosts = isOwnProfile ? MOCK_POSTS.filter(p => p.authorId === profileUser.id && p.status === 'DRAFT') : [];

  const followedUsersList = profileUser.followingUsers.map(id => {
    const post = MOCK_POSTS.find(p => p.authorId === id);
    return post ? post.author : { 
      id, 
      name: 'Unknown User', 
      expertise: [] as string[], 
      role: 'MEMBER' as const, 
      email: '', 
      followingUsers: [], 
      followingTags: [],
      avatarUrl: undefined
    } as UserType;
  });

  const handleSave = () => {
    if (!isOwnProfile) return;

    const expertiseArray = expertiseInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateUser({
      name,
      bio,
      expertise: expertiseArray,
      avatarUrl
    });

    setIsEditing(false);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile details have been saved successfully.'
    });
  };

  const handleCancel = () => {
    if (!profileUser) return;
    setName(profileUser.name);
    setBio(profileUser.bio || '');
    setExpertiseInput(profileUser.expertise.join(', '));
    setAvatarUrl(profileUser.avatarUrl || '');
    setIsEditing(false);
  };

  const handleUnfollowUser = (id: string) => {
    if (!authUser) return;
    const newFollowing = authUser.followingUsers.filter(u => u !== id);
    updateUser({ followingUsers: newFollowing });
  };

  const handleUnfollowTag = (tag: string) => {
    if (!authUser) return;
    const newTags = authUser.followingTags.filter(t => t !== tag);
    updateUser({ followingTags: newTags });
  };

  const toggleFollowUser = () => {
    if (!authUser) {
      navigate('/auth?from=' + window.location.pathname);
      return;
    }
    const isFollowing = authUser.followingUsers.includes(profileUser.id);
    let newFollowing = [...authUser.followingUsers];
    
    if (isFollowing) {
      newFollowing = newFollowing.filter(id => id !== profileUser.id);
      addNotification({ type: 'info', title: 'Unfollowed', message: `Unfollowed ${profileUser.name}` });
    } else {
      newFollowing.push(profileUser.id);
      addNotification({ type: 'success', title: 'Following', message: `Now following ${profileUser.name}` });
    }
    updateUser({ followingUsers: newFollowing });
  };

  return (
    <div className="max-w-5xl mx-auto fade-in pb-20">
      {/* Profile Header Card */}
      <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-12">
        {/* Banner Pattern */}
        <div className="h-48 bg-gradient-to-r from-indigo-900/40 to-slate-900 w-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full ring-4 ring-slate-950 bg-slate-800 overflow-hidden shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <User size={48} />
                  </div>
                )}
              </div>
              {isEditing && isOwnProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ring-4 ring-slate-950">
                  <Camera className="text-white" size={24} />
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-2">
              {isOwnProfile ? (
                !isEditing ? (
                  <Button variant="secondary" onClick={() => setIsEditing(true)}>
                    <Edit2 size={16} className="mr-2" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  </>
                )
              ) : (
                <Button 
                  onClick={toggleFollowUser}
                  className={authUser?.followingUsers.includes(profileUser.id) ? 'bg-slate-800 hover:bg-slate-700' : ''}
                >
                   {authUser?.followingUsers.includes(profileUser.id) ? (
                     <>Following <Check size={16} className="ml-2" /></>
                   ) : (
                     <>Follow <UserPlus size={16} className="ml-2" /></>
                   )}
                </Button>
              )}
            </div>
          </div>

          {/* Edit Mode Form */}
          {isEditing && isOwnProfile ? (
            <div className="grid gap-6 max-w-2xl animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avatar URL</label>
                <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary focus:outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expertise (comma separated)</label>
                <input type="text" value={expertiseInput} onChange={(e) => setExpertiseInput(e.target.value)} placeholder="e.g. DSP, Rust, React, Audio" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  {profileUser.name}
                  {profileUser.role === 'ADMIN' && (
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-2 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1">
                       <Shield size={10} /> ADMIN
                    </span>
                  )}
                </h1>
                <p className="text-slate-400 text-lg mt-2 max-w-2xl leading-relaxed">{profileUser.bio || "No bio provided yet."}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Mail size={16} /> {profileUser.email}</div>
                <div className="flex items-center gap-2"><MapPin size={16} /> Nomad Virtual Lab</div>
                <div className="flex items-center gap-2"><LinkIcon size={16} /> nomadlabs.dev</div>
              </div>

              <div className="pt-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profileUser.expertise.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-8 mb-8 border-b border-slate-800 pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`pb-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Published Research ({publishedPosts.length})
        </button>
        
        {isOwnProfile && (
          <button 
            onClick={() => setActiveTab('drafts')}
            className={`pb-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'drafts' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Drafts & Work in Progress ({draftPosts.length})
          </button>
        )}

        <button 
          onClick={() => setActiveTab('network')}
          className={`pb-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'network' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Network ({profileUser.followingUsers.length + profileUser.followingTags.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
         <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
           <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Contribution Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Published Papers</span>
                    <span className="font-mono font-bold text-white">{publishedPosts.filter(p => p.type === 'PAPER').length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Lab Notes</span>
                    <span className="font-mono font-bold text-white">{publishedPosts.filter(p => p.type === 'LAB_NOTE').length}</span>
                  </div>
                  <div className="w-full h-px bg-slate-800 my-2"></div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Citations</span>
                    <span className="font-mono font-bold text-emerald-400">14</span>
                  </div>
                </div>
              </div>
           </div>
           <div className="lg:col-span-2 space-y-6">
             {publishedPosts.length > 0 ? (
               <div className="grid gap-6">
                 {publishedPosts.map(post => (
                   <PostCard key={post.id} post={post} />
                 ))}
               </div>
             ) : (
               <div className="p-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center">
                 <p className="text-slate-500">No research published yet.</p>
                 {isOwnProfile && (
                   <Button variant="outline" className="mt-4" onClick={() => navigate('/lab/new')}>
                     Start writing
                   </Button>
                 )}
               </div>
             )}
           </div>
         </div>
      )}
      
      {activeTab === 'drafts' && isOwnProfile && (
         <div className="animate-in fade-in space-y-4">
           <div className="flex justify-between items-center mb-4">
             <p className="text-slate-400 text-sm">Private drafts only visible to you.</p>
             <Button size="sm" onClick={() => navigate('/lab/new')}> <FileText size={14} className="mr-2" /> New Draft</Button>
           </div>
           
           {draftPosts.length > 0 ? (
             <div className="grid md:grid-cols-2 gap-6">
                {draftPosts.map(draft => (
                  <div key={draft.id} className="bg-slate-900/30 border border-dashed border-slate-700 rounded-xl p-6 hover:bg-slate-900/50 transition-colors group relative">
                     <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-2">
                         <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wide">Draft</span>
                         <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> Last edited today</span>
                       </div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-200 mb-2">{draft.title}</h3>
                     <p className="text-slate-500 text-sm line-clamp-2 mb-6">{draft.subtitle || "No content preview..."}</p>
                     
                     <div className="flex gap-3">
                       <Button size="sm" onClick={() => navigate('/lab/new')} className="w-full">
                         <Edit size={14} className="mr-2" /> Continue Editing
                       </Button>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="p-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center">
                <FileText size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Your workspace is empty</h3>
                <p className="text-slate-500 mb-6">Drafts you create will appear here.</p>
                <Button onClick={() => navigate('/lab/new')}>Create new draft</Button>
             </div>
           )}
         </div>
      )}

      {activeTab === 'network' && (
         <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
           <div>
             <h3 className="text-lg font-bold text-white mb-4">Following Users</h3>
             {followedUsersList.length > 0 ? (
               <div className="space-y-3">
                 {followedUsersList.map((u, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-lg">
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-slate-800 overflow-hidden">
                         {u.avatarUrl ? <img src={u.avatarUrl} className="h-full w-full" /> : <User size={20} className="m-2.5 text-slate-500" />}
                       </div>
                       <div>
                         <div className="font-bold text-slate-200">{u.name}</div>
                         <div className="text-xs text-slate-500">{u.expertise.slice(0, 2).join(', ')}</div>
                       </div>
                     </div>
                     {isOwnProfile && (
                        <Button size="sm" variant="ghost" onClick={() => handleUnfollowUser(u.id || '')}>
                          <UserMinus size={16} />
                        </Button>
                     )}
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-slate-500 text-sm">Not following anyone yet.</p>
             )}
           </div>

           <div>
             <h3 className="text-lg font-bold text-white mb-4">Following Tags</h3>
             {profileUser.followingTags.length > 0 ? (
               <div className="flex flex-wrap gap-3">
                 {profileUser.followingTags.map(tag => (
                   <div key={tag} className="flex items-center gap-2 px-3 py-2 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-sm">
                     <Hash size={14} /> {tag}
                     {isOwnProfile && (
                       <button onClick={() => handleUnfollowTag(tag)} className="hover:text-white ml-1">
                         <X size={14} />
                       </button>
                     )}
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-slate-500 text-sm">No tags followed.</p>
             )}
           </div>
         </div>
      )}
    </div>
  );
};
