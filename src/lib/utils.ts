import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Limpa e padroniza o número de WhatsApp.
 * Garante o prefixo 55 e remove caracteres especiais.
 */
export function formatWhatsApp(phone: string): string {
  if (!phone) return "";
  
  // Remove tudo que não for número
  const numero = phone.replace(/\D/g, "");
  
  if (numero.length === 0) return "";

  // Se o número tem 10 ou 11 dígitos (DDD + 8 ou 9 números), adicionamos o 55.
  if (numero.length === 10 || numero.length === 11) {
    return "55" + numero;
  }
  
  // Se já tem o prefixo 55 (12 ou 13 dígitos), retorna como está
  if (numero.length >= 12 && numero.startsWith("55")) {
    return numero;
  }

  return numero;
}