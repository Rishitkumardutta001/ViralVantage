
import React from 'react';
import { AnalysisResult } from '../types';
import DownloadActions from './DownloadActions';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const scoreColor = analysis.viralityScore > 80 ? 'text-green-400' : analysis.viralityScore > 50 ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="animate-fadeIn p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 border border-white/5">
             <span className={`text-xl font-black ${scoreColor}`}>{analysis.viralityScore}</span>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Virality Score</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Calculated Retention Map</p>
          </div>
        </div>
        <DownloadActions elementId="ana-export" textData="" fileName="Hook_Audit" compact />
      </div>

      <div className="bg-indigo-600 p-4 rounded-2xl border border-indigo-400/30">
        <span className="text-[8px] font-black text-white/70 uppercase tracking-widest block mb-2 italic">Recommended Winner</span>
        <p className="text-sm font-black text-white leading-tight italic">"{analysis.bestVersion}"</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {analysis.whyItWorks.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="text-green-500 text-xs">✓</span>
            <span className="text-[10px] font-medium text-slate-300">{item}</span>
          </div>
        ))}
      </div>

      <div id="ana-export" className="hidden">
         {/* Export specific container if needed */}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
