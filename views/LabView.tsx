import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { PenTool, TrendingUp, MessageCircle, ArrowRight, FlaskConical, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { api } from '../services/api';
import { Post, Comment } from '../types';

export const LabView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    Promise.all([api.posts.list(), api.comments.list()]).then(([p, c]) => {
      setPosts(p);
      setComments(c);
    });
  }, []);

  const notes = posts.filter(p => (p.type === 'LAB_NOTE' || p.type === 'ARTICLE') && p.status === 'PUBLISHED');
  const activeExperiments = notes.length;
  const totalComments = comments.length;
  
  const allTags = posts.flatMap(p => p.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag.name] = (acc[tag.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const trendingTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name);

  const handleCreateClick = () => {
    if (user) {
      navigate('/lab/new');
    } else {
      navigate('/auth?from=/lab/new');
    }
  };

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
             <h1 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
               <FlaskConical className="text-emerald-500" size={32} />
               Lab Notes
             </h1>
             <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
               A feed of informal experiments, findings, and daily logs from the community. 
               Like a communal lab notebook for open science.
             </p>
          </div>
          <div className="flex-shrink-0">
            <Button className="shadow-lg shadow-indigo-500/20" onClick={handleCreateClick}>
              <PenTool size={16} className="mr-2" /> {user ? 'New Entry' : 'Sign in to Post'}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 py-3 px-4 border-y border-slate-800 bg-slate-900/20 rounded-lg backdrop-blur-sm text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="font-bold text-white">{activeExperiments}</span> Entries in Database
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" />
            <span className="font-bold text-white">{totalComments}</span> Global Comments
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex items-center gap-1.5 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <TrendingUp size={12} /> Trending:
            </span>
            <div className="flex gap-2">
              {trendingTags.map(tag => (
                <span key={tag} className="flex items-center text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group">
               <div className="p-6">
                 <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <img 
                        src={note.author.avatarUrl} 
                        alt={note.author.name} 
                        className="w-10 h-10 rounded-full ring-2 ring-slate-800"
                     />
                     <div>
                       <div className="text-sm font-semibold text-slate-200">{note.author.name}</div>
                       <div className="text-xs text-slate-500">{note.publishedAt} • {note.readTimeMinutes} min read</div>
                     </div>
                   </div>
                   <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wide">
                     {note.type.replace('_', ' ')}
                   </span>
                 </div>

                 <Link to={`/read/${note.slug}`}>
                   <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-primary transition-colors">
                     {note.title}
                   </h3>
                   <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3">
                     {note.content.substring(0, 200)}...
                   </p>
                 </Link>

                 <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                   <div className="flex gap-2">
                      {note.tags.map((tag: any) => (
                        <span key={tag.id} className="text-xs font-mono bg-slate-950 border border-slate-800/50 px-2 py-1 rounded text-slate-500">
                          #{tag.name}
                        </span>
                      ))}
                   </div>
                   
                   <div className="flex gap-4 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1 hover:text-pink-500 transition-colors cursor-pointer">
                        <TrendingUp size={14} /> {Math.floor(Math.random() * 50) + 10}
                      </span>
                      <span className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer">
                        <MessageCircle size={14} /> {Math.floor(Math.random() * 10)}
                      </span>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={16} className="text-orange-500" /> Live Activity
            </h3>
            <ul className="space-y-4">
              <li className="group cursor-pointer relative pl-4 border-l-2 border-slate-800 hover:border-indigo-500 transition-colors">
                <div className="text-sm font-medium text-slate-300 group-hover:text-primary transition-colors">
                  Rust vs C++ for DSP
                </div>
                <div className="text-xs text-slate-500 mt-1">New comment • 4m ago</div>
              </li>
              <li className="group cursor-pointer relative pl-4 border-l-2 border-slate-800 hover:border-emerald-500 transition-colors">
                <div className="text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition-colors">
                  WebGPU Compute Shaders
                </div>
                <div className="text-xs text-slate-500 mt-1">New experiment • 2h ago</div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-indigo-500/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Share your findings</h3>
            <p className="text-sm text-slate-400 mb-4">
              Working on something cool? Don't wait for the final paper. Share early results and get feedback.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300"
              onClick={handleCreateClick}
            >
              {user ? 'Start a Log' : 'Sign in to Share'} <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};