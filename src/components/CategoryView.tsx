import React, { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import type { Product, ProductCategoryId } from '../types/store';
import { ProductCard } from './ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

interface CategoryViewProps {
  categoryId: ProductCategoryId;
  products: Product[];
  searchQuery: string;
  onClearSearch: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId,
  products,
  searchQuery,
  onClearSearch,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Reiniciar marca al cambiar de categoría
  useEffect(() => {
    setSelectedBrand('ALL');
    setMobileFiltersOpen(false);
  }, [categoryId]);

  const categoryMeta = CATEGORIES.find((c) => c.id === categoryId);

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === categoryId),
    [products, categoryId]
  );

  // Marcas disponibles en la categoría con su conteo
  const brandsWithCount = useMemo(() => {
    const map = new Map<string, number>();
    categoryProducts.forEach((p) => {
      map.set(p.brand, (map.get(p.brand) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [categoryProducts]);

  // Filtrado por marca, búsqueda en tiempo real y ordenamiento
  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = categoryProducts.filter((product) => {
      const matchesBrand = selectedBrand === 'ALL' || product.brand === selectedBrand;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.brand.toLowerCase().includes(normalizedSearch);
      return matchesBrand && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    } else {
      sorted.sort((a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller)));
    }
    return sorted;
  }, [categoryProducts, selectedBrand, searchQuery, sortBy]);

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de categoría */}
        <div className="bg-[#E9C5B3]/65 rounded-2xl px-6 py-7 sm:px-10 sm:py-9 mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5B3F35]/80 mb-2">
            Categoría · Productos Originales
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl text-[#5B3F35] leading-tight">
            {categoryMeta?.label}
          </h1>
          {categoryMeta?.description && (
            <p className="text-sm sm:text-base text-[#5B3F35]/90 mt-2 max-w-2xl leading-relaxed">
              {categoryMeta.description}
            </p>
          )}
        </div>

        {/* Barra de estado / controles móviles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[#FFFFFF] border border-[#E9C5B3] text-sm font-medium text-[#5B3F35] hover:bg-[#E9C5B3]/40 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Marcas</span>
            </button>
            <p className="text-sm text-[#5B3F35]/85 tabular-nums">
              Mostrando <strong className="font-semibold text-[#5B3F35]">{visibleProducts.length}</strong>{' '}
              {visibleProducts.length === 1 ? 'producto' : 'productos'}
              {selectedBrand !== 'ALL' && (
                <span>
                  {' '}
                  de <strong className="font-semibold text-[#5B3F35]">{selectedBrand}</strong>
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <label htmlFor="category-sort" className="text-xs font-medium text-[#5B3F35]/80">
              Ordenar:
            </label>
            <select
              id="category-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-3.5 rounded-full bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] focus:outline-none focus:border-[#AE7D6B]"
            >
              <option value="featured">Más vendidos</option>
              <option value="newest">Novedades</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {/* Layout principal: Barra lateral izquierda + Grilla de productos */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Barra lateral izquierda (Filtros de marcas) */}
          <aside
            aria-label="Filtrar por marca"
            className={`w-full lg:w-64 shrink-0 bg-[#FFFFFF] border border-[#E9C5B3]/80 rounded-2xl p-5 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FFF5E3]">
              <h2 className="font-display font-semibold text-2xl text-[#5B3F35]">Marcas</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="lg:hidden text-[#5B3F35]/70 hover:text-[#5B3F35]"
                aria-label="Cerrar filtros"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand('ALL');
                    setMobileFiltersOpen(false);
                  }}
                  aria-pressed={selectedBrand === 'ALL'}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                    selectedBrand === 'ALL'
                      ? 'bg-[#C29288] text-[#5B3F35] font-semibold'
                      : 'text-[#5B3F35] hover:bg-[#FFF5E3]'
                  }`}
                >
                  <span>Todas las marcas</span>
                  <span className="text-xs tabular-nums opacity-80">
                    {categoryProducts.length}
                  </span>
                </button>
              </li>

              {brandsWithCount.map(([brand, count]) => {
                const active = selectedBrand === brand;
                return (
                  <li key={brand}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand(brand);
                        setMobileFiltersOpen(false);
                      }}
                      aria-pressed={active}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                        active
                          ? 'bg-[#C29288] text-[#5B3F35] font-semibold'
                          : 'text-[#5B3F35] hover:bg-[#FFF5E3]'
                      }`}
                    >
                      <span>{brand}</span>
                      <span className="text-xs tabular-nums opacity-80">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Grilla de productos (Derecha/Centro) */}
          <div className="flex-1 w-full">
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#FFFFFF] border border-[#E9C5B3] rounded-2xl p-10 text-center">
                {categoryProducts.length === 0 ? (
                  <>
                    <p className="font-display text-2xl text-[#5B3F35] mb-2">
                      Próximamente en esta categoría
                    </p>
                    <p className="text-sm text-[#5B3F35]/80 mb-5 max-w-md mx-auto">
                      Estamos actualizando nuestras referencias de {categoryMeta?.label}. Escríbenos
                      por WhatsApp si buscas un producto específico.
                    </p>
                    <a
                      href="https://wa.me/573106322876"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#C29288] text-[#5B3F35] text-sm font-semibold hover:bg-[#AE7D6B] hover:text-[#FFF5E3] transition-colors"
                    >
                      Consultar por WhatsApp
                    </a>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl text-[#5B3F35] mb-2">
                      No encontramos productos con esos filtros
                    </p>
                    <p className="text-sm text-[#5B3F35]/80 mb-5">
                      Prueba seleccionando todas las marcas o limpiando tu búsqueda actual.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {selectedBrand !== 'ALL' && (
                        <button
                          type="button"
                          onClick={() => setSelectedBrand('ALL')}
                          className="px-5 py-2.5 rounded-full bg-[#C29288] text-[#5B3F35] text-sm font-semibold hover:bg-[#AE7D6B] hover:text-[#FFF5E3] transition-colors"
                        >
                          Ver todas las marcas
                        </button>
                      )}
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={onClearSearch}
                          className="px-5 py-2.5 rounded-full border border-[#AE7D6B] text-[#5B3F35] text-sm font-medium hover:bg-[#E9C5B3]/40 transition-colors"
                        >
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
