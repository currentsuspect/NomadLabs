import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Sparkles, Clock } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  isRecommended?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isRecommended }) => {
  const isPaper = post.type === 'PAPER';
  
  return (
    <Link 
      to={`/read/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:shadow-indigo-500/10 ${
        isRecommended 
          ? 'border-indigo-500/30 bg-indigo-950/10 hover:bg-indigo-900/20' 
          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      {/* "PICK" Badge - Fixed positioning to not obstruct date. Now a corner ribbon style. */}
      {isRecommended && (
        <div className="absolute top-0 right-0 z-10">
          <div className="flex items-center gap-1 px-3 py-1 rounded-bl-xl bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
            <Sparkles size={10} /> Pick
          </div>
        </div>
      )}

      <div className="mb-4 pt-6 px-6 flex items-center justify-between">
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
        {/* Date is safe now */}
        <span className="text-xs text-slate-500">{post.publishedAt}</span>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col">
        <h3 className="mb-2 text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-400 flex-1">
          {post.subtitle || post.abstract}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 flex-wrap">
             {post.tags.slice(0, 3).map((tag) => (
               <span key={tag.id} className="text-xs text-slate-500 font-mono">#{tag.name}</span>
             ))}
          </div>
          <div className="flex items-center text-xs text-slate-500 gap-1 flex-shrink-0">
             <Clock size={12} /> {post.readTimeMinutes} min
          </div>
        </div>
      </div>
    </Link>
  );
};