
import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BouquetBuilder from './components/BouquetBuilder';
import { CustomBouquet, CartItem, FlowerCategory } from './types';
import { FLOWER_CATALOG } from './constants';

const Navbar: React.FC<{ cartCount: number, onOpenCart: () => void }> = ({ cartCount, onOpenCart }) => (
  <nav className="fixed top-0 left-0 right-0 h-24 bg-white border-b border-stone-100 z-[1000] px-8 md:px-12 flex items-center justify-between">
    <Link to="/" className="flex items-center gap-4 group">
      <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-pink-600 transition-all duration-500">
        <i className="fa-solid fa-leaf text-xl transform -rotate-12"></i>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold serif italic leading-none tracking-tight text-stone-900">Petal & Prose</h1>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400">Haute Couture Florals</span>
      </div>
    </Link>

    <div className="flex items-center gap-10">
      <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
        <Link to="/catalog" className="hover:text-stone-900 transition-colors">Catalog</Link>
        <Link to="/design" className="hover:text-stone-900 transition-colors">Custom Studio</Link>
        <Link to="/membership" className="hover:text-stone-900 transition-colors">Membership</Link>
      </div>
      <button 
        onClick={onOpenCart}
        className="relative w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all group shadow-sm"
      >
        <i className="fa-solid fa-bag-shopping text-sm"></i>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-fade-in">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </nav>
);

