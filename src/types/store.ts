export type CategoryId =
  | 'inicio'
  | 'maquillaje'
  | 'accesorios'
  | 'capilares'
  | 'skin-care'
  | 'corporales'
  | 'ninos';

export type ProductCategoryId = Exclude<CategoryId, 'inicio'>;

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategoryId;
  price: number;
  shadeOrSpec: string;
  description: string;
  image: string;
  images?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock: boolean;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  targetCategory: CategoryId;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  apartmentComplement: string;
}

export interface ShippingQuote {
  cost: number;
  zoneName: string;
  estimatedDelivery: string;
}

/**
 * Arquitectura preparada para futura integración de pasarela de pagos (ej. Wompi, PSE, Tarjetas).
 */
export type PaymentMethodId = 'whatsapp-cod' | 'payment-gateway';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
  description: string;
  available: boolean;
}
