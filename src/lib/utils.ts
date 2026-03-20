import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Regra estrita: Limpa caracteres não numéricos e garante o prefixo 55.
 * NÃO adiciona nem remove o dígito 9.
 * Preserva exatamente o que o usuário digitou após o prefixo.
 */
export function formatWhatsApp(phone: string): string {
  if (!phone) return "";
  
  // 1. Remove tudo que não for número
  let numero = phone.replace(/\D/g, "");
  
  // 2. Se o número já começar com 55, retornamos ele limpo.
  // Caso contrário, adicionamos o 55 na frente.
  if (!numero.startsWith("55") && numero.length > 0) {
    numero = "55" + numero;
  }
  
  return numero;
}