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
  const [lastViewed, setLastViewed] = useState<string | null>(null);

  useEffect(() => {
    // Check if we've shown announcements today
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("announcementLastViewedDate");

    // Show if first visit today or if it's been a while (not strictly enforced for demo)
    const shouldShow = lastDate !== today;

    if (shouldShow) {
      fetchAnnouncements();
    }

    function fetchAnnouncements() {
      fetch("/api/announcements")
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setAnnouncements(data);
            setIsOpen(true);
            localStorage.setItem("announcementLastViewedDate", today);
          }
        })
        .catch((err) => console.error("Erro ao buscar anúncios:", err));
    }
  }, []);

  const handleClose = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 sm:p-6">
      {/* Modal Compacto */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-100 rounded-full uppercase tracking-wide">
              Nova Feature
            </span>
            <span className="text-xs text-gray-400">
              v{announcement.version}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {announcement.title}
          </h3>
          <div
            className="text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5 mx-2">
              {announcements.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-blue-600 w-3"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === announcements.length - 1}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleClose}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {currentIndex === announcements.length - 1 ? "Fechar" : "Pular"}
          </button>
        </div>
      </div>
    </div>
  );
}
