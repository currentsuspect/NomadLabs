
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Book, Users, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const GuidelinesView: React.FC = () => (
  <div className="max-w-3xl mx-auto fade-in pb-20">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
        <Shield className="text-indigo-500" size={32} /> Community Guidelines
      </h1>
      <p className="text-slate-400 leading-relaxed text-lg">
        Nomad Labs is dedicated to high-quality discourse in audio engineering and research. 
        To maintain our signal-to-noise ratio, we ask all members to adhere to the following principles.
      </p>
    </div>

    <div className="space-y-8">
      <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">1. Rigor & Reproducibility</h2>
        <p className="text-slate-400 mb-4">
          When sharing experimental results ("Lab Notes") or formal papers, ensure your findings can be reproduced. 
          Include code snippets, audio samples, or detailed signal flow diagrams wherever possible.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">2. Constructive Critique</h2>
        <p className="text-slate-400 mb-4">
          We encourage peer review. Disagreement is healthy; disrespect is not. Attack the argument, not the author. 
          Low-effort comments (e.g., "+1", "nice") should be kept to reactions, reserving comments for meaningful discussion.
        </p>
      </section>

      <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">3. Open Source First</h2>
        <p className="text-slate-400 mb-4">
          Nomad Labs prioritizes open knowledge. While we respect proprietary research, posts that serve solely as marketing 
          for closed-source commercial products may be flagged or removed.
        </p>
      </section>
    </div>
  </div>
);

export const FellowshipsView: React.FC = () => (
  <div className="max-w-4xl mx-auto fade-in pb-20">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-white mb-4">Research Fellowships</h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto">
        Funded grants for independent researchers pushing the boundaries of Web Audio, WASM, and Embedded DSP.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Book size={120} />
        </div>
        <div className="relative z-10">
          <div className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-2">Track A</div>
          <h2 className="text-2xl font-bold text-white mb-4">Core Audio Infrastructure</h2>
          <p className="text-slate-400 mb-6 h-20">
            Focuses on low-level improvements to the Web Audio API, AudioWorklet implementations, and Rust/WASM bridges.
          </p>
          <ul className="space-y-2 mb-8 text-sm text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> $5,000 - $15,000 Grant</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 3-6 Months Duration</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Technical Mentorship</li>
          </ul>
          <Button className="w-full">Apply for Track A</Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users size={120} />
        </div>
        <div className="relative z-10">
          <div className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-2">Track B</div>
          <h2 className="text-2xl font-bold text-white mb-4">Creative Tools & AI</h2>
          <p className="text-slate-400 mb-6 h-20">
            For researchers building generative music systems, neural synthesis models, or novel interfaces for composition.
          </p>
          <ul className="space-y-2 mb-8 text-sm text-slate-300">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> $5,000 - $20,000 Grant</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 6-12 Months Duration</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Exhibition Support</li>
          </ul>
          <Button className="w-full">Apply for Track B</Button>
        </div>
      </div>
    </div>

    <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-8 text-center">
      <h3 className="text-white font-bold mb-2">Application Cycle Status</h3>
      <p className="text-slate-400 mb-6">The current application window for Q4 2025 is now open.</p>
      <p className="text-xs text-slate-500">Next deadline: November 15th, 2025</p>
    </div>
  </div>
);

export const SubmitResearchView: React.FC = () => (
  <div className="max-w-2xl mx-auto fade-in min-h-[60vh] flex flex-col justify-center text-center pb-20">
    <div className="h-24 w-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-slate-800 shadow-2xl">
      <Mail className="text-white" size={40} />
    </div>
    
    <h1 className="text-4xl font-bold text-white mb-6">Submit Your Research</h1>
    <p className="text-xl text-slate-400 mb-8 leading-relaxed">
      We accept submissions for technical papers, case studies, and experimental lab notes.
    </p>

    <div className="grid gap-4 text-left max-w-md mx-auto w-full">
      <Link to="/lab/new" className="group flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors">
        <div>
          <div className="font-bold text-white">Open Editor</div>
          <div className="text-indigo-200 text-sm">Draft and publish directly</div>
        </div>
        <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
      </Link>

      <a href="mailto:submissions@nomadlabs.dev" className="group flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
        <div>
          <div className="font-bold text-white">Email Proposal</div>
          <div className="text-slate-400 text-sm">For PDF papers or large grants</div>
        </div>
        <ArrowRight className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
);
