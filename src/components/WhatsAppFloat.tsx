import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/catalog';

export const WhatsAppFloat: React.FC = () => {
  const defaultMessage = encodeURIComponent(
    '¡Hola Karisma Face & Body! Me gustaría recibir asesoría sobre sus productos originales.'
  );

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp con Karisma Face & Body (+57 310 6322876)"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 h-12 sm:h-13 px-4 sm:px-5 rounded-full bg-[#5B3F35] hover:bg-[#AE7D6B] text-[#FFF5E3] border border-[#E9C5B3]/40 shadow-lg transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#5B3F35]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline text-xs font-semibold tracking-wide whitespace-nowrap">
        Pide por WhatsApp
      </span>
    </a>
  );
};
