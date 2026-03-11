import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <main className="pt-16">
        <div className="container mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
