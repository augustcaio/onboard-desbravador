import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const unidadeBadges: Record<string, string> = {
  "Águia": "/unid_aguia.png",
  "Falcão": "/unid_falcao.png",
  "Pardal": "/unid_pardal.png",
  "Quetzal": "/unid_quetzal.png",
};

export function getUnidadeBadge(nome: string): string {
  return unidadeBadges[nome] || "/unid_falcao.png";
}
