"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ResumoPontuacao } from "./ResumoPontuacao";
import { RankingMembros } from "./RankingMembros";
import { RankingUnidades } from "./RankingUnidades";
import { RankingConselheiros } from "./RankingConselheiros";
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

      {/* Cards de Resumo */}
      <ResumoPontuacao />

      {/* Calendário */}
      <FullCalendarComponent 
        events={events} 
        loading={loading} 
        error={error}
        calendarId={calendarId}
      />

      {/* Rankings */}
      <div className="space-y-6">
        <RankingUnidades />
        <RankingConselheiros />
        <RankingMembros />
      </div>
    </div>
  );
}
