import { Cargo, Role } from "@/types/cargo";

export interface Membro {
  id: string;
  nome: string;
  email: string | null;
  googleEmail: string | null;
  role: Role;
  cargo: Cargo;
  unidadeId: string;
  unidadeNome: string;
  image?: string | null;
  createdAt: Date;
}

export interface MembroFilters {
  search?: string;
  unidadeId?: string;
  cargo?: Cargo;
  role?: Role;
}

export interface CreateMembroInput {
  nome: string;
  googleEmail?: string;
  cargo: Cargo;
  role: Role;
  unidadeId: string;
  novaUnidade?: string;
}

export interface Unidade {
  id: string;
  nome: string;
}
