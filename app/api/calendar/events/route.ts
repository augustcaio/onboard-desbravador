import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSharedCalendarEvents } from "@/lib/googleCalendar";

interface GoogleApiError extends Error {
  response?: {
    status: number;
  };
}

// ID do calendário compartilhado (configurado via ambiente)
const SHARED_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the access token from the session
    const accessToken = (session.user as { accessToken?: string }).accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    // Verificar se o ID do calendário está configurado
    if (!SHARED_CALENDAR_ID) {
      return NextResponse.json(
        { error: "Calendário não configurado. Entre em contato com o administrador." },
        { status: 500 }
      );
    }

    // Get current month events from shared calendar
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const events = await getSharedCalendarEvents(
      accessToken,
      SHARED_CALENDAR_ID,
      startOfMonth.toISOString(),
      endOfMonth.toISOString()
    );

    return NextResponse.json({ 
      events, 
      calendarId: SHARED_CALENDAR_ID
    });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    
    // Tratar erros específicos da API do Google
    if (error instanceof Error) {
      const googleError = error as GoogleApiError;
      if (googleError.response?.status === 403 || googleError.response?.status === 404) {
        return NextResponse.json(
          { 
            error: "Não foi possível acessar o calendário compartilhado. Verifique se você tem permissão para visualizar este calendário.",
            calendarId: SHARED_CALENDAR_ID
          },
          { status: googleError.response.status }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}