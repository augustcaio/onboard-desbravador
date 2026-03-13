import { google, calendar_v3 } from 'googleapis';

// Cache para eventos (otimização) - ajustado para 1 minuto
const eventsCache = new Map<string, { events: CalendarEvent[]; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minuto

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string | null;
  location?: string | null;
}

// Função para obter eventos de um calendário específico (com cache)
export async function getSharedCalendarEvents(
  accessToken: string,
  calendarId: string,
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEvent[]> {
  const cacheKey = `${accessToken}-${calendarId}-${timeMin}-${timeMax}`;
  const cached = eventsCache.get(cacheKey);

  // Verificar cache válido (1 minuto)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached events for calendar ${calendarId}`);
    return cached.events;
  }

  try {
    const events = await getCalendarEvents(accessToken, calendarId, timeMin, timeMax);
    
    // Armazenar no cache
    eventsCache.set(cacheKey, {
      events,
      timestamp: Date.now(),
    });

    return events;
  } catch (error) {
    console.error('Error fetching shared calendar events:', error);
    throw error;
  }
}

// Função base para obter eventos de um calendário
export async function getCalendarEvents(
  accessToken: string,
  calendarId: string = 'primary',
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEvent[]> {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    // Default to current month if no range specified
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const timeMinFormatted = timeMin || startOfMonth.toISOString();
    const timeMaxFormatted = timeMax || endOfMonth.toISOString();

    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMinFormatted,
      timeMax: timeMaxFormatted,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events: calendar_v3.Schema$Event[] = response.data.items || [];

    return events.map((event) => ({
      id: event.id || '',
      title: event.summary || 'Sem título',
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      description: event.description,
      location: event.location,
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Failed to fetch calendar events');
  }
}