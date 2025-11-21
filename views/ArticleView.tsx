import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_POSTS } from '../constants';
import { Button } from '../components/ui/Button';
import { Discussion } from '../components/Discussion';
import { MarkdownRenderer, MarkdownTheme } from '../utils/markdown';
import { MessageSquare, ThumbsUp, Share2, Bookmark, ArrowLeft, Type, Minus, Plus } from 'lucide-react';

export const ArticleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = MOCK_POSTS.find(p => p.slug === slug) || MOCK_POSTS[0];

  // Local interaction state
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);
  
  // Reader Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0=sm, 1=base, 2=lg, 3=xl
  const [theme, setTheme] = useState<MarkdownTheme>('dark');

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

  // --- Theme & Style Config ---
  const themeStyles = {
    dark: {
      container: 'bg-slate-900/20 border-slate-800/50',
      header: 'border-b border-slate-800 bg-slate-900/50',
      text: 'text-slate-300',
      title: 'text-white',
      subtitle: 'text-slate-400',
      metaPrimary: 'text-slate-200',
      metaSecondary: 'text-slate-500'
    },
    light: {
      container: 'bg-white border-slate-200 shadow-xl shadow-black/5',
      header: 'border-b border-slate-100 bg-slate-50',
      text: 'text-slate-800',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
      metaPrimary: 'text-slate-800',
      metaSecondary: 'text-slate-500'
    },
    sepia: {
      container: 'bg-[#f1e7d0] border-[#e3d5b8] shadow-xl shadow-black/5',
      header: 'border-b border-[#e3d5b8] bg-[#e8dec0]',
      text: 'text-[#433422]',
      title: 'text-[#433422]',
      subtitle: 'text-[#5f4b32]',
      metaPrimary: 'text-[#433422]',
      metaSecondary: 'text-[#8c7355]'
    }
  };

  const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
  const currentStyle = themeStyles[theme];

  return (
    <div className="max-w-4xl mx-auto fade-in pb-32 relative">
       <Button 
         variant="ghost" 
         size="sm" 
         className="mb-6 -ml-4 text-slate-500 hover:text-slate-200"
         onClick={() => navigate(-1)}
       >
         <ArrowLeft size={16} className="mr-2" /> Back
       </Button>

       {/* Dynamic Article Container */}
       <article className={`rounded-2xl border overflow-hidden mb-12 transition-colors duration-300 ${currentStyle.container}`}>
         {/* Header */}
         <div className={`p-8 md:p-12 ${currentStyle.header}`}>
           <div className="flex gap-2 mb-6">
             {post.tags.map((tag: any) => (
               <span key={tag.id} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                 #{tag.name}
               </span>
             ))}
           </div>
           
           <h1 className={`text-3xl md:text-5xl font-bold mb-6 leading-tight ${currentStyle.title}`}>
             {post.title}
           </h1>
           
           {post.subtitle && (
             <p className={`text-xl mb-8 leading-relaxed ${currentStyle.subtitle}`}>
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
                 <div className={`font-medium ${currentStyle.metaPrimary}`}>{post.author.name}</div>
                 <div className={`text-sm ${currentStyle.metaSecondary}`}>{post.author.expertise.join(' • ')}</div>
               </div>
             </div>
             <div className="text-right">
               <div className={`text-sm font-medium ${currentStyle.metaPrimary}`}>{post.publishedAt}</div>
               <div className={`text-sm ${currentStyle.metaSecondary}`}>{post.readTimeMinutes} min read</div>
             </div>
           </div>
         </div>

         {/* Body with Dynamic Font and Text Color */}
         <div className={`p-8 md:p-12 max-w-3xl mx-auto ${currentStyle.text} ${fontSizes[fontSizeIndex]}`}>
           <MarkdownRenderer content={post.content} theme={theme} />
         </div>
       </article>

       {/* Discussion Section */}
       <div className="mt-16" id="discussion">
         <Discussion postId={post.id} />
       </div>

       {/* Action Bar */}
       <div className="sticky bottom-8 mt-8 mx-auto max-w-fit z-20 flex flex-col items-center gap-4">
         {/* Settings Popover */}
         {showSettings && (
           <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl shadow-black w-64 animate-in slide-in-from-bottom-5 fade-in duration-200 mb-2">
             <div className="mb-4">
               <div className="text-xs font-bold text-slate-500 uppercase mb-2">Font Size</div>
               <div className="flex items-center justify-between bg-slate-950 rounded-lg p-1 border border-slate-800">
                 <button 
                   onClick={() => setFontSizeIndex(Math.max(0, fontSizeIndex - 1))}
                   className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                   disabled={fontSizeIndex === 0}
                 >
                   <Minus size={16} />
                 </button>
                 <span className="text-sm font-medium text-slate-200">
                   {fontSizeIndex === 0 ? 'Small' : fontSizeIndex === 1 ? 'Default' : fontSizeIndex === 2 ? 'Large' : 'X-Large'}
                 </span>
                 <button 
                   onClick={() => setFontSizeIndex(Math.min(3, fontSizeIndex + 1))}
                   className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30"
                   disabled={fontSizeIndex === 3}
                 >
                   <Plus size={16} />
                 </button>
               </div>
             </div>
             <div>
               <div className="text-xs font-bold text-slate-500 uppercase mb-2">Theme</div>
               <div className="grid grid-cols-3 gap-2">
                 <button 
                   onClick={() => setTheme('dark')}
                   className={`h-8 rounded-md border flex items-center justify-center text-xs font-medium ${theme === 'dark' ? 'border-primary ring-1 ring-primary bg-slate-800 text-white' : 'border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-800'}`}
                 >
                   Dark
                 </button>
                 <button 
                   onClick={() => setTheme('light')}
                   className={`h-8 rounded-md border flex items-center justify-center text-xs font-medium ${theme === 'light' ? 'border-primary ring-1 ring-primary bg-white text-slate-900' : 'border-slate-700 bg-slate-200 text-slate-600 hover:bg-white'}`}
                 >
                   Light
                 </button>
                 <button 
                   onClick={() => setTheme('sepia')}
                   className={`h-8 rounded-md border flex items-center justify-center text-xs font-medium ${theme === 'sepia' ? 'border-primary ring-1 ring-primary bg-[#f1e7d0] text-[#433422]' : 'border-slate-700 bg-[#e8dec0] text-[#5f4b32] hover:bg-[#f1e7d0]'}`}
                 >
                   Sepia
                 </button>
               </div>
             </div>
           </div>
         )}

         <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-700 rounded-full shadow-2xl shadow-black/50 backdrop-blur-md">
           <Button 
             variant="ghost" 
             className={`rounded-full h-14 w-14 p-0 transition-colors ${liked ? 'text-pink-500 hover:text-pink-600 bg-pink-500/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
             onClick={handleLike}
             title="Like"
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
             title="Comments"
           >
             <MessageSquare size={24} />
           </Button>
           
           <Button 
             variant="ghost" 
             className={`rounded-full h-14 w-14 p-0 transition-colors ${showSettings ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
             onClick={() => setShowSettings(!showSettings)}
             title="Reader Settings"
           >
             <Type size={24} />
           </Button>

           <Button 
             variant="ghost" 
             className={`rounded-full h-14 w-14 p-0 transition-colors ${bookmarked ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
             onClick={() => setBookmarked(!bookmarked)}
             title="Bookmark"
           >
             <Bookmark size={24} className={bookmarked ? "fill-current" : ""} />
           </Button>
           
           <Button 
             variant="ghost" 
             className="rounded-full h-14 w-14 p-0 text-slate-400 hover:text-primary hover:bg-primary/10"
             onClick={handleShare}
             title="Share"
           >
             <Share2 size={24} />
           </Button>
         </div>
       </div>
    </div>
  );
};