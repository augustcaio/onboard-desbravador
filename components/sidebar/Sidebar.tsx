"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  ClipboardList,
  Trophy,
  Menu,
  LogOut,
  User,
  ChevronLeft,
} from "lucide-react";
import { Role } from "@/types/cargo";

interface SidebarProps {
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
  { label: "Home", href: "/", icon: Home, roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
  { label: "Membros", href: "/membros", icon: Users, roles: ["DIRETORIA", "SECRETARIA"] },
  { label: "Pontuação", href: "/pontuacao", icon: ClipboardList, roles: ["DIRETORIA", "SECRETARIA"] },
  { label: "Ranking", href: "/ranking", icon: Trophy, roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
];

export function Sidebar({ user }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const filteredItems = navigationItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background border-b flex items-center justify-between px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent
              user={user}
              items={filteredItems}
              pathname={pathname}
              onLogout={handleLogout}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold">Clube Quetzal</h1>

        <UserMenu user={user} onLogout={handleLogout} />
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-background lg:border-r">
        <SidebarContent
          user={user}
          items={filteredItems}
          pathname={pathname}
          onLogout={handleLogout}
          isDesktop
        />
      </aside>
    </>
  );
}

function SidebarContent({
  user,
  items,
  pathname,
  onLogout,
  onNavigate,
  isDesktop = false,
}: {
  user: SidebarProps["user"];
  items: NavItem[];
  pathname: string;
  onLogout: () => void;
  onNavigate?: () => void;
  isDesktop?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <h2 className="text-xl font-bold text-primary">Clube Quetzal</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

      {/* User Section */}
      <div className="p-3 border-t">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function UserMenu({
  user,
  onLogout,
}: {
  user: SidebarProps["user"];
  onLogout: () => void;
}) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
