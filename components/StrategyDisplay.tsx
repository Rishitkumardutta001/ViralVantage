
import React from 'react';
import { StrategyResult } from '../types';
import DownloadActions from './DownloadActions';

interface StrategyDisplayProps {
  strategy: StrategyResult;
}

const StrategyDisplay: React.FC<StrategyDisplayProps> = ({ strategy }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const textRepresentation = `
VIRAL STRATEGY EXPORT
Viral Hook: ${strategy.viralHook}

SCRIPT:
${strategy.scenes.map(s => `Scene ${s.number}:\nText: ${s.onScreenText}\nDialogue: ${s.spokenDialogue}\nAction: ${s.cameraAction}`).join('\n\n')}

CAPTION:
${strategy.caption}

HASHTAGS:
High: ${strategy.hashtags.highReach.join(', ')}
Mid: ${strategy.hashtags.midReach.join(', ')}
Low: ${strategy.hashtags.lowReach.join(', ')}

CTA:
Soft: ${strategy.cta.soft}
Strong: ${strategy.cta.strong}
  `.trim();

  return (
    <div className="animate-fadeIn">
      <DownloadActions elementId="strategy-result" textData={textRepresentation} fileName="Viral_Strategy" />
      
      <div id="strategy-result" className="space-y-8 p-4 bg-[#0f172a]">
        {/* Hook Section */}
        <section className="bg-indigo-600/20 border border-indigo-500/30 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-300">⚡ VIRAL HOOK</h2>
            <button 
              onClick={() => copyToClipboard(strategy.viralHook)}
              className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1 rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-2xl font-semibold italic text-white leading-tight">
            "{strategy.viralHook}"
          </p>
        </section>

        {/* Script Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-300 uppercase tracking-wider">Scene-by-Scene Script</h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {strategy.scenes.map((scene) => (
              <div key={scene.number} className="glass p-5 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-bold text-sm">
                    {scene.number}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scene Breakdown</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase">On-Screen Text</label>
                    <p className="text-sm text-slate-100 font-medium bg-slate-800/50 p-2 rounded mt-1">
                      {scene.onScreenText}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase">Dialogue</label>
                    <p className="text-sm text-slate-200 italic mt-1 leading-relaxed">
                      "{scene.spokenDialogue}"
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase">Camera / Action</label>
                    <p className="text-xs text-slate-400 mt-1">
                      {scene.cameraAction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Caption & Tags */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="glass p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-300">Platform Caption</h2>
              <button 
                onClick={() => copyToClipboard(strategy.caption)}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {strategy.caption}
            </p>
          </section>

          <section className="glass p-6 rounded-2xl border border-slate-700">
            <h2 className="font-bold text-slate-300 mb-4">Strategic Hashtags</h2>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-green-400 uppercase block mb-2">High Reach (Broad)</span>
                <div className="flex flex-wrap gap-2">
                  {strategy.hashtags.highReach.map(tag => (
                    <span key={tag} className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-yellow-400 uppercase block mb-2">Mid Reach (Niche)</span>
                <div className="flex flex-wrap gap-2">
                  {strategy.hashtags.midReach.map(tag => (
                    <span key={tag} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase block mb-2">Low Reach (Specific)</span>
                <div className="flex flex-wrap gap-2">
                  {strategy.hashtags.lowReach.map(tag => (
                    <span key={tag} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-2">Soft CTA (Engagement)</h2>
            <p className="text-sm text-slate-200 font-medium">"{strategy.cta.soft}"</p>
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-bold text-indigo-400 uppercase mb-2">Strong CTA (Conversion)</h2>
            <p className="text-sm text-white font-bold">"{strategy.cta.strong}"</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StrategyDisplay;
