"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, TrendingUp, Award } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
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
      subtitle: data?.top3?.[0]?.unidade ?? "",
      icon: Award,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-card rounded-lg p-6 border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold mt-2">
              {typeof card.value === "number"
                ? card.value.toLocaleString("pt-BR")
                : card.value}
            </p>
            {card.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