const CatalogView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FlowerCategory | 'All'>('All');
  const navigate = useNavigate();
  
  const filteredFlowers = useMemo(() => {
    return activeFilter === 'All' 
      ? FLOWER_CATALOG 
      : FLOWER_CATALOG.filter(f => f.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="pt-32 pb-24 px-8 md:px-12 max-w-[1600px] mx-auto animate-fade-in">
      {/* Catalog Header - Oversized and elegant */}
      <header className="mb-24 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <h2 className="text-[6rem] md:text-[9rem] font-bold serif leading-none text-stone-900 tracking-tighter">
          The Catalog<span className="text-pink-300">.</span>
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {['ALL', 'BLOOM', 'FILLER', 'GREENERY', 'ACCENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase() as any)}
              className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all border ${
                activeFilter.toUpperCase() === cat 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xl scale-105' 
                  : 'bg-white text-stone-300 border-stone-50 hover:border-stone-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Layout - 2 columns per screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
        {filteredFlowers.map((flower) => {
          const isSoldOut = flower.stock <= 0;
          return (
            <div 
              key={flower.id} 
              className={`flex flex-col space-y-12 group transition-all duration-500 cursor-pointer ${isSoldOut ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.01]'}`}
              onClick={() => navigate('/design')}
            >
              
              {/* Image Container - Matching rounded corners from UI spec */}
              <div className="aspect-[1.5] bg-stone-100 rounded-[5rem] overflow-hidden relative shadow-sm group-hover:shadow-3xl transition-all duration-1000 ring-1 ring-stone-100">
                <img 
                  src={flower.image} 
                  alt={flower.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] group-hover:scale-110" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&fit=crop';
                  }}
                />
                
                {isSoldOut && (
                  <div className="absolute inset-0 bg-stone-950/20 backdrop-blur-sm flex items-center justify-center z-10">
                    <span className="bg-white/95 px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.4em] text-stone-900 shadow-2xl">
                      Sold Out
                    </span>
                  </div>
                )}
                
                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white text-stone-900 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    Add to Studio <i className="fa-solid fa-plus ml-2"></i>
                  </span>
                </div>
              </div>

              {/* Typography Block - Exactly as screenshot */}
              <div className="px-10 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h3 className="text-5xl md:text-6xl font-bold serif text-stone-900 tracking-tight leading-none">
                      {flower.name}
                    </h3>
                    <p className="text-[14px] font-bold uppercase text-stone-300 tracking-[0.5em] block font-sans">
                      {flower.scientificName}
                    </p>
                  </div>
                  
                  {/* Price - Pink Serif Italic as requested */}
                  <span className="text-[2.5rem] font-bold serif italic text-pink-300 leading-none transform translate-y-3 shrink-0">
                    ${flower.price.toFixed(2)}
                  </span>
                </div>
                
                {/* Care Quote - Light Italic Serif */}
                <p className="text-2xl text-stone-300 font-light italic leading-relaxed max-w-2xl serif">
                  "{flower.careInstructions}"
                </p>

                {/* Badge Row - Subtle factual pills */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-stone-50">
                  <div className="bg-stone-100 text-stone-500 text-[11px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full"></div>
                    {flower.origin}
                  </div>
                  <div className="bg-white border border-stone-100 text-stone-200 text-[11px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full">
                    {flower.season}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HomeView: React.FC = () => {
  const styles = [
    { name: 'Minimalist', img: 'https://images.unsplash.com/photo-1525310238806-f1941e263832?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bohemian', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Classic', img: 'https://images.unsplash.com/photo-1548610762-65603720792a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Romantic', img: 'https://images.unsplash.com/photo-1563241527-3004b7be0fab?auto=format&fit=crop&q=80&w=600' }
  ];

  return (
    <div className="pt-24 min-h-screen">
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=2400" 
            className="w-full h-full object-cover brightness-[0.95]"
            alt="Lush Floral Background"
          />
          <div className="absolute inset-0 bg-stone-900/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-12 w-full space-y-12">
          <div className="space-y-6 animate-slide-up">
            <span className="text-white text-xs font-black uppercase tracking-[0.5em] block shadow-sm">Global Distribution Network</span>
            <h2 className="text-7xl md:text-9xl font-bold serif italic text-white tracking-tighter leading-none drop-shadow-2xl">
              Ethical <br />Artistry.
            </h2>
            <p className="max-w-xl text-lg text-white font-light leading-relaxed drop-shadow-md">
              The premier online shop for curated botanical inventory. From rare imports to rustic staples, 
              we distribute beauty in every variety and style.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/catalog" className="px-10 py-5 bg-white text-stone-900 rounded-2xl font-bold text-sm hover:bg-pink-600 hover:text-white transition-all shadow-2xl">
              Shop Inventory
            </Link>
            <Link to="/design" className="px-10 py-5 bg-stone-900/50 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold text-sm hover:bg-white hover:text-stone-900 transition-all">
              Bespoke Studio
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
    </div>
  );
};

const MembershipView: React.FC = () => (
  <div className="pt-32 pb-24 px-8 md:px-12 max-w-7xl mx-auto animate-fade-in space-y-24">
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
          <button className="px-8 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Join Now</button>
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
          <button className="px-8 py-3 bg-white text-stone-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-pink-500 hover:text-white transition-all">Join Circle</button>
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
          <button className="px-8 py-3 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Contact B2B</button>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Router>
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
                <BouquetBuilder onAddToCart={handleAddToCart} />
              </div>
            } />
            <Route path="/membership" element={<MembershipView />} />
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
                <button 
                  disabled={cart.length === 0}
                  className="w-full py-6 bg-stone-900 text-white rounded-3xl font-bold text-lg hover:bg-pink-600 shadow-2xl transition-all disabled:opacity-20 flex items-center justify-center gap-3 active:scale-95"
                >
                  Checkout <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="py-24 border-t border-stone-100 bg-white">
          <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                  <i className="fa-solid fa-leaf transform -rotate-12"></i>
                </div>
                <h1 className="text-2xl font-bold serif italic text-stone-900">Petal & Prose</h1>
              </div>
              <p className="text-stone-400 text-sm max-w-sm font-light leading-relaxed">The global standard for curated floral distribution. Architecting beauty for every variety and style since 2025.</p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Distributor</h4>
              <ul className="space-y-4 text-sm text-stone-400 font-light">
                <li><Link to="/catalog" className="hover:text-stone-900 transition-colors">Bulk Catalog</Link></li>
                <li><Link to="/design" className="hover:text-stone-900 transition-colors">Custom Studio</Link></li>
                <li><Link to="/membership" className="hover:text-stone-900 transition-colors">B2B Partnership</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Assistance</h4>
              <ul className="space-y-4 text-sm text-stone-400 font-light">
                <li className="hover:text-stone-900 transition-colors cursor-pointer">Logistics Guide</li>
                <li className="hover:text-stone-900 transition-colors cursor-pointer">Shipping Network</li>
                <li className="hover:text-stone-900 transition-colors cursor-pointer">Quality Control</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-12 pt-24 mt-24 border-t border-stone-50 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-300">Petal & Prose Artisan Collective © 2025</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
