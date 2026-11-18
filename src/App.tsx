import React, { useMemo, useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from './data/catalog';
import type { CartItem, CategoryId, Product, ProductCategoryId } from './types/store';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ProductCarouselSection } from './components/ProductCarouselSection';
import { CategoryView } from './components/CategoryView';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';

const CART_STORAGE_KEY = 'karisma_cart_v1';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignorar si almacenamiento local no está disponible
    }
  }, [cartItems]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Filtrado en tiempo real por nombre, marca o tono
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.shadeOrSpec.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const bestSellers = useMemo(
    () => PRODUCTS.filter((p) => p.isBestSeller),
    []
  );

  const newArrivals = useMemo(
    () => PRODUCTS.filter((p) => p.isNew),
    []
  );

  const handleAddToCart = (product: Product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const isSearchingOnHome = activeCategory === 'inicio' && searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5E3] text-[#5B3F35]">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        onSelectProduct={setSelectedProduct}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {activeCategory === 'inicio' ? (
          <>
            {isSearchingOnHome ? (
              <section className="py-10 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-7 pb-4 border-b border-[#E9C5B3]">
                    <div>
                      <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[#5B3F35]">
                        Resultados para "{searchQuery}"
                      </h1>
                      <p className="text-sm text-[#5B3F35]/80 mt-1 tabular-nums">
                        {searchResults.length}{' '}
                        {searchResults.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-5 py-2.5 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] text-sm font-semibold transition-colors"
                    >
                      Ver página de inicio
                    </button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {searchResults.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={(p) => handleAddToCart(p, 1)}
                          onSelectProduct={setSelectedProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#FFFFFF] border border-[#E9C5B3] rounded-2xl p-10 text-center">
                      <p className="font-display text-2xl text-[#5B3F35] mb-2">
                        No encontramos coincidencias
                      </p>
                      <p className="text-sm text-[#5B3F35]/80">
                        Intenta buscando otro nombre como labial, máscara, sérum o brochas.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <>
                <HeroCarousel onNavigateCategory={setActiveCategory} />

                <ProductCarouselSection
                  title="Los más vendidos"
                  subtitle="Tus favoritos de siempre en maquillaje, cuidado facial y capilar original."
                  bannerTone="marron"
                  products={bestSellers}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onSelectProduct={setSelectedProduct}
                />

                <ProductCarouselSection
                  title="Productos nuevos"
                  subtitle="Recién llegados a Karisma para renovar tu rutina diaria con marcas originales."
                  bannerTone="nude"
                  products={newArrivals}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onSelectProduct={setSelectedProduct}
                />

                {/* Sección sobria de marcas originales y promesa de marca */}
                <section className="py-10">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#FFFFFF] border border-[#E9C5B3] rounded-2xl px-6 py-9 sm:px-10 sm:py-11 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                      <div className="max-w-xl">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#AE7D6B] mb-2">
                          Karisma Face &amp; Body · Medellín
                        </p>
                        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[#5B3F35] leading-tight mb-3 text-balance">
                          Realza tu belleza con productos originales
                        </h2>
                        <p className="text-sm text-[#5B3F35]/85 leading-relaxed">
                          Trabajamos con referencias 100% originales en Montoc, Atenea, Bloomshell,
                          Ani-K, Prosa, Girl Y, Vive Beauty y Schwarzkopf, con envíos en Medellín y
                          toda Colombia.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {CATEGORIES.filter((c) => c.id !== 'inicio').map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setActiveCategory(cat.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-4 py-2.5 rounded-full bg-[#FFF5E3] hover:bg-[#C29288] border border-[#E9C5B3] text-xs font-semibold text-[#5B3F35] transition-colors whitespace-nowrap"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        ) : (
          <CategoryView
            categoryId={activeCategory as ProductCategoryId}
            products={PRODUCTS}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={setSelectedProduct}
          />
        )}
      </main>

      <Footer onSelectCategory={setActiveCategory} />

      <WhatsAppFloat />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
