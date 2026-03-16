import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const unidadeId = searchParams.get("unidadeId");
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");

    // Build where clause for date filter
    const wherePontuacao: any = {};
    if (dataInicio || dataFim) {
      wherePontuacao.data = {};
      if (dataInicio) {
        wherePontuacao.data.gte = new Date(dataInicio);
      }
      if (dataFim) {
        wherePontuacao.data.lte = new Date(dataFim + "T23:59:59");
      }
    }

    // Build where clause for membro
    const whereMembro: any = {
      unidade: {
        NOT: {
          nome: "Quetzal",
        },
      },
    };
    if (unidadeId) {
      whereMembro.unidadeId = unidadeId;
    }

    const membros = await prisma.membro.findMany({
      where: whereMembro,
      include: {
        unidade: true,
        pontos: {
          where: wherePontuacao,
        },
      },
    });

    // Calcular pontuação total de cada membro
    const membrosComPontos = membros.map((membro) => {
      const totalPontos = membro.pontos.reduce((acc, p) => {
        // Pontuação positiva
        const pontosPositivos =
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

        // Pontuação negativa
        const pontosNegativos =
          Math.abs(p.indisciplina || 0) +
          Math.abs(p.xingamentos || 0) +
          Math.abs(p.ofensa || 0) +
          Math.abs(p.agressao || 0);

        return acc + pontosPositivos - pontosNegativos;
      }, 0);

      return {
        id: membro.id,
        nome: membro.nome,
        unidade: membro.unidade.nome,
        totalPontos,
      };
    });

    // Ordenar por pontuação (maior para menor)
    membrosComPontos.sort((a, b) => b.totalPontos - a.totalPontos);

    return NextResponse.json(membrosComPontos);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ranking de membros" },
      { status: 500 }
    );
  }
}
