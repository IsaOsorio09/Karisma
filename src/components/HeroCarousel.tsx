import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../data/catalog';
import type { CategoryId } from '../types/store';

interface HeroCarouselProps {
  onNavigateCategory: (cat: CategoryId) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigateCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      aria-label="Campañas destacadas"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-[#E9C5B3]"
    >
      <div className="relative h-[430px] sm:h-[490px] lg:h-[540px] w-full">
        {HERO_SLIDES.map((slide, idx) => {
          const active = idx === currentIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {/* Scrim cacao suave para garantizar contraste AA del texto crema */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#5B3F35]/85 via-[#5B3F35]/50 to-[#5B3F35]/15"
              />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-14">
                  <div className="max-w-xl text-[#FFF5E3]">
                    <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#E9C5B3] mb-3">
                      {slide.eyebrow}
                    </p>
                    <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-balance mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base text-[#FFF5E3]/90 leading-relaxed mb-7 max-w-lg">
                      {slide.subtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigateCategory(slide.targetCategory)}
                      className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#C29288] hover:bg-[#E9C5B3] text-[#5B3F35] font-semibold text-sm tracking-wide transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#FFF5E3]"
                    >
                      {slide.ctaLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Controles manuales */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Anuncio anterior"
          className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFF5E3]/85 hover:bg-[#FFF5E3] text-[#5B3F35] absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 transition-colors focus-visible:outline-2 focus-visible:outline-[#5B3F35]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente anuncio"
          className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFF5E3]/85 hover:bg-[#FFF5E3] text-[#5B3F35] absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 transition-colors focus-visible:outline-2 focus-visible:outline-[#5B3F35]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {HERO_SLIDES.map((slide, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ver campaña ${idx + 1}: ${slide.title}`}
                aria-current={active ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-200 ${
                  active ? 'w-8 bg-[#FFF5E3]' : 'w-2.5 bg-[#FFF5E3]/55 hover:bg-[#FFF5E3]/85'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
