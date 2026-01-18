
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FLOWER_CATALOG, WRAP_STYLES, PRESET_BOUQUETS } from '../constants';
import { CustomBouquet, Flower, FlowerCategory, WholesaleConfig, WholesaleTier, CustomerMultiplier } from '../types';
import { getPaletteSuggestions } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import AIAssistant from './AIAssistant';

interface BouquetBuilderProps {
  onAddToCart: (custom: CustomBouquet, total: number) => void;
}

const DEFAULT_WHOLESALE: WholesaleConfig = {
  enabled: false,
  tiers: [
    { id: 't1', minQuantity: 25, discountPercentage: 10 },
    { id: 't2', minQuantity: 50, discountPercentage: 20 },
    { id: 't3', minQuantity: 100, discountPercentage: 35 }
  ],
  customerMultipliers: [
    { id: 'c1', type: 'Standard Retail', multiplier: 1.0 },
    { id: 'c2', type: 'Design Partner', multiplier: 0.85 },
    { id: 'c3', type: 'Volume Distributor', multiplier: 0.70 }
  ],
  activeCustomerTypeId: 'c1',
  simulatedQuantity: 1
};

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

  const [wholesale, setWholesale] = useState<WholesaleConfig>(DEFAULT_WHOLESALE);
  const [showWholesaleAdmin, setShowWholesaleAdmin] = useState(false);

  const [selectedFlowerDetail, setSelectedFlowerDetail] = useState<Flower | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const [activeCategory, setActiveCategory] = useState<FlowerCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isRenderingRealistic, setIsRenderingRealistic] = useState(false);
  const [realisticImageUrl, setRealisticImageUrl] = useState<string | null>(null);
  const [canvasBgColor, setCanvasBgColor] = useState('#f2f0eb');

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [globalRotation, setGlobalRotation] = useState({ x: 10, y: -5 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Persistence for Wholesale Configuration
  useEffect(() => {
    const savedWholesale = localStorage.getItem('petal_wholesale_config');
    if (savedWholesale) {
      try {
        setWholesale(JSON.parse(savedWholesale));
      } catch (e) {
        console.error("Failed to load wholesale config", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('petal_wholesale_config', JSON.stringify(wholesale));
  }, [wholesale]);

  const pushHistory = (newBouquet: CustomBouquet) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newBouquet)));
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addFlower = (flower: Flower) => {
    if (flower.stock <= 0) return;
    const offset = (Math.random() - 0.5) * 15;
    const newItems = [
      ...bouquet.items,
      {
        flowerId: flower.id,
        quantity: 1,
        rotation: 0,
        localRotation3D: { x: 0, y: 0 },
        scale: 1,
        position: { x: 50 + offset, y: 40 + offset }
      }
    ];
    const newBouquet = { ...bouquet, items: newItems };
    setBouquet(newBouquet);
    pushHistory(newBouquet);
    setSelectedItemIndex(newItems.length - 1);
    // Don't close detail so they can add multiple from harmonious pairings
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
      [items[selectedItemIndex], items[selectedItemIndex + 1]] = [items[selectedItemIndex + 1], items[selectedItemIndex]];
      nextIdx = selectedItemIndex + 1;
    } else if (direction === 'backward' && selectedItemIndex > 0) {
      [items[selectedItemIndex], items[selectedItemIndex - 1]] = [items[selectedItemIndex - 1], items[selectedItemIndex]];
      nextIdx = selectedItemIndex - 1;
    }

    const newBouquet = { ...bouquet, items };
    setBouquet(newBouquet);
    pushHistory(newBouquet);
    setSelectedItemIndex(nextIdx);
  };

  const generateRealisticPreview = async () => {
    if (bouquet.items.length === 0) return;
    setIsRenderingRealistic(true);
    const flowerNames = bouquet.items.map(it => FLOWER_CATALOG.find(f => f.id === it.flowerId)?.name).join(', ');
    const prompt = `A highly realistic, masterfully lit studio photograph of a floral bouquet containing: ${flowerNames}. Professional florist arrangement, clear details, 8k resolution.`;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] }
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) setRealisticImageUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
    } catch (e) { console.error(e); } finally { setIsRenderingRealistic(false); }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) {
      setIsRotating(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      setIsDragging(false);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPreviewMode && isRotating) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      setGlobalRotation(prev => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y + deltaX * 0.5
      }));
      setLastMousePos({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isPreviewMode && isDragging && selectedItemIndex !== null && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      updateItem(selectedItemIndex, { position: { x, y } });
    }
  };

  const handleCanvasMouseUp = () => {
    if (isRotating) setIsRotating(false);
    if (isDragging) {
      pushHistory(bouquet);
      setIsDragging(false);
    }
  };

  const pricing = useMemo(() => {
    const baseUnitCost = bouquet.items.reduce((s, it) => s + (FLOWER_CATALOG.find(x => x.id === it.flowerId)?.price || 0), 0) + 
                       (WRAP_STYLES.find(w => w.id === bouquet.wrapType)?.price || 0);
    
    if (!wholesale.enabled) return { unit: baseUnitCost, total: baseUnitCost, discount: 0 };

    const customerMultiplier = wholesale.customerMultipliers.find(c => c.id === wholesale.activeCustomerTypeId)?.multiplier || 1.0;
    let adjustedUnitCost = baseUnitCost * customerMultiplier;

    const activeTier = [...wholesale.tiers]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find(t => wholesale.simulatedQuantity >= t.minQuantity);
    
    const quantityDiscount = activeTier ? activeTier.discountPercentage / 100 : 0;
    adjustedUnitCost = adjustedUnitCost * (1 - quantityDiscount);

    return {
      unit: adjustedUnitCost,
      total: adjustedUnitCost * wholesale.simulatedQuantity,
      discount: quantityDiscount * 100 + (1 - customerMultiplier) * 100
    };
  }, [bouquet, wholesale]);

  const filteredFlowers = FLOWER_CATALOG.filter(f => 
    (activeCategory === 'All' || f.category === activeCategory) &&
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const harmoniousPairings = useMemo(() => {
    if (!selectedFlowerDetail) return [];
    return FLOWER_CATALOG.filter(f => 
      f.id !== selectedFlowerDetail.id && 
      (f.color === selectedFlowerDetail.color || f.subCategory === selectedFlowerDetail.subCategory)
    ).slice(0, 3);
  }, [selectedFlowerDetail]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Sidebar: Inventory */}
      <div className="lg:col-span-3 space-y-6">
        <AIAssistant 
          currentBouquetState={bouquet.items.map(it => FLOWER_CATALOG.find(f => f.id === it.flowerId)?.name).join(", ")} 
          onInspectFlower={(id) => setSelectedFlowerDetail(FLOWER_CATALOG.find(f => f.id === id) || null)}
          getCanvasSnapshot={async () => null}
        />
        
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold serif italic">The Stems</h3>
            <div className="flex gap-1">
              {['All', ...Object.values(FlowerCategory)].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredFlowers.map(f => (
              <button 
                key={f.id} 
                onClick={() => setSelectedFlowerDetail(f)} 
                className="group relative bg-stone-50 p-2 rounded-2xl border border-transparent hover:border-pink-200 transition-all text-left overflow-hidden"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 relative bg-stone-100">
                  <img src={f.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={f.name} />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all"></div>
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-stone-900 text-[6px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded shadow-sm border border-stone-100">
                      {f.season}
                    </span>
                  </div>
                </div>
                <div className="text-[9px] font-black uppercase text-stone-700 leading-tight mb-1">{f.name}</div>
                <div className="text-[8px] text-pink-500 font-bold">${f.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Canvas Workspace */}
      <div className="lg:col-span-6 space-y-6">
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4">
            <button onClick={() => setIsPreviewMode(false)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isPreviewMode ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-400 border border-stone-100'}`}>Workspace</button>
            <button onClick={() => setIsPreviewMode(true)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isPreviewMode ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-400 border border-stone-100'}`}>3D Preview</button>
          </div>
          <div className="flex gap-2">
            {isPreviewMode && (
              <button onClick={() => setGlobalRotation({x: 10, y: -5})} className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-white border border-stone-100 text-stone-400 hover:text-stone-900">Reset View</button>
            )}
            <button 
              onClick={() => setWholesale({...wholesale, enabled: !wholesale.enabled})} 
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${wholesale.enabled ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-stone-400 border-stone-100'}`}
            >
              Wholesale Mode {wholesale.enabled ? 'On' : 'Off'}
            </button>
            <button onClick={() => setBouquet(initialBouquet)} className="w-10 h-10 rounded-full bg-stone-50 text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"><i className="fa-solid fa-trash-can text-sm"></i></button>
          </div>
        </div>

        <div 
          ref={canvasRef}
          className={`relative aspect-[4/5] rounded-[3rem] shadow-inner border-[12px] border-white overflow-hidden transition-all duration-700 ${isPreviewMode ? 'perspective-1000 cursor-all-scroll bg-stone-900' : 'cursor-crosshair'}`}
          style={{ backgroundColor: isPreviewMode ? '#1c1917' : canvasBgColor }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onClick={(e) => { if (!isPreviewMode && e.target === canvasRef.current) setSelectedItemIndex(null); }}
        >
          <div 
            className="relative w-full h-full z-20 preserve-3d transition-transform duration-100"
            style={isPreviewMode ? { transform: `translateZ(-200px) rotateX(${globalRotation.x}deg) rotateY(${globalRotation.y}deg)` } : {}}
          >
            {bouquet.items.map((item, idx) => {
              const f = FLOWER_CATALOG.find(x => x.id === item.flowerId);
              const isSelected = selectedItemIndex === idx;
              
              const localX = item.localRotation3D?.x || 0;
              const localY = item.localRotation3D?.y || 0;
              const zOff = isPreviewMode ? ((idx - bouquet.items.length/2) * 30) : 0;

              return (
                <div 
                  key={idx}
                  className={`absolute transition-all ${isPreviewMode ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
                  style={{
                    left: `${item.position.x}%`, top: `${item.position.y}%`,
                    transform: `translate(-50%, -50%) rotateZ(${item.rotation}deg) rotateX(${localX}deg) rotateY(${localY}deg) scale(${item.scale}) ${isPreviewMode ? 'translateZ(' + zOff + 'px)' : ''}`,
                    zIndex: isSelected ? 100 : idx + 1,
                    transformStyle: 'preserve-3d'
                  }}
                  onMouseDown={(e) => { 
                    e.stopPropagation(); 
                    setSelectedItemIndex(idx); 
                    if (!isPreviewMode) setIsDragging(true); 
                  }}
                >
                  <div className={`relative w-40 h-40 rounded-full overflow-hidden border-[3px] shadow-2xl transition-all ${isSelected ? 'border-pink-500 scale-105 shadow-pink-400' : 'border-white'}`}>
                    <img src={f?.image} className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" alt={f?.name} />
                  </div>
                </div>
              );
            })}
          </div>
          {isPreviewMode && (
            <div className="absolute bottom-10 left-10 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] pointer-events-none">
              Drag background to rotate globally • Select flower to adjust local axis
            </div>
          )}
        </div>
      </div>

      {/* Right: Property Console */}
      <div className="lg:col-span-3 space-y-6">
        {/* Stem Controller */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-8">
          <div className="space-y-1">
            <h3 className="text-lg font-bold serif italic">Stem Controller</h3>
            <p className="text-[8px] font-black uppercase text-stone-300 tracking-widest">{isPreviewMode ? '3D Local Orientation' : 'Architect your arrangement'}</p>
          </div>

          {selectedItemIndex !== null && bouquet.items[selectedItemIndex] ? (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
               {/* 2D Z-Rotation (Always available) */}
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Z-Axis Rotation</span>
                    <span className="text-[11px] font-mono font-bold text-pink-600">{Math.round(bouquet.items[selectedItemIndex].rotation)}°</span>
                  </div>
                  <input 
                    type="range" min="-180" max="180" step="1"
                    value={bouquet.items[selectedItemIndex].rotation} 
                    onChange={e => updateItem(selectedItemIndex, { rotation: parseFloat(e.target.value) })} 
                    onMouseUp={() => pushHistory(bouquet)} 
                    className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-pink-500" 
                  />
               </div>

               {/* 3D Local Rotation (Only in Preview Mode) */}
               {isPreviewMode && (
                 <>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Local X Rotation</span>
                        <span className="text-[11px] font-mono font-bold text-pink-600">{Math.round(bouquet.items[selectedItemIndex].localRotation3D?.x || 0)}°</span>
                      </div>
                      <input 
                        type="range" min="-90" max="90" step="1"
                        value={bouquet.items[selectedItemIndex].localRotation3D?.x || 0} 
                        onChange={e => updateItem(selectedItemIndex, { localRotation3D: { ...bouquet.items[selectedItemIndex].localRotation3D || {x:0,y:0}, x: parseFloat(e.target.value) } })} 
                        onMouseUp={() => pushHistory(bouquet)} 
                        className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900" 
                      />
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Local Y Rotation</span>
                        <span className="text-[11px] font-mono font-bold text-pink-600">{Math.round(bouquet.items[selectedItemIndex].localRotation3D?.y || 0)}°</span>
                      </div>
                      <input 
                        type="range" min="-90" max="90" step="1"
                        value={bouquet.items[selectedItemIndex].localRotation3D?.y || 0} 
                        onChange={e => updateItem(selectedItemIndex, { localRotation3D: { ...bouquet.items[selectedItemIndex].localRotation3D || {x:0,y:0}, y: parseFloat(e.target.value) } })} 
                        onMouseUp={() => pushHistory(bouquet)} 
                        className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900" 
                      />
                   </div>
                 </>
               )}

               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Scale</span>
                    <span className="text-[11px] font-mono font-bold text-stone-900">{Math.round(bouquet.items[selectedItemIndex].scale * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="2.0" step="0.05"
                    value={bouquet.items[selectedItemIndex].scale} 
                    onChange={e => updateItem(selectedItemIndex, { scale: parseFloat(e.target.value) })} 
                    onMouseUp={() => pushHistory(bouquet)} 
                    className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900" 
                  />
               </div>

               {!isPreviewMode && (
                 <div className="grid grid-cols-4 gap-2">
                   <button onClick={() => moveLayer('back')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all"><i className="fa-solid fa-angles-down text-[10px]"></i></button>
                   <button onClick={() => moveLayer('backward')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all"><i className="fa-solid fa-angle-down text-[10px]"></i></button>
                   <button onClick={() => moveLayer('forward')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all"><i className="fa-solid fa-angle-up text-[10px]"></i></button>
                   <button onClick={() => moveLayer('front')} className="p-3 bg-stone-50 rounded-xl hover:bg-stone-900 hover:text-white transition-all"><i className="fa-solid fa-angles-up text-[10px]"></i></button>
                 </div>
               )}

               <button onClick={() => { const items = bouquet.items.filter((_,i) => i !== selectedItemIndex); const nb = {...bouquet, items}; setBouquet(nb); pushHistory(nb); setSelectedItemIndex(null); }} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Remove Stem</button>
            </div>
          ) : (
            <div className="py-12 text-center text-stone-300 opacity-50 space-y-4">
              <i className="fa-solid fa-hand-pointer text-4xl"></i>
              <p className="text-[10px] font-black uppercase tracking-widest">Select a stem to edit</p>
            </div>
          )}

          <div className="space-y-4 pt-8 border-t border-stone-50">
             <div className="flex justify-between items-end">
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">
                   {wholesale.enabled ? `Unit Cost (Bulk x${wholesale.simulatedQuantity})` : 'Total Selection'}
                 </span>
                 <span className="text-4xl font-bold italic serif text-pink-600">${pricing.unit.toFixed(2)}</span>
                 {wholesale.enabled && (
                   <span className="text-[9px] font-black uppercase text-green-500 tracking-widest mt-1">
                     Wholesale Savings: {pricing.discount.toFixed(0)}% Applied
                   </span>
                 )}
               </div>
             </div>
             <button onClick={() => onAddToCart(bouquet, pricing.total)} disabled={bouquet.items.length === 0} className="w-full py-5 bg-stone-900 text-white rounded-3xl font-bold text-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-2">
               {wholesale.enabled ? `Order Bulk (${wholesale.simulatedQuantity})` : 'Order Custom Bouquet'} <i className="fa-solid fa-arrow-right"></i>
             </button>
          </div>
        </div>

        {/* Wholesale Admin Panel */}
        {wholesale.enabled && (
          <div className="bg-stone-900 p-8 rounded-[2.5rem] border border-stone-800 shadow-2xl space-y-6 text-white animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-bold serif italic">Wholesale Admin</h3>
                <p className="text-[8px] font-black uppercase text-pink-500 tracking-widest">Pricing & Tiers Configuration</p>
              </div>
              <button onClick={() => setShowWholesaleAdmin(!showWholesaleAdmin)} className="text-stone-500 hover:text-white">
                <i className={`fa-solid ${showWholesaleAdmin ? 'fa-chevron-up' : 'fa-gear'}`}></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Order Volume (Simulation)</label>
                <div className="flex items-center gap-4 bg-stone-800 p-3 rounded-2xl">
                  <input 
                    type="range" min="1" max="500" step="1"
                    value={wholesale.simulatedQuantity} 
                    onChange={e => setWholesale({...wholesale, simulatedQuantity: parseInt(e.target.value)})} 
                    className="flex-1 accent-pink-500"
                  />
                  <span className="text-lg font-bold font-mono text-pink-500 w-12 text-right">{wholesale.simulatedQuantity}</span>
                </div>
              </div>

              {showWholesaleAdmin && (
                <div className="space-y-6 pt-4 border-t border-stone-800">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Partner Category</label>
                    <select 
                      value={wholesale.activeCustomerTypeId || ''}
                      onChange={e => setWholesale({...wholesale, activeCustomerTypeId: e.target.value})}
                      className="w-full bg-stone-800 text-white border-none rounded-xl p-3 text-xs font-bold"
                    >
                      {wholesale.customerMultipliers.map(c => (
                        <option key={c.id} value={c.id}>{c.type} ({Math.round((1-c.multiplier)*100)}% off)</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase text-stone-500 tracking-widest">Volume Discount Tiers</label>
                      <button 
                        onClick={() => setWholesale({...wholesale, tiers: [...wholesale.tiers, { id: Date.now().toString(), minQuantity: 200, discountPercentage: 40 }]})}
                        className="text-[8px] font-black text-pink-500 uppercase hover:underline"
                      >
                        + Add Tier
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {wholesale.tiers.map((t, i) => (
                        <div key={t.id} className="grid grid-cols-12 gap-2 items-center bg-stone-800 p-2 rounded-xl">
                          <input 
                            type="number" value={t.minQuantity}
                            onChange={e => setWholesale({...wholesale, tiers: wholesale.tiers.map((x,idx) => idx === i ? {...x, minQuantity: parseInt(e.target.value)} : x)})}
                            className="col-span-5 bg-stone-700 rounded-lg p-1 text-[10px] text-center font-bold"
                          />
                          <span className="col-span-2 text-center text-stone-600 text-[8px] uppercase">qty</span>
                          <input 
                            type="number" value={t.discountPercentage}
                            onChange={e => setWholesale({...wholesale, tiers: wholesale.tiers.map((x,idx) => idx === i ? {...x, discountPercentage: parseInt(e.target.value)} : x)})}
                            className="col-span-3 bg-stone-700 rounded-lg p-1 text-[10px] text-center font-bold text-pink-500"
                          />
                          <button 
                            onClick={() => setWholesale({...wholesale, tiers: wholesale.tiers.filter((_, idx) => idx !== i)})}
                            className="col-span-2 text-red-500 text-[10px]"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-stone-800 rounded-2xl border border-stone-700">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-stone-400">
                      <span>Gross Wholesale Total</span>
                      <span className="text-white">${pricing.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button onClick={generateRealisticPreview} disabled={isRenderingRealistic || bouquet.items.length === 0} className="w-full py-5 bg-white border border-stone-200 text-stone-900 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-3">
          {isRenderingRealistic ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-camera-retro"></i>}
          Photo-Realistic Preview
        </button>
      </div>

      {/* Botanical Fact Sheet Modal */}
      {selectedFlowerDetail && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl" onClick={() => setSelectedFlowerDetail(null)}></div>
          <div className="relative bg-white w-full max-w-6xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-500">
            <div className="md:w-1/2 p-12 md:p-16 space-y-12 flex flex-col justify-center order-2 md:order-1 overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="space-y-4">
                <span className="text-[11px] font-black text-pink-500 uppercase tracking-[0.4em] block">Botanical Inventory Data</span>
                <h2 className="text-5xl md:text-6xl font-bold serif italic text-stone-900 tracking-tighter">{selectedFlowerDetail.name}</h2>
                <p className="text-stone-300 text-[14px] font-bold uppercase tracking-[0.4em]">{selectedFlowerDetail.scientificName}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 border-y border-stone-100 py-10">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Native Origin</span>
                  <p className="text-sm font-bold text-stone-800">{selectedFlowerDetail.origin}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Natural Blooming Season</span>
                  <p className="text-sm font-bold text-stone-800">{selectedFlowerDetail.season}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Professional Care Guide</span>
                  <p className="text-sm text-stone-600 italic leading-relaxed">{selectedFlowerDetail.careInstructions}</p>
                </div>
              </div>

              {/* Harmonious Pairings Section */}
              {harmoniousPairings.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold serif italic text-stone-900 tracking-tight">Harmonious Pairings</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {harmoniousPairings.map(pair => (
                      <div key={pair.id} className="group/pair relative bg-stone-50 rounded-3xl p-3 border border-transparent hover:border-pink-100 transition-all text-center">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                          <img src={pair.image} className="absolute inset-0 w-full h-full object-cover group-hover/pair:scale-110 transition-transform duration-700" alt={pair.name} />
                          <button 
                            onClick={(e) => { e.stopPropagation(); addFlower(pair); }}
                            className="absolute inset-0 bg-stone-900/0 hover:bg-stone-900/40 transition-all flex items-center justify-center text-white opacity-0 hover:opacity-100"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>
                        <p className="text-[8px] font-black uppercase text-stone-400 truncate mb-1 px-1">{pair.name}</p>
                        <p className="text-[10px] font-bold serif italic text-pink-300">${pair.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4">
                <button onClick={() => addFlower(selectedFlowerDetail)} disabled={selectedFlowerDetail.stock <= 0} className="w-full py-6 bg-stone-900 text-white rounded-3xl font-bold text-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-xl group">
                  Add to Studio Arrangement <span className="font-serif italic text-pink-300 ml-2">(${selectedFlowerDetail.price.toFixed(2)})</span>
                  <i className="fa-solid fa-plus text-sm group-hover:rotate-90 transition-transform"></i>
                </button>
                <button onClick={() => setSelectedFlowerDetail(null)} className="w-full py-4 text-stone-400 text-[10px] font-black uppercase tracking-widest hover:text-stone-900 transition-colors">Return to Studio</button>
              </div>
            </div>
            <div className="md:w-1/2 relative min-h-[500px] order-1 md:order-2">
              <img src={selectedFlowerDetail.image} className="w-full h-full object-cover" alt={selectedFlowerDetail.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-16 space-y-4">
                 <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Botanical Metaphor</span>
                 <p className="text-white text-4xl serif italic leading-tight">"{selectedFlowerDetail.meaning}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {realisticImageUrl && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-3xl" onClick={() => setRealisticImageUrl(null)}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
              <div className="aspect-[3/4] overflow-hidden"><img src={realisticImageUrl} className="w-full h-full object-cover" alt="Realistic Render" /></div>
              <div className="p-10 text-center space-y-4">
                <h3 className="text-3xl font-bold serif italic">Architectural Visualization</h3>
                <button onClick={() => setRealisticImageUrl(null)} className="px-10 py-4 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl">Close Preview</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BouquetBuilder;
