"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, TrendingUp, Award, Target, Crown } from "lucide-react";
import { UnidadeBadge } from "@/components/ui/UnidadeBadge";
import type { ResumoPontuacao } from "./types";

export function ResumoPontuacao() {
  const [data, setData] = useState<ResumoPontuacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumo() {
      try {
        const res = await fetch("/api/pontuacao/resumo");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Erro ao buscar resumo:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResumo();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-black rounded-lg p-6 border border-gray-800 animate-pulse">
            <div className="h-4 bg-gray-900 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-900 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards: Array<{
    title: string;
    value?: string | number | null;
    subtitle?: string | null;
    unidadeBadge?: string | null;
    icon: any;
    color: string;
  }> = [
    {
      title: "Total de Membros",
      value: data?.totalMembros ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Pontuação Total",
      value: data?.totalPontos ?? 0,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      title: "Média por Membro",
      value: data?.mediaPontos ?? 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Líder do Ranking",
      value: data?.top3?.[0]?.nome ?? "-",
      unidadeBadge: data?.top3?.[0]?.unidade ?? null,
      icon: Award,
      color: "text-purple-500",
    },
    {
      title: "Conselheiro Líder",
      value: data?.conselheiroLider?.nome ?? "-",
      unidadeBadge: data?.conselheiroLider?.unidade ?? null,
      icon: Crown,
      color: "text-amber-500",
    },
    {
      title: "Unidade Líder",
      unidadeBadge: data?.unidadeLider ?? null,
      subtitle: "Unidade com maior pontuação",
      icon: Target,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-black rounded-lg p-6 border border-gray-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{card.title}</p>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            
            {card.unidadeBadge ? (
              <div className="flex items-center gap-3 mt-2">
                {card.value && (
                  <p className="text-2xl font-bold text-white">
                    {typeof card.value === "number"
                      ? card.value.toLocaleString("pt-BR")
                      : card.value}
                  </p>
                )}
                <UnidadeBadge nome={card.unidadeBadge} size="lg" />
              </div>
            ) : (
              <p className="text-2xl font-bold mt-2 text-white">
                {typeof card.value === "number"
                  ? card.value.toLocaleString("pt-BR")
                  : card.value}
              </p>
            )}
            
            {card.subtitle && (
              <p className="text-xs text-gray-400 mt-1">
                {card.subtitle}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
