import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_POSTS } from '../constants';
import { Button } from '../components/ui/Button';
import { Discussion } from '../components/Discussion';
import { MarkdownRenderer } from '../utils/markdown';
import { MessageSquare, ThumbsUp, Share2, Bookmark, ArrowLeft } from 'lucide-react';

export const ArticleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = MOCK_POSTS.find(p => p.slug === slug) || MOCK_POSTS[0];

  // Local interaction state
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);

  const handleLike = () => {
    if (liked) {
      setLikeCount(c => c - 1);
    } else {
      setLikeCount(c => c + 1);
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto fade-in pb-32">
       <Button 
         variant="ghost" 
         size="sm" 
         className="mb-6 -ml-4 text-slate-500 hover:text-slate-200"
         onClick={() => navigate(-1)}
       >
         <ArrowLeft size={16} className="mr-2" /> Back
       </Button>

       <article className="bg-slate-900/20 rounded-2xl border border-slate-800/50 overflow-hidden mb-12">
         {/* Header */}
         <div className="border-b border-slate-800 bg-slate-900/50 p-8 md:p-12">
           <div className="flex gap-2 mb-6">
             {post.tags.map((tag: any) => (
               <span key={tag.id} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                 #{tag.name}
               </span>
             ))}
           </div>
           
           <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
             {post.title}
           </h1>
           
           {post.subtitle && (
             <p className="text-xl text-slate-400 mb-8 leading-relaxed">
               {post.subtitle}
             </p>
           )}

           <div className="flex items-center justify-between mt-8">
             <div className="flex items-center gap-4">
               <img 
                 src={post.author.avatarUrl} 
                 alt={post.author.name} 
                 className="w-12 h-12 rounded-full ring-2 ring-slate-800"
               />
               <div>
                 <div className="font-medium text-slate-200">{post.author.name}</div>
                 <div className="text-sm text-slate-500">{post.author.expertise.join(' • ')}</div>
               </div>
             </div>
             <div className="text-right">
               <div className="text-sm font-medium text-slate-200">{post.publishedAt}</div>
               <div className="text-sm text-slate-500">{post.readTimeMinutes} min read</div>
             </div>
           </div>
         </div>

         {/* Body */}
         <div className="p-8 md:p-12 max-w-3xl mx-auto">
           <MarkdownRenderer content={post.content} />
         </div>
       </article>

       {/* Discussion Section */}
       <div className="mt-16" id="discussion">
         <Discussion postId={post.id} />
       </div>

       {/* Action Bar */}
       <div className="sticky bottom-8 mt-8 mx-auto max-w-fit z-20">
         <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-700 rounded-full shadow-2xl shadow-black/50 backdrop-blur-md">
           <Button 
             variant="ghost" 
             className={`rounded-full h-14 w-14 p-0 transition-colors ${liked ? 'text-pink-500 hover:text-pink-600 bg-pink-500/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
             onClick={handleLike}
           >
             <ThumbsUp size={24} className={liked ? "fill-current" : ""} />
           </Button>
           <span className={`text-sm font-bold px-1 transition-colors ${liked ? 'text-pink-500' : 'text-slate-500'}`}>
             {likeCount}
           </span>
           
           <div className="w-px h-6 bg-slate-800 mx-2"></div>
           
           <Button 
             variant="ghost" 
             className="rounded-full h-14 w-14 p-0 text-slate-400 hover:text-primary hover:bg-primary/10"
             onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })}
           >
             <MessageSquare size={24} />
           </Button>
           
           <Button 
             variant="ghost" 
             className={`rounded-full h-14 w-14 p-0 transition-colors ${bookmarked ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
             onClick={() => setBookmarked(!bookmarked)}
           >
             <Bookmark size={24} className={bookmarked ? "fill-current" : ""} />
           </Button>
           
           <Button 
             variant="ghost" 
             className="rounded-full h-14 w-14 p-0 text-slate-400 hover:text-primary hover:bg-primary/10"
             onClick={handleShare}
           >
             <Share2 size={24} />
           </Button>
         </div>
       </div>
    </div>
  );
};