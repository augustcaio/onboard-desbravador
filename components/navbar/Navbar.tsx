"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, Home, Users, ClipboardList, Trophy } from "lucide-react";
import { Role } from "@/types/cargo";
import { useState } from "react";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  } | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const navigationItems: NavItem[] = [
  { label: "Início", href: "/", icon: Home, roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
  { label: "Membros", href: "/membros", icon: Users, roles: ["DIRETORIA", "SECRETARIA"] },
  { label: "Pontuação", href: "/pontuacao", icon: ClipboardList, roles: ["DIRETORIA", "SECRETARIA"] },
  { label: "Ranking", href: "/ranking", icon: Trophy, roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = navigationItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b">
      <div className="flex h-full items-center justify-between px-4">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-8">
                <ul className="space-y-2">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="absolute bottom-4 left-4 right-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                asChild
              >
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
