import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Limpa o número de WhatsApp mantendo apenas os dígitos.
 * Não adiciona prefixos (como 55) nem altera a estrutura do número (como o 9º dígito).
 */
export function formatWhatsApp(phone: string): string {
  // Apenas remove caracteres não numéricos
  return phone.replace(/\D/g, "");
}