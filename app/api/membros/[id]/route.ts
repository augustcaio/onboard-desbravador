import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const membro = await prisma.membro.findUnique({
      where: { id },
      include: {
        unidade: true,
        user: true,
      },
    });

    if (!membro) {
      return NextResponse.json(
        { error: "Membro não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: membro.id,
      nome: membro.nome,
      email: membro.email,
      googleEmail: membro.googleEmail,
      role: membro.role,
      cargo: membro.cargo,
      unidadeId: membro.unidadeId,
      unidadeNome: membro.unidade.nome,
      image: membro.user?.image || null,
      createdAt: membro.createdAt,
    });
  } catch (error) {
    console.error("Erro ao buscar membro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar membro" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, googleEmail, cargo, role, unidadeId, novaUnidade } = body;

    if (!nome || !cargo || !role || (!unidadeId && !novaUnidade)) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Se nova unidade, criar primeiro
    let unidadeIdFinal = unidadeId;

    if (novaUnidade) {
      const unidadeExistente = await prisma.unidade.findUnique({
        where: { nome: novaUnidade },
      });

      if (unidadeExistente) {
        unidadeIdFinal = unidadeExistente.id;
      } else {
        const novaUnidadeCriada = await prisma.unidade.create({
          data: { nome: novaUnidade },
        });
        unidadeIdFinal = novaUnidadeCriada.id;
      }
    }

    // Atualizar membro
    const membro = await prisma.membro.update({
      where: { id },
      data: {
        nome,
        googleEmail: googleEmail || null,
        cargo,
        role,
        unidadeId: unidadeIdFinal,
      },
    });

    return NextResponse.json(membro);
  } catch (error) {
    console.error("Erro ao atualizar membro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar membro" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.membro.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar membro:", error);
    return NextResponse.json(
      { error: "Erro ao deletar membro" },
      { status: 500 }
    );
  }
}
