
import React, { useState, useRef, useEffect } from 'react';
import { getIrisResponse, getIrisVoice } from '../services/geminiService';
import { FLOWER_CATALOG } from '../constants';

interface AIAssistantProps {
  currentBouquetState?: string;
  onInspectFlower: (flowerId: string) => void;
  getCanvasSnapshot: () => Promise<string | null>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentBouquetState, onInspectFlower, getCanvasSnapshot }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleAudit = async (customPrompt?: string) => {
    setLoading(true);
    setSuggestion(null);
    
    // Capture Visual State
    const snapshot = await getCanvasSnapshot();
    const result = await getIrisResponse(customPrompt || "Perform a visual design audit of my current arrangement.", currentBouquetState, snapshot || undefined);
    
    setSuggestion(result);
    setLoading(false);

    if (isVoiceEnabled && result?.suggestion) {
      playVoice(result.suggestion);
    }
  };

  const playVoice = async (text: string) => {
    const audioData = await getIrisVoice(text);
    if (!audioData) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    const ctx = audioContextRef.current;
    const binary = atob(audioData);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const int16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, int16.length, 24000);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < int16.length; i++) data[i] = int16[i] / 32768.0;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    source.start();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [suggestion, loading]);

  return (
    <div className="glass rounded-[3rem] p-8 border border-white/40 shadow-2xl flex flex-col h-[700px] relative overflow-hidden group">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-stone-900 rounded-3xl flex items-center justify-center text-white shadow-2xl ring-4 ring-pink-50">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-xl serif italic leading-none mb-1">Iris Studio Mentor</h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">Digital Horticulture AI</span>
              {isSpeaking && (
                <div className="flex items-end h-3 gap-0.5">
                  <div className="wave-bar" style={{animationDelay: '0s'}}></div>
                  <div className="wave-bar" style={{animationDelay: '0.2s'}}></div>
                  <div className="wave-bar" style={{animationDelay: '0.4s'}}></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isVoiceEnabled ? 'bg-pink-500 text-white shadow-lg' : 'bg-stone-50 text-stone-300'}`}
          title="Toggle Voice Feedback"
        >
          <i className={`fa-solid ${isVoiceEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
        </button>
      </div>

      {/* Suggestion History / Scroll Area */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-8 custom-scrollbar pr-2">
        {!suggestion && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-10 animate-fade-in">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <i className="fa-solid fa-palette text-3xl text-stone-200"></i>
              </div>
              <p className="text-lg font-light italic serif text-stone-400 leading-relaxed">
                "Place your initial stems, then trigger a <span className="text-stone-900 font-bold not-italic">Visual Audit</span>. I will analyze your depth, palette, and spatial flow."
              </p>
            </div>
            
            <button 
              onClick={() => handleAudit()}
              className="px-8 py-5 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pink-600 transition-all shadow-2xl flex items-center gap-4 group"
            >
              Start Visual Audit <i className="fa-solid fa-eye group-hover:scale-110 transition-transform"></i>
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-8 bg-stone-50/50 rounded-[2.5rem] border border-stone-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Evaluating Spatial Balance...</span>
              </div>
              <div className="space-y-3">
                <div className="h-2.5 bg-stone-100 rounded-full w-full animate-pulse"></div>
                <div className="h-2.5 bg-stone-100 rounded-full w-5/6 animate-pulse"></div>
                <div className="h-2.5 bg-stone-100 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {suggestion && (
          <div className="animate-slide-up space-y-8">
            <div className="space-y-6 bg-white p-8 rounded-[3rem] border border-stone-50 shadow-sm shadow-stone-100">
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-pink-500 tracking-widest">Harmony Score</span>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold serif italic text-stone-900 leading-none">{suggestion.designScore}</span>
                    <span className="text-[10px] text-stone-300 font-black mb-1">/ 100</span>
                  </div>
                </div>
                <div className="w-24 h-1.5 bg-stone-50 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 transition-all duration-1000" style={{width: `${suggestion.designScore}%`}}></div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Artisan Critique</span>
                <p className="text-base text-stone-800 leading-relaxed italic serif">"{suggestion.suggestion}"</p>
              </div>

              <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block mb-3">Architectural Review</span>
                <p className="text-[11px] text-stone-600 leading-relaxed">{suggestion.deepAnalysis}</p>
              </div>

              {/* Actionable Stems Cards */}
              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block">Material Recommendations</span>
                <div className="grid grid-cols-2 gap-3">
                  {suggestion.recommendedFlowerIds.map((id: string) => {
                    const flower = FLOWER_CATALOG.find(f => f.id === id);
                    if (!flower) return null;
                    return (
                      <button 
                        key={id}
                        onClick={() => onInspectFlower(id)}
                        className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-stone-100 hover:border-pink-200 transition-all group/card text-left"
                      >
                        <img src={flower.image} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-stone-900 truncate">{flower.name}</p>
                          <p className="text-[8px] font-black text-pink-500 uppercase tracking-tighter">${flower.price}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-stone-900 p-6 rounded-3xl text-white flex gap-4 items-start shadow-xl">
                <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fa-solid fa-play text-[10px]"></i>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-pink-400 tracking-widest block mb-1">Recommended Next Step</span>
                  <p className="text-xs font-medium leading-relaxed opacity-90">{suggestion.nextStep}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSuggestion(null)}
              className="w-full py-4 text-stone-300 hover:text-stone-900 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Reset Mentor Console
            </button>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Stage */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleAudit(prompt); }} 
        className="relative mt-auto pt-6 bg-white/50"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Iris for a design audit..."
          className="w-full pl-8 pr-16 py-6 bg-white border border-stone-100 rounded-[2rem] text-sm focus:outline-none focus:ring-4 focus:ring-pink-50 shadow-xl transition-all"
        />
        <button
          disabled={loading || !prompt.trim()}
          type="submit"
          className="absolute right-4 top-10 w-12 h-12 flex items-center justify-center bg-stone-900 text-white rounded-2xl hover:bg-pink-600 transition-all disabled:opacity-20 shadow-lg"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>}
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
