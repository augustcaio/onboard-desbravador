"use client";

import { useState, useEffect, useRef } from "react";

interface EventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    start?: Date | null;
    end?: Date | null;
    description?: string | null;
    location?: string | null;
  };
}

export function EventPopup({ isOpen, onClose, event }: EventPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="bg-black rounded-xl shadow-2xl border border-gray-800 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
          <h3 className="font-semibold text-sm truncate flex-1">{event.title}</h3>
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Data e Hora */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 text-white">
              {event.start && (
                <p>
                  Início: <span className="text-gray-400">{formatDate(event.start)}</span>
                </p>
              )}
              {event.end && (
                <p>
                  Fim: <span className="text-gray-400">{formatDate(event.end)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Localização */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-white">
              <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {/* Descrição */}
          {event.description && (
            <div className="flex items-start gap-2 text-sm text-white pt-2 border-t border-gray-800">
              <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <p className="flex-1">{event.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-900 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-[#59e865] text-black rounded-lg text-sm font-medium hover:bg-[#4ac856] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
