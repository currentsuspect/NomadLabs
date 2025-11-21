import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Terminal, Image as ImageIcon, Table as TableIcon, Sigma } from 'lucide-react';

// Define global KaTeX interface
declare global {
  interface Window {
    katex: any;
  }
}

interface MarkdownProps {
  content: string;
  className?: string;
}

// --- Helper Components ---

const FrontmatterBlock: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').filter(l => l.trim() !== '');
  
  return (
    <div className="mb-8 rounded-lg border border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
      <div className="px-4 py-2 bg-indigo-500/10 border-b border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
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
              <span className="text-indigo-400 font-semibold min-w-[140px] opacity-80">{key}</span>
              <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                {isArray ? (
                  val.slice(1, -1).split(',').map((item, idx) => {
                    const cleanItem = item.trim().replace(/^['"]|['"]$/g, ''); // Clean quotes inside array
                    if (!cleanItem) return null;
                    return (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {cleanItem}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-slate-300 break-words">{val}</span>
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
        // Safety check: KaTeX throws a hard error in Quirks Mode (BackCompat)
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
          return true; // Success
        } catch (e) {
          console.error("KaTeX error:", e);
          containerRef.current.innerText = formula;
          return true; // Handled error
        }
      }
      return false; // Not ready
    };

    // Attempt render immediately
    if (!renderMath()) {
      // If failed (KaTeX not loaded yet), poll for it
      const intervalId = setInterval(() => {
        if (renderMath()) {
          clearInterval(intervalId);
        }
      }, 100);

      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [formula, block]);

  if (block) {
    return (
      <div 
        className="my-6 py-4 px-4 overflow-x-auto bg-slate-900/30 rounded-lg border border-slate-800 text-center text-lg" 
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
      html = html.replace(regex, `<span class="text-primary font-bold">${kw}</span>`);
    });
    // Types
    types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      html = html.replace(regex, `<span class="text-orange-400">${type}</span>`);
    });

    return html;
  };

  return (
    <div className="my-6 rounded-lg border border-slate-800 bg-slate-950 overflow-hidden group shadow-lg shadow-black/20">
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

const Table: React.FC<{ rows: string[] }> = ({ rows }) => {
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

  return (
    <div className="my-8 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-900/80 text-slate-200 font-bold">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4 border-b border-slate-800 min-w-[120px]">
                  <span className="inline-block">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {bodyRows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-slate-300 align-top">
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
  // Split order: Images -> Latex -> Code -> Bold -> Italic
  
  // 1. Extract Images: ![alt](url)
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  const partsWithImages = text.split(imgRegex);
  
  if (partsWithImages.length > 1) {
    const match = imgRegex.exec(text);
    if (match) {
      return [
        <div key="img" className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 inline-block w-full">
          <img src={match[2]} alt={match[1]} className="w-full h-auto object-cover max-h-[500px]" />
          <div className="px-4 py-2 text-xs text-center text-slate-500 bg-slate-900/50 border-t border-slate-800">
            {match[1]}
          </div>
        </div>
      ];
    }
  }

  // 2. Split remaining text by delimiters
  // Updated regex to capture:
  // $$...$$ (Display Math)
  // $...$ (Inline Math)
  // `...` (Code)
  // **...** (Bold)
  // *...* (Italic)
  const combinedRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(combinedRegex);
  
  return parts.map((part, i) => {
    // Display Math ($$ ... $$) inside a paragraph
    if (part.startsWith('$$') && part.endsWith('$$')) {
       return <LatexBlock key={i} formula={part.slice(2, -2)} block={false} />;
    }
    // Inline Math ($ ... $)
    if (part.startsWith('$') && part.endsWith('$')) {
      return <LatexBlock key={i} formula={part.slice(1, -1)} />;
    }
    // Inline Code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-sm border border-slate-700/50">{part.slice(1, -1)}</code>;
    }
    // Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
    }
    // Italic
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-300 font-serif">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export const MarkdownRenderer: React.FC<MarkdownProps> = ({ content, className = '' }) => {
  const elements: React.ReactNode[] = [];
  let lines = content.split('\n');
  let startIdx = 0;

  // --- Frontmatter Processing ---
  // Check if the very first line is '---'
  if (lines[0]?.trim() === '---') {
    const endIdx = lines.slice(1).findIndex(l => l.trim() === '---');
    if (endIdx !== -1) {
      // Found valid frontmatter block
      const frontmatterContent = lines.slice(1, endIdx + 1).join('\n');
      elements.push(<FrontmatterBlock key="frontmatter" content={frontmatterContent} />);
      startIdx = endIdx + 2; // Skip first ---, content, and closing ---
    }
  }

  // --- Parser State ---
  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockContent: string[] = [];

  let inTable = false;
  let tableRows: string[] = [];

  const flushTable = (idx: number) => {
    if (tableRows.length > 0) {
      elements.push(<Table key={`tbl-${idx}`} rows={tableRows} />);
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];

    // --- Code Blocks ---
    if (line.trim().startsWith('```')) {
      if (inTable) flushTable(i);

      if (inCodeBlock) {
        elements.push(
          <CodeBlock 
            key={`code-${i}`} 
            language={codeBlockLanguage} 
            code={codeBlockContent.join('\n')} 
          />
        );
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

    // --- Tables ---
    const isTableLine = line.trim().startsWith('|');
    if (isTableLine) {
      if (!inTable) inTable = true;
      tableRows.push(line);
      if (i === lines.length - 1) flushTable(i);
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    // --- Block Latex ($$ ... $$) ---
    // Simple check for single-line block math or multi-line start
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 2) {
       elements.push(<LatexBlock key={i} formula={line.trim().slice(2, -2)} block />);
       continue;
    }
    
    // --- Horizontal Rule ---
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-8 border-slate-800" />);
      continue;
    }

    // --- Headers ---
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-white tracking-tight leading-tight">{processInline(line.substring(2))}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-white border-b border-slate-800 pb-2">{processInline(line.substring(3))}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold mt-8 mb-3 text-indigo-200">{processInline(line.substring(4))}</h3>);
      continue;
    }

    // --- Blockquotes ---
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="relative pl-6 py-2 my-8 border-l-4 border-primary/50 text-lg text-slate-300 italic bg-gradient-to-r from-slate-900/50 to-transparent rounded-r-lg">
          {processInline(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // --- Lists ---
    const listMatch = line.match(/^(\s*)-\s+(.*)/);
    if (listMatch) {
      const indentLevel = Math.floor(listMatch[1].length / 2);
      const content = listMatch[2];
      
      elements.push(
        <div key={i} className="flex items-start gap-3 mb-2 text-slate-300" style={{ marginLeft: `${indentLevel * 1.5}rem` }}>
          <span className={`mt-2.5 flex-shrink-0 ${indentLevel > 0 ? 'text-slate-500 w-1 h-1' : 'text-primary w-1.5 h-1.5'} rounded-full bg-current`} />
          <span className="leading-7">{processInline(content)}</span>
        </div>
      );
      continue;
    }

    // --- Empty Lines ---
    if (!line.trim()) {
      elements.push(<div key={i} className="h-4"></div>);
      continue;
    }

    // --- Paragraphs ---
    elements.push(
      <p key={i} className="mb-4 text-base md:text-lg leading-8 text-slate-300">
        {processInline(line)}
      </p>
    );
  }

  return <div className={`prose prose-invert max-w-none ${className}`}>{elements}</div>;
};