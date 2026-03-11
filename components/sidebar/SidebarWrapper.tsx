"use client";

import { useState, useEffect, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Role } from "@/types/cargo";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  } | null;
  children: ReactNode;
}

export function SidebarWrapper({ user, children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <>
      <Sidebar 
        user={user} 
        collapsed={collapsed} 
        onToggle={toggleSidebar} 
      />
      <main 
        className={`transition-all duration-300 pt-16 lg:pt-0 ${
          mounted ? (collapsed ? "lg:pl-20" : "lg:pl-64") : "lg:pl-20"
        }`}
      >
        {children}
      </main>
    </>
  );
}
