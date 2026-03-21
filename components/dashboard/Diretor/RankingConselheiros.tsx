"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { UnidadeBadge } from "@/components/ui/UnidadeBadge";
import type { MembroPontuacao } from "./types";

const medalColors = [
  { bg: "from-yellow-400 to-yellow-600", border: "border-yellow-500", label: "1º" },
  { bg: "from-gray-300 to-gray-500", border: "border-gray-400", label: "2º" },
  { bg: "from-amber-600 to-amber-800", border: "border-amber-700", label: "3º" },
];

export function RankingConselheiros() {
  const [conselheiros, setConselheiros] = useState<MembroPontuacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      try {
        const res = await fetch("/api/membros/ranking-conselheiros");
        if (res.ok) {
          const json = await res.json();
          setConselheiros(json);
        }
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  const top3 = conselheiros.slice(0, 3);

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

  const getMedalIconLarge = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Trophy className="w-10 h-10 text-yellow-500" />;
      case 2:
        return <Medal className="w-10 h-10 text-gray-400" />;
      case 3:
        return <Award className="w-10 h-10 text-amber-600" />;
      default:
        return <Crown className="w-10 h-10 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Cards */}
      {!loading && top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((conselheiro, index) => (
            <div
              key={conselheiro.id}
              className={`relative bg-gradient-to-br ${medalColors[index].bg} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="absolute top-2 right-2 opacity-100 z-10">
                <UnidadeBadge nome={conselheiro.unidade} size="xl" />
              </div>
              
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getMedalIconLarge(index + 1)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm opacity-80 font-medium uppercase tracking-wider">
                    {medalColors[index].label} Lugar
                  </p>
                  <h3 className="text-xl font-bold truncate mt-1">
                    {conselheiro.nome}
                  </h3>
                  <p className="text-2xl font-bold mt-2">
                    {conselheiro.totalPontos.toLocaleString("pt-BR")} pts
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton for top 3 */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 animate-pulse h-40" />
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="bg-black rounded-lg border border-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Ranking de Conselheiros</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-800 bg-gray-900/50">
                <th className="text-left p-3 text-sm font-medium text-white">Posição</th>
                <th className="text-left p-3 text-sm font-medium text-white">Nome</th>
                <th className="text-center p-3 text-sm font-medium text-white">Unidade</th>
                <th className="text-right p-3 text-sm font-medium text-white">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : conselheiros.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    Nenhum conselheiro encontrado
                  </td>
                </tr>
              ) : (
                conselheiros.map((conselheiro, index) => (
                  <tr
                    key={conselheiro.id}
                    className={`border-t border-gray-800 transition-colors ${
                      index < 3 ? "bg-yellow-500/5 hover:bg-yellow-500/10" : "hover:bg-gray-900"
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index + 1)}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-white">
                      <span className={index === 0 ? "text-yellow-500" : ""}>
                        {conselheiro.nome}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <UnidadeBadge nome={conselheiro.unidade} size="md" />
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-white">
                      {conselheiro.totalPontos.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
