import React from 'react';
import { MOCK_POSTS } from '../constants';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Zap, ArrowRight, Play, Brain, Sparkles, TrendingUp } from 'lucide-react';
import { PostCard } from '../components/PostCard';

export const HomeView: React.FC = () => {
  const { user } = useAuth();

  // Logic: Featured Post is the latest Paper
  const featuredPost = MOCK_POSTS.find(p => p.type === 'PAPER');

  // Logic: Recommended posts based on user expertise
  const getRecommendedPosts = () => {
    if (!user || !user.expertise) return [];
    return MOCK_POSTS.filter(post => {
      const matches = post.tags.some(tag => 
        user.expertise.some(exp => exp.toLowerCase() === tag.name.toLowerCase())
      );
      return matches && post.id !== featuredPost?.id; // Don't recommend the featured post again
    }).slice(0, 3);
  };

  const recommendedPosts = getRecommendedPosts();
  // Latest feed excludes featured and recommended to avoid dupes (simple version)
  const latestPosts = MOCK_POSTS.filter(p => 
    p.id !== featuredPost?.id && !recommendedPosts.find(r => r.id === p.id)
  );

  return (
    <div className="space-y-16 fade-in">
      
      {/* 1. Hero / Featured Section (Always visible, user requested it back) */}
      {featuredPost && (
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 p-8 md:p-12">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <Zap size={12} /> Featured Research
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
              {featuredPost.title}
            </h1>
            <p className="mb-8 text-lg text-slate-400 leading-relaxed max-w-2xl">
              {featuredPost.abstract}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/read/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Read Paper <ArrowRight size={16} />
              </Link>
              <button 
                onClick={() => alert('Demo loading...')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Play size={16} /> View Demo
              </button>
            </div>
          </div>
          
          {/* Abstract visual decorations */}
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-[80px] pointer-events-none"></div>
        </section>
      )}

      {/* 2. Recommended For You (Dynamic) */}
      {user && recommendedPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
              <Sparkles size={16} /> Recommended for you
            </div>
            <Link to="/explore" className="text-xs font-medium text-slate-500 hover:text-white transition-colors">
              View Preferences
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedPosts.map(post => (
              <PostCard key={post.id} post={post} isRecommended />
            ))}
          </div>
        </section>
      )}

      {/* 3. Latest Activity / Feed */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider">
          <TrendingUp size={16} /> Latest Updates
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {/* Add a dummy card to fill grid if needed */}
          <Link to="/explore" className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-8 hover:border-slate-600 hover:bg-slate-900/40 transition-all min-h-[240px]">
             <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <ArrowRight size={24} className="text-slate-400" />
             </div>
             <span className="font-medium text-slate-300">Browse All Research</span>
          </Link>
        </div>
      </section>

    </div>
  );
};