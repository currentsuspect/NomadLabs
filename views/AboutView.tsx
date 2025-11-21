import React from 'react';
import { Shield, Cpu, Globe, Music } from 'lucide-react';

export const AboutView: React.FC = () => {
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
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
          <div className="h-12 w-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-6">
            <Cpu size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">High Performance</h3>
          <p className="text-slate-400 leading-relaxed">
            We treat the browser as a serious compilation target. From WebAssembly-powered granular synthesis to GPU-accelerated spectral visualization, we push for native-like performance.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
          <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Open Research</h3>
          <p className="text-slate-400 leading-relaxed">
            Knowledge shouldn't be locked behind paywalls. We publish our findings, white papers, and experimental results as open-access resources for the community.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
          <div className="h-12 w-12 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-400 mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Peer Reviewed</h3>
          <p className="text-slate-400 leading-relaxed">
            Our "Member" and "Reviewer" roles ensure that published research meets industry standards. We foster a culture of constructive critique and validation.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">12k+</div>
            <div className="text-sm text-slate-500">Monthly Readers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">450+</div>
            <div className="text-sm text-slate-500">Open Source Commits</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">89</div>
            <div className="text-sm text-slate-500">Research Papers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <div className="text-sm text-slate-500">Core Maintainers</div>
          </div>
        </div>
      </section>
    </div>
  );
};