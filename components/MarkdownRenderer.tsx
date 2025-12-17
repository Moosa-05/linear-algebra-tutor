import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processedContent = useMemo(() => {
    if (!content) return "";
    
    // 1. Handle DeepSeek <think> tags
    // We replace them with a Blockquote style marker.
    // NOTE: We rely on the 'blockquote' component style below to apply italics, 
    // so we don't need to add '*' characters here. This is cleaner for streaming.
    let normalized = content
      .replace(/<think>/g, '\n> **🧠 DeepSeek Thinking:**\n> ') 
      .replace(/<\/think>/g, '\n\n---\n\n')
      // 2. Normalize LaTeX delimiters for KaTeX
      // Replace \[ ... \] with $$ ... $$
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
      // Replace \( ... \) with $ ... $
      .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');
      
    return normalized;
  }, [content]);

  return (
    // prose-invert is crucial for dark mode text contrast
    <div className="prose prose-slate prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-slate-100">
      <ReactMarkdown
        children={processedContent}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({node, ...props}) => <p className="mb-4 text-slate-300" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-2xl mb-4 mt-6 border-b border-slate-700 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl mb-3 mt-5 font-bold text-slate-100" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg mb-2 mt-4 font-bold text-indigo-300" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1 text-slate-300 marker:text-cyan-500" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-slate-300 marker:text-cyan-500" {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 overflow-x-auto shadow-inner">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-slate-800/80 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-700/50" {...props}>
                {children}
              </code>
            )
          },
          // Custom Blockquote for Thinking Process
          // Note 'italic' class is applied here
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-slate-600 pl-4 py-3 my-6 bg-slate-900/40 italic text-slate-400 rounded-r-lg shadow-sm" {...props} />
          )
        }}
      />
    </div>
  );
};

export default MarkdownRenderer;