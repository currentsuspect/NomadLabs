import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MarkdownRenderer } from '../utils/markdown';
import { ArrowLeft, Save, Image as ImageIcon, Code, Type, Eye, Edit3 } from 'lucide-react';

export const EditorView: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# Lab Note\n\nStart writing here...\n\nTry using **bold** text, *italics*, or code blocks:\n\n```rust\nfn main() {\n    println!("Hello Nomad");\n}\n```');
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const handleSave = () => {
    if (!title) return alert('Please enter a title');
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved successfully!');
      navigate('/lab');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto fade-in h-full flex flex-col min-h-[80vh]">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
            <ArrowLeft size={18} />
          </Button>
          <span className="text-slate-500 text-sm">Draft / {title || 'Untitled'}</span>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex gap-1 mr-2">
             <button 
               onClick={() => setMode('edit')}
               className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'edit' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <span className="flex items-center gap-1.5"><Edit3 size={12} /> Write</span>
             </button>
             <button 
               onClick={() => setMode('preview')}
               className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'preview' ? 'bg-indigo-500/10 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
             >
               <span className="flex items-center gap-1.5"><Eye size={12} /> Preview</span>
             </button>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
            {isSaving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Draft</>}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col">
        {mode === 'edit' ? (
          <div className="space-y-6 flex-1 animate-in fade-in duration-200">
            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-slate-700 focus:outline-none"
              autoFocus
            />

            <div className="flex gap-2 mb-2 text-slate-400">
               <button className="p-2 hover:bg-slate-800 rounded transition-colors" title="Bold"><Type size={16} /></button>
               <button className="p-2 hover:bg-slate-800 rounded transition-colors" title="Code Block"><Code size={16} /></button>
               <button className="p-2 hover:bg-slate-800 rounded transition-colors" title="Insert Image"><ImageIcon size={16} /></button>
            </div>

            <textarea
              className="w-full flex-1 min-h-[50vh] bg-slate-900/30 border border-slate-800 rounded-lg p-6 text-slate-300 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none selection:bg-primary/30"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write using Markdown..."
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h1 className="text-4xl font-bold text-white mb-8 pb-2 border-b border-slate-800/50">{title || "Untitled Draft"}</h1>
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};