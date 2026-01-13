
import React from 'react';
import { VideoAuditResult } from '../types';
import DownloadActions from './DownloadActions';
import AIContentReviewDisplay from './AIContentReviewDisplay';

interface VideoAuditDisplayProps {
  audit: VideoAuditResult;
}

const VideoAuditDisplay: React.FC<VideoAuditDisplayProps> = ({ audit }) => {
  const ratingColor = (audit.overallPerformance?.rating ?? 0) >= 8 ? 'text-green-400' : 
                      (audit.overallPerformance?.rating ?? 0) >= 5 ? 'text-yellow-400' : 
                      'text-red-400';

  const ScoreBar = ({ label, score }: { label: string, score: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">{label}</span>
        <span className="text-white">{score}/10</span>
      </div>
      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${score >= 8 ? 'bg-green-500' : score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Diagnostic Result</h2>
        <DownloadActions elementId="video-audit-result" textData="" fileName="Elite_Video_Audit" />
      </div>
      
      <div id="video-audit-result" className="space-y-12">
        {/* CONDITIONAL AI CONTENT REVIEW */}
        {audit.aiContentReview && (
          <AIContentReviewDisplay review={audit.aiContentReview} />
        )}

        {/* HERO SECTION: SCORE & VERDICT */}
        <section className="glass p-10 rounded-[3rem] border-white/10 shadow-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative shrink-0 flex items-center justify-center w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900" />
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={527} strokeDashoffset={527 - (527 * (audit.overallPerformance?.rating ?? 0)) / 10} className={`${ratingColor} transition-all duration-[1.5s] ease-out`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-6xl font-black tracking-tighter ${ratingColor}`}>{audit.overallPerformance?.rating ?? 0}</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Growth Tier</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${(audit.performanceBreakdown?.alignment || 'Medium') === 'Strong' ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-slate-800 text-slate-400'}`}>
                  {audit.performanceBreakdown?.alignment || 'Medium'} Alignment
                </span>
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest">
                  {audit.prePostingPrediction?.expectedPerformance || 'Unknown'} Performance Expected
                </span>
              </div>
              <p className="text-3xl font-black text-white leading-tight uppercase italic tracking-tighter">
                "{audit.overallPerformance?.verdict || 'Analysis Complete'}"
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/5">
                <ScoreBar label="Hook" score={audit.performanceBreakdown?.hook ?? 0} />
                <ScoreBar label="Retention" score={audit.performanceBreakdown?.retention ?? 0} />
                <ScoreBar label="Engagement" score={audit.performanceBreakdown?.engagement ?? 0} />
                <ScoreBar label="Platform" score={audit.performanceBreakdown?.platformFit ?? 0} />
              </div>
            </div>
          </div>
        </section>

        {/* CORE ACTION: FIX MY VIDEO */}
        <section className="bg-indigo-600 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <span className="text-9xl font-black italic">FIX</span>
          </div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
              <span className="bg-white text-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">🛠️</span>
              Immediate Performance Fixes
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-3">The New Viral Hook</label>
                  <p className="text-2xl font-black text-white italic leading-tight">
                    "{audit.fixMyVideo?.hookRewrite || 'Optimize your existing opening'}"
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-3">Structural Optimization</label>
                  <p className="text-sm text-indigo-50 leading-relaxed">
                    {audit.fixMyVideo?.structureChanges || 'No structural changes required.'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-3">High-CTR Titles / Captions</label>
                  <div className="space-y-3">
                    {(audit.fixMyVideo?.titleVariations || []).map((t, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-sm font-bold text-white italic">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                  <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-2">Conversion Anchor (CTA)</label>
                  <p className="text-sm font-medium text-white italic">"{audit.fixMyVideo?.ctaOptimization || 'No CTA changes required.'}"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DATA DEEP DIVE: RETENTION & VISUALS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Analysis Card 1 */}
          <div className="glass p-8 rounded-[2rem] border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Attention Risk Map</h4>
            <div className="space-y-6">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">Hook Analysis</span>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{audit.retentionPrediction?.hookEvaluation || 'Retention analysis complete.'}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-red-400 uppercase mb-2 block tracking-widest">Drop-Off Risk</span>
                  <div className="flex flex-wrap gap-2">
                    {(audit.retentionPrediction?.dropOffTimestamps || []).map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black rounded-lg">⏱ {t}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">Binge Potential</span>
                  <p className="text-[10px] font-bold text-slate-300 uppercase">{audit.retentionPrediction?.bingePotential || 'Medium'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Card 2 */}
          <div className="glass p-8 rounded-[2rem] border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Internal Diagnostics</h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Strategic Wins</span>
                <ul className="space-y-2">
                  {(audit.pros || []).map((p, i) => (
                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2">
                      <span className="text-green-500">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Blockers</span>
                <ul className="space-y-2">
                  {(audit.cons || []).map((c, i) => (
                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2">
                      <span className="text-red-500">✕</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SECONDARY INSIGHTS */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Ceiling</h5>
            <div className="flex items-end justify-between">
              <span className={`text-2xl font-black uppercase ${(audit.growthAssessment?.ceiling || 'Medium') === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                {audit.growthAssessment?.ceiling || 'Medium'}
              </span>
              <span className="text-[10px] font-black text-slate-600 mb-1">{audit.growthAssessment?.limitingFactor || 'N/A'} Bound</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">{audit.growthAssessment?.nextTierRequirement || 'Continue posting quality content.'}</p>
          </div>
          
          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Tactics</h5>
            <div className="space-y-2">
              {(audit.platformTips?.tactical || []).map((tip, i) => (
                <div key={i} className="text-[11px] text-slate-300 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cross-Platform Adapt</h5>
            <div className="space-y-3">
              {(audit.repurposing || []).slice(0, 2).map((r, i) => (
                <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 block">{r.platform}</span>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{r.adjustments}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THE FINAL LEVER */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] text-center space-y-4 shadow-inner">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block">The One Lever for 10X Result</span>
          <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
            "{audit.prePostingPrediction?.mostImpactfulChange || 'Focus on consistent engagement.'}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoAuditDisplay;
