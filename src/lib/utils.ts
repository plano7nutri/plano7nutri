import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Limpa e padroniza o número de WhatsApp para o fluxo geral.
 */
export function formatWhatsApp(phone: string): string {
  if (!phone) return "";
  
  const numero = phone.replace(/\D/g, "");
  
  if (numero.length === 0) return "";

  if (numero.length === 10 || numero.length === 11) {
    return "55" + numero;
  }
  
  if (numero.length >= 12 && numero.startsWith("55")) {
    return numero;
  }

  return numero;
}

/**
 * Formata o telefone para a coluna telefone_cadastro (Plano Pago).
 * Garante o prefixo 55 e preserva o restante exatamente como digitado pelo cliente.
 */
export function formatTelefoneCadastro(phone: string): string {
  if (!phone) return "";
  
  // Remove apenas caracteres não numéricos
  const numero = phone.replace(/\D/g, "");
  
  if (numero.length === 0) return "";

  // Se já começa com 55, retorna como está. Se não, adiciona o 55.
  if (numero.startsWith("55")) {
    return numero;
  }

  return "55" + numero;
}