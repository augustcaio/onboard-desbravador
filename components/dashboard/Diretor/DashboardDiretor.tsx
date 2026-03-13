"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ResumoPontuacao } from "./ResumoPontuacao";
import { RankingMembros } from "./RankingMembros";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { FullCalendarComponent } from "@/components/FullCalendarComponent";

export function DashboardDiretor() {
  const { data: session, status } = useSession();
  const { events, loading, error, calendarId } = useCalendarEvents();

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
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard do Diretor</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral das pontuações e atividades
        </p>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Calendário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendário */}
          <FullCalendarComponent 
            events={events} 
            loading={loading} 
            error={error}
            calendarId={calendarId}
          />

          {/* Ranking */}
          <RankingMembros />
        </div>

        {/* Coluna da direita - Resumo */}
        <div className="space-y-6">
          <ResumoPontuacao />

          {/* Membros Logados */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Membros Ativos</h2>
            <p className="text-sm text-muted-foreground">
              Visualização de membros online (em breve)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
