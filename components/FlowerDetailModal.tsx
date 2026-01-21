import React, { useMemo } from 'react';
import { Flower, FlowerCategory } from '../types';
import { FLOWER_CATALOG } from '../constants';

interface FlowerDetailModalProps {
    flower: Flower | null;
    onClose: () => void;
    onAddToCart: (flower: Flower, quantity: number) => void;
    onBuildWith: (flower: Flower) => void;
}

const FlowerDetailModal: React.FC<FlowerDetailModalProps> = ({
    flower,
    onClose,
    onAddToCart,
    onBuildWith
}) => {
    const harmoniousPairings = useMemo(() => {
        if (!flower) return [];
        return FLOWER_CATALOG.filter(f =>
            f.id !== flower.id &&
            (f.color === flower.color || f.subCategory === flower.subCategory)
        ).slice(0, 3);
    }, [flower]);

    if (!flower) return null;

    const stockStatus = flower.stock > 100
        ? { label: 'Abundant', color: 'bg-green-500' }
        : flower.stock > 50
            ? { label: 'In Stock', color: 'bg-emerald-500' }
            : flower.stock > 20
                ? { label: 'Limited', color: 'bg-amber-500' }
                : { label: `Only ${flower.stock} left`, color: 'bg-orange-500' };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div
                className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl"
                onClick={onClose}
            />

            <div className="relative bg-white w-full max-w-6xl max-h-[95vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-500">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all shadow-lg"
                >
                    <i className="fa-solid fa-xmark text-lg"></i>
                </button>

                {/* Left: Details */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-16 space-y-8 flex flex-col justify-center order-2 md:order-1 overflow-y-auto max-h-[90vh] custom-scrollbar">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={`${stockStatus.color} text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full`}>
                                {stockStatus.label}
                            </span>
                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                                {flower.category}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold serif italic text-stone-900 tracking-tighter leading-tight">
                            {flower.name}
                        </h2>
                        <p className="text-stone-300 text-sm font-bold uppercase tracking-[0.4em]">
                            {flower.scientificName}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold serif italic text-pink-500">
                            ${flower.price.toFixed(2)}
                        </span>
                        <span className="text-stone-300 text-sm font-medium">per stem</span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-6 border-y border-stone-100 py-8">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Origin</span>
                            <p className="text-sm font-bold text-stone-800">{flower.origin}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Season</span>
                            <p className="text-sm font-bold text-stone-800">{flower.season}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Color</span>
                            <p className="text-sm font-bold text-stone-800">{flower.color}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Style</span>
                            <p className="text-sm font-bold text-stone-800">{flower.subCategory}</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                            <span className="text-[9px] font-black uppercase text-stone-300 tracking-widest">Care Guide</span>
                            <p className="text-sm text-stone-600 italic leading-relaxed">{flower.careInstructions}</p>
                        </div>
                    </div>

                    {/* Harmonious Pairings */}
                    {harmoniousPairings.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold serif italic text-stone-900">Pairs Well With</h4>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {harmoniousPairings.map(pair => (
                                    <button
                                        key={pair.id}
                                        onClick={() => { onClose(); onAddToCart(pair, 1); }}
                                        className="group flex-shrink-0 w-24 text-center"
                                    >
                                        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-2 relative bg-stone-100">
                                            <img
                                                src={pair.image}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt={pair.name}
                                            />
                                            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors flex items-center justify-center">
                                                <i className="fa-solid fa-plus text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"></i>
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-stone-600 truncate">{pair.name}</p>
                                        <p className="text-[10px] font-bold serif italic text-pink-400">${pair.price.toFixed(2)}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        <button
                            onClick={() => { onAddToCart(flower, 1); onClose(); }}
                            disabled={flower.stock <= 0}
                            className="w-full py-5 bg-pink-500 text-white rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-bag-shopping"></i>
                            Add to Cart
                        </button>
                        <button
                            onClick={() => { onBuildWith(flower); onClose(); }}
                            disabled={flower.stock <= 0}
                            className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            Build Bouquet with This
                        </button>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="md:w-1/2 relative min-h-[300px] md:min-h-[500px] order-1 md:order-2">
                    <img
                        src={flower.image}
                        className="w-full h-full object-cover"
                        alt={flower.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16 space-y-4">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Floral Meaning</span>
                        <p className="text-white text-2xl md:text-3xl serif italic leading-tight">"{flower.meaning}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowerDetailModal;
