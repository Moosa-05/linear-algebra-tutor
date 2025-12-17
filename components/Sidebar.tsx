import React from 'react';
import { TeachingStyle } from '../types';
import { Brain, Trash2, Sliders, Info, Network } from 'lucide-react';

interface SidebarProps {
  style: TeachingStyle;
  setStyle: (style: TeachingStyle) => void;
  onClearChat: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  style,
  setStyle,
  onClearChat,
  className
}) => {
  return (
    <div className={`
      h-full flex flex-col w-80 text-slate-300 border-r border-slate-800/50 
      bg-slate-900/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/60
      ${className}
    `}>
      <div className="p-6 border-b border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-transparent">
        <h1 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-400/20">
             <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Linear Algebra
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-2 pl-11 tracking-wider uppercase font-semibold">AI Neural Tutor</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        {/* Teaching Style */}
        <section>
          <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" /> Teaching Mode
          </h3>
          <div className="relative group">
             <select 
              value={style}
              onChange={(e) => setStyle(e.target.value as TeachingStyle)}
              className="w-full text-sm bg-slate-950/50 border border-slate-700 text-slate-200 rounded-lg shadow-inner focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 p-3 appearance-none cursor-pointer hover:bg-slate-900 transition-all outline-none"
            >
              <option value={TeachingStyle.StepByStep}>Step-by-Step</option>
              <option value={TeachingStyle.Concise}>Concise Output</option>
              <option value={TeachingStyle.ExamStyle}>Exam Preparation</option>
              <option value={TeachingStyle.Intuition}>Intuition & Concepts</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-cyan-400 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info className="w-3 h-3" /> System Status
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-mono">DeepSeek R1 Online</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-mono flex items-center gap-1">
              <Network className="w-3 h-3" /> Provider: OpenRouter
              <br/>
              Reasoning: Active
            </p>
        </section>
      </div>

      <div className="p-4 border-t border-slate-800/50 bg-slate-950/30">
        <button
          onClick={onClearChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
        >
          <Trash2 className="w-4 h-4" />
          Purge Session Data
        </button>
      </div>
    </div>
  );
};

export default Sidebar;