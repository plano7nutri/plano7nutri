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
  const numero = phone.replace(/\D/g, "");
  
  if (numero.length === 0) return "";

  // 2. Se o número tem 10 ou 11 dígitos (DDD + 8 ou 9 números), adicionamos o 55.
  // Ex: 1188887777 (10) -> 551188887777 (12)
  // Ex: 11988887777 (11) -> 5511988887777 (13)
  if (numero.length === 10 || numero.length === 11) {
    return "55" + numero;
  }
  
  // 3. Se já tem 12 ou 13 dígitos, assumimos que já tem o 55 e retornamos como está.
  // Isso evita que o sistema adicione 55 novamente ou tente "corrigir" o que já está certo.
  return numero;
}