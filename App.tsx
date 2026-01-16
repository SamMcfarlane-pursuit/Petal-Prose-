
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BouquetBuilder from './components/BouquetBuilder';
import AIAssistant from './components/AIAssistant';
import { FLOWER_CATALOG } from './constants';
import { CartItem, CustomBouquet, FlowerCategory } from './types';

const Navbar: React.FC<{ cartCount: number, onOpenCart: () => void }> = ({ cartCount, onOpenCart }) => (
  <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-100/50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-stone-900 serif italic flex items-center gap-2 group">
        <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
           <i className="fa-solid fa-leaf text-sm transform -rotate-12"></i>
        </div>
        <span className="tracking-tight">Petal & Prose</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">
        <Link to="/catalog" className="hover:text-pink-600 transition-colors">Catalog</Link>
        <Link to="/design" className="hover:text-pink-600 transition-colors">Custom Studio</Link>
        <Link to="/subscriptions" className="hover:text-pink-600 transition-colors">Membership</Link>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={onOpenCart}
          className="relative w-12 h-12 flex items-center justify-center bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all shadow-xl"
        >
          <i className="fa-solid fa-bag-shopping text-sm"></i>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </nav>
);

const HomeView: React.FC = () => (
  <div className="relative min-h-screen bg-[#faf9f6] overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
      <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[120%] h-auto opacity-[0.05] absolute -top-1/4 -left-1/4 animate-pulse duration-[10s]">
        <path d="M200,500 C200,150 450,50 750,100 C950,150 1000,500 850,850 C700,1200 250,950 200,500 Z" fill="url(#petal-grad)" />
        <defs><linearGradient id="petal-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient></defs>
      </svg>
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[70%] bg-pink-100/10 blur-[150px] rounded-full"></div>
    </div>

    <div className="space-y-40 py-24 px-6 max-w-7xl mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-20 items-center">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 bg-white border border-stone-100 text-stone-900 px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            Haute Couture Arrangements
          </div>
          
          <h1 className="text-8xl md:text-9xl font-bold leading-[0.9] text-stone-900 tracking-tighter serif italic">
            Nature, <br />
            Digitalized. <br />
            <span className="text-pink-600 not-italic font-black tracking-normal">Bespoke.</span>
          </h1>
          
          <p className="text-2xl text-stone-400 leading-relaxed max-w-xl font-light">
            Compose your own silent symphony of flowers using our premium AI-driven design studio. From petal texture to stem tilt—every detail is yours.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-4">
            <Link to="/design" className="px-14 py-6 bg-stone-900 text-white rounded-full font-bold hover:bg-pink-600 transition-all shadow-2xl flex items-center gap-4 group">
              Open Studio <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
            </Link>
            <Link to="/catalog" className="px-14 py-6 bg-white border border-stone-200 rounded-full font-bold hover:border-stone-900 transition-all">Collections</Link>
          </div>
        </div>

        <div className="relative group">
          <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/5] bg-stone-200">
            <img src="https://images.unsplash.com/photo-1591880911020-d349695a898b?q=80&w=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12 text-white">
               <h3 className="text-4xl serif italic mb-2 leading-none">The Artisan's Pride</h3>
               <p className="text-white/60 text-xs font-black uppercase tracking-widest">Available in Studio Today</p>
            </div>
          </div>
          <div className="absolute -inset-10 bg-pink-100/30 blur-[100px] -z-10 rounded-full group-hover:scale-110 transition-transform duration-[5s]"></div>
        </div>
      </section>
    </div>
  </div>
);

