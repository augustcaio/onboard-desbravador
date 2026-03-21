import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RankingMembros } from "@/components/dashboard/Diretor/RankingMembros";
import { RankingUnidades } from "@/components/dashboard/Diretor/RankingUnidades";
import { RankingConselheiros } from "@/components/dashboard/Diretor/RankingConselheiros";
import { Users, Building2, Award } from "lucide-react";

type RankingType = "membros" | "unidades" | "conselheiros";

interface RankingPageProps {
  searchParams: Promise<{ tipo?: string }>;
}

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const tipo: RankingType = (resolvedParams.tipo as RankingType) || "membros";

  const tabs = [
    { id: "membros" as const, label: "Membros", icon: Users, href: "/ranking?tipo=membros" },
    { id: "conselheiros" as const, label: "Conselheiros", icon: Award, href: "/ranking?tipo=conselheiros" },
    { id: "unidades" as const, label: "Unidades", icon: Building2, href: "/ranking?tipo=unidades" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ranking</h1>
        <p className="text-muted-foreground">
          {tipo === "membros" 
            ? "Posição dos desbravadores por pontuação" 
            : tipo === "conselheiros"
            ? "Posição dos conselheiros por pontuação"
            : "Posição das unidades por pontuação"}
        </p>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tipo === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {tipo === "membros" ? (
        <RankingMembros />
      ) : tipo === "conselheiros" ? (
        <RankingConselheiros />
      ) : (
        <RankingUnidades />
      )}
    </div>
  );
}
