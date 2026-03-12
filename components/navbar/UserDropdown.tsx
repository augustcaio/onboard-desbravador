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
        <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex-shrink-0 whitespace-nowrap w-fit min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Usuário"}
                className="w-7 h-7 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">{getInitials(user.name)}</span>
              </div>
            )}
            <div className="hidden sm:block text-left min-w-0">
              <div className="text-sm font-medium truncate">
                {user.name || "Usuário"}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {ROLE_LABELS[role]}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="end" sideOffset={0} className="w-56">
          <div className="px-3 py-2">
            <div className="font-medium text-sm truncate">
              {user.name || "Usuário"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {user.email}
            </div>
            <div className="mt-1 text-xs px-2 py-0.5 bg-muted rounded-full inline-block">
              {ROLE_LABELS[role]}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled
            className="cursor-default opacity-60"
          >
            <User className="w-4 h-4 mr-2" />
            Ver Perfil
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
