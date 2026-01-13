
import React, { useState } from 'react';
import { AIContentReview } from '../types';

interface AIContentReviewDisplayProps {
  review: AIContentReview;
}

const AIContentReviewDisplay: React.FC<AIContentReviewDisplayProps> = ({ review }) => {
  const [showPrompt, setShowPrompt] = useState<boolean | null>(null);

  const confidenceColor = {
    Low: 'text-slate-400',
    Medium: 'text-indigo-400',
    High: 'text-cyan-400'
  }[review.confidence];

  return (
    <div className="bg-slate-900/30 border-2 border-cyan-500/20 rounded-[3rem] p-10 space-y-10 animate-fadeIn relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-2xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            🤖
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">AI-Generated Content Review</h3>
            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em]">Module Active: Neural Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Confidence</span>
            <span className={`text-lg font-black uppercase tracking-tighter ${confidenceColor}`}>{review.confidence}</span>
          </div>
          <div className="h-10 w-px bg-white/5"></div>
          <div className="text-right">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Prompt Quality</span>
            <span className="text-lg font-black text-white uppercase tracking-tighter">{review.promptQualityScore}/10</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></span>
              Key Detection Indicators
            </h4>
            <div className="flex flex-wrap gap-2">
              {review.indicators.map((ind, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-medium text-slate-400 italic">
                  {ind}
                </span>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-6">
             <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Creative Control</label>
                <p className="text-xs font-bold text-slate-200">{review.creativeControlLevel}</p>
             </div>
             <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 italic">Scene Logic</label>
                <p className="text-xs font-bold text-slate-200">{review.sceneConsistency}</p>
             </div>
          </div>

          <section className="space-y-4">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></span>
              Optimization Opportunities
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {review.opportunities.humanizationStrategies.slice(0, 2).map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                  <span className="text-cyan-400 text-xs mt-0.5">✨</span>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-green-400 uppercase tracking-widest block">AI Strengths</label>
                <ul className="space-y-2">
                  {review.strengths.map((s, i) => (
                    <li key={i} className="text-[10px] text-slate-400 flex items-start gap-2">
                      <span className="text-green-500">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-red-400 uppercase tracking-widest block">Limitations</label>
                <ul className="space-y-2">
                  {review.limitations.map((l, i) => (
                    <li key={i} className="text-[10px] text-slate-400 flex items-start gap-2">
                      <span className="text-red-500">✕</span> {l}
                    </li>
                  ))}
                </ul>
              </div>
           </div>

           <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl">
              <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-2">Platform Mismatch Risks</label>
              <div className="space-y-2">
                 {review.risks.map((r, i) => (
                   <p key={i} className="text-[10px] text-slate-300 italic flex gap-2">
                     <span className="text-rose-500">⚠️</span> {r}
                   </p>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Interactive Action Section */}
      <div className="bg-slate-950/50 border border-white/5 rounded-[2.5rem] p-10 text-center space-y-8 shadow-inner">
        {!showPrompt && showPrompt !== false && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-lg font-black text-white italic tracking-tight">
              “Would you like a refined AI generation prompt to improve this video’s performance while keeping your original idea intact?”
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setShowPrompt(true)}
                className="px-8 py-3 bg-cyan-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/20"
              >
                Yes, Optimize My Prompt
              </button>
              <button 
                onClick={() => setShowPrompt(false)}
                className="px-8 py-3 bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                No, Just Tips
              </button>
            </div>
          </div>
        )}

        {showPrompt === true && (
          <div className="space-y-6 animate-scaleIn">
            <div className="flex items-center justify-center gap-2 mb-2">
               <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">Neural Optimized Prompt</span>
            </div>
            <div className="relative group">
              <textarea 
                readOnly 
                className="w-full bg-slate-900 border border-white/5 rounded-2xl p-6 text-sm font-medium text-slate-200 resize-none outline-none focus:border-cyan-500/30 transition-all italic leading-relaxed" 
                rows={6}
                value={review.optimizedPrompt}
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(review.optimizedPrompt || "");
                  alert("Prompt Copied to Clipboard!");
                }}
                className="absolute top-4 right-4 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Copy
              </button>
            </div>
            <button onClick={() => setShowPrompt(null)} className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">← Back to Options</button>
          </div>
        )}

        {showPrompt === false && (
          <div className="space-y-6 animate-scaleIn">
            <div className="flex items-center justify-center gap-2 mb-2">
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">Expert Prompt Writing Tips</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {review.promptTips?.map((tip, i) => (
                <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
                  <span className="text-xs text-cyan-500 font-black">0{i+1}</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPrompt(null)} className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">← Back to Options</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContentReviewDisplay;
