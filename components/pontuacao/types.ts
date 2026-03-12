import { Cargo, Role } from "@/types/cargo";

export interface Pontuacao {
  id: string;
  data: Date;
  membroId: string;
  membroNome: string;
  membroUnidade: string;
  
  // Pontuação Diária
  kitEspiritual: number;
  lenco: number;
  pontualidade: number;
  cantil: number;
  bandeirim: number;
  uniformeDomingo: number;
  
  // Pontuação Secundária
  atividadeCartao: number;
  especialidade: number;
  presencaEventos: number;
  visita: number;
  
  // Dinâmicas
  dinamicas: number;
  
  // Perda de Pontos
  indisciplina: number;
  xingamentos: number;
  ofensa: number;
  agressao: number;
  
  // Total calculado
  total: number;
}

export interface PontuacaoInput {
  membroId: string;
  data: string;
  kitEspiritual?: number;
  lenco?: number;
  pontualidade?: number;
  cantil?: number;
  bandeirim?: number;
  uniformeDomingo?: number;
  atividadeCartao?: number;
  especialidade?: number;
  presencaEventos?: number;
  visita?: number;
  dinamicas?: number;
  indisciplina?: number;
  xingamentos?: number;
  ofensa?: number;
  agressao?: number;
}

export interface PontuacaoFilters {
  membroId?: string;
  unidadeId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface MembroOption {
  id: string;
  nome: string;
  unidadeId: string;
  unidadeNome: string;
}
