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

      // Dispara Lead apenas na página de dashboard (após o cadastro grátis)
      if (location.pathname === '/dashboard') {
        window.fbq('track', 'Lead');
      }
    }
  }, [location]);

  return null;
};

export default FacebookPixelTracker;