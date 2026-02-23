import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Padroniza o número de WhatsApp para o formato 55DDDNÚMERO
 * Remove caracteres não numéricos e garante o prefixo 55.
 */
export function formatWhatsApp(phone: string): string {
  let clean = phone.replace(/\D/g, "");
  
  if (clean.length === 0) return "";

  // Se o número não começa com 55, adicionamos o prefixo
  if (!clean.startsWith("55")) {
    clean = "55" + clean;
  }
  
  return clean;
}