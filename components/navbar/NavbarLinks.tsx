"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/types/cargo";
import { navigationItems } from "./types";

interface NavbarLinksProps {
  role: Role;
}

export function NavbarLinks({ role }: NavbarLinksProps) {
  const pathname = usePathname();

  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <nav className="flex items-center gap-2">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
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
