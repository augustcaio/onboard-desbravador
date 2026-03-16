import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const membroId = searchParams.get("membroId") || undefined;
    const unidadeId = searchParams.get("unidadeId") || undefined;
    const dataInicio = searchParams.get("dataInicio") || undefined;
    const dataFim = searchParams.get("dataFim") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const where: any = {};

    if (membroId) {
      where.membroId = membroId;
    }

    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) {
        where.data.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.data.lte = new Date(dataFim + "T23:59:59");
      }
    }

    // Get total count
    const total = await prisma.pontuacao.count({ where });

    // Get pontuações
    const pontuacoes = await prisma.pontuacao.findMany({
      where,
      include: {
        membro: {
          include: {
            unidade: true,
          },
        },
      },
      orderBy: { data: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform to response format with filtering by unidadeId in memory
    let pontuacoesFiltradas = pontuacoes;
    if (unidadeId) {
      pontuacoesFiltradas = pontuacoes.filter(
        (p) => p.membro.unidadeId === unidadeId
      );
    }

    const pontuacoesFormatadas = pontuacoesFiltradas.map((p) => {
      const positivos =
        (p.kitEspiritual || 0) +
        (p.lenco || 0) +
        (p.pontualidade || 0) +
        (p.cantil || 0) +
        (p.bandeirim || 0) +
        (p.uniformeDomingo || 0) +
        (p.atividadeCartao || 0) +
        (p.especialidade || 0) +
        (p.presencaEventos || 0) +
        (p.visita || 0) +
        (p.dinamicas || 0);

      const negativos =
        Math.abs(p.indisciplina || 0) +
        Math.abs(p.xingamentos || 0) +
        Math.abs(p.ofensa || 0) +
        Math.abs(p.agressao || 0);

      return {
        id: p.id,
        data: p.data,
        membroId: p.membroId,
        membroNome: p.membro.nome,
        membroUnidade: p.membro.unidade.nome,
        kitEspiritual: p.kitEspiritual,
        lenco: p.lenco,
        pontualidade: p.pontualidade,
        cantil: p.cantil,
        bandeirim: p.bandeirim,
        uniformeDomingo: p.uniformeDomingo,
        atividadeCartao: p.atividadeCartao,
        especialidade: p.especialidade,
        presencaEventos: p.presencaEventos,
        visita: p.visita,
        dinamicas: p.dinamicas,
        indisciplina: p.indisciplina,
        xingamentos: p.xingamentos,
        ofensa: p.ofensa,
        agressao: p.agressao,
        total: positivos - negativos,
      };
    });

    return NextResponse.json({
      data: pontuacoesFormatadas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar pontuações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pontuações" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      membroId,
      data,
      kitEspiritual = 0,
      lenco = 0,
      pontualidade = 0,
      cantil = 0,
      bandeirim = 0,
      uniformeDomingo = 0,
      atividadeCartao = 0,
      especialidade = 0,
      presencaEventos = 0,
      visita = 0,
      dinamicas = 0,
      indisciplina = 0,
      xingamentos = 0,
      ofensa = 0,
      agressao = 0,
    } = body;

    if (!membroId || !data) {
      return NextResponse.json(
        { error: "Membro e data são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o membro existe
    const membro = await prisma.membro.findUnique({
      where: { id: membroId },
      include: { unidade: true },
    });

    if (!membro) {
      return NextResponse.json(
        { error: "Membro não encontrado" },
        { status: 404 }
      );
    }

    // Validar que o membro não é da unidade Quetzal
    if (membro.unidade.nome === "Quetzal") {
      return NextResponse.json(
        { error: "Não é possível atribuir pontos a membros da unidade Quetzal" },
        { status: 400 }
      );
    }

    // Verificar se já existe pontuação para este membro nesta data
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const pontuacaoExistente = await prisma.pontuacao.findFirst({
      where: {
        membroId,
        data: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    });

    let pontuacao;
    if (pontuacaoExistente) {
      // Atualizar pontuação existente
      pontuacao = await prisma.pontuacao.update({
        where: { id: pontuacaoExistente.id },
        data: {
          kitEspiritual,
          lenco,
          pontualidade,
          cantil,
          bandeirim,
          uniformeDomingo,
          atividadeCartao,
          especialidade,
          presencaEventos,
          visita,
          dinamicas,
          indisciplina,
          xingamentos,
          ofensa,
          agressao,
        },
      });
    } else {
      // Criar nova pontuação
      pontuacao = await prisma.pontuacao.create({
        data: {
          membroId,
          data: new Date(data),
          kitEspiritual,
          lenco,
          pontualidade,
          cantil,
          bandeirim,
          uniformeDomingo,
          atividadeCartao,
          especialidade,
          presencaEventos,
          visita,
          dinamicas,
          indisciplina,
          xingamentos,
          ofensa,
          agressao,
        },
      });
    }

    return NextResponse.json(pontuacao);
  } catch (error) {
    console.error("Erro ao criar pontuação:", error);
    return NextResponse.json(
      { error: "Erro ao criar pontuação" },
      { status: 500 }
    );
  }
}
