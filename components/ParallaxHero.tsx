import React, { useEffect, useRef, useState } from 'react';

interface ParallaxHeroProps {
    onExplore?: () => void;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({ onExplore }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            if (!ref.current) return;
            const { top } = ref.current.getBoundingClientRect();
            setScroll(Math.max(0, Math.min(1, -top / (window.innerHeight * 0.7))));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div ref={ref} className="relative h-screen overflow-hidden">
            {/* 4K Rose Background - Full hero focus */}
            <div
                className="absolute inset-0 transition-transform duration-100"
                style={{
                    transform: `scale(${1 + scroll * 0.15})`,
                    filter: `blur(${scroll * 3}px)`,
                }}
            >
                <img
                    src="/assets/rose-bg.png"
                    alt="Rose"
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/70" />

            {/* Text Overlay */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8"
                style={{ opacity: 1 - scroll * 1.5, transform: `translateY(${scroll * 60}px)` }}
            >
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/90 mb-6 drop-shadow">
                    Haute Couture Florals
                </span>
                <h1 className="text-7xl md:text-9xl font-bold serif italic text-white text-center drop-shadow-lg">
                    Petal &<br />Prose
                </h1>
                <p className="text-lg text-white/80 mt-6 max-w-md text-center drop-shadow">
                    Artisan arrangements crafted with passion
                </p>
                <button
                    onClick={onExplore}
                    className="mt-10 px-12 py-4 bg-white text-stone-900 rounded-full font-bold hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-2xl hover:scale-105"
                >
                    Explore Collection
                </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest animate-bounce">
                SCROLL
            </div>
        </div>
    );
};

export default ParallaxHero;
