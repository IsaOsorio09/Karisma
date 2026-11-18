import React from 'react';
import { MapPin, Clock, Instagram, Phone, ShieldCheck } from 'lucide-react';
import { CATEGORIES, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../data/catalog';
import type { CategoryId } from '../types/store';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const handleNav = (id: CategoryId) => {
    onSelectCategory(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#5B3F35] text-[#FFF5E3] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-sm text-[#FFF5E3]/85 leading-relaxed">
              Realza tu belleza con productos originales. Tu tienda de maquillaje y cuidado personal
              en Medellín con envíos seguros a todo el país.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E9C5B3]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Productos Originales Garantizados</span>
            </div>
          </div>

          {/* Columna 2: Categorías */}
          <div>
            <h3 className="font-display font-semibold text-2xl text-[#FFF5E3] mb-4">
              Categorías
            </h3>
            <ul className="space-y-2 text-sm text-[#FFF5E3]/85">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(cat.id)}
                    className="hover:text-[#E9C5B3] transition-colors"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Punto físico y horarios */}
          <div>
            <h3 className="font-display font-semibold text-2xl text-[#FFF5E3] mb-4">
              Encuéntranos
            </h3>
            <ul className="space-y-3 text-sm text-[#FFF5E3]/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E9C5B3] shrink-0 mt-0.5" />
                <span>Cra. 43A # 14-27, El Poblado, Medellín, Antioquia</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#E9C5B3] shrink-0 mt-0.5" />
                <span>Lunes a sábado: 9:00 a. m. – 7:00 p. m.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#E9C5B3] shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E9C5B3] transition-colors tabular-nums"
                >
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 text-[#E9C5B3] shrink-0 mt-0.5" />
                <a
                  href="https://instagram.com/karismafacebody"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E9C5B3] transition-colors"
                >
                  @karismafacebody
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Políticas básicas y envíos */}
          <div>
            <h3 className="font-display font-semibold text-2xl text-[#FFF5E3] mb-4">
              Envíos y Políticas
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FFF5E3]/80 leading-relaxed">
              <li>
                <strong className="text-[#E9C5B3] font-medium">Área Metropolitana:</strong> Medellín,
                Envigado, Itagüí, Sabaneta y Bello ($10.000). Caldas, La Estrella y Niquía ($13.000).
              </li>
              <li>
                <strong className="text-[#E9C5B3] font-medium">Envíos Nacionales:</strong> Resto del
                país ($18.000) con entrega de 2 a 4 días hábiles.
              </li>
              <li>
                <strong className="text-[#E9C5B3] font-medium">Cambios y Garantía:</strong> Aplica
                dentro de los 5 días hábiles siguientes si el producto llega averiado o sellado sin
                uso.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#FFF5E3]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFF5E3]/70">
          <p>© {new Date().getFullYear()} Karisma Face &amp; Body · Medellín, Colombia.</p>
          <p>Montoc · Atenea · Bloomshell · Ani-K · Prosa · Girl Y · Vive Beauty · Schwarzkopf</p>
        </div>
      </div>
    </footer>
  );
};
