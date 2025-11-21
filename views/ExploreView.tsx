import React, { useState } from 'react';
import { MOCK_POSTS } from '../constants';
import { PostCard } from '../components/PostCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
  });

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-white">Explore Research</h1>
        <p className="text-slate-400 max-w-2xl">
          Search through our database of white papers, technical articles, and experimental lab notes.
        </p>
      </div>

      {/* Controls */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
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
      </div>
      
      {/* Results */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
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