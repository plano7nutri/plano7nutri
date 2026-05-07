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

      // Dispara Lead apenas na página de dashboard e apenas uma vez por sessão
      if (location.pathname === '/dashboard') {
        const leadSent = sessionStorage.getItem('fb_lead_sent');
        
        if (!leadSent) {
          window.fbq('track', 'Lead');
          sessionStorage.setItem('fb_lead_sent', 'true');
        }
      }
    }
  }, [location]);

  return null;
};

export default FacebookPixelTracker;