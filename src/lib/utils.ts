import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Regra: Limpa, remove zero inicial e garante prefixo 55.
 * Jamais adiciona ou remove o dígito 9.
 */
export function formatWhatsApp(phone: string): string {
  if (!phone) return "";
  
  // 1. Remove tudo que não for número
  let numero = phone.replace(/\D/g, "");
  
  // 2. Remove zero do início se houver
  numero = numero.replace(/^0+/, "");
  
  // 3. Se NÃO começar com 55, adiciona 55 no início
  if (!numero.startsWith("55") && numero.length > 0) {
    numero = "55" + numero;
  }
  
  return numero;
}