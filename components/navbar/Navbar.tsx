"use client";

import { useSession } from "next-auth/react";
import { Role } from "@/types/cargo";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";
import { MobileMenu } from "./MobileMenu";
import { UserDropdown } from "./UserDropdown";

export function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role as Role || "MEMBRO";

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <NavbarLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavbarLinks role={role} />
          <div className="ml-2 pl-2 border-l">
            <UserDropdown />
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu role={role} />
      </div>
    </header>
  );
}
