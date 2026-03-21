export interface MembroPontuacao {
  id: string;
  nome: string;
  unidade: string;
  totalPontos: number;
}

export interface ResumoPontuacao {
  totalMembros: number;
  totalPontos: number;
  mediaPontos: number;
  top3: MembroPontuacao[];
  unidadeLider?: string | null;
  conselheiroLider?: MembroPontuacao | null;
}

export interface PontuacaoFilters {
  unidadeId?: string;
  dataInicio?: string;
  dataFim?: string;
}
