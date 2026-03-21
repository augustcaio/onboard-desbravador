"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ChevronDown, Badge } from "lucide-react";
import { Role, ROLE_LABELS } from "@/types/cargo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

export function UserDropdown() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role as Role;

  if (!user) return null;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[#59e865] hover:text-black transition-colors flex-shrink-0 whitespace-nowrap w-fit min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Usuário"}
                className="w-7 h-7 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">{getInitials(user.name)}</span>
              </div>
            )}
            <div className="hidden sm:block text-left min-w-0">
              <div className="text-sm font-medium truncate text-white">
                {user.name || "Usuário"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {ROLE_LABELS[role]}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="end" sideOffset={0} className="w-56 bg-black border-gray-800">
          <div className="px-3 py-2 border-b border-gray-800">
            <div className="font-medium text-sm truncate text-white">
              {user.name || "Usuário"}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user.email}
            </div>
            <div className="mt-1 text-xs px-2 py-0.5 bg-[#59e865]/20 text-[#59e865] rounded-full inline-block">
              {ROLE_LABELS[role]}
            </div>
          </div>

          <DropdownMenuSeparator className="bg-gray-800" />

          <DropdownMenuItem
            disabled
            className="cursor-default opacity-60 text-gray-500"
          >
            <User className="w-4 h-4 mr-2" />
            Ver Perfil
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="cursor-pointer text-red-400 hover:bg-red-500 hover:text-white focus:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
