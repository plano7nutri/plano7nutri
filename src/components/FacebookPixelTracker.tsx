"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq: any;
  }
}

const FacebookPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.fbq) {
      // Dispara PageView em todas as páginas
      window.fbq('track', 'PageView');

      // Dispara Lead e Conversão Personalizada apenas na página de dashboard e apenas uma vez por sessão
      if (location.pathname === '/dashboard') {
        const leadSent = sessionStorage.getItem('fb_lead_sent');
        
        if (!leadSent) {
          // Evento padrão Lead
          window.fbq('track', 'Lead');
          
          // Evento personalizado solicitado
          window.fbq('trackCustom', 'Concluiu cadastro até o fim', { 
            conversion_id: '1303270535323644',
            content_name: 'Cadastro Grátis Finalizado'
          });
          
          sessionStorage.setItem('fb_lead_sent', 'true');
        }
      }
    }
  }, [location]);

  return null;
};

export default FacebookPixelTracker;