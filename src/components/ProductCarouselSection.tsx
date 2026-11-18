import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types/store';
import { ProductCard } from './ProductCard';

interface ProductCarouselSectionProps {
  title: string;
  subtitle: string;
  bannerTone?: 'marron' | 'nude';
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCarouselSection: React.FC<ProductCarouselSectionProps> = ({
  title,
  subtitle,
  bannerTone = 'marron',
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [products, updateScrollState]);

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = Math.max(trackRef.current.clientWidth * 0.78, 280);
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const isMarron = bannerTone === 'marron';

  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título tipo banner acorde a la guía de marca (sin flechas) */}
        <div
          className={`rounded-2xl px-6 py-5 sm:px-8 sm:py-6 mb-7 ${
            isMarron
              ? 'bg-[#AE7D6B] text-[#FFF5E3]'
              : 'bg-[#E9C5B3] text-[#5B3F35]'
          }`}
        >
          <h2 className="font-display font-semibold text-3xl sm:text-4xl leading-tight text-balance">
            {title}
          </h2>
          <p
            className={`text-sm mt-1 ${
              isMarron ? 'text-[#FFF5E3]/90' : 'text-[#5B3F35]/85'
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* Carrusel horizontal de tarjetas con flechas ubicadas sobre el área de imágenes */}
        {products.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollTrack('left')}
              disabled={!canScrollLeft}
              aria-label={`Anterior en ${title}`}
              className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFF5E3]/95 border border-[#E9C5B3] text-[#5B3F35] shadow-md absolute left-2 sm:-left-4 top-[125px] sm:top-[135px] -translate-y-1/2 z-20 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#5B3F35] ${
                canScrollLeft
                  ? 'hover:bg-[#C29288] hover:border-[#AE7D6B] cursor-pointer opacity-100'
                  : 'opacity-40 cursor-default'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={trackRef}
              onScroll={updateScrollState}
              className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[250px] sm:w-[270px] lg:w-[285px]"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onSelectProduct={onSelectProduct}
                    className="h-full"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollTrack('right')}
              disabled={!canScrollRight}
              aria-label={`Siguiente en ${title}`}
              className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFF5E3]/95 border border-[#E9C5B3] text-[#5B3F35] shadow-md absolute right-2 sm:-right-4 top-[125px] sm:top-[135px] -translate-y-1/2 z-20 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#5B3F35] ${
                canScrollRight
                  ? 'hover:bg-[#C29288] hover:border-[#AE7D6B] cursor-pointer opacity-100'
                  : 'opacity-40 cursor-default'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#E9C5B3] rounded-2xl p-8 text-center text-sm text-[#5B3F35]/80">
            No hay productos que coincidan con tu búsqueda en esta sección.
          </div>
        )}
      </div>
    </section>
  );
};
