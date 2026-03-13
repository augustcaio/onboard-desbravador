"use client";

interface GoogleCalendarEmbedProps {
  calendarId: string;
  height?: string;
  mode?: "week" | "month" | "agenda";
  showNav?: boolean;
  showTitle?: boolean;
}

export function GoogleCalendarEmbed({
  calendarId,
  height = "600px",
  mode = "month",
  showNav = true,
  showTitle = true,
}: GoogleCalendarEmbedProps) {
  const baseUrl = "https://calendar.google.com/calendar/embed";
  const params = new URLSearchParams({
    src: calendarId,
    ctz: "America/Sao_Paulo",
    mode: mode,
    showNav: showNav ? "1" : "0",
    showTitle: showTitle ? "1" : "0",
  });

  return (
    <div className="w-full">
      <iframe
        src={`${baseUrl}?${params.toString()}`}
        style={{ border: 0, width: '100%', height }}
        frameBorder="0"
        scrolling="no"
        className="rounded-lg shadow-md"
        title="Calendário Clube Quetzal"
      />
    </div>
  );
}
