import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return session;
}

export default async function MembrosPage() {
  await checkAuth();

  const membros = await prisma.membro.findMany({
    include: { unidade: true },
    orderBy: { nome: "asc" },
  });

  const unidades = await prisma.unidade.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Membros</h1>
          <Link href="/membros/novo">
            <Button>Novo Membro</Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium">Nome</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Cargo</th>
                <th className="text-left p-4 font-medium">Unidade</th>
                <th className="text-left p-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {membros.map((membro) => (
                <tr key={membro.id} className="border-t border-border">
                  <td className="p-4">{membro.nome}</td>
                  <td className="p-4 text-muted-foreground">
                    {membro.email || "-"}
                  </td>
                  <td className="p-4">{membro.cargo}</td>
                  <td className="p-4">{membro.unidade.nome}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        membro.role === "DIRETORIA"
                          ? "bg-purple-100 text-purple-800"
                          : membro.role === "SECRETARIA"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {membro.role}
                    </span>
                  </td>
                </tr>
              ))}
              {membros.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum membro cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Unidades</h2>
          <div className="flex gap-2 flex-wrap">
            {unidades.map((unidade) => (
              <span
                key={unidade.id}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
              >
                {unidade.nome}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
