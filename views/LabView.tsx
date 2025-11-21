import React from 'react';
import { MOCK_POSTS } from '../constants';
import { Button } from '../components/ui/Button';
import { PenTool, TrendingUp, MessageCircle, ArrowRight, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

export const LabView: React.FC = () => {
  const notes = MOCK_POSTS.filter(p => p.type === 'LAB_NOTE' || p.type === 'ARTICLE');
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto fade-in">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
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
          {user && (
            <Link to="/lab/new" className="flex-shrink-0">
              <Button className="shadow-lg shadow-indigo-500/20">
                <PenTool size={16} className="mr-2" /> New Entry
              </Button>
            </Link>
          )}
        </div>
        
        {/* Stats / Ticker (Visual Flair) */}
        <div className="flex gap-8 py-4 border-y border-slate-800 text-xs font-mono text-slate-500 overflow-x-auto">
          <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div> 12 active experiments</span>
          <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-indigo-500"></div> 483 comments today</span>
          <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-orange-500"></div> WASM Audio Worklet</span>
          <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-sky-500"></div> GPU Compute</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
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
                   {/* Badge */}
                   <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wide">
                     {note.type.replace('_', ' ')}
                   </span>
                 </div>

                 <Link to={`/read/${note.slug}`}>
                   <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-primary transition-colors">
                     {note.title}
                   </h3>
                   <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3">
                     {note.content}
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
                        <TrendingUp size={14} /> 24
                      </span>
                      <span className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer">
                        <MessageCircle size={14} /> 8
                      </span>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Community Pulse */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-orange-500" /> Trending Now
            </h3>
            <ul className="space-y-4">
              <li className="group cursor-pointer">
                <div className="text-sm font-medium text-slate-300 group-hover:text-primary transition-colors">
                  Rust vs C++ for DSP
                </div>
                <div className="text-xs text-slate-500 mt-1">128 comments • 4h ago</div>
              </li>
              <li className="group cursor-pointer">
                <div className="text-sm font-medium text-slate-300 group-hover:text-primary transition-colors">
                  WebGPU Compute Shaders for FFT
                </div>
                <div className="text-xs text-slate-500 mt-1">85 comments • 2h ago</div>
              </li>
              <li className="group cursor-pointer">
                <div className="text-sm font-medium text-slate-300 group-hover:text-primary transition-colors">
                  Latency issues in Chrome 118
                </div>
                <div className="text-xs text-slate-500 mt-1">42 comments • 1d ago</div>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-indigo-500/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Share your findings</h3>
            <p className="text-sm text-slate-400 mb-4">
              Working on something cool? Don't wait for the final paper. Share early results and get feedback.
            </p>
            <Link to="/lab/new">
              <Button variant="outline" size="sm" className="w-full border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300">
                Start a Log <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};