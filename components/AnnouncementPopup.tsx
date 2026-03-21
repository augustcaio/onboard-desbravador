"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  version: string;
  createdAt: string;
}

export function AnnouncementPopup() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hideFor7Days, setHideFor7Days] = useState(false);

  useEffect(() => {
    // Verificar se o usuário optou por ocultar por 7 dias
    const hideUntil = localStorage.getItem("announcementHideUntil");
    const now = new Date().getTime();

    if (hideUntil && parseInt(hideUntil) > now) {
      return; // Não mostrar, usuário optou por ocultar
    }

    fetchAnnouncements();

    function fetchAnnouncements() {
      fetch("/api/announcements")
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setAnnouncements(data);
            setIsOpen(true);
          }
        })
        .catch((err) => console.error("Erro ao buscar anúncios:", err));
    }
  }, []);

  const handleClose = () => {
    if (hideFor7Days) {
      // Ocultar por 7 dias (em milissegundos)
      const sevenDaysFromNow = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
      localStorage.setItem("announcementHideUntil", sevenDaysFromNow.toString());
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!isOpen || announcements.length === 0) return null;

  const announcement = announcements[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6">
      {/* Modal */}
      <div className="bg-black rounded-xl shadow-2xl border border-gray-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-semibold text-[#59e865] bg-[#59e865]/20 rounded-full uppercase tracking-wide">
              Novidade
            </span>
            <span className="text-xs text-gray-500">
              v{announcement.version}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2">
            {announcement.title}
          </h3>
          <div
            className="text-sm text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 p-4 border-t border-gray-800 bg-gray-900">
          {/* Navegação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1.5 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex gap-1.5 mx-2">
                {announcements.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-[#59e865] w-3"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={currentIndex === announcements.length - 1}
                className="p-1.5 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <button
              onClick={handleClose}
              className="text-xs font-medium text-[#59e865] hover:text-[#4ac856] transition-colors"
            >
              {currentIndex === announcements.length - 1 ? "Fechar" : "Próximo"}
            </button>
          </div>

          {/* Checkbox ocultar por 7 dias */}
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
            <input
              type="checkbox"
              checked={hideFor7Days}
              onChange={(e) => setHideFor7Days(e.target.checked)}
              className="rounded border-gray-700 bg-gray-800 text-[#59e865] focus:ring-[#59e865] focus:ring-offset-0 cursor-pointer"
            />
            Não mostrar este popup por 7 dias
          </label>
        </div>
      </div>
    </div>
  );
}
