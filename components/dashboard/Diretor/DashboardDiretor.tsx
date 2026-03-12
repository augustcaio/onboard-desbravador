"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ResumoPontuacao } from "./ResumoPontuacao";
import { RankingMembros } from "./RankingMembros";

export function DashboardDiretor() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session || session.user?.role !== "DIRETORIA") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard do Diretor</h1>
        <p className="text-muted-foreground">
          Visão geral das pontuações dos desbravadores
        </p>
      </div>

      <ResumoPontuacao />
      <RankingMembros />
    </div>
  );
}
