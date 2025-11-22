
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useNotification } from '../components/NotificationProvider';
import { Button } from '../components/ui/Button';
import { MarkdownRenderer } from '../utils/markdown';
import { ArrowLeft, Save, Image as ImageIcon, Code, MoreVertical, Eye, Edit3, FileText, ChevronRight } from 'lucide-react';

export const EditorView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Empty by default, usage instructions in placeholder
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Auto-resize text area
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleSave = (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
        addNotification({ type: 'warning', title: 'Missing Title', message: 'Please give your entry a title.' });
        return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
      addNotification({ 
        type: 'success', 
        title: status === 'DRAFT' ? 'Draft Saved' : 'Published!', 
        message: status === 'DRAFT' ? 'Saved to your workspace.' : 'Your note is now live.' 
      });
    }, 800);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto fade-in h-full flex flex-col min-h-[60vh] items-center justify-center text-center space-y-6">
        <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center ring-1 ring-slate-700">
          <FileText size={32} className="text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Please sign in to create a new lab note. Your drafts will be saved to your account.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/lab')}>Cancel</Button>
          <Button onClick={() => navigate('/auth?from=/lab/new')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto fade-in min-h-[90vh] flex flex-col pb-20">
      {/* Enhanced Workspace Header */}
      <div className="sticky top-0 z-30 bg-[#020617]/95 backdrop-blur-md py-4 mb-8 border-b border-slate-800/50 -mx-4 px-4 md:px-0 md:mx-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} 
                className="h-10 w-10 p-0 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                title="Back"
            >
                <ArrowLeft size={24} />
            </Button>
            
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Workspace</span>
                    <ChevronRight size={10} />
                    <span>Drafts</span>
                </div>
                <span className="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-md">
                    {title || 'Untitled Entry'}
                </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {lastSaved && !isSaving && (
               <span className="hidden sm:inline text-xs text-slate-500 mr-2 animate-in fade-in">
                 Saved {lastSaved}
               </span>
            )}
            
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPreview(!isPreview)}
                className="hidden sm:flex gap-2 text-slate-400"
                title={isPreview ? "Edit Mode" : "Preview Mode"}
            >
                {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                <span className="hidden md:inline">{isPreview ? 'Edit' : 'Preview'}</span>
            </Button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block mx-1"></div>

            <Button 
                variant="secondary" 
                onClick={() => handleSave('DRAFT')} 
                disabled={isSaving} 
                size="sm"
                className="hidden sm:flex"
            >
              Save Draft
            </Button>
            
            <Button 
                onClick={() => handleSave('PUBLISHED')} 
                disabled={isSaving} 
                size="sm" 
                className={isSaving ? 'opacity-80' : ''}
            >
              {isSaving ? 'Processing...' : 'Publish'}
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:hidden">
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor / Preview Surface */}
      <div className="flex-1 relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
        {isPreview ? (
            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-p:text-slate-300 prose-p:text-lg prose-p:leading-8">
                <h1>{title || 'Untitled Entry'}</h1>
                <MarkdownRenderer content={content || '*No content...*'} />
            </div>
        ) : (
            <>
                {/* Title Input */}
                <input
                type="text"
                placeholder="Untitled Entry"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder:text-slate-700 focus:outline-none mb-8"
                autoFocus
                />

                {/* Slash Command Hint (Desktop) */}
                <div className="absolute left-0 top-24 -ml-12 hidden xl:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-800/50 text-slate-500 text-xs font-bold border border-slate-700" title="Add Block">+</div>
                    <div className="h-8 w-8 rounded flex items-center justify-center hover:bg-slate-800 text-slate-600 hover:text-slate-300 cursor-pointer transition-colors" title="Image"><ImageIcon size={16} /></div>
                    <div className="h-8 w-8 rounded flex items-center justify-center hover:bg-slate-800 text-slate-600 hover:text-slate-300 cursor-pointer transition-colors" title="Code"><Code size={16} /></div>
                </div>

                {/* Content Area */}
                <textarea
                className="w-full bg-transparent border-none text-lg text-slate-300 leading-relaxed focus:outline-none resize-none min-h-[60vh] placeholder:text-slate-700"
                value={content}
                onChange={handleContentChange}
                placeholder={`Start writing your lab note... 

Use markdown shortcuts:
- # for headings
- **bold** for emphasis
- \`code\` for inline code`}
                spellCheck={false}
                style={{ height: 'auto' }} 
                ref={(ref) => {
                    if (ref && ref.style.height === 'auto') {
                        ref.style.height = ref.scrollHeight + 'px';
                    }
                }}
                />
            </>
        )}
      </div>
    </div>
  );
};
