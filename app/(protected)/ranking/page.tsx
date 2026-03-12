import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { RankingMembros } from "@/components/dashboard/Diretor/RankingMembros";
import { Role } from "@/types/cargo";

export default async function RankingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role as Role;

  // Todas as roles podem ver o ranking
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ranking</h1>
        <p className="text-muted-foreground">
          Posição dos desbravadores por pontuação
        </p>
      </div>

      <RankingMembros />
    </div>
  );
}
