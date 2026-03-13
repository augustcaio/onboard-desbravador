"use client";

import { useState, useEffect } from "react";
import { CalendarEvent } from "@/lib/googleCalendar";
import { useSession } from "next-auth/react";

export function useCalendarEvents() {
  const { status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarId, setCalendarId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (status !== "authenticated") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setCalendarId(null);

        const response = await fetch("/api/calendar/events");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch calendar events");
        }

        setEvents(data.events || []);
        if (data.calendarId) {
          setCalendarId(data.calendarId);
        }
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar eventos do calendário");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [status]);

  return { events, loading, error, calendarId, refetch: () => {} };
}