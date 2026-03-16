import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RankingMembros } from "@/components/dashboard/Diretor/RankingMembros";
import { RankingUnidades } from "@/components/dashboard/Diretor/RankingUnidades";
import { Role } from "@/types/cargo";

type RankingType = "membros" | "unidades";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ranking</h1>
        <p className="text-muted-foreground">
          {tipo === "membros" 
            ? "Posição dos desbravadores por pontuação" 
            : "Posição das unidades por pontuação"}
        </p>
      </div>

      {tipo === "membros" ? <RankingMembros /> : <RankingUnidades />}
    </div>
  );
}
