import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@/types/cargo";

export default async function MembroEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role as Role;

  // Apenas DIRETORIA e SECRETARIA podem acessar
  if (role !== "DIRETORIA" && role !== "SECRETARIA") {
    redirect("/");
  }

  return <>{children}</>;
}
