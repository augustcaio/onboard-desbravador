import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const unidades = await prisma.unidade.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
      },
    });

    return NextResponse.json(unidades);
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    return NextResponse.json(
      { error: "Erro ao buscar unidades" },
      { status: 500 }
    );
  }
}
