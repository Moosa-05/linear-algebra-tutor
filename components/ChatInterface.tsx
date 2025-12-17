import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot, User, Sparkles, AlertTriangle, Terminal } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto scroll-smooth relative no-scrollbar"
    >
       <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 min-h-full flex flex-col">
        
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-700">
            <div className="relative mb-8 group cursor-default">
               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
               <div className="relative bg-slate-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border border-slate-700">
                  <Bot className="w-12 h-12 text-cyan-400" />
               </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
              Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Protocol</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed mb-8 font-light">
              Upload matrix snapshots or input linear equations.<br/>
              <span className="text-sm text-slate-500 font-mono mt-2 block">System Ready...</span>
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group flex gap-4 sm:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg border backdrop-blur-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                : 'bg-slate-800/60 border-slate-700 text-cyan-400'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Terminal className="w-5 h-5" />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 min-w-0 max-w-[85%] sm:max-w-[80%] rounded-2xl p-5 sm:p-7 shadow-xl transition-all duration-300 hover:scale-[1.01] ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/30 text-indigo-50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                : 'bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            } ${msg.isError ? 'border-red-500/40 bg-red-900/10' : ''}`}>
              
              {msg.image && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-700 shadow-md max-w-md bg-slate-950">
                   <img src={msg.image} alt="User Upload" className="w-full h-auto object-contain opacity-90" />
                </div>
              )}

              {msg.isError && (
                <div className="flex items-center gap-2 text-red-400 mb-3 font-semibold text-sm bg-red-900/20 p-2 rounded border border-red-500/20 inline-block">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Computation Error</span>
                </div>
              )}

              <div className="prose-container text-[15px] sm:text-[16px] leading-7">
                <MarkdownRenderer content={msg.content || (msg.image ? "*Image Data Received*" : "")} />
              </div>
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isLoading && messages[messages.length - 1]?.role !== 'model' && (
          <div className="flex gap-6 animate-pulse">
             <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-500/70" />
            </div>
            <div className="flex items-center gap-2 text-cyan-500/70 text-sm font-mono py-2">
               <Sparkles className="w-4 h-4 animate-spin-slow" />
               <span>Processing neural vectors...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;