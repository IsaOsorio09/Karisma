import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { CATEGORIES, formatCOP } from '../data/catalog';
import type { CategoryId, Product } from '../types/store';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: Product[];
  onSelectProduct: (product: Product) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectProduct,
  cartCount,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = searchFocused && searchQuery.trim().length > 0;

  const handleCategoryClick = (id: CategoryId) => {
    onSelectCategory(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF5E3]/95 backdrop-blur-sm border-b border-[#E9C5B3]">
      {/* Fila superior: Logo + Buscador en tiempo real + Carrito */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2.5 sm:py-3">
          {/* Botón menú móvil + Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#5B3F35] hover:bg-[#E9C5B3]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#5B3F35]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => handleCategoryClick('inicio')}
              className="text-left focus-visible:outline-2 focus-visible:outline-[#5B3F35] rounded-lg"
              aria-label="Ir al inicio de Karisma Face & Body"
            >
              <BrandLogo variant="dark" size="sm" className="sm:hidden" />
              <BrandLogo variant="dark" size="md" className="hidden sm:inline-flex" />
            </button>
          </div>

          {/* Derecha: Buscador funcional en tiempo real + Carrito */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Barra de búsqueda escritorio */}
            <div ref={searchWrapperRef} className="relative hidden md:block w-72 lg:w-80">
              <label htmlFor="desktop-product-search" className="sr-only">
                Buscar productos por nombre
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#5B3F35]/70 absolute left-3.5 pointer-events-none" />
                <input
                  id="desktop-product-search"
                  type="search"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setSearchFocused(true);
                  }}
                  placeholder="Buscar productos por nombre..."
                  className="w-full h-10 pl-10 pr-8 rounded-full bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/55 focus:outline-none focus:border-[#AE7D6B] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 text-[#5B3F35]/70 hover:text-[#5B3F35]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Resultados en tiempo real */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-[#FFFFFF] border border-[#E9C5B3] rounded-xl shadow-lg z-50 divide-y divide-[#FFF5E3]">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-2 text-xs font-medium text-[#AE7D6B] bg-[#FFF5E3]/60">
                        {searchResults.length}{' '}
                        {searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                      </div>
                      {searchResults.slice(0, 6).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            onSelectProduct(product);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#FFF5E3]/70 transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-[#FFFFFF] border border-[#E9C5B3]/50 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#AE7D6B] uppercase tracking-wide">
                              {product.brand}
                            </p>
                            <p className="text-sm font-medium text-[#5B3F35] truncate">
                              {product.name}
                            </p>
                            <p className="text-xs font-semibold text-[#5B3F35] tabular-nums">
                              {formatCOP(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="p-5 text-center text-sm text-[#5B3F35]/80">
                      No encontramos productos con "{searchQuery}".
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Lupa móvil */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label="Buscar productos"
              aria-expanded={mobileSearchOpen}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E9C5B3] text-[#5B3F35] hover:bg-[#E9C5B3]/40 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Botón Carrito con contador dinámico */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Abrir carrito de compras (${cartCount} productos)`}
              className="inline-flex items-center gap-2.5 h-11 px-4 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] font-medium text-sm transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-[#5B3F35]"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Carrito</span>
              <span
                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#FFF5E3] text-[#5B3F35] text-xs font-semibold tabular-nums"
                aria-live="polite"
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Buscador expandible en móvil */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <label htmlFor="mobile-product-search" className="sr-only">
              Buscar productos por nombre
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#5B3F35]/70 absolute left-3.5 pointer-events-none" />
              <input
                id="mobile-product-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar labial, sérum, brochas..."
                className="w-full h-11 pl-10 pr-9 rounded-full bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/60 focus:outline-none focus:border-[#AE7D6B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 text-[#5B3F35]/70"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery.trim().length > 0 && (
              <div className="mt-2 bg-[#FFFFFF] border border-[#E9C5B3] rounded-xl max-h-64 overflow-y-auto divide-y divide-[#FFF5E3]">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        setMobileSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-lg object-cover border border-[#E9C5B3]/40 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-[#AE7D6B]">{product.brand}</p>
                        <p className="text-sm font-medium text-[#5B3F35] truncate">{product.name}</p>
                        <p className="text-xs font-semibold text-[#5B3F35] tabular-nums">
                          {formatCOP(product.price)}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-center text-[#5B3F35]/80">
                    Sin resultados para "{searchQuery}".
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fila inferior: Menú de navegación de categorías (Escritorio) */}
      <nav
        aria-label="Categorías principales"
        className="hidden lg:block border-t border-[#E9C5B3]/70 bg-[#FFF5E3]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 h-11">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative py-2 text-sm tracking-wide whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#5B3F35] ${
                      isActive
                        ? 'font-semibold text-[#5B3F35]'
                        : 'font-medium text-[#5B3F35]/80 hover:text-[#5B3F35]'
                    }`}
                  >
                    {category.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#AE7D6B]"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Menú desplegable en móvil */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menú móvil de categorías"
          className="lg:hidden border-t border-[#E9C5B3] bg-[#FFF5E3] px-4 py-3"
        >
          <ul className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(category.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#C29288] text-[#5B3F35] font-semibold'
                        : 'bg-[#FFFFFF] text-[#5B3F35] hover:bg-[#E9C5B3]/60'
                    }`}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};