const CatalogView: React.FC = () => {
  const [filter, setFilter] = useState<FlowerCategory | 'All'>('All');
  
  const filteredFlowers = filter === 'All' 
    ? FLOWER_CATALOG 
    : FLOWER_CATALOG.filter(f => f.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-16 animate-in fade-in duration-700">
      <header className="space-y-6 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-black uppercase text-pink-500 tracking-[0.4em]">Artisanal Library</span>
        <h1 className="text-7xl font-bold serif italic text-stone-900 tracking-tighter">The Collection</h1>
        <p className="text-stone-400 font-light text-xl leading-relaxed">
          Our digital greenhouse is stocked with the finest ethically sourced stems. 
          Use these as the building blocks for your bespoke arrangement.
        </p>
      </header>

      <div className="flex justify-center gap-4 flex-wrap">
        {['All', ...Object.values(FlowerCategory)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              filter === cat 
                ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105' 
                : 'bg-white text-stone-400 border-stone-100 hover:border-stone-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filteredFlowers.map((flower) => (
          <div key={flower.id} className="group cursor-pointer">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-stone-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 relative">
              <img 
                src={flower.image} 
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors pointer-events-none"></div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-stone-900">
                 <i className="fa-solid fa-plus text-xs"></i>
              </div>
            </div>
            <div className="space-y-2 px-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold serif text-stone-900 leading-none">{flower.name}</h3>
                  <p className="text-[9px] font-black uppercase text-stone-300 tracking-[0.2em] mt-1">{flower.scientificName}</p>
                </div>
                <span className="text-lg font-bold serif italic text-pink-600">${flower.price.toFixed(2)}</span>
              </div>
              <p className="text-stone-400 text-xs italic font-light line-clamp-2">"{flower.meaning}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MembershipView: React.FC = () => {
  const PLANS = [
    {
      name: 'Petal Enthusiast',
      price: '29',
      interval: 'month',
      features: ['Weekly AI Design Review', '10% Discount on Stems', 'Priority Seasonal Access', 'Basic Texture Engine'],
      accent: 'stone-400'
    },
    {
      name: 'Monthly Muse',
      price: '59',
      interval: 'month',
      features: ['Real-time Iris Mentoring', '25% Discount on Stems', 'Free Standard Shipping', 'Unlimited Texture Generation', 'Advanced 3D Export'],
      popular: true,
      accent: 'pink-500'
    },
    {
      name: 'Artisan Pro',
      price: '149',
      interval: 'month',
      features: ['Commercial Resale License', '50% Bulk Stem Discount', 'Concierge Sourcing', 'Custom Palette Branding', 'Dedicated API Access'],
      accent: 'stone-900'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24 animate-in fade-in duration-700">
      <header className="space-y-8 text-center max-w-3xl mx-auto">
        <span className="text-[10px] font-black uppercase text-pink-500 tracking-[0.4em]">Membership Program</span>
        <h1 className="text-8xl font-bold serif italic text-stone-900 tracking-tighter leading-none">The Bloom Club</h1>
        <p className="text-stone-400 font-light text-2xl leading-relaxed">
          Elevate your artistry. Join our inner circle for exclusive inventory, advanced AI tooling, and preferred botanical pricing.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {PLANS.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-12 rounded-[3.5rem] bg-white border flex flex-col transition-all duration-500 hover:scale-[1.02] ${
              plan.popular ? 'border-pink-200 shadow-2xl scale-105 z-10' : 'border-stone-100 shadow-sm'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                Most Chosen
              </span>
            )}
            
            <div className="space-y-2 mb-10">
              <h3 className="text-2xl font-bold serif italic text-stone-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold serif text-stone-900">${plan.price}</span>
                <span className="text-stone-400 text-sm font-light">/{plan.interval}</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 mb-12">
              <p className="text-[10px] font-black uppercase text-stone-300 tracking-widest">Inclusions</p>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-4 items-center text-stone-600 text-[13px] font-medium leading-tight">
                    <i className={`fa-solid fa-check text-xs text-${plan.popular ? 'pink-500' : 'stone-300'}`}></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button className={`w-full py-5 rounded-full font-bold text-sm transition-all shadow-xl ${
              plan.popular 
                ? 'bg-stone-900 text-white hover:bg-pink-600' 
                : 'bg-stone-50 text-stone-900 hover:bg-stone-900 hover:text-white'
            }`}>
              Select {plan.name}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-stone-900 rounded-[4rem] p-20 text-center text-white space-y-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-5xl serif italic font-bold">Gift a Subscription</h2>
          <p className="text-stone-400 max-w-xl mx-auto font-light text-lg">
            Share the joy of composition. Our gift memberships are the perfect offering for the artisan in your life.
          </p>
          <button className="px-12 py-5 bg-white text-stone-900 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-all shadow-2xl">
            Purchase Gift Pass
          </button>
        </div>
      </div>
    </div>
  );
};

const DesignStudioView: React.FC<{ onAddToCart: (c: CustomBouquet, p: number) => void }> = ({ onAddToCart }) => (
  <div className="max-w-[1600px] mx-auto px-6 py-16 space-y-12">
    <header className="max-w-4xl space-y-6 animate-in slide-in-from-left-4 duration-700">
      <div className="inline-flex items-center gap-3 bg-pink-50 text-pink-600 px-5 py-2 rounded-full text-[9px] font-black tracking-[0.4em] uppercase shadow-sm">
        <i className="fa-solid fa-sparkles"></i>
        Bespoke Creator v2.5
      </div>
      <h1 className="text-7xl font-bold text-stone-900 tracking-tighter serif italic leading-tight">The Design Studio.</h1>
      <p className="text-xl text-stone-400 font-light leading-relaxed max-w-2xl">
        A professional workspace for floral architects. Select your stems, adjust their depth, 
        and consult Iris for the perfect compositional balance.
      </p>
    </header>
    <BouquetBuilder onAddToCart={onAddToCart} />
  </div>
);

const CartDrawer: React.FC<{ items: CartItem[], isOpen: boolean, onClose: () => void }> = ({ items, isOpen, onClose }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col slide-in-from-right duration-500">
        <div className="p-10 border-b border-stone-50 flex items-center justify-between">
          <h2 className="text-4xl font-bold serif italic">The Bag</h2>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-50 text-stone-400 hover:text-stone-950 transition-colors"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 opacity-30">
              <i className="fa-solid fa-bag-shopping text-6xl"></i>
              <p className="text-lg serif italic text-stone-500">Your selection is empty</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-stone-100"><img src={item.image} className="w-full h-full object-cover" /></div>
                <div className="flex-1 flex flex-col justify-center gap-1">
                  <h4 className="font-bold text-lg text-stone-900 leading-none">{item.name}</h4>
                  <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Bespoke Design</p>
                  <p className="text-xl font-bold italic serif mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="p-10 bg-stone-50 space-y-8">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Order Total</span>
              <span className="text-4xl font-bold italic serif">${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-5 bg-stone-950 text-white rounded-full font-bold hover:bg-pink-600 shadow-xl transition-all">Secure Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (custom: CustomBouquet, price: number) => {
    const newItem: CartItem = {
      id: `custom-${Date.now()}`,
      name: "Bespoke Arrangement",
      price: price,
      quantity: 1,
      type: 'custom',
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&fit=crop"
    };
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#faf9f6]">
        <Navbar cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/catalog" element={<CatalogView />} />
            <Route path="/design" element={<DesignStudioView onAddToCart={handleAddToCart} />} />
            <Route path="/subscriptions" element={<MembershipView />} />
            <Route path="*" element={<div className="py-40 text-center"><h1 className="text-4xl serif italic">Page in development</h1><Link to="/" className="text-pink-600 hover:underline">Return Home</Link></div>} />
          </Routes>
        </main>
        <footer className="bg-stone-950 text-white py-40 mt-40">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
            <h2 className="text-5xl serif italic font-bold">Petal & Prose</h2>
            <p className="text-stone-500 max-w-xl mx-auto font-light leading-relaxed">Defining the intersection of horticulture and high-technology. Based in London, shipping worldwide.</p>
            <div className="pt-12 border-t border-stone-900 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-700">
               <span>&copy; 2024 Petal & Prose</span>
               <div className="flex gap-10"><span>Instagram</span><span>Pinterest</span></div>
            </div>
          </div>
        </footer>
        <CartDrawer items={cart} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
  );
};

export default App;
