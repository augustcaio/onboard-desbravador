"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/types/cargo";
import { navigationItems } from "./types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface NavbarLinksProps {
  role: Role;
}

export function NavbarLinks({ role }: NavbarLinksProps) {
  const pathname = usePathname();

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  const isActive = (href: string) => {
    if (href.includes("?")) {
      return pathname === href.split("?")[0];
    }
    return pathname === href;
  };

  return (
    <nav className="flex items-center gap-2">
      {filteredItems.map((item) => {
        if (item.children) {
          return (
            <DropdownMenu key={item.href}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    isActive(item.href)
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {item.children.map((child) => (
                  <DropdownMenuItem asChild key={child.href}>
                    <Link href={child.href} className="w-full">
                      {child.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        const itemIsActive = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              itemIsActive
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
