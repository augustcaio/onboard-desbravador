"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, Calendar } from "lucide-react";
import { PontuacaoFilters } from "./PontuacaoFilters";

interface PontuacaoData {
  id: string;
  data: string;
  membroId: string;
  membroNome: string;
  membroUnidade: string;
  kitEspiritual: number;
  lenco: number;
  pontualidade: number;
  cantil: number;
  bandeirim: number;
  uniformeDomingo: number;
  atividadeCartao: number;
  especialidade: number;
  presencaEventos: number;
  visita: number;
  dinamicas: number;
  indisciplina: number;
  xingamentos: number;
  ofensa: number;
  agressao: number;
  total: number;
}

export function PontuacaoList() {
  const [pontuacoes, setPontuacoes] = useState<PontuacaoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    async function fetchPontuacoes() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", pagination.page.toString());
        params.set("limit", pagination.limit.toString());
        
        if (filters.membroId) params.set("membroId", filters.membroId);
        if (filters.unidadeId) params.set("unidadeId", filters.unidadeId);
        if (filters.dataInicio) params.set("dataInicio", filters.dataInicio);
        if (filters.dataFim) params.set("dataFim", filters.dataFim);

        const res = await fetch(`/api/pontuacao?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPontuacoes(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Erro ao buscar pontuações:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPontuacoes();
  }, [filters, pagination.page, pagination.limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-BR");
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <PontuacaoFilters filters={filters} onFiltersChange={setFilters} />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <p className="text-sm text-muted-foreground">Total de Registros</p>
          <p className="text-2xl font-bold">{pagination.total}</p>
        </div>
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <p className="text-sm text-muted-foreground">Pontuação Total</p>
          <p className="text-2xl font-bold text-green-600">
            {formatNumber(pontuacoes.reduce((acc, p) => acc + p.total, 0))}
          </p>
        </div>
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <p className="text-sm text-muted-foreground">Média por Registro</p>
          <p className="text-2xl font-bold">
            {pagination.total > 0 
              ? formatNumber(Math.round(pontuacoes.reduce((acc, p) => acc + p.total, 0) / pontuacoes.length))
              : 0}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-3 text-sm font-medium">Data</th>
                <th className="text-left p-3 text-sm font-medium">Membro</th>
                <th className="text-left p-3 text-sm font-medium">Unidade</th>
                <th className="text-right p-3 text-sm font-medium">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : pontuacoes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Nenhuma pontuação encontrada
                  </td>
                </tr>
              ) : (
                pontuacoes.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(p.data)}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{p.membroNome}</td>
                    <td className="p-3 text-muted-foreground">{p.membroUnidade}</td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${p.total >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatNumber(p.total)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
              {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
