import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PontuacaoFormWrapper from "@/components/pontuacao/PontuacaoFormWrapper";
import { Role } from "@/types/cargo";

export default async function NovaPontuacaoPage({ searchParams }: { searchParams: Promise<{ membroId?: string }> }) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lançar Pontuação</h1>
        <p className="text-muted-foreground">
          Atribua pontos aos desbravadores
        </p>
      </div>

      <PontuacaoFormWrapper params={Promise.resolve(searchParams)} />
    </div>
  );
}
