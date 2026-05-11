import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar o timer de oferta de 24 horas sincronizado.
 * @param createdAt Data opcional de referência (ex: data de cadastro do usuário)
 */
export function useOfferTimer(createdAt?: string) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      let startTime: number;
      
      if (createdAt) {
        // Se temos uma data de criação (Dashboard), usamos ela como âncora
        startTime = new Date(createdAt).getTime();
      } else {
        // Caso contrário (Landing/Vendas), usamos o primeiro acesso armazenado
        const stored = localStorage.getItem('plano7_offer_start_v1');
        if (stored) {
          startTime = parseInt(stored);
        } else {
          startTime = Date.now();
          localStorage.setItem('plano7_offer_start_v1', startTime.toString());
        }
      }

      const endTime = startTime + (24 * 60 * 60 * 1000); // 24 horas
      const diff = endTime - Date.now();
      
      // Garante que o tempo não seja negativo
      setTimeLeft(Math.max(0, diff));
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return timeLeft;
}