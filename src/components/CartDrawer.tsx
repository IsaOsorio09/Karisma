import React, { useMemo, useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
  MessageCircle,
  Lock,
} from 'lucide-react';
import {
  DEPARTAMENTOS_COLOMBIA,
  MUNICIPIOS_SUGERIDOS,
  PAYMENT_METHODS,
  buildWhatsAppOrderUrl,
  calculateShipping,
  formatCOP,
} from '../data/catalog';
import type { CartItem, CheckoutFormData, PaymentMethodId } from '../types/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'confirmed';

const INITIAL_FORM: CheckoutFormData = {
  fullName: '',
  phone: '',
  department: 'Antioquia',
  municipality: '',
  address: '',
  apartmentComplement: '',
};

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('whatsapp-cod');
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [confirmedUrl, setConfirmedUrl] = useState<string>('');
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  // El domicilio NO se calcula ni se suma hasta que se ingresen municipio y dirección
  const shippingQuote = useMemo(
    () => calculateShipping(form.municipality, form.address),
    [form.municipality, form.address]
  );

  const totalWithShipping = shippingQuote ? subtotal + shippingQuote.cost : subtotal;

  if (!isOpen) return null;

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedUrl('');
    }
    onClose();
  };

  const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCheckout = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (form.fullName.trim().length < 3) {
      nextErrors.fullName = 'Ingresa tu nombre completo.';
    }
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 7) {
      nextErrors.phone = 'Ingresa un número de celular válido.';
    }
    if (!form.department.trim()) {
      nextErrors.department = 'Selecciona un departamento.';
    }
    if (form.municipality.trim().length < 2) {
      nextErrors.municipality = 'Ingresa tu municipio o ciudad.';
    }
    if (form.address.trim().length < 5) {
      nextErrors.address = 'Ingresa tu dirección exacta de entrega.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFinalizeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckout() || !shippingQuote || items.length === 0) return;

    const whatsappUrl = buildWhatsAppOrderUrl(items, form, subtotal, shippingQuote);
    setConfirmedUrl(whatsappUrl);
    setConfirmedTotal(subtotal + shippingQuote.cost);
    setStep('confirmed');

    // Redirección limpia mediante elemento <a> sintético (evita window.open)
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinishAndReset = () => {
    onClearCart();
    setForm(INITIAL_FORM);
    setStep('cart');
    setConfirmedUrl('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#5B3F35]/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras y pago"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFF5E3] h-full flex flex-col shadow-2xl border-l border-[#E9C5B3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del panel */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FFFFFF] border-b border-[#E9C5B3]">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Volver al carrito"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#FFF5E3] text-[#5B3F35] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="font-display font-semibold text-2xl text-[#5B3F35] leading-none">
                {step === 'cart' && 'Tu Carrito'}
                {step === 'checkout' && 'Datos de Entrega'}
                {step === 'confirmed' && 'Pedido Listo'}
              </h2>
              <p className="text-xs text-[#AE7D6B] mt-1">
                {step === 'cart' && `${items.reduce((acc, i) => acc + i.quantity, 0)} productos`}
                {step === 'checkout' && 'Calculamos tu domicilio al completar municipio y dirección'}
                {step === 'confirmed' && 'Confirmación preparada para WhatsApp'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar carrito"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#FFF5E3] text-[#5B3F35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido principal scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-14">
                  <div className="w-16 h-16 rounded-full bg-[#E9C5B3]/60 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-[#5B3F35]" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-[#5B3F35] mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-sm text-[#5B3F35]/80 max-w-xs mb-6">
                    Explora nuestras categorías y elige tus productos originales favoritos.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] font-semibold text-sm transition-colors"
                  >
                    Seguir explorando
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex gap-4 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E9C5B3]/70"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover bg-[#FFFFFF] border border-[#FFF5E3] shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-[#AE7D6B]">
                              {product.brand}
                            </p>
                            <h3 className="text-sm font-semibold text-[#5B3F35] truncate">
                              {product.name}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            aria-label={`Eliminar ${product.name}`}
                            className="p-1.5 text-[#5B3F35]/60 hover:text-[#5B3F35] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center rounded-full bg-[#FFF5E3] border border-[#E9C5B3]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, -1)}
                              aria-label={`Disminuir cantidad de ${product.name}`}
                              className="w-8 h-8 inline-flex items-center justify-center text-[#5B3F35] hover:bg-[#E9C5B3]/50 rounded-l-full"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-[#5B3F35] tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, 1)}
                              aria-label={`Aumentar cantidad de ${product.name}`}
                              className="w-8 h-8 inline-flex items-center justify-center text-[#5B3F35] hover:bg-[#E9C5B3]/50 rounded-r-full"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#5B3F35] tabular-nums">
                            {formatCOP(product.price * quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="karisma-checkout-form" onSubmit={handleFinalizeOrder} noValidate className="space-y-4">
              {/* Nombre completo */}
              <div>
                <label
                  htmlFor="checkout-fullName"
                  className="block text-xs font-semibold text-[#5B3F35] mb-1.5"
                >
                  Nombre completo *
                </label>
                <input
                  id="checkout-fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="Ej. Laura Gómez Restrepo"
                  className="w-full h-11 px-4 rounded-xl bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/45 focus:outline-none focus:border-[#AE7D6B]"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs font-medium text-[#AE7D6B]">{errors.fullName}</p>
                )}
              </div>

              {/* Celular */}
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-[#5B3F35] mb-1.5"
                >
                  Número de celular *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="Ej. 310 632 2876"
                  className="w-full h-11 px-4 rounded-xl bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/45 focus:outline-none focus:border-[#AE7D6B]"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs font-medium text-[#AE7D6B]">{errors.phone}</p>
                )}
              </div>

              {/* Departamento y Municipio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="checkout-department"
                    className="block text-xs font-semibold text-[#5B3F35] mb-1.5"
                  >
                    Departamento *
                  </label>
                  <select
                    id="checkout-department"
                    required
                    value={form.department}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] focus:outline-none focus:border-[#AE7D6B]"
                  >
                    {DEPARTAMENTOS_COLOMBIA.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-xs font-medium text-[#AE7D6B]">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-municipality"
                    className="block text-xs font-semibold text-[#5B3F35] mb-1.5"
                  >
                    Municipio / Ciudad *
                  </label>
                  <input
                    id="checkout-municipality"
                    type="text"
                    required
                    list="municipios-colombia"
                    value={form.municipality}
                    onChange={(e) => handleFieldChange('municipality', e.target.value)}
                    placeholder="Ej. Medellín, Envigado..."
                    className="w-full h-11 px-4 rounded-xl bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/45 focus:outline-none focus:border-[#AE7D6B]"
                  />
                  <datalist id="municipios-colombia">
                    {MUNICIPIOS_SUGERIDOS.map((mun) => (
                      <option key={mun} value={mun} />
                    ))}
                  </datalist>
                  {errors.municipality && (
                    <p className="mt-1 text-xs font-medium text-[#AE7D6B]">
                      {errors.municipality}
                    </p>
                  )}
                </div>
              </div>

              {/* Dirección exacta */}
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-[#5B3F35] mb-1.5"
                >
                  Dirección exacta *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Ej. Cra 43A # 14-27"
                  className="w-full h-11 px-4 rounded-xl bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/45 focus:outline-none focus:border-[#AE7D6B]"
                />
                {errors.address && (
                  <p className="mt-1 text-xs font-medium text-[#AE7D6B]">{errors.address}</p>
                )}
              </div>

              {/* Apartamento / casa / interior (opcional) */}
              <div>
                <label
                  htmlFor="checkout-apartment"
                  className="block text-xs font-semibold text-[#5B3F35] mb-1.5"
                >
                  Número de apartamento, casa o interior (opcional)
                </label>
                <input
                  id="checkout-apartment"
                  type="text"
                  value={form.apartmentComplement}
                  onChange={(e) => handleFieldChange('apartmentComplement', e.target.value)}
                  placeholder="Ej. Apto 502, Torre 2, Unidad Los Laureles"
                  className="w-full h-11 px-4 rounded-xl bg-[#FFFFFF] border border-[#E9C5B3] text-sm text-[#5B3F35] placeholder:text-[#5B3F35]/45 focus:outline-none focus:border-[#AE7D6B]"
                />
              </div>

              {/* Aviso dinámico de cálculo de domicilio */}
              {!shippingQuote ? (
                <div className="p-4 rounded-xl bg-[#E9C5B3]/45 border border-[#E9C5B3] flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#5B3F35] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5B3F35] leading-relaxed">
                    Ingresa tu <strong>municipio</strong> y tu <strong>dirección exacta</strong> para
                    calcular automáticamente el valor de tu domicilio.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#AE7D6B]/60 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#AE7D6B] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#5B3F35]">
                    <p className="font-semibold">
                      Domicilio calculado: {formatCOP(shippingQuote.cost)}
                    </p>
                    <p className="text-[#5B3F35]/80 mt-0.5">
                      {shippingQuote.zoneName} · {shippingQuote.estimatedDelivery}
                    </p>
                  </div>
                </div>
              )}

              {/* Preparación visual/lógica para Pasarela de Pagos */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-[#5B3F35] mb-2">Método de pago</p>
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${
                          !method.available
                            ? 'bg-[#FFFFFF]/60 border-[#E9C5B3]/60 opacity-65 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#FFFFFF] border-[#AE7D6B] cursor-pointer'
                              : 'bg-[#FFFFFF] border-[#E9C5B3] cursor-pointer'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={isSelected}
                          disabled={!method.available}
                          onChange={() => method.available && setPaymentMethod(method.id)}
                          className="mt-1 accent-[#5B3F35]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#5B3F35]">
                              {method.label}
                            </span>
                            {!method.available && <Lock className="w-3.5 h-3.5 text-[#AE7D6B] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#5B3F35]/75 mt-1 leading-relaxed">
                            {method.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="py-6 space-y-6">
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9C5B3] text-center">
                <CheckCircle2 className="w-12 h-12 text-[#AE7D6B] mx-auto mb-3" />
                <h3 className="font-display font-semibold text-3xl text-[#5B3F35] mb-2">
                  ¡Tu pedido está listo!
                </h3>
                <p className="text-sm text-[#5B3F35]/85 leading-relaxed mb-5">
                  Si WhatsApp no se abrió automáticamente, presiona el botón de abajo para enviarnos tu
                  resumen y coordinar la entrega.
                </p>

                <a
                  href={confirmedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[46px] px-6 py-3 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar pedido por WhatsApp</span>
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E9C5B3] text-xs text-[#5B3F35] space-y-2">
                <p className="font-semibold text-sm mb-2">Resumen del envío</p>
                <p>
                  <strong>Cliente:</strong> {form.fullName} ({form.phone})
                </p>
                <p>
                  <strong>Destino:</strong> {form.municipality}, {form.department}
                </p>
                <p>
                  <strong>Dirección:</strong> {form.address}
                  {form.apartmentComplement ? ` · ${form.apartmentComplement}` : ''}
                </p>
                <p className="pt-2 border-t border-[#FFF5E3] text-sm font-semibold tabular-nums">
                  Total a pagar: {formatCOP(confirmedTotal)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinishAndReset}
                className="w-full py-3 rounded-full border border-[#AE7D6B] text-[#5B3F35] text-sm font-medium hover:bg-[#E9C5B3]/40 transition-colors"
              >
                Vaciar carrito y volver a la tienda
              </button>
            </div>
          )}
        </div>

        {/* Pie fijo del carrito con totales y acción principal */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 bg-[#FFFFFF] border-t border-[#E9C5B3] space-y-3">
            <div className="flex items-center justify-between text-sm text-[#5B3F35]">
              <span>Subtotal productos</span>
              <span className="font-semibold tabular-nums">{formatCOP(subtotal)}</span>
            </div>

            {/* Regla estricta: el domicilio SOLO se muestra y se suma tras ingresar municipio y dirección */}
            {step === 'checkout' && shippingQuote && (
              <div className="flex items-center justify-between text-sm text-[#5B3F35]">
                <span>Domicilio ({form.municipality.trim()})</span>
                <span className="font-semibold tabular-nums">{formatCOP(shippingQuote.cost)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2.5 border-t border-[#FFF5E3] text-base font-semibold text-[#5B3F35]">
              <span>{step === 'checkout' && shippingQuote ? 'Total a pagar' : 'Subtotal'}</span>
              <span className="text-lg tabular-nums">
                {formatCOP(step === 'checkout' ? totalWithShipping : subtotal)}
              </span>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full min-h-[48px] px-6 py-3 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] font-semibold text-sm transition-colors"
              >
                Continuar con el pedido
              </button>
            ) : (
              <button
                type="submit"
                form="karisma-checkout-form"
                className="w-full min-h-[48px] px-6 py-3 rounded-full bg-[#C29288] hover:bg-[#AE7D6B] text-[#5B3F35] hover:text-[#FFF5E3] font-semibold text-sm transition-colors"
              >
                Finalizar compra
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
