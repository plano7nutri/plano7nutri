import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Padroniza o número de WhatsApp para o formato 55DDDNÚMERO
 * Remove caracteres não numéricos e garante o prefixo 55
 */
export function formatWhatsApp(phone: string): string {
  let clean = phone.replace(/\D/g, "");
  
  // Se o número tiver 10 ou 11 dígitos (sem 55), adiciona o 55
  if (clean.length === 10 || clean.length === 11) {
    clean = "55" + clean;
  }
  
  // Se começar com +, o replace(/\D/g) já removeu
  // Retorna apenas se tiver o tamanho mínimo esperado de um número BR com 55
  return clean;
}