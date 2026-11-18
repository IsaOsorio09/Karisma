import React, { useState, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { formatCOP } from '../data/catalog';
import type { Product } from '../types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
  className = '',
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const gallery = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product.image, product.images]);

  const hasCarousel = gallery.length > 1;
  const currentImage = gallery[activeImageIdx] ?? product.image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgError(false);
    setActiveImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgError(false);
    setActiveImageIdx((prev) => (prev + 1) % gallery.length);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <article
      className={`group flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#E9C5B3]/70 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <div className="relative aspect-square w-full bg-[#FFFFFF] overflow-hidden">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          aria-label={`Ver detalles de ${product.name}`}
          className="block w-full h-full focus-visible:outline-2 focus-visible:outline-[#5B3F35]"
        >
          {!imgError ? (
            <img
              src={currentImage}
              alt={`${product.name} - ${product.brand}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF5E3] p-6 text-center">
              <ShoppingBag className="w-8 h-8 text-[#AE7D6B] mb-2" />
              <span className="text-xs font-medium text-[#5B3F35]">{product.name}</span>
            </div>
          )}
        </button>

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label={`Foto anterior de ${product.name}`}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#FFF5E3]/90 hover:bg-[#C29288] border border-[#E9C5B3] text-[#5B3F35] inline-flex items-center justify-center shadow-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label={`Siguiente foto de ${product.name}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#FFF5E3]/90 hover:bg-[#C29288] border border-[#E9C5B3] text-[#5B3F35] inline-flex items-center justify-center shadow-sm transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#FFF5E3]/85 border border-[#E9C5B3]/60">
              {gallery.map((_, idx) => {
                const isActive = idx === activeImageIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImgError(false);
                      setActiveImageIdx(idx);
                    }}
                    aria-label={`Ver foto ${idx + 1} de ${product.name}`}
                    className={`h-1.5 rounded-full transition-all duration-150 ${
                      isActive ? 'w-4 bg-[#5B3F35]' : 'w-1.5 bg-[#5B3F35]/35 hover:bg-[#5B3F35]/70'
                    }`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5 border-t border-[#FFF5E3]">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#AE7D6B] mb-1.5 truncate">
          <span>{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{product.shadeOrSpec}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left focus-visible:outline-2 focus-visible:outline-[#5B3F35] rounded"
        >
          <h3 className="font-sans text-[15px] font-semibold text-[#5B3F35] leading-snug line-clamp-2 min-h-[42px] group-hover:text-[#AE7D6B] transition-colors">
            {product.name}
          </h3>
        </button>

        <div className="mt-auto pt-3 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-base font-semibold text-[#5B3F35] tabular-nums">
              {formatCOP(product.price)}
            </span>
            <span className="text-[11px] text-[#5B3F35]/70">Producto original</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`w-full min-h-[44px] px-4 py-2.5 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-150 whitespace-nowrap ${
              justAdded
                ? 'bg-[#5B3F35] text-[#FFF5E3]'
                : 'bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span>Agregado al carrito</span>
              </>
            ) : (
              <span>Agregar al carrito</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};