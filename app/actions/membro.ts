"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Role } from "@/types/auth";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const role = session.user.role;
  if (role !== "SECRETARIA" && role !== "DIRETORIA") {
    throw new Error("Você não tem permissão para realizar esta ação");
  }
  return session;
}

export async function createMembro(formData: FormData) {
  try {
    await checkAuth();

    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string | null;
    const cargo = formData.get("cargo") as string;
    const unidadeId = formData.get("unidadeId") as string;
    const novaUnidade = formData.get("novaUnidade") as string | null;

    if (!nome || !unidadeId) {
      return { error: "Nome e unidade são obrigatórios" };
    }

    let finalUnidadeId = unidadeId;

    if (unidadeId === "new" && novaUnidade) {
      const existingUnidade = await prisma.unidade.findUnique({
        where: { nome: novaUnidade },
      });

      if (existingUnidade) {
        finalUnidadeId = existingUnidade.id;
      } else {
        const newUnidade = await prisma.unidade.create({
          data: { nome: novaUnidade },
        });
        finalUnidadeId = newUnidade.id;
      }
    }

    const membro = await prisma.membro.create({
      data: {
        nome,
        email,
        cargo,
        unidadeId: finalUnidadeId,
        role: "DESBRAVADOR" as Role,
      },
    });

    return { success: true, membro };
  } catch (error) {
    console.error("Error creating membro:", error);
    return { error: "Erro ao criar membro" };
  }
}
