import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MembroForm } from "@/components/membros/MembroForm";
import { Role } from "@/types/cargo";

export default async function NovoMembroPage() {
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Novo Membro</h1>
        <p className="text-muted-foreground">
          Cadastre um novo membro no clube
        </p>
      </div>

      <MembroForm />
    </div>
  );
}
