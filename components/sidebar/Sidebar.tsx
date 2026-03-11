"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
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
import {
  Home,
  Users,
  ClipboardList,
  Trophy,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Role } from "@/types/cargo";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  } | null;
  collapsed?: boolean;
  onToggle?: () => void;
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

export function Sidebar({ user, collapsed = true, onToggle }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold">Clube Quetzal</h1>

        <UserMenu user={user} onLogout={handleLogout} />
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:bg-background lg:border-r transition-all duration-300 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        <SidebarContent
          user={user}
          items={filteredItems}
          pathname={pathname}
          onLogout={handleLogout}
          collapsed={collapsed}
          onToggle={onToggle}
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
  collapsed,
  onToggle,
  onNavigate,
}: {
  user: SidebarProps["user"];
  items: NavItem[];
  pathname: string;
  onLogout: () => void;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`h-16 flex items-center border-b ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
        {!collapsed && <h2 className="text-xl font-bold text-primary">Clube Quetzal</h2>}
        {collapsed && <div className="w-8" />}
        {onToggle && (
          <Button variant="ghost" size="icon" onClick={onToggle} className={collapsed ? "" : "hidden lg:flex"}>
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className={`space-y-1 ${collapsed ? "px-2" : "px-3"}`}>
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  } ${collapsed ? "justify-center px-2" : "px-3"}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className={`border-t ${collapsed ? "p-2" : "p-3"}`}>
        {user ? (
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <Avatar className={collapsed ? "h-9 w-9" : "h-9 w-9"}>
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onLogout} title="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            {collapsed && (
              <Button variant="ghost" size="icon" onClick={onLogout} title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <Button variant="outline" className={collapsed ? "w-full" : "w-full"} asChild>
            <Link href="/login">{collapsed ? "" : "Entrar"}</Link>
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
