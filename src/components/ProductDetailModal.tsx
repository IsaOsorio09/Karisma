import React, { useState, useEffect, useMemo } from 'react';
import { X, Minus, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES, formatCOP } from '../data/catalog';
import type { Product } from '../types/store';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
    setAdded(false);
  }, [product?.id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  if (!product) return null;

  const hasCarousel = gallery.length > 1;
  const currentImage = gallery[activeImageIdx] ?? product.image;

  const categoryLabel =
    CATEGORIES.find((c) => c.id === product.category)?.label ?? product.category;

  const handleConfirmAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      setQuantity(1);
      onClose();
    }, 650);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5B3F35]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FFF5E3] border border-[#E9C5B3] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha de producto"
          className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF5E3]/90 text-[#5B3F35] hover:bg-[#E9C5B3] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Galería principal sobre fondo blanco */}
        <div className="bg-[#FFFFFF] flex flex-col">
          <div className="relative aspect-square w-full bg-[#FFFFFF] overflow-hidden flex items-center justify-center">
            <img
              src={currentImage}
              alt={`${product.name}${hasCarousel ? ` - vista ${activeImageIdx + 1}` : ''}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {hasCarousel && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length)
                  }
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFF5E3]/90 hover:bg-[#C29288] border border-[#E9C5B3] text-[#5B3F35] inline-flex items-center justify-center shadow-sm transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((prev) => (prev + 1) % gallery.length)}
                  aria-label="Siguiente foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFF5E3]/90 hover:bg-[#C29288] border border-[#E9C5B3] text-[#5B3F35] inline-flex items-center justify-center shadow-sm transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas seleccionables */}
          {hasCarousel && (
            <div className="flex items-center gap-2.5 p-3.5 bg-[#FFF5E3]/50 border-t border-[#E9C5B3]/60 overflow-x-auto">
              {gallery.map((imgSrc, idx) => {
                const isSelected = idx === activeImageIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`Seleccionar foto ${idx + 1}`}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`w-16 h-16 rounded-xl overflow-hidden bg-[#FFFFFF] shrink-0 border-2 transition-all ${
                      isSelected
                        ? 'border-[#5B3F35] opacity-100'
                        : 'border-[#E9C5B3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} miniatura ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Módulo de compra */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#FFF5E3]">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#AE7D6B] mb-2">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{categoryLabel}</span>
            </div>

            <h2
              id="pdp-title"
              className="font-display font-semibold text-3xl text-[#5B3F35] leading-tight mb-2"
            >
              {product.name}
            </h2>

            <p className="text-xs font-medium text-[#5B3F35]/75 mb-4">
              {product.shadeOrSpec} · {product.inStock ? 'Disponible' : 'Agotado'}
            </p>

            <p className="text-2xl font-semibold text-[#5B3F35] tabular-nums mb-5">
              {formatCOP(product.price)}
            </p>

            <p className="text-sm text-[#5B3F35]/90 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E9C5B3]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5B3F35]">Cantidad</span>
              <div className="inline-flex items-center rounded-full bg-[#FFFFFF] border border-[#E9C5B3]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                  className="w-10 h-10 inline-flex items-center justify-center text-[#5B3F35] hover:bg-[#E9C5B3]/40 rounded-l-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#5B3F35] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                  className="w-10 h-10 inline-flex items-center justify-center text-[#5B3F35] hover:bg-[#E9C5B3]/40 rounded-r-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              className="w-full min-h-[46px] px-6 py-3 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Agregado al carrito!</span>
                </>
              ) : (
                <span>Agregar al carrito · {formatCOP(product.price * quantity)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};