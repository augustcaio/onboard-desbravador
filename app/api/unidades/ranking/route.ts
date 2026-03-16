import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");

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

    const unidades = await prisma.unidade.findMany({
      where: {
        NOT: {
          nome: "Quetzal",
        },
      },
      include: {
        membros: {
          include: {
            pontos: {
              where: wherePontuacao,
            },
          },
        },
      },
    });

    const rankingUnidades = unidades.map((unidade) => {
      const totalPontos = unidade.membros.reduce((accMembro, membro) => {
        const pontosMembro = membro.pontos.reduce((acc, p) => {
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

          return acc + positivos - negativos;
        }, 0);
        return accMembro + pontosMembro;
      }, 0);

      return {
        id: unidade.id,
        nome: unidade.nome,
        totalPontos,
        totalMembros: unidade.membros.length,
      };
    });

    rankingUnidades.sort((a, b) => b.totalPontos - a.totalPontos);

    return NextResponse.json(rankingUnidades);
  } catch (error) {
    console.error("Erro ao buscar ranking de unidades:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ranking de unidades" },
      { status: 500 }
    );
  }
}
