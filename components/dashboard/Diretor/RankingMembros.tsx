"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Search } from "lucide-react";
import type { MembroPontuacao, PontuacaoFilters } from "./types";

export function RankingMembros() {
  const [membros, setMembros] = useState<MembroPontuacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PontuacaoFilters>({});

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.unidadeId) params.set("unidadeId", filters.unidadeId);
        if (filters.dataInicio) params.set("dataInicio", filters.dataInicio);
        if (filters.dataFim) params.set("dataFim", filters.dataFim);

        const res = await fetch(`/api/membros/ranking?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setMembros(json);
        }
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, [filters]);

  const getMedalIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground w-5 text-center">{posicao}</span>;
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Ranking de Membros</h2>
      </div>

      {/* Filtros */}
      <div className="p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-muted-foreground mb-1 block">
            Data Início
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-md border bg-background"
            onChange={(e) =>
              setFilters((f) => ({ ...f, dataInicio: e.target.value || undefined }))
            }
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-muted-foreground mb-1 block">
            Data Fim
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-md border bg-background"
            onChange={(e) =>
              setFilters((f) => ({ ...f, dataFim: e.target.value || undefined }))
            }
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t bg-muted/50">
              <th className="text-left p-3 text-sm font-medium">Posição</th>
              <th className="text-left p-3 text-sm font-medium">Nome</th>
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
            ) : membros.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  Nenhum membro encontrado
                </td>
              </tr>
            ) : (
              membros.map((membro, index) => (
                <tr
                  key={membro.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {getMedalIcon(index + 1)}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{membro.nome}</td>
                  <td className="p-3 text-muted-foreground">{membro.unidade}</td>
                  <td className="p-3 text-right font-bold">
                    {membro.totalPontos.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
