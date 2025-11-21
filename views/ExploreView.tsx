import React, { useState } from 'react';
import { MOCK_POSTS } from '../constants';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Zap, ArrowRight, Clock, Play, Search, SlidersHorizontal } from 'lucide-react';

const PostCard: React.FC<{ post: any }> = ({ post }) => {
  const isPaper = post.type === 'PAPER';
  
  return (
    <Link 
      to={`/read/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
             isPaper 
              ? 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/30' 
              : 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/30'
           }`}>
             {isPaper ? <BookOpen size={12} className="mr-1" /> : <FileText size={12} className="mr-1" />}
             {post.type}
           </span>
           {isPaper && post.version && (
             <span className="text-xs text-slate-500 font-mono">v{post.version}</span>
           )}
        </div>
        <span className="text-xs text-slate-500">{post.publishedAt}</span>
      </div>

      <h3 className="mb-2 text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-slate-400">
        {post.subtitle || post.abstract}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2">
           {post.tags.map((tag: any) => (
             <span key={tag.id} className="text-xs text-slate-500 font-mono">#{tag.name}</span>
           ))}
        </div>
        <div className="flex items-center text-xs text-slate-500 gap-1">
           <Clock size={12} /> {post.readTimeMinutes} min
        </div>
      </div>
    </Link>
  );
};

export const ExploreView: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPost = MOCK_POSTS.find(p => p.type === 'PAPER');

  const filteredPosts = MOCK_POSTS.filter(p => {
    // Filter by Category
    const matchesCategory = filter === 'All' 
      ? true 
      : filter === 'Papers' 
        ? p.type === 'PAPER'
        : filter === 'Articles'
          ? p.type === 'ARTICLE'
          : p.type === 'LAB_NOTE';

    // Filter by Search
    const query = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(query) || 
                          p.abstract?.toLowerCase().includes(query) || 
                          p.tags.some(t => t.name.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  }).filter(p => p.id !== featuredPost?.id); // Exclude featured from list if possible, or show all

  const handleDemoClick = () => {
    alert("Launching interactive WASM environment...\n(This is a demo action)");
  };

  return (
    <div className="space-y-12 fade-in">
      {/* Hero Section */}
      {featuredPost && !searchQuery && filter === 'All' && (
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <Zap size={12} /> Featured Research
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              {featuredPost.title}
            </h1>
            <p className="mb-8 text-lg text-slate-400">
              {featuredPost.abstract}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/read/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Read Paper <ArrowRight size={16} />
              </Link>
              <button 
                onClick={handleDemoClick}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Play size={16} /> View Demo
              </button>
            </div>
          </div>
          {/* Abstract visual decoration */}
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl"></div>
        </section>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Papers', 'Articles', 'Notes'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-slate-100 text-slate-900' 
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-4 text-sm text-slate-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Results */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
           <SlidersHorizontal size={48} className="mx-auto text-slate-700 mb-4" />
           <h3 className="text-lg font-medium text-white">No results found</h3>
           <p className="text-slate-500">Try adjusting your search or filters.</p>
           <button 
             onClick={() => { setFilter('All'); setSearchQuery(''); }}
             className="mt-4 text-primary hover:underline text-sm"
           >
             Clear filters
           </button>
        </div>
      )}
    </div>
  );
};