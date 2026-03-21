import { Role } from "@/types/cargo";

export type NavItem = {
  label: string;
  href: string;
  roles: Role[];
  children?: NavItem[];
};

export const navigationItems: NavItem[] = [
  { label: "Início", href: "/", roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
  { label: "Calendário", href: "/calendario", roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
  { 
    label: "Ranking", 
    href: "/ranking", 
    roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"],
    children: [
      { label: "Membros", href: "/ranking?tipo=membros", roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
      { label: "Conselheiros", href: "/ranking?tipo=conselheiros", roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
      { label: "Unidades", href: "/ranking?tipo=unidades", roles: ["DIRETORIA", "SECRETARIA", "LIDERANCA", "MEMBRO"] },
    ]
  },
  { label: "Pontuação", href: "/pontuacao", roles: ["DIRETORIA", "SECRETARIA"] },
  { label: "Membros", href: "/membros", roles: ["DIRETORIA", "SECRETARIA"] },
];
