
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FLOWER_CATALOG, WRAP_STYLES, PRESET_BOUQUETS } from '../constants';
import { CustomBouquet, Flower, FlowerCategory, WholesaleConfig, WholesaleTier, CustomerMultiplier } from '../types';
import { getPairingSuggestions } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import AIAssistant from './AIAssistant';

interface BouquetBuilderProps {
  onAddToCart: (custom: CustomBouquet, total: number) => void;
}

interface UserPreset {
  id: string;
  name: string;
  config: CustomBouquet;
  timestamp: number;
}

const BouquetBuilder: React.FC<BouquetBuilderProps> = ({ onAddToCart }) => {
  const initialBouquet: CustomBouquet = {
    items: [],
    wrapType: 'paper',
    ribbonColor: '#f472b6',
    customTexture: undefined,
    textureIntensity: 0.45
  };

  const [bouquet, setBouquet] = useState<CustomBouquet>(initialBouquet);
  const [history, setHistory] = useState<CustomBouquet[]>([initialBouquet]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedFlowerDetail, setSelectedFlowerDetail] = useState<Flower | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FlowerCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGuides, setShowGuides] = useState(false);
  const [isGeneratingTexture, setIsGeneratingTexture] = useState(false);
  const [texturePrompt, setTexturePrompt] = useState('');
  const [userPresets, setUserPresets] = useState<UserPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  
  // Wholesale & Admin State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [wholesale, setWholesale] = useState<WholesaleConfig>({
    enabled: false,
    tiers: [
      { id: 't1', minQuantity: 10, discountPercentage: 10 },
      { id: 't2', minQuantity: 50, discountPercentage: 20 }
    ],
    customerMultipliers: [
      { id: 'c1', type: 'Boutique', multiplier: 0.85 },
      { id: 'c2', type: 'Event Planner', multiplier: 0.75 },
      { id: 'c3', type: 'Hotel Chain', multiplier: 0.70 }
    ],
    activeCustomerTypeId: null,
    simulatedQuantity: 1
  });

  // Realistic Rendering State
  const [isRenderingRealistic, setIsRenderingRealistic] = useState(false);
  const [realisticImageUrl, setRealisticImageUrl] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState('');

  // Canvas Environment State
  const [canvasBgColor, setCanvasBgColor] = useState('#f2f0eb');
  const PRESET_BG_COLORS = [
    { name: 'Studio', hex: '#f2f0eb' },
    { name: 'Gallery', hex: '#d6d3d1' },
    { name: 'Midnight', hex: '#1c1917' },
    { name: 'Sage', hex: '#d1d5db' },
    { name: 'Blush', hex: '#fdf2f8' }
  ];

  // 3D Preview State
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [globalRotation, setGlobalRotation] = useState({ x: 0, y: 0 });

  const USER_PRESETS_KEY = 'petal_prose_user_collections';
  const WHOLESALE_KEY = 'petal_prose_wholesale_config';
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPresets = localStorage.getItem(USER_PRESETS_KEY);
    if (savedPresets) {
      try { setUserPresets(JSON.parse(savedPresets)); } catch (e) { console.error(e); }
    }
    const savedWholesale = localStorage.getItem(WHOLESALE_KEY);
    if (savedWholesale) {
      try { setWholesale(JSON.parse(savedWholesale)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WHOLESALE_KEY, JSON.stringify(wholesale));
  }, [wholesale]);

  const pushHistory = (newBouquet: CustomBouquet) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newBouquet)));
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      setBouquet(JSON.parse(JSON.stringify(history[prev])));
      setHistoryIndex(prev);
      setSelectedItemIndex(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      setBouquet(JSON.parse(JSON.stringify(history[next])));
      setHistoryIndex(next);
      setSelectedItemIndex(null);
    }
  };

  const loadPreset = (presetName: string) => {
    const preset = PRESET_BOUQUETS[presetName];
    if (preset) {
      const loaded = JSON.parse(JSON.stringify(preset));
      setBouquet(loaded);
      pushHistory(loaded);
      setSelectedItemIndex(null);
    }
  };

  const addFlower = (flower: Flower) => {
    if (flower.stock <= 0) return;
    const offset = (Math.random() - 0.5) * 20;
    const newItems = [
      ...bouquet.items,
      {
        flowerId: flower.id,
        quantity: 1,
        rotation: (Math.random() - 0.5) * 30,
        scale: 1,
        position: { x: 50 + offset, y: 40 + offset }
      }
    ];
    const newBouquet = { ...bouquet, items: newItems };
    setBouquet(newBouquet);
    pushHistory(newBouquet);
    setSelectedItemIndex(newItems.length - 1);
    setSelectedFlowerDetail(null);
  };

  const updateItem = (index: number, updates: Partial<CustomBouquet['items'][0]>, isFinal = false) => {
    const newBouquet = {
      ...bouquet,
      items: bouquet.items.map((item, i) => i === index ? { ...item, ...updates } : item)
    };
    setBouquet(newBouquet);
    if (isFinal) pushHistory(newBouquet);
  };

  const moveLayer = (direction: 'front' | 'back' | 'forward' | 'backward') => {
    if (selectedItemIndex === null) return;
    const items = [...bouquet.items];
    const item = items[selectedItemIndex];
    let nextIdx = selectedItemIndex;

    if (direction === 'front') {
      items.splice(selectedItemIndex, 1);
      items.push(item);
      nextIdx = items.length - 1;
    } else if (direction === 'back') {
      items.splice(selectedItemIndex, 1);
      items.unshift(item);
      nextIdx = 0;
    } else if (direction === 'forward' && selectedItemIndex < items.length - 1) {
      items[selectedItemIndex] = items[selectedItemIndex + 1];
      items[selectedItemIndex + 1] = item;
      nextIdx = selectedItemIndex + 1;
    } else if (direction === 'backward' && selectedItemIndex > 0) {
      items[selectedItemIndex] = items[selectedItemIndex - 1];
      items[selectedItemIndex - 1] = item;
      nextIdx = selectedItemIndex - 1;
    }

    const newBouquet = { ...bouquet, items };
    setBouquet(newBouquet);
    pushHistory(newBouquet);
    setSelectedItemIndex(nextIdx);
  };

  const exportConfiguration = () => {
    if (bouquet.items.length === 0) return;
    const dataStr = JSON.stringify(bouquet, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `petal-prose-config-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const generateRealisticPreview = async () => {
    if (bouquet.items.length === 0) return;
    setIsRenderingRealistic(true);
    setRenderStatus('Assembling composition...');
    
    const flowerNames = bouquet.items.map(it => FLOWER_CATALOG.find(f => f.id === it.flowerId)?.name).join(', ');
    const wrap = WRAP_STYLES.find(w => w.id === bouquet.wrapType)?.name || 'no wrap';
    
    const statuses = [
      'Diffusing studio lighting...',
      'Calculating petal translucency...',
      'Hydrating textures...',
      'Final color correction...'
    ];
    
    let statusIdx = 0;
    const interval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setRenderStatus(statuses[statusIdx]);
        statusIdx++;
      }
    }, 1500);

    const prompt = `A professional, realistic, high-resolution studio photograph of a lush floral bouquet. 
    The arrangement contains: ${flowerNames}. 
    The bouquet is wrapped in ${wrap}. 
    It is placed against a solid ${canvasBgColor} background. 
    Cinematic soft lighting, shallow depth of field, sharp focus on petals, droplets of water, 8k resolution, elegant florist composition.`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "4:5" } }
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setRealisticImageUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setIsRenderingRealistic(false);
    }
  };

  const handleCanvasMove = (e: React.MouseEvent) => {
    if (isPreviewMode) return; 
    if (!isDragging || selectedItemIndex === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updateItem(selectedItemIndex, { position: { x, y } });
  };

  const unitPrice = useMemo(() => {
    const fPrice = bouquet.items.reduce((s, it) => s + (FLOWER_CATALOG.find(x => x.id === it.flowerId)?.price || 0), 0);
    return fPrice + (WRAP_STYLES.find(w => w.id === bouquet.wrapType)?.price || 0);
  }, [bouquet]);

  const pricingSummary = useMemo(() => {
    let finalPrice = unitPrice;
    let appliedDiscount = 0;
    let appliedMultiplier = 1;

    if (wholesale.enabled) {
      const cust = wholesale.customerMultipliers.find(c => c.id === wholesale.activeCustomerTypeId);
      if (cust) {
        appliedMultiplier = cust.multiplier;
        finalPrice *= appliedMultiplier;
      }

      const applicableTier = [...wholesale.tiers]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(t => wholesale.simulatedQuantity >= t.minQuantity);
      
      if (applicableTier) {
        appliedDiscount = applicableTier.discountPercentage;
        finalPrice *= (1 - (appliedDiscount / 100));
      }
    }

    return {
      unitPrice,
      wholesaleUnitPrice: finalPrice,
      totalOrderPrice: finalPrice * wholesale.simulatedQuantity,
      discount: appliedDiscount,
      multiplierLabel: wholesale.customerMultipliers.find(c => c.id === wholesale.activeCustomerTypeId)?.type || 'Retail'
    };
  }, [unitPrice, wholesale]);

  const filteredFlowers = FLOWER_CATALOG.filter(f => 
    (activeCategory === 'All' || f.category === activeCategory) &&
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bouquetAnalysisString = useMemo(() => {
    const names = bouquet.items.map(it => FLOWER_CATALOG.find(f => f.id === it.flowerId)?.name).filter(Boolean);
    return `Bouquet with ${names.length} stems: ${names.join(", ")}. Wrap style: ${bouquet.wrapType}.`;
  }, [bouquet]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Column: The Flower Bar & AI Mentor */}
      <div className="lg:col-span-3 space-y-6">
        <AIAssistant currentBouquetState={bouquetAnalysisString} />
        
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold serif italic">The Catalog</h3>
            <div className="flex gap-2">
              <button onClick={undo} disabled={historyIndex === 0} className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-900 disabled:opacity-30"><i className="fa-solid fa-rotate-left text-xs"></i></button>
              <button onClick={redo} disabled={historyIndex === history.length - 1} className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-900 disabled:opacity-30"><i className="fa-solid fa-rotate-right text-xs"></i></button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar px-2">
            {['All', FlowerCategory.BLOOM, FlowerCategory.FILLER, FlowerCategory.GREENERY, FlowerCategory.ACCENT].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat as any)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredFlowers.map(f => {
              const isOutOfStock = f.stock <= 0;
              return (
                <button 
                  key={f.id} 
                  onClick={() => !isOutOfStock && setSelectedFlowerDetail(f)} 
                  disabled={isOutOfStock}
                  className={`group relative bg-stone-50 p-3 rounded-3xl border border-transparent transition-all ${
                    isOutOfStock 
                      ? 'opacity-40 grayscale cursor-not-allowed' 
                      : 'hover:border-pink-200 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-2 relative">
                    <img src={f.image} className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-110'}`} loading="lazy" />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                        <span className="bg-white/90 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-stone-900 shadow-sm">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-tighter text-stone-700 truncate">{f.name}</div>
                  <div className="text-[9px] text-pink-500 font-bold">${f.price.toFixed(2)}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Column: The Design Studio Canvas */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4">
            <button 
              onClick={() => setIsPreviewMode(false)} 
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isPreviewMode ? 'bg-stone-900 text-white shadow-xl' : 'bg-white text-stone-400 border border-stone-100'}`}
            >
              2D Workspace
            </button>
            <button 
              onClick={() => setIsPreviewMode(true)} 
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isPreviewMode ? 'bg-stone-900 text-white shadow-xl' : 'bg-white text-stone-400 border border-stone-100'}`}
            >
              3D Viewport
            </button>
          </div>
          {isPreviewMode && (
             <div className="flex gap-4 items-center">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Global Rotation</span>
                <input 
                  type="range" min="-45" max="45" value={globalRotation.y} 
                  onChange={e => setGlobalRotation({...globalRotation, y: parseFloat(e.target.value)})} 
                  className="w-24 h-1 bg-stone-200 accent-stone-900 rounded-lg appearance-none cursor-pointer" 
                />
             </div>
          )}
        </div>

        <div 
          ref={canvasRef}
          className={`relative aspect-[4/5] rounded-[4rem] shadow-inner border-[15px] border-white overflow-hidden cursor-crosshair group/canvas transition-all duration-700 ${isPreviewMode ? 'perspective-2000' : ''}`}
          style={{ backgroundColor: canvasBgColor }}
          onMouseMove={handleCanvasMove}
          onMouseUp={() => { if(isDragging) pushHistory(bouquet); setIsDragging(false); }}
          onClick={() => setSelectedItemIndex(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/5 to-transparent pointer-events-none"></div>
          {showGuides && !isPreviewMode && (
            <div className="absolute inset-0 pointer-events-none border border-pink-500/10 z-10 flex items-center justify-center"><div className="w-full h-px bg-pink-500/10"></div><div className="h-full w-px bg-pink-500/10"></div></div>
          )}

          <div 
            className="relative w-full h-full z-20 transition-transform duration-700 preserve-3d"
            style={isPreviewMode ? { transform: `rotateX(15deg) rotateY(${globalRotation.y}deg)` } : {}}
          >
            {bouquet.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-6 opacity-30 select-none">
                <i className="fa-solid fa-leaf text-7xl"></i>
                <p className="text-2xl serif italic">Place your first stem</p>
              </div>
            ) : (
              bouquet.items.map((item, idx) => {
                const f = FLOWER_CATALOG.find(x => x.id === item.flowerId);
                const isSelected = selectedItemIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`absolute transition-all duration-300 ${isPreviewMode ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
                    style={{
                      left: `${item.position.x}%`, top: `${item.position.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale}) ${isPreviewMode ? 'translateZ(' + (idx * 5) + 'px)' : ''}`,
                      zIndex: isSelected ? 1000 : idx + 10
                    }}
                    onMouseDown={(e) => { 
                      if (isPreviewMode) return;
                      e.stopPropagation(); 
                      setSelectedItemIndex(idx); 
                      setIsDragging(true); 
                    }}
                  >
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-stone-950/[0.08] blur-[40px] rounded-full transform translate-y-8 scale-[0.8] transition-all duration-500 mix-blend-multiply ${isSelected ? 'opacity-60 blur-[60px]' : 'opacity-40'}`}></div>
                      
                      <div className={`relative rounded-full overflow-hidden border-[4px] shadow-2xl transition-all ${isSelected ? 'border-pink-500 ring-4 ring-pink-500/20 scale-105' : 'border-white'}`}>
                        <img src={f?.image} className="w-48 h-48 object-cover select-none pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none"></div>
                      </div>

                      {isSelected && !isPreviewMode && (
                        <>
                          <div className="absolute inset-[-40px] border-2 border-dashed border-pink-300 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none"></div>
                          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-stone-100 flex flex-col gap-2 z-[2000] animate-in slide-in-from-top-2 duration-300 pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-stone-500">
                              <span>Rotate</span>
                              <span className="text-pink-600">{Math.round(item.rotation)}°</span>
                            </div>
                            <input 
                              type="range" 
                              min="-180" 
                              max="180" 
                              value={item.rotation} 
                              onChange={e => updateItem(idx, { rotation: parseFloat(e.target.value) })}
                              onMouseUp={() => pushHistory(bouquet)}
                              className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Studio Controls & Pricing */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-stone-50 pb-4">
            <h3 className="text-lg font-bold serif italic">Studio Console</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsAdminMode(!isAdminMode)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAdminMode ? 'bg-pink-600 text-white' : 'bg-stone-50 text-stone-300'}`} title="Wholesale Management"><i className="fa-solid fa-briefcase text-[10px]"></i></button>
              <button onClick={() => setShowGuides(!showGuides)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${showGuides ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-300'}`}><i className="fa-solid fa-compass-drafting text-[10px]"></i></button>
            </div>
          </div>

          {isAdminMode ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Wholesale Pricing</span>
                    <span className="text-[9px] text-stone-300">Enable B2B Tiering</span>
                  </div>
                  <button 
                    onClick={() => setWholesale({...wholesale, enabled: !wholesale.enabled})}
                    className={`relative w-10 h-5 rounded-full transition-all ${wholesale.enabled ? 'bg-pink-500' : 'bg-stone-200'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${wholesale.enabled ? 'left-6' : 'left-1'}`}></div>
                  </button>
               </div>

               {wholesale.enabled && (
                 <div className="space-y-6">
                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-400">Bulk Quantity Tiers</h4>
                      <div className="space-y-2">
                        {wholesale.tiers.map((tier) => (
                          <div key={tier.id} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl">
                            <div className="flex-1 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-stone-100">
                               <input type="number" value={tier.minQuantity} onChange={e => setWholesale({...wholesale, tiers: wholesale.tiers.map(t => t.id === tier.id ? {...t, minQuantity: parseInt(e.target.value)} : t)})} className="w-10 text-[11px] font-bold outline-none" />
                               <span className="text-[9px] font-black uppercase text-stone-300 tracking-tighter">Units+</span>
                            </div>
                            <div className="flex-1 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-stone-100">
                               <input type="number" value={tier.discountPercentage} onChange={e => setWholesale({...wholesale, tiers: wholesale.tiers.map(t => t.id === tier.id ? {...t, discountPercentage: parseInt(e.target.value)} : t)})} className="w-10 text-[11px] font-bold outline-none" />
                               <span className="text-[9px] font-black uppercase text-stone-300 tracking-tighter">Disc%</span>
                            </div>
                            <button onClick={() => setWholesale({...wholesale, tiers: wholesale.tiers.filter(t => t.id !== tier.id)})} className="text-red-300 hover:text-red-500 p-1"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                          </div>
                        ))}
                        <button onClick={() => setWholesale({...wholesale, tiers: [...wholesale.tiers, { id: Date.now().toString(), minQuantity: 0, discountPercentage: 0 }]})} className="w-full py-2 border border-dashed border-stone-200 rounded-xl text-[9px] font-black uppercase text-stone-400 hover:border-stone-400 transition-all">+ Add Discount Tier</button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-400">Customer Segments</h4>
                      <div className="space-y-2">
                        {wholesale.customerMultipliers.map(mult => (
                          <div key={mult.id} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl">
                            <input type="text" value={mult.type} onChange={e => setWholesale({...wholesale, customerMultipliers: wholesale.customerMultipliers.map(m => m.id === mult.id ? {...m, type: e.target.value} : m)})} className="flex-1 bg-white rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none border border-stone-100" />
                            <input type="number" step="0.05" value={mult.multiplier} onChange={e => setWholesale({...wholesale, customerMultipliers: wholesale.customerMultipliers.map(m => m.id === mult.id ? {...m, multiplier: parseFloat(e.target.value)} : m)})} className="w-14 bg-white rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none border border-stone-100" />
                            <button onClick={() => setWholesale({...wholesale, customerMultipliers: wholesale.customerMultipliers.filter(m => m.id !== mult.id)})} className="text-red-300 hover:text-red-500 p-1"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>
               )}
               <button onClick={() => setIsAdminMode(false)} className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Save & Exit Admin</button>
            </div>
          ) : selectedItemIndex !== null && bouquet.items[selectedItemIndex] ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <span>Stem Tilt</span>
                    <span className="text-pink-600 font-mono">{Math.round(bouquet.items[selectedItemIndex].rotation)}°</span>
                  </div>
                  <input type="range" min="-180" max="180" value={bouquet.items[selectedItemIndex].rotation} onChange={e => updateItem(selectedItemIndex, { rotation: parseFloat(e.target.value) })} onMouseUp={() => pushHistory(bouquet)} className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-pink-500" />
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <span>Dimension Scale</span>
                    <span className="text-pink-600 font-mono">{Math.round(bouquet.items[selectedItemIndex].scale * 100)}%</span>
                  </div>
                  <input type="range" min="0.5" max="2.0" step="0.01" value={bouquet.items[selectedItemIndex].scale} onChange={e => updateItem(selectedItemIndex, { scale: parseFloat(e.target.value) })} onMouseUp={() => pushHistory(bouquet)} className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900" />
               </div>

               <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Z-Index Positioning</span>
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => moveLayer('back')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all border border-stone-100" title="To Back"><i className="fa-solid fa-angles-down text-xs"></i></button>
                    <button onClick={() => moveLayer('backward')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all border border-stone-100" title="Step Back"><i className="fa-solid fa-angle-down text-xs"></i></button>
                    <button onClick={() => moveLayer('forward')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all border border-stone-100" title="Step Forward"><i className="fa-solid fa-angle-up text-xs"></i></button>
                    <button onClick={() => moveLayer('front')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all border border-stone-100" title="To Front"><i className="fa-solid fa-angles-up text-xs"></i></button>
                  </div>
               </div>
               
               <button onClick={() => { const items = bouquet.items.filter((_,i) => i !== selectedItemIndex); const nb = {...bouquet, items}; setBouquet(nb); pushHistory(nb); setSelectedItemIndex(null); }} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100">Discard Selected Stem</button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Commercial Quote Calculator */}
              {wholesale.enabled && (
                <div className="bg-stone-950 p-6 rounded-3xl text-white space-y-5 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><i className="fa-solid fa-file-invoice-dollar text-4xl"></i></div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">Wholesale Estimator</h4>
                   
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black uppercase text-stone-500">Order Quantity (x)</label>
                         <input type="number" min="1" value={wholesale.simulatedQuantity} onChange={e => setWholesale({...wholesale, simulatedQuantity: Math.max(1, parseInt(e.target.value) || 1)})} className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none focus:bg-white/20 transition-all" />
                      </div>

                      <div className="space-y-1">
                         <label className="text-[9px] font-black uppercase text-stone-500">Business Segment</label>
                         <select value={wholesale.activeCustomerTypeId || ''} onChange={e => setWholesale({...wholesale, activeCustomerTypeId: e.target.value || null})} className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer">
                            <option value="" className="text-black">Retail (Standard)</option>
                            {wholesale.customerMultipliers.map(c => (
                              <option key={c.id} value={c.id} className="text-black">{c.type}</option>
                            ))}
                         </select>
                      </div>
                   </div>

                   <div className="pt-2 flex justify-between items-center border-t border-white/5">
                      <span className="text-[9px] font-black uppercase text-stone-500">Applied Discount</span>
                      <span className="text-xs font-bold text-pink-500">{pricingSummary.discount}% Tiered</span>
                   </div>
                </div>
              )}

              {/* Designer Presets */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Designer Presets</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(PRESET_BOUQUETS).map(presetName => (
                    <button 
                      key={presetName}
                      onClick={() => loadPreset(presetName)}
                      className="group flex items-center justify-between px-4 py-3 bg-white rounded-2xl text-[10px] font-bold text-stone-600 hover:bg-stone-900 hover:text-white transition-all border border-stone-100"
                    >
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${presetName === 'Romantic' ? 'fa-heart text-pink-400' : presetName === 'Modern' ? 'fa-cube text-blue-400' : 'fa-wheat-awn text-orange-400'} group-hover:text-white transition-colors`}></i>
                        {presetName}
                      </div>
                      <i className="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Environment Control */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Studio Ambiance</h4>
                <div className="flex flex-wrap gap-2">
                  {PRESET_BG_COLORS.map(color => (
                    <button 
                      key={color.name}
                      onClick={() => setCanvasBgColor(color.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${canvasBgColor === color.hex ? 'border-pink-500 scale-110 shadow-lg' : 'border-white'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* High-Level Studio Actions */}
              <div className="space-y-3">
                <button 
                  onClick={generateRealisticPreview}
                  disabled={isRenderingRealistic || bouquet.items.length === 0}
                  className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-30 group"
                >
                  {isRenderingRealistic ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Finalizing Render...</>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles group-hover:animate-bounce"></i> AI Photorealistic Render</>
                  )}
                </button>
                
                <button 
                  onClick={exportConfiguration}
                  disabled={bouquet.items.length === 0}
                  className="w-full py-4 bg-white border border-stone-100 text-stone-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-stone-900 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-30 group"
                >
                  <i className="fa-solid fa-download group-hover:scale-110 transition-transform"></i> Download Config (JSON)
                </button>
              </div>
            </div>
          )}

          {/* Pricing Footer */}
          <div className="space-y-4 pt-6 border-t border-stone-50">
             <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">
                    {wholesale.enabled ? `${pricingSummary.multiplierLabel} Unit` : 'Individual Price'}
                  </span>
                  <span className="text-4xl font-bold italic serif text-pink-600">
                    ${(wholesale.enabled ? pricingSummary.wholesaleUnitPrice : pricingSummary.unitPrice).toFixed(2)}
                  </span>
                </div>
             </div>
             
             {wholesale.enabled && (
               <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Full Order Total</span>
                    <span className="text-2xl font-bold text-stone-900 serif">${pricingSummary.totalOrderPrice.toFixed(2)}</span>
                  </div>
                  <i className="fa-solid fa-tag text-pink-500 animate-pulse"></i>
               </div>
             )}

             <button 
               onClick={() => onAddToCart(bouquet, wholesale.enabled ? pricingSummary.totalOrderPrice : pricingSummary.unitPrice)} 
               disabled={bouquet.items.length === 0} 
               className="w-full py-5 bg-stone-900 text-white rounded-[2rem] font-bold text-lg hover:bg-pink-600 shadow-2xl disabled:opacity-20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
             >
               {wholesale.enabled ? 'Confirm Wholesale Order' : 'Checkout Design'} <i className="fa-solid fa-arrow-right"></i>
             </button>
          </div>
        </div>
      </div>

      {/* Realistic Preview Modal */}
      {realisticImageUrl && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-3xl" onClick={() => setRealisticImageUrl(null)}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl border border-white/20 flex flex-col items-center">
              <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100">
                 <img src={realisticImageUrl} className="w-full h-full object-cover animate-in zoom-in-95 duration-700" />
              </div>
              <div className="p-12 w-full text-center space-y-8 bg-white">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-bold serif italic">The Masterpiece</h3>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Studio Visualization Engine v1.0</p>
                 </div>
                 <div className="flex gap-4 justify-center">
                    <button onClick={() => { const link = document.createElement('a'); link.href = realisticImageUrl; link.download = 'bouquet-render.png'; link.click(); }} className="px-8 py-4 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all flex items-center gap-2 shadow-xl">
                       <i className="fa-solid fa-cloud-arrow-down"></i> Export Image
                    </button>
                    <button onClick={() => setRealisticImageUrl(null)} className="px-8 py-4 bg-stone-50 text-stone-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-all">Dismiss Preview</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Rendering Progress Modal */}
      {isRenderingRealistic && (
        <div className="fixed inset-0 z-[2001] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-2xl"></div>
          <div className="relative text-center space-y-12 max-w-sm">
             <div className="relative flex items-center justify-center">
                <div className="w-32 h-32 border-[4px] border-white/10 rounded-full animate-[spin_4s_linear_infinite]"></div>
                <div className="absolute w-32 h-32 border-[4px] border-transparent border-t-pink-500 rounded-full animate-spin"></div>
                <div className="absolute"><i className="fa-solid fa-wand-magic-sparkles text-white text-4xl animate-pulse"></i></div>
             </div>
             <div className="space-y-6">
                <h4 className="text-white text-3xl font-bold serif italic">Rendering Reality...</h4>
                <div className="flex flex-col gap-2">
                   <p className="text-pink-500 text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">{renderStatus}</p>
                   <p className="text-white/20 text-[9px] uppercase tracking-[0.3em]">Leveraging Digital Horticulture AI</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Flower Inspection Modal */}
      {selectedFlowerDetail && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl" onClick={() => setSelectedFlowerDetail(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/20">
            <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
              <img src={selectedFlowerDetail.image} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <h2 className="text-6xl font-bold serif italic leading-none mb-2">{selectedFlowerDetail.name}</h2>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">{selectedFlowerDetail.scientificName}</p>
              </div>
            </div>
            <div className="md:w-1/2 p-16 space-y-12 flex flex-col justify-center bg-white">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] block">Iris's Botanical Insight</span>
                <p className="text-3xl font-light italic serif text-stone-700 leading-tight">"{selectedFlowerDetail.meaning}"</p>
              </div>
              <div className="flex justify-between items-end border-b border-stone-100 pb-8">
                <span className="text-[11px] font-black text-stone-300 uppercase tracking-widest">Base Studio Price</span>
                <span className="text-4xl font-bold serif italic">${selectedFlowerDetail.price.toFixed(2)}</span>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => addFlower(selectedFlowerDetail)} 
                  disabled={selectedFlowerDetail.stock <= 0}
                  className="w-full py-6 bg-stone-900 text-white rounded-[2rem] font-bold text-lg hover:bg-pink-600 shadow-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {selectedFlowerDetail.stock > 0 ? 'Add to Arrangement' : 'Out of Stock'}
                </button>
                <button onClick={() => setSelectedFlowerDetail(null)} className="w-full py-4 text-stone-400 text-[11px] font-black uppercase tracking-[0.2em] hover:text-stone-950 transition-colors">Return to Console</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BouquetBuilder;
