
import React, { useState, useRef } from 'react';
import { 
  UserInputs, StrategyResult, AnalysisInputs, AnalysisResult, 
  AudienceInputs, AudienceResult, CommentInputs, CommentResult,
  VideoAuditInputs, VideoAuditResult 
} from './types';
import { 
  generateViralStrategy, analyzeViralHook, generateAudiencePersona, 
  analyzeComment, auditVideoPerformance 
} from './services/geminiService';
import StrategyDisplay from './components/StrategyDisplay';
import AnalysisDisplay from './components/AnalysisDisplay';
import AudienceDisplay from './components/AudienceDisplay';
import CommentDisplay from './components/CommentDisplay';
import VideoAuditDisplay from './components/VideoAuditDisplay';

type AppMode = 'generator' | 'audit' | 'hub';
type HubTab = 'audience' | 'hook' | 'community';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('generator');
  const [hubTab, setHubTab] = useState<HubTab>('audience');
  const [isLoading, setIsLoading] = useState(false);
  const [hubLoading, setHubLoading] = useState<{ana?: boolean, per?: boolean, com?: boolean}>({});
  const [error, setError] = useState<string | null>(null);
  const [extractingFrames, setExtractingFrames] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  // States
  const [genInputs, setGenInputs] = useState<UserInputs>({ niche: '', targetAudience: '', duration: 15, goal: 'Engagement', tone: 'Educational', platform: 'TikTok' });
  const [genResult, setGenResult] = useState<StrategyResult | null>(null);

  const [anaInputs, setAnaInputs] = useState<AnalysisInputs>({ originalHook: '', niche: '', platform: 'TikTok', targetAudience: '' });
  const [anaResult, setAnaResult] = useState<AnalysisResult | null>(null);

  const [perInputs, setPerInputs] = useState<AudienceInputs>({ niche: '', sampleComments: '', sampleCaptions: '', platform: 'TikTok' });
  const [perResult, setPerResult] = useState<AudienceResult | null>(null);

  const [comInputs, setComInputs] = useState<CommentInputs>({ commentText: '', creatorTone: 'Friendly', context: '', responseStyle: 'friendly' });
  const [comResult, setComResult] = useState<CommentResult | null>(null);

  const [audInputs, setAudInputs] = useState<VideoAuditInputs>({ 
    platform: 'TikTok', title: '', description: '', transcript: '', 
    duration: '', niche: '', targetAudience: '', visuals: '', visualFrames: [], audioData: '',
    optimizationMode: 'default', style: 'Vlog'
  });
  const [audResult, setAudResult] = useState<VideoAuditResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractFrames = async (file: File): Promise<{frames: string[], audio: string}> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.muted = true;

      video.onloadedmetadata = async () => {
        const duration = video.duration;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const frames: string[] = [];
        const frameCount = 15; // Increased for "High Density" scan
        const intervals = Array.from({ length: frameCount }, (_, i) => (duration / (frameCount + 1)) * (i + 1));

        for (let i = 0; i < intervals.length; i++) {
          const time = intervals[i];
          video.currentTime = time;
          await new Promise(r => video.onseeked = r);
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL('image/jpeg', 0.4).split(',')[1]);
          setExtractionProgress(Math.round(((i + 1) / frameCount) * 100));
        }

        // Audio Extraction Loop
        let base64Audio = '';
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            // We convert to a simpler representation if needed, but for now we send a blob
            // In a real production app, we would transcode to MP3/AAC 16kbps here
            // Sending small chunk of audio data for reasoning
            base64Audio = ''; // Placeholder for full audio extraction logic
        } catch (e) { console.error("Audio rip failed", e); }

        URL.revokeObjectURL(video.src);
        resolve({ frames, audio: base64Audio });
      };
      video.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtractingFrames(true);
    setExtractionProgress(0);
    try {
      const { frames, audio } = await extractFrames(file);
      setAudInputs(prev => ({ ...prev, visualFrames: frames, audioData: audio }));
    } catch (err) {
      setError("Failed to extract video content.");
    } finally {
      setExtractingFrames(false);
    }
  };

  const handleGenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setGenResult(null);
    try { const data = await generateViralStrategy(genInputs); setGenResult(data); } catch (err) { setError('Failed to generate blueprint.'); } finally { setIsLoading(false); }
  };

  const handleAnaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHubLoading(prev => ({...prev, ana: true})); setError(null);
    try { const data = await analyzeViralHook(anaInputs); setAnaResult(data); } catch (err) { setError('Hook Audit failed.'); } finally { setHubLoading(prev => ({...prev, ana: false})); }
  };

  const handlePerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHubLoading(prev => ({...prev, per: true})); setError(null);
    try { const data = await generateAudiencePersona(perInputs); setPerResult(data); } catch (err) { setError('Intelligence failed.'); } finally { setHubLoading(prev => ({...prev, per: false})); }
  };

  const handleComSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHubLoading(prev => ({...prev, com: true})); setError(null);
    try { const data = await analyzeComment(comInputs); setComResult(data); } catch (err) { setError('Comment analysis failed.'); } finally { setHubLoading(prev => ({...prev, com: false})); }
  };

  const handleAudSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setAudResult(null);
    try { const data = await auditVideoPerformance(audInputs); setAudResult(data); } catch (err) { setError('Growth Diagnostic failed.'); } finally { setIsLoading(false); }
  };

  const architectureStyles = [
    'Vlog', 'Talking Head', 'POV/Skit', 
    'Aesthetic', 'Tutorial', 'Podcast', 
    'Gaming', 'Meme/Trend', 'Showcase'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 custom-scrollbar overflow-x-hidden">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-indigo-500/20">V</div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none">ViralVantage</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 text-indigo-400">Intelligence Engine</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {[
              { id: 'generator', label: 'Strategy' },
              { id: 'audit', label: 'Audit' },
              { id: 'hub', label: 'Intelligence Hub' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => { setMode(nav.id as AppMode); setError(null); }}
                className={`px-5 py-2.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${mode === nav.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column: Fixed Input Console (Now wider at 5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:h-fit space-y-8 transition-all duration-500">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                {mode === 'audit' ? 'Audit' : mode === 'generator' ? 'Strategy' : 'Command'}
              </h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Module Active: {mode}</p>
            </div>

            <div className="space-y-6">
              {mode === 'generator' && (
                <form onSubmit={handleGenSubmit} className="space-y-6 glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
                  <div className="space-y-4">
                    <input required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50" value={genInputs.niche} onChange={e => setGenInputs({...genInputs, niche: e.target.value})} placeholder="Niche (e.g. Finance)" />
                    <input required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50" value={genInputs.targetAudience} onChange={e => setGenInputs({...genInputs, targetAudience: e.target.value})} placeholder="Target Audience" />
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" value={genInputs.platform} onChange={e => setGenInputs({...genInputs, platform: e.target.value as any})}>
                            <option value="TikTok">TikTok</option><option value="Instagram">Instagram</option><option value="YouTube Shorts">Shorts</option>
                        </select>
                        <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none" value={genInputs.goal} onChange={e => setGenInputs({...genInputs, goal: e.target.value})}>
                            <option value="Engagement">Engagement</option><option value="Sales">Sales</option>
                        </select>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-6 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all">
                    Generate Strategy
                  </button>
                </form>
              )}

              {/* REFINED AUDIT FORM (EXPANDED WIDTH & DEEP SCAN) */}
              {mode === 'audit' && (
                <form onSubmit={handleAudSubmit} className="space-y-8 glass p-10 rounded-[3rem] border-white/5 shadow-2xl bg-gradient-to-b from-slate-900/50 to-slate-950">
                  <div className="space-y-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()} 
                      className={`group border-2 border-dashed rounded-[2.5rem] p-12 text-center cursor-pointer transition-all relative overflow-hidden ${extractingFrames ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-white/[0.02]'}`}
                    >
                      {extractingFrames && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${extractionProgress}%` }}></div>
                      )}
                      <div className={`text-5xl mb-3 transition-all duration-500 ${extractingFrames ? 'animate-bounce' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`}>🎬</div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                        {extractingFrames ? `Scanning: ${extractionProgress}%` : (audInputs.visualFrames?.length ?? 0) > 0 ? '✅ Content Synced' : 'Initiate Deep Scan'}
                      </span>
                      <p className="text-[9px] text-slate-600 font-bold mt-2 uppercase tracking-widest">vision + audio engine ready</p>
                      <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Video Architecture</label>
                       <div className="grid grid-cols-3 gap-2.5">
                          {architectureStyles.map(s => (
                            <button 
                              key={s} type="button" 
                              onClick={() => setAudInputs({...audInputs, style: s})}
                              className={`py-3 px-1 text-[8px] sm:text-[9px] font-black uppercase rounded-2xl border transition-all duration-300 ${audInputs.style === s ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_8px_20px_rgba(79,70,229,0.3)]' : 'bg-slate-950/50 border-white/5 text-slate-600 hover:text-slate-400 hover:border-white/10'}`}
                            >
                              {s}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                      <input required className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 text-sm font-medium text-white placeholder-slate-700 outline-none focus:border-indigo-500/50 transition-all" value={audInputs.title} onChange={e => setAudInputs({...audInputs, title: e.target.value})} placeholder="Main Narrative / Concept" />
                      
                      <div className="relative group">
                        <textarea rows={3} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 text-sm font-medium text-white placeholder-slate-700 outline-none resize-none focus:border-indigo-500/50 transition-all" value={audInputs.transcript} onChange={e => setAudInputs({...audInputs, transcript: e.target.value})} placeholder="Dialogue / Script (Optional)..." />
                        {!audInputs.transcript && (audInputs.visualFrames?.length ?? 0) > 0 && (
                          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg backdrop-blur-md animate-fadeIn">
                             <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping"></div>
                             <span className="text-[9px] font-black text-indigo-400 uppercase italic tracking-wider">Multimodal Logic Ready</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-2">Platform</label>
                           <select className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500/50 transition-all" value={audInputs.platform} onChange={e => setAudInputs({...audInputs, platform: e.target.value as any})}>
                              <option value="TikTok">TikTok</option><option value="Instagram">Instagram</option><option value="YouTube">YouTube</option>
                           </select>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-2">Growth Lens</label>
                           <select className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-indigo-500/50 transition-all" value={audInputs.optimizationMode} onChange={e => setAudInputs({...audInputs, optimizationMode: e.target.value as any})}>
                              <option value="default">Strategic</option><option value="spectacle">Spectacle</option>
                           </select>
                        </div>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading || extractingFrames} className="w-full py-7 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all active:scale-[0.98] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isLoading ? 'Processing High-Density Map...' : 'Run Neural Audit'}
                  </button>
                </form>
              )}

              {/* INTELLIGENCE HUB CONSOLE */}
              {mode === 'hub' && (
                <div className="space-y-6 glass p-10 rounded-[3rem] border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-gradient-to-b from-slate-900/40 to-slate-950/80">
                  <div className="bg-slate-950/80 p-1.5 rounded-2xl flex gap-1.5 border border-white/10 shadow-inner">
                    {(['audience', 'hook', 'community'] as HubTab[]).map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setHubTab(tab)} 
                        className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all duration-300 ${hubTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-200'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-8 min-h-[450px] animate-fadeIn">
                    {hubTab === 'audience' && (
                      <form onSubmit={handlePerSubmit} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Segment</label>
                           <input required className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none focus:border-emerald-500/50" value={perInputs.niche} onChange={e => setPerInputs({...perInputs, niche: e.target.value})} placeholder="e.g. Luxury Real Estate" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Observational Data</label>
                           <textarea rows={10} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none resize-none focus:border-emerald-500/50" value={perInputs.sampleComments} onChange={e => setPerInputs({...perInputs, sampleComments: e.target.value})} placeholder="Paste comments, captions, or community context..." />
                        </div>
                        <button type="submit" disabled={hubLoading.per} className="w-full py-6 rounded-[1.5rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all active:scale-[0.98]">
                          {hubLoading.per ? 'Decoding Psychology...' : 'Generate Profile'}
                        </button>
                      </form>
                    )}
                    
                    {hubTab === 'hook' && (
                      <form onSubmit={handleAnaSubmit} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Viral Hook Entry</label>
                           <textarea required rows={8} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none resize-none focus:border-indigo-500/50" value={anaInputs.originalHook} onChange={e => setAnaInputs({...anaInputs, originalHook: e.target.value})} placeholder="Enter the hook you want to audit for algorithm retention..." />
                        </div>
                        <button type="submit" disabled={hubLoading.ana} className="w-full py-6 rounded-[1.5rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                          {hubLoading.ana ? 'Analyzing Logic...' : 'Verify Virality'}
                        </button>
                      </form>
                    )}

                    {hubTab === 'community' && (
                      <form onSubmit={handleComSubmit} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Incoming Content</label>
                           <textarea required rows={8} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none resize-none focus:border-rose-500/50" value={comInputs.commentText} onChange={e => setComInputs({...comInputs, commentText: e.target.value})} placeholder="Paste comment for elite response strategy..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Creator Tone</label>
                              <input className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" value={comInputs.creatorTone} onChange={e => setComInputs({...comInputs, creatorTone: e.target.value})} placeholder="Tone" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Strategy style</label>
                              <select className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" value={comInputs.responseStyle} onChange={e => setComInputs({...comInputs, responseStyle: e.target.value as any})}>
                                <option value="witty">Witty</option><option value="friendly">Friendly</option><option value="professional">Professional</option>
                              </select>
                           </div>
                        </div>
                        <button type="submit" disabled={hubLoading.com} className="w-full py-6 rounded-[1.5rem] bg-rose-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/30 hover:bg-rose-500 transition-all">
                          {hubLoading.com ? 'Drafting Protocol...' : 'Draft Response'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] text-center font-black uppercase tracking-widest">{error}</div>}
          </div>

          {/* Right Column: Dashboard (7 cols) */}
          <div className="lg:col-span-7 transition-all duration-500">
            {isLoading ? (
              <div className="h-[700px] flex flex-col items-center justify-center space-y-8">
                <div className="w-20 h-20 border-[6px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_40px_rgba(99,102,241,0.2)]"></div>
                <div className="text-center">
                  <span className="text-xs font-black text-white uppercase tracking-[0.4em] block mb-2 animate-pulse">Running Neural Simulation</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Growth Engines Engaged</span>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn space-y-10">
                {mode === 'generator' && (genResult ? <StrategyDisplay strategy={genResult} /> : <Placeholder icon="🎬" text="Strategy Blueprint" sub="Assemble viral script architecture." color="indigo" />)}
                {mode === 'audit' && (audResult ? <VideoAuditDisplay audit={audResult} /> : <Placeholder icon="📊" text="Performance Diagnostic" sub="Scan video for automated retention audit." color="orange" />)}
                
                {mode === 'hub' && (
                  <div className="space-y-10">
                    <div className="glass px-8 py-6 rounded-[2rem] border-white/5 flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-8">
                         <div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Target Persona</span>
                            <span className="text-sm font-black text-white italic tracking-tight">{perInputs.niche || 'Global Intelligence'}</span>
                         </div>
                         <div className="h-10 w-px bg-white/10"></div>
                         <div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Signal Quality</span>
                            <div className="flex items-center gap-1.5">
                               <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping"></div>
                               <span className="text-[10px] font-black text-indigo-400 uppercase">100% Locked</span>
                            </div>
                         </div>
                      </div>
                      <div className="hidden md:block">
                         <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">ViralVantage v1.7 Command</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InsightTile 
                        title="Psychological Profile" color="emerald" icon="🧠" 
                        loading={hubLoading.per} data={perResult} 
                        render={<AudienceDisplay persona={perResult!} />} 
                        onAction={() => setHubTab('audience')}
                      />
                      <InsightTile 
                        title="Hook Logic Analysis" color="indigo" icon="🔍" 
                        loading={hubLoading.ana} data={anaResult} 
                        render={<AnalysisDisplay analysis={anaResult!} />} 
                        onAction={() => setHubTab('hook')}
                      />
                      <div className="md:col-span-2">
                        <InsightTile 
                          title="Community Response Strategy" color="rose" icon="💬" 
                          loading={hubLoading.com} data={comResult} 
                          render={<CommentDisplay result={comResult!} />} 
                          onAction={() => setHubTab('community')}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const InsightTile = ({ title, icon, color, loading, data, render, onAction }: any) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 ml-2">
      <div className={`w-2 h-2 rounded-full bg-${color}-500 shadow-[0_0_10px_rgba(255,255,255,0.4)]`}></div>
      <h3 className={`text-[10px] font-black text-white uppercase tracking-[0.2em]`}>{title}</h3>
    </div>
    {loading ? (
      <ModuleSkeleton color={color} />
    ) : data ? (
      <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-white/10 animate-fadeIn">
        {render}
      </div>
    ) : (
      <button 
        onClick={onAction}
        className="w-full h-56 border-2 border-dashed border-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-white/10 hover:bg-white/[0.01] transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="text-4xl grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">{icon}</span>
        <div className="text-center relative z-10">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-200 transition-colors block">Intelligence Pending</span>
          <p className="text-[9px] text-slate-700 font-bold uppercase mt-1">Initiate command sequence</p>
        </div>
      </button>
    )}
  </div>
);

const Placeholder = ({ icon, text, sub, color }: any) => (
  <div className="h-[700px] flex flex-col items-center justify-center border-2 border-dashed border-slate-900 rounded-[3rem] p-12 text-center group bg-slate-900/5 hover:bg-slate-900/10 transition-all">
    <span className="text-6xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110">{icon}</span>
    <h3 className={`font-black text-2xl uppercase tracking-tighter text-slate-500 mb-2 group-hover:text-${color}-400 transition-colors`}>{text}</h3>
    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">{sub}</p>
  </div>
);

const ModuleSkeleton = ({ color }: { color: string }) => (
  <div className={`h-56 glass rounded-[2.5rem] border-white/5 p-10 flex flex-col gap-6 animate-pulse`}>
    <div className={`h-4 w-1/4 bg-${color}-500/20 rounded-full`}></div>
    <div className="space-y-4">
      <div className="h-2 w-full bg-slate-900 rounded-full"></div>
      <div className="h-2 w-11/12 bg-slate-900 rounded-full"></div>
      <div className="h-2 w-9/12 bg-slate-900 rounded-full"></div>
    </div>
    <div className="flex gap-3 pt-2">
      <div className="h-8 w-20 bg-slate-900 rounded-xl"></div>
      <div className="h-8 w-20 bg-slate-900 rounded-xl"></div>
    </div>
  </div>
);

export default App;
