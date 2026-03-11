export type Role = "DIRETORIA" | "SECRETARIA" | "LIDERANCA" | "MEMBRO";

export const ROLES = {
  DIRETORIA: "DIRETORIA",
  SECRETARIA: "SECRETARIA",
  LIDERANCA: "LIDERANCA",
  MEMBRO: "MEMBRO",
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  DIRETORIA: "Diretoria",
  SECRETARIA: "Secretaria",
  LIDERANCA: "Liderança",
  MEMBRO: "Membro",
};

export type Cargo =
  | "DIRETOR"
  | "DIRETOR_ASSOCIADO"
  | "SECRETARIO"
  | "TESOUREIRO"
  | "INSTRUTOR"
  | "CAPELAO"
  | "CONSELHEIRO"
  | "CAPITAO"
  | "SECRETARIO_UNIDADE"
  | "TESOUREIRO_UNIDADE"
  | "ALMOXARIFE"
  | "DESBRAVADOR";

export const CARGOS: Record<Cargo, { label: string; role: Role }> = {
  // Diretoria
  DIRETOR: { label: "Diretor(a)", role: "DIRETORIA" },
  DIRETOR_ASSOCIADO: { label: "Diretor(a) Associado(a)", role: "DIRETORIA" },
  SECRETARIO: { label: "Secretário(a)", role: "SECRETARIA" },
  TESOUREIRO: { label: "Tesoureiro(a)", role: "DIRETORIA" },
  INSTRUTOR: { label: "Instrutor(a)", role: "DIRETORIA" },
  CAPELAO: { label: "Capelão", role: "DIRETORIA" },
  
  // Liderança de Unidade
  CONSELHEIRO: { label: "Conselheiro(a)", role: "LIDERANCA" },
  CAPITAO: { label: "Capitão(ã)", role: "LIDERANCA" },
  SECRETARIO_UNIDADE: { label: "Secretário(a) de Unidade", role: "LIDERANCA" },
  TESOUREIRO_UNIDADE: { label: "Tesoureiro(a) de Unidade", role: "LIDERANCA" },
  ALMOXARIFE: { label: "Almoxarife", role: "LIDERANCA" },
  
  // Membro comum
  DESBRAVADOR: { label: "Desbravador", role: "MEMBRO" },
};

export const CARGO_OPTIONS = Object.entries(CARGOS).map(([value, { label }]) => ({
  value,
  label,
}));

export function getCargoRole(cargo: Cargo): Role {
  return CARGOS[cargo].role;
}

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function canManageMembers(role: Role): boolean {
  return role === "DIRETORIA" || role === "SECRETARIA";
}

export function canManageScores(role: Role): boolean {
  return role === "DIRETORIA" || role === "SECRETARIA";
}
