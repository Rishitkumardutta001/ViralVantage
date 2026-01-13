
import React from 'react';
import { CommentResult } from '../types';
import DownloadActions from './DownloadActions';

interface CommentDisplayProps {
  result: CommentResult;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({ result }) => {
  const typeColors = {
    fan: 'bg-pink-500/20 text-pink-400',
    question: 'bg-blue-500/20 text-blue-400',
    objection: 'bg-orange-500/20 text-orange-400',
    troll: 'bg-slate-800 text-slate-400',
    lead: 'bg-green-500/20 text-green-400'
  }[result.commentType];

  return (
    <div className="animate-fadeIn p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-4">
           <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-xl border border-white/5 font-black text-[9px] uppercase tracking-widest ${typeColors}`}>
                {result.commentType} Detected
              </div>
              <div className="text-xl">
                 {result.sentiment === 'positive' ? '😊' : result.sentiment === 'negative' ? '😡' : '😐'}
              </div>
           </div>
           <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Growth Protocol</span>
              <p className="text-[10px] text-slate-300 leading-relaxed italic">{result.followUp || "Continue standard engagement loop."}</p>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
           <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block italic">Top Response Templates</span>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {result.recommendedResponses.map((res, i) => (
               <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-rose-500/30 transition-all">
                 <p className="text-[11px] text-white font-medium italic mb-3 leading-relaxed">"{res.text}"</p>
                 <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">{res.label}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(res.text);
                        alert('Copied!');
                      }}
                      className="text-[9px] font-black text-white bg-rose-600 px-3 py-1 rounded-lg uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Copy
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDisplay;
