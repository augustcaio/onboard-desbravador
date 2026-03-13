import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { AnnouncementPopup } from "@/components/AnnouncementPopup";

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
    <div className="flex flex-col">
      <AnnouncementPopup />
      <Navbar />
      <main className="flex-1 p-5 md:p-8">
        {children}
      </main>
    </div>
  );
}
