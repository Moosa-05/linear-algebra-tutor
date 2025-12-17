import React, { useState, useRef, useEffect } from 'react';
import { Send, Sigma, Ban } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string, image: string | null) => void;
  disabled: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input, null); // DeepSeek R1 is text-only
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertLatex = (latex: string) => {
    setInput(prev => prev + latex);
    textareaRef.current?.focus();
  };

  const MATRIX_TEMPLATE = `
$$
\\begin{bmatrix}
 a & b \\\\
 c & d 
\\end{bmatrix}
$$
`;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <div className="border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-xl p-4 lg:pb-6 relative z-40">
      <div className="max-w-3xl mx-auto">
        
        <div 
          className="relative flex flex-col gap-2 bg-slate-950/50 border rounded-2xl p-3 transition-all duration-300 shadow-lg border-slate-700/50 hover:border-slate-600 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
        >
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1 pb-1">
              <button 
                  className="p-2.5 text-slate-400 hover:text-cyan-400 transition-all duration-200 rounded-xl hover:bg-cyan-950/30"
                  title="Insert Matrix Template"
                  onClick={() => insertLatex(MATRIX_TEMPLATE)}
                  disabled={disabled}
              >
                <Sigma className="w-5 h-5" />
              </button>
              
              <button 
                  className="p-2.5 text-slate-600 cursor-not-allowed rounded-xl"
                  title="Image upload disabled for DeepSeek R1"
                  disabled={true}
              >
                <Ban className="w-5 h-5" />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Ask a Linear Algebra problem (Text Only)..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 max-h-48 text-slate-200 placeholder:text-slate-500/70 font-light"
              style={{ minHeight: '48px' }}
            />
            
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || disabled}
              className={`p-2.5 rounded-xl mb-0.5 transition-all duration-300 ${
                input.trim() && !disabled 
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:scale-105' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 text-center text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
           Powered by DeepSeek R1 <span className="mx-2 text-slate-700">|</span> Reasoning Engine
        </div>
      </div>
    </div>
  );
};

export default InputArea;