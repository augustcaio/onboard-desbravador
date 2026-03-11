export type Role = "DESBRAVADOR" | "SECRETARIA" | "DIRETORIA";

export const ROLES = {
  DESBRAVADOR: "DESBRAVADOR",
  SECRETARIA: "SECRETARIA",
  DIRETORIA: "DIRETORIA",
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  DESBRAVADOR: "Desbravador",
  SECRETARIA: "Secretaria",
  DIRETORIA: "Diretoria",
};

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function isSecretariaOrDiretoria(role: Role): boolean {
  return role === "SECRETARIA" || role === "DIRETORIA";
}
