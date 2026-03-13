import { GoogleCalendarEmbed } from "@/components/GoogleCalendarEmbed";

export default function CalendarioPage() {
  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "";

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Calendário de Atividades
      </h1>
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
        <GoogleCalendarEmbed 
          calendarId={CALENDAR_ID} 
          height="500px"
          mode="month"
        />
      </div>
    </div>
  );
}
