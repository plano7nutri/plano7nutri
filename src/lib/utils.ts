import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Regra: Limpa, remove zero inicial e garante prefixo 55.
 * Jamais adiciona ou remove o dígito 9.
 * Se entrar 12 dígitos (55 + DDD + 8 números), sai 12.
 * Se entrar 13 dígitos (55 + DDD + 9 números), sai 13.
 */
export function formatWhatsApp(phone: string): string {
  if (!phone) return "";
  
  // 1. Remove tudo que não for número
  let numero = phone.replace(/\D/g, "");
  
  // 2. Remove zero do início se houver (evita 011...)
  numero = numero.replace(/^0+/, "");
  
  // 3. Se NÃO começar com 55, adiciona 55 no início
  if (!numero.startsWith("55") && numero.length > 0) {
    numero = "55" + numero;
  }
  
  return numero;
}