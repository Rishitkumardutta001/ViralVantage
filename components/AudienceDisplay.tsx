
import React from 'react';
import { AudienceResult } from '../types';
import DownloadActions from './DownloadActions';

interface AudienceDisplayProps {
  persona: AudienceResult;
}

const AudienceDisplay: React.FC<AudienceDisplayProps> = ({ persona }) => {
  const intentColor = {
    Low: 'text-red-400',
    Medium: 'text-yellow-400',
    High: 'text-green-400'
  }[persona.buyingIntent];

  return (
    <div className="animate-fadeIn p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Persona</span>
          <p className="text-xs font-black text-white">{persona.coreProfile.ageRange}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{persona.coreProfile.genderSplit}</p>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Buying Intent</span>
          <p className={`text-xs font-black uppercase ${intentColor}`}>{persona.buyingIntent}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Commercial Readiness</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block italic">Top Triggers</span>
          <div className="flex flex-wrap gap-2">
            {persona.psychologicalTriggers.painPoints.slice(0, 3).map((p, i) => (
              <span key={i} className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5 italic">
                {p}
              </span>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block italic">Resonance Angles</span>
          <div className="grid grid-cols-1 gap-1.5">
            {persona.scalingAngles.slice(0, 2).map((a, i) => (
              <div key={i} className="text-[10px] text-slate-300 font-medium leading-tight p-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                → {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceDisplay;
