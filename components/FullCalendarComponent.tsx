"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarEvent } from "@/lib/googleCalendar";
import { EventPopup } from "./EventPopup";

interface FullCalendarComponentProps {
  events: CalendarEvent[];
  loading?: boolean;
  error?: string | null;
  calendarId?: string | null;
}

interface PopupEvent {
  title: string;
  start?: Date | null;
  end?: Date | null;
  description?: string | null;
  location?: string | null;
}

export function FullCalendarComponent({
  events,
  loading = false,
  error = null,
  calendarId = null,
}: FullCalendarComponentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PopupEvent | null>(null);

  // Detectar tamanho da tela para layout responsivo
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      description: event.description,
      location: event.location,
    },
  }));

  // Toolbar configurável baseada no tamanho da tela
  const headerToolbar = isMobile
    ? {
        left: "prev,next",
        center: "title",
        right: "today",
      }
    : {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-white rounded-lg shadow-md border border-border">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  // Exibir mensagem de erro inline se o calendário não for encontrado
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-border">
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium">
              Agenda não encontrada
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver eventos e não estiver carregando, exibir mensagem vazia
  if (calendarEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-border">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <svg className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-muted-foreground">Nenhum evento encontrado neste mês.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
      {/* Cabeçalho do calendário */}
      <div className="p-3 md:p-4 border-b border-border bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Agenda Quetzal
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {isMobile ? 'Toque nos botões para navegar' : 'Clique nos botões para navegar'}
          </div>
        </div>
      </div>

      {/* Calendário */}
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height="auto"
          headerToolbar={headerToolbar}
          locale="pt-br"
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            prev: 'Ant',
            next: 'Próx'
          }}
          buttonHints={{
            prev: 'Anterior',
            next: 'Próximo',
            today: 'Ir para hoje',
            dayGridMonth: 'Vista mensal',
            timeGridWeek: 'Vista semanal',
            timeGridDay: 'Vista diária'
          }}
          eventClick={(info) => {
            setSelectedEvent({
              title: info.event.title,
              start: info.event.start,
              end: info.event.end,
              description: info.event.extendedProps.description,
              location: info.event.extendedProps.location,
            });
            setPopupOpen(true);
          }}
          dayMaxEvents={isMobile}
          weekends={true}
          nowIndicator={true}
          firstDay={0} // Domingo como primeiro dia da semana
        />
      </div>

      {/* Footer com informações */}
      <div className="p-2 md:p-3 border-t border-border bg-gray-50/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>📅 {calendarEvents.length} evento(s) este mês</span>
          <span className="hidden sm:inline">💡 Dica: Clique em um evento para ver detalhes</span>
        </div>
      </div>

      {/* Popup de detalhes do evento */}
      <EventPopup
        isOpen={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent || { title: '' }}
      />
    </div>
  );
}