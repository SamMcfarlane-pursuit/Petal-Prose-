
import React, { useState, useMemo, createContext, useContext, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BouquetBuilder from './components/BouquetBuilder';
import FlowerDetailModal from './components/FlowerDetailModal';
import CheckoutPage from './components/CheckoutPage';
import ParallaxHero from './components/ParallaxHero';
import { ToastProvider, useToast } from './components/Toast';
import { CustomBouquet, CartItem, FlowerCategory, Flower } from './types';
import { FLOWER_CATALOG } from './constants';

// Context for global cart and flower actions
interface AppContextType {
  addSingleFlower: (flower: Flower, quantity?: number) => void;
  navigateToStudioWithFlower: (flower: Flower) => void;
  openCart: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const Navbar: React.FC<{ cartCount: number, onOpenCart: () => void }> = ({ cartCount, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-md border-b border-stone-100 z-[1000] px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-pink-600 transition-all duration-500">
            <i className="fa-solid fa-leaf text-lg transform -rotate-12"></i>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold serif italic leading-none tracking-tight text-stone-900">Petal & Prose</h1>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400 hidden sm:block">Haute Couture Florals</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
            <Link to="/catalog" className="hover:text-stone-900 transition-colors">Catalog</Link>
            <Link to="/design" className="hover:text-stone-900 transition-colors">Custom Studio</Link>
            <Link to="/membership" className="hover:text-stone-900 transition-colors">Membership</Link>
          </div>
          <button onClick={onOpenCart} className="relative w-11 h-11 bg-stone-50 rounded-2xl flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all group shadow-sm">
            <i className="fa-solid fa-bag-shopping text-sm"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-11 h-11 bg-stone-50 rounded-2xl flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[2000] lg:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <span className="text-lg font-bold serif italic text-stone-900">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <nav className="flex-1 p-6 space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition-colors">
                <i className="fa-solid fa-home w-5 text-center text-stone-400"></i> Home
              </Link>
              <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition-colors">
                <i className="fa-solid fa-leaf w-5 text-center text-stone-400"></i> Catalog
              </Link>
              <Link to="/design" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition-colors">
                <i className="fa-solid fa-wand-magic-sparkles w-5 text-center text-stone-400"></i> Custom Studio
              </Link>
              <Link to="/membership" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition-colors">
                <i className="fa-solid fa-crown w-5 text-center text-stone-400"></i> Membership
              </Link>
            </nav>
            <div className="p-6 border-t border-stone-100">
              <button onClick={() => { onOpenCart(); setMobileMenuOpen(false); }} className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-pink-600 transition-all flex items-center justify-center gap-3">
                <i className="fa-solid fa-bag-shopping"></i> View Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CatalogView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FlowerCategory | 'All'>('All');
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addSingleFlower, navigateToStudioWithFlower } = useAppContext();
  const { showToast } = useToast();

  // Category metadata for section headers
  const categoryMeta = {
    [FlowerCategory.BLOOM]: {
      title: 'Focal Blooms',
      description: 'Statement flowers that anchor your arrangement with dramatic presence',
      icon: 'fa-seedling',
      gradient: 'from-pink-400 to-rose-500'
    },
    [FlowerCategory.FILLER]: {
      title: 'Delicate Fillers',
      description: 'Texture and volume builders that create depth and movement',
      icon: 'fa-cloud',
      gradient: 'from-violet-400 to-purple-500'
    },
    [FlowerCategory.GREENERY]: {
      title: 'Lush Greenery',
      description: 'Architectural foliage for structure and organic flow',
      icon: 'fa-leaf',
      gradient: 'from-emerald-400 to-green-500'
    },
    [FlowerCategory.ACCENT]: {
      title: 'Textural Accents',
      description: 'Unique elements and dried pieces for artistic expression',
      icon: 'fa-star',
      gradient: 'from-amber-400 to-orange-500'
    }
  };

  // Filter and search flowers
  const filteredFlowers = useMemo(() => {
    let flowers = activeFilter === 'All'
      ? FLOWER_CATALOG
      : FLOWER_CATALOG.filter(f => f.category === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      flowers = flowers.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.scientificName.toLowerCase().includes(query) ||
        f.color.toLowerCase().includes(query) ||
        f.subCategory.toLowerCase().includes(query)
      );
    }
    return flowers;
  }, [activeFilter, searchQuery]);

  // Group flowers by category for section view
  const flowersByCategory = useMemo(() => {
    if (activeFilter !== 'All' || searchQuery.trim()) {
      return null; // Show flat grid when filtering/searching
    }

    const categories = [FlowerCategory.BLOOM, FlowerCategory.FILLER, FlowerCategory.GREENERY, FlowerCategory.ACCENT];
    return categories.map(cat => ({
      category: cat,
      flowers: FLOWER_CATALOG.filter(f => f.category === cat)
    })).filter(group => group.flowers.length > 0);
  }, [activeFilter, searchQuery]);

  const handleAddToCart = (flower: Flower, quantity: number) => {
    addSingleFlower(flower, quantity);
    showToast(`${flower.name} added to cart`, 'success');
  };

  const handleQuickAdd = (e: React.MouseEvent, flower: Flower) => {
    e.stopPropagation();
    addSingleFlower(flower, 1);
    showToast(`${flower.name} added to cart`, 'success');
  };

  // Color swatch component
  const ColorSwatch: React.FC<{ color: string }> = ({ color }) => {
    const colorMap: Record<string, string> = {
      'Soft Pink': '#f9a8d4',
      'Champagne': '#e7d8c9',
      'Blush Cream': '#f5e6d3',
      'Blush Pink': '#fbcfe8',
      'Dusty Pink': '#d4a5a5',
      'Pure White': '#ffffff',
      'Peach Blush': '#fcd5ce',
      'Deep Wine': '#722f37',
      'Antique Blue': '#6b7b8c',
      'Multi-color': 'linear-gradient(135deg, #f472b6, #fbbf24, #a855f7)',
      'Crisp White': '#fafafa',
      'White': '#f5f5f5',
      'Dusty Rose': '#dcb9b9',
      'Pale Pink': '#fce7f3',
      'Lavender': '#c4b5d6',
      'Sage Green': '#9caf88',
      'Deep Green': '#2f5233',
      'Silver Green': '#a3b899',
      'Vibrant Green': '#22c55e',
      'Sage Silver': '#b4bfad',
      'Steel Blue': '#4682b4',
      'Golden Yellow': '#fbbf24',
      'Lavender Purple': '#a78bfa',
      'Natural Cream': '#f5f0e1',
      'Natural Beige': '#d4c7b0',
      'Natural Brown': '#8b7355'
    };

    const bg = colorMap[color] || '#e5e5e5';
    const isGradient = bg.startsWith('linear');

    return (
      <div
        className="w-4 h-4 rounded-full border border-stone-200 shadow-sm"
        style={{ background: bg }}
        title={color}
      />
    );
  };

  // Stock indicator component
  const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
    if (stock === 0) return <span className="text-red-500 text-[9px] font-bold uppercase">Sold Out</span>;
    if (stock <= 20) return <span className="text-orange-500 text-[9px] font-bold uppercase">Only {stock} left</span>;
    if (stock <= 50) return <span className="text-amber-500 text-[9px] font-bold uppercase">Limited</span>;
    return <span className="text-green-500 text-[9px] font-bold uppercase">In Stock</span>;
  };

  // Flower card component
  const FlowerCard: React.FC<{ flower: Flower }> = ({ flower }) => {
    const isSoldOut = flower.stock <= 0;

    return (
      <div
        className={`group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-stone-50 hover:border-stone-100 ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
        onClick={() => !isSoldOut && setSelectedFlower(flower)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <img
            src={flower.image}
            alt={flower.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&fit=crop';
            }}
          />

          {/* Stock Badge */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1.5 rounded-full backdrop-blur-md text-[9px] font-black uppercase tracking-wider shadow-lg ${flower.stock > 50 ? 'bg-green-500/90 text-white' :
              flower.stock > 20 ? 'bg-amber-500/90 text-white' :
                flower.stock > 0 ? 'bg-orange-500/90 text-white' :
                  'bg-stone-900/90 text-white'
              }`}>
              {flower.stock > 100 ? 'Abundant' : flower.stock > 50 ? 'In Stock' : flower.stock > 20 ? 'Limited' : flower.stock > 0 ? `${flower.stock} left` : 'Sold Out'}
            </div>
          </div>

          {/* Quick Add Button - appears on hover */}
          {!isSoldOut && (
            <button
              onClick={(e) => handleQuickAdd(e, flower)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-pink-500 hover:text-white"
            >
              <i className="fa-solid fa-plus text-sm"></i>
            </button>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-20">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">
              View Details <i className="fa-solid fa-arrow-right ml-2"></i>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 min-w-0">
              <h4 className="text-lg font-bold serif text-stone-900 leading-tight truncate group-hover:text-pink-600 transition-colors">
                {flower.name}
              </h4>
              <p className="text-[9px] font-black uppercase text-stone-300 tracking-[0.2em] truncate">
                {flower.scientificName}
              </p>
            </div>
            <span className="text-xl font-bold serif italic text-pink-400 shrink-0">
              ${flower.price.toFixed(2)}
            </span>
          </div>

          {/* Color and Category Row */}
          <div className="flex items-center gap-3">
            <ColorSwatch color={flower.color} />
            <span className="text-[10px] text-stone-400 font-medium">{flower.color}</span>
            <span className="text-stone-200">•</span>
            <span className="text-[10px] text-stone-400 font-medium">{flower.subCategory}</span>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-stone-50 text-stone-400 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">
              {flower.origin}
            </span>
            <span className="bg-stone-50 text-stone-400 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">
              {flower.season}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-24 px-8 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
      {/* Catalog Header */}
      <header className="mb-16 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] block">Premium Botanical Collection</span>
            <h2 className="text-[4rem] md:text-[6rem] font-bold serif leading-none text-stone-900 tracking-tighter">
              The Catalog<span className="text-pink-300">.</span>
            </h2>
            <p className="text-stone-400 text-lg font-light max-w-xl">
              {FLOWER_CATALOG.length} curated varieties • 4K photographic accuracy • Farm-fresh delivery
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search flowers, colors, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white border border-stone-100 rounded-2xl text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all shadow-sm"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-stone-300"></i>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xs text-stone-500"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {['ALL', 'BLOOM', 'FILLER', 'GREENERY', 'ACCENT'].map((cat) => {
            const isActive = activeFilter.toUpperCase() === cat;
            const catKey = cat === 'ALL' ? null : cat.charAt(0) + cat.slice(1).toLowerCase() as FlowerCategory;
            const meta = catKey ? categoryMeta[catKey] : null;

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat === 'ALL' ? 'All' : catKey as FlowerCategory)}
                className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all border flex items-center gap-3 ${isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xl scale-105'
                  : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300 hover:text-stone-600'
                  }`}
              >
                {meta && <i className={`fa-solid ${meta.icon}`}></i>}
                {cat}
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-white/20' : 'bg-stone-100'}`}>
                  {cat === 'ALL'
                    ? FLOWER_CATALOG.length
                    : FLOWER_CATALOG.filter(f => f.category === catKey).length}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Categorized Sections View */}
      {flowersByCategory ? (
        <div className="space-y-24">
          {flowersByCategory.map(({ category, flowers }) => {
            const meta = categoryMeta[category];
            return (
              <section key={category} className="space-y-10">
                {/* Category Header */}
                <div className="flex items-center gap-6 border-b border-stone-100 pb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${meta.gradient} text-white`}>
                    <i className={`fa-solid ${meta.icon} text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold serif italic text-stone-900">{meta.title}</h3>
                    <p className="text-stone-400 text-sm font-light mt-1">{meta.description}</p>
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-300 bg-stone-50 px-4 py-2 rounded-full">
                    {flowers.length} {flowers.length === 1 ? 'variety' : 'varieties'}
                  </span>
                </div>

                {/* Flower Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {flowers.map((flower) => (
                    <FlowerCard key={flower.id} flower={flower} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat Grid View (when filtering or searching) */
        <div className="space-y-8">
          {searchQuery && (
            <p className="text-stone-400 text-sm">
              {filteredFlowers.length} {filteredFlowers.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredFlowers.map((flower) => (
              <FlowerCard key={flower.id} flower={flower} />
            ))}
          </div>
          {filteredFlowers.length === 0 && (
            <div className="text-center py-24 text-stone-300 space-y-4">
              <i className="fa-solid fa-search text-5xl"></i>
              <p className="text-xl serif italic">No flowers found</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="text-pink-500 text-sm font-bold hover:text-pink-600 transition-colors"
              >
                Clear filters →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Flower Detail Modal */}
      <FlowerDetailModal
        flower={selectedFlower}
        onClose={() => setSelectedFlower(null)}
        onAddToCart={handleAddToCart}
        onBuildWith={navigateToStudioWithFlower}
      />
    </div>
  );
};

const HomeView: React.FC = () => {
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const { addSingleFlower, navigateToStudioWithFlower } = useAppContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const styles = [
    { name: 'Minimalist', img: 'https://images.unsplash.com/photo-1525310238806-f1941e263832?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bohemian', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Classic', img: 'https://images.unsplash.com/photo-1548610762-65603720792a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Romantic', img: 'https://images.unsplash.com/photo-1563241527-3004b7be0fab?auto=format&fit=crop&q=80&w=600' }
  ];

  const inStockByCategory = useMemo(() => {
    const categories = [
      { key: FlowerCategory.BLOOM, label: 'Signature Blooms', icon: 'fa-seedling', accent: 'pink' },
      { key: FlowerCategory.FILLER, label: 'Delicate Fillers', icon: 'fa-cloud', accent: 'purple' },
      { key: FlowerCategory.GREENERY, label: 'Lush Greenery', icon: 'fa-leaf', accent: 'green' },
      { key: FlowerCategory.ACCENT, label: 'Textural Accents', icon: 'fa-star', accent: 'amber' }
    ];

    return categories.map(cat => ({
      ...cat,
      items: FLOWER_CATALOG.filter(f => f.category === cat.key && f.stock > 0)
    }));
  }, []);

  const totalInStock = FLOWER_CATALOG.filter(f => f.stock > 0).length;

  const handleAddToCart = (flower: Flower, quantity: number) => {
    addSingleFlower(flower, quantity);
    showToast(`${flower.name} added to cart`, 'success');
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Parallax Hero - Scroll-triggered petal dispersion */}
      <ParallaxHero onExplore={scrollToContent} />

      {/* IN STOCK NOW */}
      <section className="py-32 px-8 md:px-12 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-[1800px] mx-auto space-y-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 bg-green-50 text-green-700 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Live Inventory
            </div>
            <h2 className="text-6xl md:text-8xl font-bold serif italic text-stone-900 tracking-tighter leading-none">
              In Stock Now<span className="text-pink-300">.</span>
            </h2>
            <p className="text-xl text-stone-400 font-light max-w-2xl mx-auto">
              {totalInStock} premium botanicals ready for immediate dispatch — from signature blooms to architectural greenery.
            </p>
          </div>

          {inStockByCategory.map((category, idx) => (
            <div key={category.key} className="space-y-10" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between border-b border-stone-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${category.accent === 'pink' ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white' :
                    category.accent === 'purple' ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white' :
                      category.accent === 'green' ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white' :
                        'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                    }`}>
                    <i className={`fa-solid ${category.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold serif italic text-stone-900">{category.label}</h3>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-300">
                      {category.items.length} {category.items.length === 1 ? 'variety' : 'varieties'} available
                    </span>
                  </div>
                </div>
                <Link
                  to="/catalog"
                  className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                >
                  View All <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4">
                {category.items.map((flower) => (
                  <div
                    key={flower.id}
                    onClick={() => setSelectedFlower(flower)}
                    className="group flex-shrink-0 w-[320px] bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-stone-50 hover:border-stone-100"
                  >
                    <div className="relative h-[220px] overflow-hidden">
                      <img
                        src={flower.image}
                        alt={flower.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&fit=crop';
                        }}
                      />
                      <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg ${flower.stock > 100 ? 'bg-green-500/90 text-white' :
                        flower.stock > 50 ? 'bg-emerald-500/90 text-white' :
                          flower.stock > 20 ? 'bg-amber-500/90 text-white' :
                            'bg-orange-500/90 text-white'
                        }`}>
                        {flower.stock > 100 ? 'Abundant' : flower.stock > 50 ? 'In Stock' : flower.stock > 20 ? 'Limited' : `Only ${flower.stock} left`}
                      </div>

                      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white text-stone-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                          View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold serif text-stone-900 leading-tight group-hover:text-pink-600 transition-colors">
                            {flower.name}
                          </h4>
                          <p className="text-[10px] font-black uppercase text-stone-300 tracking-[0.3em]">
                            {flower.scientificName}
                          </p>
                        </div>
                        <span className="text-2xl font-bold serif italic text-pink-400 shrink-0">
                          ${flower.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-stone-50 text-stone-400 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                          {flower.color}
                        </span>
                        <span className="bg-stone-50 text-stone-400 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                          {flower.origin}
                        </span>
                      </div>

                      <p className="text-sm text-stone-400 font-light italic leading-relaxed line-clamp-2 serif">
                        "{flower.meaning}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-10">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 px-12 py-5 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-pink-600 transition-all shadow-2xl hover:scale-105 duration-300"
            >
              <i className="fa-solid fa-box-open"></i>
              Browse Full Catalog
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Style Collections */}
      <section className="py-32 px-12 max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">Curation by aesthetic</span>
            <h2 className="text-6xl font-bold serif italic text-stone-900 tracking-tighter">Shop by Style</h2>
          </div>
          <Link to="/catalog" className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-2 hover:text-stone-900 transition-colors">View All Varieties</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {styles.map((style) => (
            <Link key={style.name} to="/catalog" className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-stone-100 shadow-xl transition-transform hover:scale-[1.02] duration-500">
              <img src={style.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-10">
                <h4 className="text-2xl font-bold serif italic text-white">{style.name}</h4>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-2">Explore {style.name} Varieties</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flower Detail Modal */}
      <FlowerDetailModal
        flower={selectedFlower}
        onClose={() => setSelectedFlower(null)}
        onAddToCart={handleAddToCart}
        onBuildWith={navigateToStudioWithFlower}
      />
    </div>
  );
};

const MembershipView: React.FC = () => {
  const [joinedTier, setJoinedTier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleJoin = (tierName: string) => {
    setJoinedTier(tierName);
    showToast(`Thank you for your interest in ${tierName}! We'll be in touch soon.`, 'success');
  };

  const testimonials = [
    { name: 'Sarah Mitchell', role: 'Wedding Planner, NYC', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', quote: 'The Designer Pro membership has transformed my business. Access to exclusive varieties and 20% savings on every order.', tier: 'Designer Pro' },
    { name: 'James Chen', role: 'Floral Studio Owner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', quote: 'Farm-to-shop logistics mean my arrangements are always fresh. The quality difference is immediately noticeable.', tier: 'Distributor' },
    { name: 'Emily Rose', role: 'Home Enthusiast', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', quote: "I look forward to my monthly bouquet every time. It's like a little gift to myself that brightens my whole week.", tier: 'Enthusiast' }
  ];

  const faqs = [
    { q: 'Can I cancel my membership anytime?', a: 'Yes! All memberships are month-to-month with no long-term commitment.' },
    { q: 'When will I receive my monthly bouquet?', a: 'Bouquets ship on the 1st of each month and arrive within 2-3 business days.' },
    { q: 'Do discounts apply to custom arrangements?', a: 'Member discounts apply to all catalog items and custom studio arrangements.' },
    { q: 'What exclusive varieties are available?', a: 'Members get early access to seasonal rarities, imported specimens, and limited-edition preserved botanicals.' }
  ];

  const comparisonFeatures = [
    { feature: 'Monthly Bouquet', enthusiast: true, designer: true, distributor: false },
    { feature: 'Free Shipping', enthusiast: '$75+', designer: 'Always', distributor: 'Always' },
    { feature: 'Catalog Discount', enthusiast: '5%', designer: '20%', distributor: '50%' },
    { feature: 'Exclusive Varieties', enthusiast: false, designer: true, distributor: true },
    { feature: 'Design Consultations', enthusiast: false, designer: '2/mo', distributor: 'Unlimited' },
    { feature: 'Bulk Ordering', enthusiast: false, designer: false, distributor: true }
  ];

  return (
    <div className="pt-32 pb-24 px-8 md:px-12 max-w-7xl mx-auto animate-fade-in space-y-32">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="text-pink-500 text-xs font-black uppercase tracking-[0.5em] block">Professional Partnerships</span>
        <h2 className="text-6xl md:text-8xl font-bold serif italic text-stone-900 tracking-tighter leading-none">The Bloom Club.</h2>
        <p className="text-xl text-stone-500 font-light leading-relaxed">
          Our distributor network offers preferred pricing, global sourcing, and recurring botanical logistics
          for florists, designers, and enthusiasts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="p-12 bg-white rounded-[3rem] border border-stone-100 shadow-sm space-y-10 flex flex-col text-left hover:scale-[1.02] transition-all">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold serif italic text-stone-900">Enthusiast</h3>
            <p className="text-stone-400 text-sm">Monthly mono-botanical exploration.</p>
          </div>
          <div className="flex-1 space-y-4 text-stone-600 text-sm font-light">
            <p><i className="fa-solid fa-check text-pink-500 mr-3"></i> One artisan bouquet per month</p>
            <p><i className="fa-solid fa-check text-pink-500 mr-3"></i> Priority seasonal access</p>
          </div>
          <div className="pt-8 border-t border-stone-50 flex justify-between items-end">
            <span className="text-4xl font-bold serif italic text-stone-900">$49<span className="text-sm font-light text-stone-400">/mo</span></span>
            <button
              onClick={() => handleJoin('Enthusiast')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${joinedTier === 'Enthusiast'
                ? 'bg-green-500 text-white'
                : 'bg-stone-900 text-white hover:bg-pink-600'
                }`}
            >
              {joinedTier === 'Enthusiast' ? 'Requested!' : 'Join Now'}
            </button>
          </div>
        </div>

        <div className="p-12 bg-stone-900 rounded-[3rem] shadow-2xl space-y-10 flex flex-col text-left text-white relative overflow-hidden group hover:scale-[1.02] transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 blur-[80px] -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-bold serif italic">Designer Pro</h3>
              <span className="bg-pink-500 text-[8px] font-black uppercase px-3 py-1 rounded-full">Pro Choice</span>
            </div>
            <p className="text-stone-400 text-sm">Logistical support for professional designers.</p>
          </div>
          <div className="flex-1 space-y-4 text-stone-200 text-sm font-light">
            <p><i className="fa-solid fa-check text-pink-500 mr-3"></i> Weekly curated architectural masters</p>
            <p><i className="fa-solid fa-check text-pink-500 mr-3"></i> 20% Off all individual catalog stems</p>
          </div>
          <div className="pt-8 border-t border-stone-800 flex justify-between items-end">
            <span className="text-4xl font-bold serif italic text-pink-500">$179<span className="text-sm font-light text-stone-700">/mo</span></span>
            <button
              onClick={() => handleJoin('Designer Pro')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${joinedTier === 'Designer Pro'
                ? 'bg-green-500 text-white'
                : 'bg-white text-stone-900 hover:bg-pink-500 hover:text-white'
                }`}
            >
              {joinedTier === 'Designer Pro' ? 'Requested!' : 'Join Circle'}
            </button>
          </div>
        </div>

        <div className="p-12 bg-white rounded-[3rem] border border-stone-100 shadow-sm space-y-10 flex flex-col text-left hover:scale-[1.02] transition-all">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold serif italic text-stone-900">Distributor</h3>
            <p className="text-stone-400 text-sm">Bulk botanical infrastructure.</p>
          </div>
          <div className="flex-1 space-y-4 text-stone-600 text-sm font-light">
            <p><i className="fa-solid fa-check text-stone-900 mr-3"></i> Custom bulk variety sourcing</p>
            <p><i className="fa-solid fa-check text-stone-900 mr-3"></i> Wholesale tier pricing (up to 50% off)</p>
            <p><i className="fa-solid fa-check text-stone-900 mr-3"></i> Direct farm-to-shop logistics</p>
          </div>
          <div className="pt-8 border-t border-stone-50 flex justify-between items-end">
            <span className="text-4xl font-bold serif italic text-stone-900">Custom</span>
            <button
              onClick={() => handleJoin('Distributor')}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${joinedTier === 'Distributor'
                ? 'bg-green-500 text-white'
                : 'bg-stone-900 text-white hover:bg-pink-600'
                }`}
            >
              {joinedTier === 'Distributor' ? 'Requested!' : 'Contact B2B'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">Compare Plans</span>
          <h3 className="text-4xl font-bold serif italic text-stone-900">Feature Comparison</h3>
        </div>
        <div className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 text-center text-[10px] font-black uppercase tracking-widest bg-stone-50 border-b border-stone-100">
            <div className="p-6 text-stone-400">Feature</div>
            <div className="p-6 text-stone-600">Enthusiast</div>
            <div className="p-6 text-pink-500">Designer Pro</div>
            <div className="p-6 text-stone-600">Distributor</div>
          </div>
          {comparisonFeatures.map((row, i) => (
            <div key={i} className={`grid grid-cols-4 text-center text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'} border-b border-stone-50 last:border-0`}>
              <div className="p-5 text-left text-stone-700 font-medium">{row.feature}</div>
              <div className="p-5 flex items-center justify-center">{row.enthusiast === true ? <i className="fa-solid fa-check text-green-500"></i> : row.enthusiast === false ? <i className="fa-solid fa-minus text-stone-200"></i> : <span className="text-stone-600 font-medium">{row.enthusiast}</span>}</div>
              <div className="p-5 flex items-center justify-center bg-pink-50/30">{row.designer === true ? <i className="fa-solid fa-check text-green-500"></i> : row.designer === false ? <i className="fa-solid fa-minus text-stone-200"></i> : <span className="text-pink-600 font-bold">{row.designer}</span>}</div>
              <div className="p-5 flex items-center justify-center">{row.distributor === true ? <i className="fa-solid fa-check text-green-500"></i> : row.distributor === false ? <i className="fa-solid fa-minus text-stone-200"></i> : <span className="text-stone-600 font-medium">{row.distributor}</span>}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-10">
        <div className="text-center space-y-4">
          <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">Member Stories</span>
          <h3 className="text-4xl font-bold serif italic text-stone-900">Loved by Thousands</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                <div><p className="font-bold text-stone-900">{t.name}</p><p className="text-xs text-stone-400">{t.role}</p></div>
              </div>
              <p className="text-stone-600 text-sm font-light italic leading-relaxed">"{t.quote}"</p>
              <span className="inline-block bg-stone-100 text-stone-500 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">{t.tier} Member</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">Questions?</span>
          <h3 className="text-4xl font-bold serif italic text-stone-900">Frequently Asked</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-stone-50 transition-colors">
                <span className="font-bold text-stone-900">{faq.q}</span>
                <i className={`fa-solid fa-chevron-down text-stone-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}></i>
              </button>
              {openFaq === i && <div className="px-8 pb-6 text-stone-600 text-sm font-light animate-fade-in">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingStudioFlower, setPendingStudioFlower] = useState<Flower | null>(null);

  const handleAddToCart = (custom: CustomBouquet, total: number) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substring(2, 11),
      name: `Custom Artisan Bouquet - ${new Date().toLocaleDateString()}`,
      price: total,
      quantity: 1,
      type: 'custom',
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=200&h=200'
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const addSingleFlower = useCallback((flower: Flower, quantity: number = 1) => {
    const existingIndex = cart.findIndex(item => item.name === flower.name && item.type === 'single stem');

    if (existingIndex >= 0) {
      // Update existing item quantity
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      newCart[existingIndex].price = flower.price * newCart[existingIndex].quantity;
      setCart(newCart);
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Math.random().toString(36).substring(2, 11),
        name: flower.name,
        price: flower.price * quantity,
        quantity,
        type: 'single stem',
        image: flower.image
      };
      setCart(prev => [...prev, newItem]);
    }
    setIsCartOpen(true);
  }, [cart]);

  const navigateToStudioWithFlower = useCallback((flower: Flower) => {
    setPendingStudioFlower(flower);
    window.location.hash = '/design';
  }, []);

  const removeCartItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <ToastProvider>
      <Router>
        <AppContext.Provider value={{ addSingleFlower, navigateToStudioWithFlower, openCart: () => setIsCartOpen(true) }}>
          <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-pink-100 selection:text-pink-900">
            <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />

            <main>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/catalog" element={<CatalogView />} />
                <Route path="/design" element={
                  <div className="pt-32 pb-24 px-8 md:px-12 max-w-[1920px] mx-auto">
                    <header className="mb-16 space-y-4">
                      <span className="text-pink-500 text-xs font-black uppercase tracking-[0.5em] block animate-pulse">Design Studio v2.5</span>
                      <h2 className="text-5xl md:text-7xl font-bold serif italic text-stone-900 tracking-tighter leading-none">Architect Your Bloom</h2>
                    </header>
                    <BouquetBuilder
                      onAddToCart={handleAddToCart}
                      initialFlower={pendingStudioFlower}
                      onFlowerConsumed={() => setPendingStudioFlower(null)}
                    />
                  </div>
                } />
                <Route path="/membership" element={<MembershipView />} />
                <Route path="/checkout" element={
                  <CheckoutPage
                    cart={cart}
                    onOrderComplete={clearCart}
                    onBack={() => window.history.back()}
                  />
                } />
                <Route path="*" element={
                  <div className="pt-32 pb-24 px-8 min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-8 max-w-lg animate-fade-in">
                      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                        <i className="fa-solid fa-flower text-4xl text-pink-500"></i>
                      </div>
                      <h1 className="text-7xl font-bold serif italic text-stone-900">404</h1>
                      <p className="text-xl text-stone-500 font-light">This bloom has wilted. The page you're looking for doesn't exist.</p>
                      <Link to="/" className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-xl">
                        <i className="fa-solid fa-home"></i> Return Home
                      </Link>
                    </div>
                  </div>
                } />
              </Routes>
            </main>

            {/* Cart Sidebar */}
            {isCartOpen && (
              <div className="fixed inset-0 z-[2000] animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                  <div className="p-10 border-b border-stone-50 flex justify-between items-center">
                    <h3 className="text-2xl font-bold serif italic">Your Selection</h3>
                    <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-6 opacity-40">
                        <i className="fa-solid fa-box-open text-6xl"></i>
                        <p className="text-xl serif italic">Your selection is empty</p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="mt-4 text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors"
                        >
                          Continue Shopping →
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex gap-6 group">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-stone-50 flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="flex-1 flex flex-col justify-center gap-1">
                            <span className="text-[9px] font-black uppercase text-pink-500 tracking-widest">{item.type}</span>
                            <h4 className="font-bold text-lg text-stone-900 leading-tight">{item.name}</h4>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-stone-400 text-xs font-medium">Qty: {item.quantity}</span>
                              <span className="font-bold text-stone-900">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all self-center opacity-0 group-hover:opacity-100"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-10 bg-stone-50/50 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                        <span>Subtotal</span>
                        <span className="font-bold text-stone-900">${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                        <span>Courier Fees</span>
                        <span className="text-green-600 font-bold uppercase">Complimentary</span>
                      </div>
                      <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                        <span className="text-stone-900 text-xl font-bold serif italic">Order Total</span>
                        <span className="text-3xl font-bold italic serif text-pink-600">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <Link
                      to="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className={`w-full py-6 bg-stone-900 text-white rounded-3xl font-bold text-lg hover:bg-pink-600 shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${cart.length === 0 ? 'opacity-20 pointer-events-none' : ''}`}
                    >
                      Checkout <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <footer className="py-20 border-t border-stone-100 bg-gradient-to-b from-white to-stone-50">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                      <i className="fa-solid fa-leaf transform -rotate-12"></i>
                    </div>
                    <h1 className="text-2xl font-bold serif italic text-stone-900">Petal & Prose</h1>
                  </div>
                  <p className="text-stone-400 text-sm max-w-sm font-light leading-relaxed">The global standard for curated floral distribution. Architecting beauty for every variety and style since 2025.</p>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 hover:bg-pink-500 hover:text-white transition-all"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#" className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 hover:bg-pink-500 hover:text-white transition-all"><i className="fa-brands fa-pinterest"></i></a>
                    <a href="#" className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 hover:bg-pink-500 hover:text-white transition-all"><i className="fa-brands fa-tiktok"></i></a>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Explore</h4>
                  <ul className="space-y-3 text-sm text-stone-400 font-light">
                    <li><Link to="/catalog" className="hover:text-stone-900 transition-colors flex items-center gap-2"><i className="fa-solid fa-leaf text-xs"></i> Catalog</Link></li>
                    <li><Link to="/design" className="hover:text-stone-900 transition-colors flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-xs"></i> Custom Studio</Link></li>
                    <li><Link to="/membership" className="hover:text-stone-900 transition-colors flex items-center gap-2"><i className="fa-solid fa-crown text-xs"></i> Membership</Link></li>
                    <li><Link to="/checkout" className="hover:text-stone-900 transition-colors flex items-center gap-2"><i className="fa-solid fa-bag-shopping text-xs"></i> Checkout</Link></li>
                  </ul>
                </div>

                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Newsletter</h4>
                  <p className="text-stone-400 text-sm font-light">Get seasonal updates & exclusive offers.</p>
                  <div className="flex gap-2">
                    <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 bg-white rounded-xl border border-stone-100 text-sm focus:border-pink-300 focus:ring-0 outline-none" />
                    <button className="px-4 py-3 bg-stone-900 text-white rounded-xl hover:bg-pink-600 transition-all"><i className="fa-solid fa-arrow-right"></i></button>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 mt-12 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-300">Petal & Prose Artisan Collective © 2025</p>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                  Back to Top <i className="fa-solid fa-arrow-up group-hover:-translate-y-1 transition-transform"></i>
                </button>
              </div>
            </footer>
          </div>
        </AppContext.Provider>
      </Router>
    </ToastProvider>
  );
};

export default App;
