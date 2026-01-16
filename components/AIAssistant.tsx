
import React, { useState, useRef, useEffect } from 'react';
import { getFloralAdvice } from '../services/geminiService';

interface AIAssistantProps {
  currentBouquetState?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentBouquetState }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = [
    "Check my balance",
    "Suggest a focal bloom",
    "Need a color palette",
    "Explain 3D depth"
  ];

  const handleAsk = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setSuggestion(null);
    const result = await getFloralAdvice(text, currentBouquetState);
    setSuggestion(result);
    setLoading(false);
    setPrompt('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [suggestion, loading]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-stone-100 shadow-sm flex flex-col h-[650px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 border-b border-stone-50 pb-4 px-2">
        <div className="relative">
          <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <i className="fa-solid fa-wand-sparkles"></i>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="font-bold text-lg serif italic leading-none mb-1">Iris Studio Mentor</h3>
          <p className="text-[9px] text-pink-500 font-black uppercase tracking-widest">Master Floral AI v3.0</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-6 custom-scrollbar pr-1">
        {!suggestion && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 gap-8 animate-in fade-in duration-700">
            <div className="space-y-4">
              <i className="fa-solid fa-feather-pointed text-4xl text-stone-200"></i>
              <p className="text-[13px] font-medium italic serif leading-relaxed text-stone-400">
                "Welcome to the Studio. I am here to ensure your arrangement carries both meaning and visual harmony."
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              {QUICK_PROMPTS.map(p => (
                <button 
                  key={p} 
                  onClick={() => handleAsk(p)}
                  className="px-4 py-3 bg-stone-50 hover:bg-stone-900 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-stone-100"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Iris is analyzing your Studio...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-stone-200 rounded-full w-full animate-pulse"></div>
                <div className="h-3 bg-stone-200 rounded-full w-4/5 animate-pulse delay-75"></div>
                <div className="h-3 bg-stone-200 rounded-full w-2/3 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}

        {suggestion && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
            <div className="bg-stone-50 p-6 rounded-[2.5rem] border border-stone-100 shadow-inner space-y-6">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest">Mentor's Vision</span>
                <p className="text-sm text-stone-800 leading-relaxed italic serif font-medium">"{suggestion.suggestion}"</p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-stone-100 shadow-sm space-y-3">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block">Structural Analysis</span>
                <p className="text-[11px] text-stone-600 leading-relaxed">{suggestion.designAnalysis}</p>
              </div>

              {suggestion.designChecklist && (
                <div className="space-y-3">
                  <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block">Artisan Checklist</span>
                  <div className="space-y-2">
                    {suggestion.designChecklist.map((step: string, i: number) => (
                      <div key={i} className="flex gap-3 items-center bg-white/50 p-3 rounded-xl border border-stone-50 text-[11px] text-stone-700">
                        <span className="w-5 h-5 bg-stone-900 text-white rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">{i+1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-50">
                   <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block mb-2">Recommended Materials</span>
                   <div className="flex flex-wrap gap-2">
                    {suggestion.recommendedFlowers.map((f: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-stone-100 text-stone-900 rounded-full text-[10px] font-bold border border-stone-200">{f}</span>
                    ))}
                   </div>
                </div>

                {suggestion.toolTip && (
                  <div className="bg-stone-900 p-5 rounded-2xl text-white shadow-xl flex gap-3 items-start transform hover:scale-[1.02] transition-transform">
                    <i className="fa-solid fa-compass-drafting text-pink-500 mt-1"></i>
                    <div>
                      <span className="text-[9px] font-black uppercase text-stone-500 tracking-[0.3em] block mb-1">Studio Tool Integration</span>
                      <p className="text-[11px] leading-relaxed opacity-90">{suggestion.toolTip}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                 <div className="flex gap-2">
                    {suggestion.colorPalette?.map((c: string, i: number) => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: c.toLowerCase()}}></div>
                    ))}
                 </div>
                 <span className="px-3 py-1 bg-white border border-stone-100 rounded-full text-[9px] font-black text-stone-400 uppercase tracking-widest">{suggestion.mood}</span>
              </div>
            </div>
            
            <button onClick={() => setSuggestion(null)} className="w-full py-4 text-stone-400 hover:text-stone-900 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-rotate-left"></i> Start New Design Inquiry
            </button>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleAsk(prompt); }} className="relative mt-auto pt-4 bg-white">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your mood, or ask for a design review..."
          className="w-full pl-6 pr-14 py-5 bg-stone-50 border border-stone-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all shadow-inner"
        />
        <button
          disabled={loading || !prompt.trim()}
          type="submit"
          className="absolute right-3 top-7 w-10 h-10 flex items-center justify-center bg-stone-900 text-white rounded-xl hover:bg-pink-600 transition-all disabled:opacity-20 shadow-lg"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-up text-xs"></i>}
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
