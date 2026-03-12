import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/types/cargo";

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
    // 1. Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // 2. Verificar autorização (apenas DIRETORIA e SECRETARIA)
    const role = session.user?.role as Role;
    if (role !== "DIRETORIA" && role !== "SECRETARIA") {
      return NextResponse.json(
        { error: "Permissão negada" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // 3. Deletar em transação (membro + pontuações associadas)
    await prisma.$transaction(async (tx) => {
      // Deletar pontuações associadas
      await tx.pontuacao.deleteMany({ where: { membroId: id } });
      // Deletar membro
      await tx.membro.delete({ where: { id } });
    });

    return NextResponse.json({ success: true, message: "Membro deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar membro:", error);
    return NextResponse.json(
      { error: "Erro ao deletar membro" },
      { status: 500 }
    );
  }
}
