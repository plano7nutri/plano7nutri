import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Padroniza o número de WhatsApp para o formato 55DDDNÚMERO
 * Apenas remove caracteres não numéricos e garante o prefixo 55.
 * Não adiciona o dígito 9 automaticamente.
 */
export function formatWhatsApp(phone: string): string {
  let clean = phone.replace(/\D/g, "");
  
  if (clean.length === 0) return "";

  // Se o número tiver 10 ou 11 dígitos e não começar com 55, adicionamos o 55 do Brasil
  // Mas não alteramos os dígitos internos (não forçamos o 9)
  if ((clean.length === 10 || clean.length === 11) && !clean.startsWith("55")) {
    clean = "55" + clean;
  }
  
  return clean;
}