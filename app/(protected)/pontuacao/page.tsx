import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PontuacaoList } from "@/components/pontuacao/PontuacaoList";
import { Role } from "@/types/cargo";

export default async function PontuacaoPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role as Role;

  // Apenas DIRETORIA e SECRETARIA podem acessar
  if (role !== "DIRETORIA" && role !== "SECRETARIA") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pontuação</h1>
          <p className="text-muted-foreground">
            Gerencie as pontuações dos desbravadores
          </p>
        </div>
        <Link
          href="/pontuacao/novo"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nova Pontuação
        </Link>
      </div>

      <PontuacaoList />
    </div>
  );
}
