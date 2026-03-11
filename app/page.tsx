import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Bem-vindo, {session?.user?.name || "Desbravador"}!
        </h1>
        <p className="text-muted-foreground mt-4">
          Você está logado no Clube Quetzal
        </p>
      </div>
    </main>
  );
}
