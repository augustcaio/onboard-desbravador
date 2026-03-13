import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardDiretor } from "@/components/dashboard/Diretor/DashboardDiretor";
import { Role } from "@/types/cargo";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role as Role;

  // Apenas DIRETORIA vê o dashboard completo
  if (role === "DIRETORIA") {
    return <DashboardDiretor />;
  }

  // Redirecionar para ranking se não for diretor
  redirect("/ranking");
}
