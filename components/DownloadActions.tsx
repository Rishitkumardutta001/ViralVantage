
import React from 'react';

interface DownloadActionsProps {
  elementId: string;
  textData: string;
  fileName: string;
  compact?: boolean;
}

const DownloadActions: React.FC<DownloadActionsProps> = ({ elementId, textData, fileName, compact }) => {
  const downloadText = () => {
    const content = textData || "ViralVantage Audit Data";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadImage = async () => {
    const element = document.getElementById(elementId);
    if (!element || !(window as any).html2canvas) return;
    
    try {
      const canvas = await (window as any).html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
        useCORS: true,
        borderRadius: 20
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  if (compact) {
    return (
      <div className="flex gap-1">
        <button onClick={downloadText} title="Export Text" className="p-2 bg-white/5 border border-white/5 rounded-lg text-xs hover:bg-white/10 transition-all opacity-40 hover:opacity-100">📄</button>
        <button onClick={downloadImage} title="Export Image" className="p-2 bg-indigo-500/10 border border-indigo-500/10 rounded-lg text-xs hover:bg-indigo-500/20 transition-all opacity-40 hover:opacity-100">🖼️</button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={downloadText}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 transition-all active:scale-95 uppercase tracking-widest"
      >
        📄 Text
      </button>
      <button 
        onClick={downloadImage}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-[10px] font-black text-indigo-400 transition-all active:scale-95 uppercase tracking-widest"
      >
        🖼️ Image
      </button>
    </div>
  );
};

export default DownloadActions;
