import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Terminal, Image as ImageIcon, Table as TableIcon, Sigma } from 'lucide-react';

// Define global KaTeX interface
declare global {
  interface Window {
    katex: any;
  }
}

export type MarkdownTheme = 'dark' | 'light' | 'sepia';

interface MarkdownProps {
  content: string;
  className?: string;
  theme?: MarkdownTheme;
}

// --- Helper Components ---

const FrontmatterBlock: React.FC<{ content: string; theme: MarkdownTheme }> = ({ content, theme }) => {
  const lines = content.split('\n').filter(l => l.trim() !== '');
  
  // Theme styles
  const styles = {
    dark: {
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/5',
      headerBg: 'bg-indigo-500/10',
      headerText: 'text-indigo-300',
      keyText: 'text-indigo-400',
      valText: 'text-slate-300',
      pillBg: 'bg-indigo-500/10',
      pillText: 'text-indigo-300',
      pillBorder: 'border-indigo-500/20'
    },
    light: {
      border: 'border-indigo-200',
      bg: 'bg-indigo-50',
      headerBg: 'bg-indigo-100',
      headerText: 'text-indigo-700',
      keyText: 'text-indigo-600',
      valText: 'text-slate-700',
      pillBg: 'bg-white',
      pillText: 'text-indigo-700',
      pillBorder: 'border-indigo-200'
    },
    sepia: {
      border: 'border-[#d0c0a0]',
      bg: 'bg-[#e8dec0]/50',
      headerBg: 'bg-[#e8dec0]',
      headerText: 'text-[#5f4b32]',
      keyText: 'text-[#8c7355]',
      valText: 'text-[#433422]',
      pillBg: 'bg-[#f1e7d0]',
      pillText: 'text-[#5f4b32]',
      pillBorder: 'border-[#d0c0a0]'
    }
  };

  const s = styles[theme];

  return (
    <div className={`mb-8 rounded-lg border ${s.border} ${s.bg} overflow-hidden`}>
      <div className={`px-4 py-2 ${s.headerBg} border-b ${s.border} text-xs font-bold ${s.headerText} uppercase tracking-wider flex items-center gap-2`}>
        <TableIcon size={12} /> Metadata
      </div>
      <div className="p-4 grid grid-cols-1 gap-3 font-mono text-sm">
        {lines.map((line, i) => {
          const colonIndex = line.indexOf(':');
          if (colonIndex === -1) return null;
          
          const key = line.substring(0, colonIndex).trim();
          let val = line.substring(colonIndex + 1).trim();

          // Strip Quotes (Single or Double)
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }

          // Check for Array syntax [tag1, tag2]
          const isArray = val.startsWith('[') && val.endsWith(']');
          
          return (
            <div key={i} className="flex flex-col sm:flex-row sm:gap-4">
              <span className={`font-semibold min-w-[140px] opacity-80 ${s.keyText}`}>{key}</span>
              <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                {isArray ? (
                  val.slice(1, -1).split(',').map((item, idx) => {
                    const cleanItem = item.trim().replace(/^['"]|['"]$/g, ''); // Clean quotes inside array
                    if (!cleanItem) return null;
                    return (
                      <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.pillBg} ${s.pillText} ${s.pillBorder}`}>
                        {cleanItem}
                      </span>
                    );
                  })
                ) : (
                  <span className={`break-words ${s.valText}`}>{val}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LatexBlock: React.FC<{ formula: string; block?: boolean }> = ({ formula, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMath = () => {
      if (window.katex && containerRef.current) {
        if (document.compatMode === 'BackCompat') {
           console.warn("Page is in Quirks Mode. KaTeX disabled.");
           containerRef.current.innerText = formula;
           return true;
        }

        try {
          window.katex.render(formula, containerRef.current, {
            throwOnError: false,
            displayMode: block
          });
          return true;
        } catch (e) {
          console.error("KaTeX error:", e);
          containerRef.current.innerText = formula;
          return true;
        }
      }
      return false;
    };

    if (!renderMath()) {
      const intervalId = setInterval(() => {
        if (renderMath()) clearInterval(intervalId);
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [formula, block]);

  if (block) {
    return (
      <div 
        className="my-6 py-4 px-4 overflow-x-auto bg-black/5 rounded-lg border border-black/10 text-center text-lg" 
        ref={containerRef} 
      />
    );
  }

  return <span ref={containerRef} className="px-1 inline-block" />;
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting
  const highlightSyntax = (code: string) => {
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const keywords = [
      'const', 'let', 'var', 'function', 'fn', 'return', 'import', 'export', 'from', 
      'class', 'interface', 'type', 'struct', 'impl', 'pub', 'use', 'mod', 'match', 
      'if', 'else', 'for', 'while', 'await', 'async', 'try', 'catch', 'new', 'this'
    ];
    
    const types = [
      'string', 'number', 'boolean', 'any', 'void', 'u8', 'i32', 'f32', 'Vec', 'Option', 'Result', 'String', 'Self'
    ];

    // Strings
    html = html.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-emerald-400">$&</span>');
    // Comments
    html = html.replace(/\/\/.*$/gm, '<span class="text-slate-500">$&</span>');
    // Keywords
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      html = html.replace(regex, `<span class="text-indigo-400 font-bold">${kw}</span>`);
    });
    // Types
    types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      html = html.replace(regex, `<span class="text-orange-400">${type}</span>`);
    });

    return html;
  };

  // Code blocks always kept dark for contrast/syntax highlighting
  return (
    <div className="my-6 rounded-lg border border-slate-800 bg-[#0f172a] overflow-hidden group shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2">
           <div className="p-1 rounded bg-slate-800">
             <Terminal size={12} className="text-indigo-400" />
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
             {language || 'TEXT'}
           </span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-xs text-slate-500 hover:text-white transition-all"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-sm text-slate-300 leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
        </pre>
      </div>
    </div>
  );
};

const Table: React.FC<{ rows: string[]; theme: MarkdownTheme }> = ({ rows, theme }) => {
  if (rows.length < 2) return null; 

  const parseRow = (row: string) => 
    row.split('|')
       .filter((c, i, arr) => {
          if (i === 0 && c.trim() === '') return false;
          if (i === arr.length - 1 && c.trim() === '') return false;
          return true;
       })
       .map(c => c.trim());

  const headers = parseRow(rows[0]);
  const bodyRows = rows.slice(2).map(parseRow);

  const styles = {
    dark: { border: 'border-slate-800', headerBg: 'bg-slate-900/80', rowHover: 'hover:bg-slate-800/30', bg: 'bg-slate-900/20' },
    light: { border: 'border-slate-200', headerBg: 'bg-slate-100', rowHover: 'hover:bg-slate-50', bg: 'bg-white' },
    sepia: { border: 'border-[#d0c0a0]', headerBg: 'bg-[#e8dec0]', rowHover: 'hover:bg-[#d0c0a0]/20', bg: 'bg-[#f1e7d0]/50' }
  };
  const s = styles[theme];

  return (
    <div className={`my-8 w-full overflow-hidden rounded-xl border ${s.border} ${s.bg}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className={`${s.headerBg} font-bold`}>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className={`px-6 py-4 border-b ${s.border} min-w-[120px]`}>
                  <span className="inline-block">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-800/50' : 'divide-black/10'}`}>
            {bodyRows.map((row, i) => (
              <tr key={i} className={`${s.rowHover} transition-colors`}>
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Processing Logic ---

const processInline = (text: string): React.ReactNode[] => {
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  const partsWithImages = text.split(imgRegex);
  
  if (partsWithImages.length > 1) {
    const match = imgRegex.exec(text);
    if (match) {
      return [
        <div key="img" className="my-6 rounded-xl overflow-hidden border border-black/10 bg-black/5 inline-block w-full">
          <img src={match[2]} alt={match[1]} className="w-full h-auto object-cover max-h-[500px]" />
          <div className="px-4 py-2 text-xs text-center opacity-70 bg-black/10">
            {match[1]}
          </div>
        </div>
      ];
    }
  }

  const combinedRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(combinedRegex);
  
  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
       return <LatexBlock key={i} formula={part.slice(2, -2)} block={false} />;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return <LatexBlock key={i} formula={part.slice(1, -1)} />;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-black/20 px-1.5 py-0.5 rounded font-mono text-[0.9em] border border-black/10 text-inherit">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-inherit">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic font-serif text-inherit">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export const MarkdownRenderer: React.FC<MarkdownProps> = ({ content, className = '', theme = 'dark' }) => {
  const elements: React.ReactNode[] = [];
  let lines = content.split('\n');
  let startIdx = 0;

  // Dynamic colors based on theme
  const themeStyles = {
    dark: {
      h1: 'text-white',
      h2: 'text-white border-slate-800',
      h3: 'text-indigo-200',
      quote: 'text-slate-300 border-primary/50 bg-gradient-to-r from-slate-900/50 to-transparent',
      hr: 'border-slate-800'
    },
    light: {
      h1: 'text-slate-900',
      h2: 'text-slate-800 border-slate-200',
      h3: 'text-indigo-700',
      quote: 'text-slate-700 border-indigo-500/50 bg-slate-50',
      hr: 'border-slate-200'
    },
    sepia: {
      h1: 'text-[#433422]',
      h2: 'text-[#433422] border-[#d0c0a0]',
      h3: 'text-[#8c7355]',
      quote: 'text-[#5f4b32] border-[#8c7355]/50 bg-[#e8dec0]/30',
      hr: 'border-[#d0c0a0]'
    }
  };
  const ts = themeStyles[theme];

  if (lines[0]?.trim() === '---') {
    const endIdx = lines.slice(1).findIndex(l => l.trim() === '---');
    if (endIdx !== -1) {
      const frontmatterContent = lines.slice(1, endIdx + 1).join('\n');
      elements.push(<FrontmatterBlock key="frontmatter" content={frontmatterContent} theme={theme} />);
      startIdx = endIdx + 2;
    }
  }

  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockContent: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = (idx: number) => {
    if (tableRows.length > 0) {
      elements.push(<Table key={`tbl-${idx}`} rows={tableRows} theme={theme} />);
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inTable) flushTable(i);
      if (inCodeBlock) {
        elements.push(<CodeBlock key={`code-${i}`} language={codeBlockLanguage} code={codeBlockContent.join('\n')} />);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBlockLanguage = line.trim().replace('```', '');
      }
      continue;
    }
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    const isTableLine = line.trim().startsWith('|');
    if (isTableLine) {
      if (!inTable) inTable = true;
      tableRows.push(line);
      if (i === lines.length - 1) flushTable(i);
      continue;
    } else if (inTable) flushTable(i);

    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 2) {
       elements.push(<LatexBlock key={i} formula={line.trim().slice(2, -2)} block />);
       continue;
    }
    
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      elements.push(<hr key={i} className={`my-8 ${ts.hr}`} />);
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className={`text-[2em] font-bold mt-12 mb-6 tracking-tight leading-tight ${ts.h1}`}>{processInline(line.substring(2))}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className={`text-[1.5em] font-bold mt-10 mb-4 border-b pb-2 ${ts.h2}`}>{processInline(line.substring(3))}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className={`text-[1.25em] font-semibold mt-8 mb-3 ${ts.h3}`}>{processInline(line.substring(4))}</h3>);
      continue;
    }

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className={`relative pl-6 py-2 my-8 border-l-4 text-[1.1em] italic rounded-r-lg ${ts.quote}`}>
          {processInline(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    const listMatch = line.match(/^(\s*)-\s+(.*)/);
    if (listMatch) {
      const indentLevel = Math.floor(listMatch[1].length / 2);
      elements.push(
        <div key={i} className="flex items-start gap-3 mb-2" style={{ marginLeft: `${indentLevel * 1.5}rem` }}>
          <span className={`mt-2.5 flex-shrink-0 ${indentLevel > 0 ? 'opacity-60 w-1 h-1' : 'w-1.5 h-1.5'} rounded-full bg-current`} />
          <span className="leading-7">{processInline(listMatch[2])}</span>
        </div>
      );
      continue;
    }

    if (!line.trim()) {
      elements.push(<div key={i} className="h-4"></div>);
      continue;
    }

    // Paragraphs now inherit font size and color from parent
    elements.push(
      <p key={i} className="mb-4 leading-8">
        {processInline(line)}
      </p>
    );
  }

  return <div className={`prose max-w-none ${className}`}>{elements}</div>;
};