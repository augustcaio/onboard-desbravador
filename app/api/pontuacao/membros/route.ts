import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const membros = await prisma.membro.findMany({
      where: {
        unidade: {
          NOT: {
            nome: "Quetzal",
          },
        },
      },
      include: {
        unidade: true,
      },
      orderBy: { nome: "asc" },
    });

    const membrosFormatados = membros.map((m) => ({
      id: m.id,
      nome: m.nome,
      unidadeId: m.unidadeId,
      unidadeNome: m.unidade.nome,
    }));

    return NextResponse.json(membrosFormatados);
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar membros" },
      { status: 500 }
    );
  }
}
