
import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Globe, Music, Users as UsersIcon, FileText, GitCommit, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Post, User } from '../types';

export const AboutView: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    papers: 0,
    maintainers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, posts] = await Promise.all([
          api.users.getAll(),
          api.posts.list()
        ]);

        setStats({
          users: users.length,
          posts: posts.length,
          papers: posts.filter(p => p.type === 'PAPER' || p.type === 'ARTICLE').length,
          maintainers: users.filter(u => u.role === 'ADMIN').length
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-16 fade-in pb-20">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          The Future of <span className="text-primary">Audio Intelligence</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nomad Labs is a decentralized collective of audio engineers, DSP researchers, and interface designers building the next generation of creative tools.
        </p>
      </section>

      {/* Mission Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/30 transition-colors">
          <div className="h-12 w-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-6">
            <Cpu size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">High Performance</h3>
          <p className="text-slate-400 leading-relaxed">
            We treat the browser as a serious compilation target. From WebAssembly-powered granular synthesis to GPU-accelerated spectral visualization, we push for native-like performance.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/30 transition-colors">
          <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Open Research</h3>
          <p className="text-slate-400 leading-relaxed">
            Knowledge shouldn't be locked behind paywalls. We publish our findings, white papers, and experimental results as open-access resources for the community.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-sky-500/30 transition-colors">
          <div className="h-12 w-12 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-400 mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Peer Reviewed</h3>
          <p className="text-slate-400 leading-relaxed">
            Our "Member" and "Reviewer" roles ensure that published research meets industry standards. We foster a culture of constructive critique and validation.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-rose-500/30 transition-colors">
          <div className="h-12 w-12 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400 mb-6">
            <Music size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Artistic Tooling</h3>
          <p className="text-slate-400 leading-relaxed">
            Technology serves creativity. Our ultimate goal is to build the "Nomad DAW" ecosystem—modular, web-based, and collaborative.
          </p>
        </div>
      </section>

      {/* Team Stats */}
      <section className="border-t border-slate-800 pt-16">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                 {stats.users} <UsersIcon size={20} className="text-slate-600" />
              </div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Members</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                {stats.posts} <FileText size={20} className="text-slate-600" />
              </div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Publications</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                {stats.papers} <Globe size={20} className="text-slate-600" />
              </div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Major Papers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                {stats.maintainers} <GitCommit size={20} className="text-slate-600" />
              </div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Admins</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
