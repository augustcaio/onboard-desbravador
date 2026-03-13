"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  version: string;
  createdAt: string;
}

export function AnnouncementPopup() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [viewedAnnouncements, setViewedAnnouncements] = useState<string[]>([]);

  // Efeito 1: Carregar viewedAnnouncements do localStorage (executa apenas na montagem)
  useEffect(() => {
    const stored = localStorage.getItem("viewedAnnouncements");
    if (stored) {
      setViewedAnnouncements(JSON.parse(stored));
    }
  }, []);

  // Efeito 2: Buscar anúncios da API (depende de viewedAnnouncements)
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/announcements");
        if (response.ok) {
          const data = await response.json();
          // Filtrar anúncios não visualizados
          const newAnnouncements = data.filter(
            (a: Announcement) => !viewedAnnouncements.includes(a.id)
          );
          setAnnouncements(newAnnouncements);
          if (newAnnouncements.length > 0) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    };

    fetchAnnouncements();
  }, [viewedAnnouncements]);

  const handleClose = () => {
    // Marcar anúncio atual como visualizado
    if (announcements[currentAnnouncementIndex]) {
      const newViewed = [
        ...viewedAnnouncements,
        announcements[currentAnnouncementIndex].id,
      ];
      setViewedAnnouncements(newViewed);
      localStorage.setItem("viewedAnnouncements", JSON.stringify(newViewed));
    }

    // Ir para próximo anúncio ou fechar popup
    if (currentAnnouncementIndex < announcements.length - 1) {
      setCurrentAnnouncementIndex(currentAnnouncementIndex + 1);
    } else {
      setIsOpen(false);
      setCurrentAnnouncementIndex(0);
    }
  };

  const handleSkipAll = () => {
    // Marcar todos os anúncios como visualizados
    const allIds = announcements.map((a) => a.id);
    const newViewed = [...viewedAnnouncements, ...allIds];
    setViewedAnnouncements(newViewed);
    localStorage.setItem("viewedAnnouncements", JSON.stringify(newViewed));
    setIsOpen(false);
    setCurrentAnnouncementIndex(0);
  };

  if (!isOpen || announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentAnnouncement.title}
            </h2>
            <p className="text-sm text-gray-500">
              Versão {currentAnnouncement.version}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div
            className="text-gray-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: currentAnnouncement.content }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentAnnouncementIndex + 1} de {announcements.length}
            </span>
            {announcements.length > 1 && (
              <div className="flex gap-1">
                {announcements.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentAnnouncementIndex
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSkipAll}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Ver depois
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {currentAnnouncementIndex === announcements.length - 1
                ? "Fechar"
                : "Próximo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
