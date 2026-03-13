"use client";

import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { FullCalendarComponent } from "@/components/FullCalendarComponent";

export default function CalendarioPage() {
  const { events, loading, error, calendarId } = useCalendarEvents();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Calendário de Atividades
      </h1>
      <FullCalendarComponent 
        events={events} 
        loading={loading} 
        error={error}
        calendarId={calendarId}
      />
    </div>
  );
}
