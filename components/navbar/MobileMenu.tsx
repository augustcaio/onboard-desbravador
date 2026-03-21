"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Home, Users, Trophy, LogOut, ClipboardList, User, Calendar, ChevronDown } from "lucide-react";
import { Role, ROLE_LABELS } from "@/types/cargo";
import { navigationItems } from "./types";

interface MobileMenuProps {
  role: Role;
}

export function MobileMenu({ role }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rankingExpanded, setRankingExpanded] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/login" });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isRankingActive = (href: string) => {
    if (href.includes("?")) {
      return pathname === href.split("?")[0];
    }
    return pathname === href;
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-md hover:bg-[#59e865] hover:text-black transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sheet Lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-black z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="font-semibold text-white">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-[#59e865] hover:text-black transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Usuário"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                <span className="text-sm font-medium text-white">{getInitials(user.name)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-white">{user.name || "Usuário"}</div>
              <div className="text-xs text-gray-400 truncate">
                {user.email}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {ROLE_LABELS[role]}
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <nav className="flex flex-col p-4">
          {filteredItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.href}>
                  <button
                    onClick={() => setRankingExpanded(!rankingExpanded)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-md transition-colors ${
                      isRankingActive(item.href)
                        ? "bg-[#59e865] text-black"
                        : "text-gray-300 hover:bg-[#59e865] hover:text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5" />
                      {item.label}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        rankingExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {rankingExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-800 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={handleLinkClick}
                          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                            pathname === child.href
                              ? "bg-[#59e865] text-black"
                              : "text-gray-300 hover:bg-[#59e865] hover:text-black"
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            const Icon = getIcon(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-[#59e865] text-black"
                    : "text-gray-300 hover:bg-[#59e865] hover:text-black"
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer com Perfil e Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-2">
          {/* Botão Perfil - Desabilitado */}
          <button
            disabled
            className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-gray-500 opacity-50 cursor-not-allowed"
          >
            <User className="w-5 h-5" />
            Ver Perfil
          </button>
          
          {/* Botão Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

function getIcon(href: string) {
  switch (href) {
    case "/":
      return Home;
    case "/calendario":
      return Calendar;
    case "/ranking":
      return Trophy;
    case "/pontuacao":
      return ClipboardList;
    case "/membros":
      return Users;
    default:
      return null;
  }
}
