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
        pontos: true,
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

    // Ordenar por pontuação
    membrosComPontos.sort((a, b) => b.totalPontos - a.totalPontos);

    const totalMembros = membros.length;
    const totalPontos = membrosComPontos.reduce((acc, m) => acc + m.totalPontos, 0);
    const mediaPontos = totalMembros > 0 ? Math.round(totalPontos / totalMembros) : 0;
    const top3 = membrosComPontos.slice(0, 3);

    // Calcular ranking de unidades
    const unidades = await prisma.unidade.findMany({
      where: {
        NOT: {
          nome: "Quetzal",
        },
      },
      include: {
        membros: {
          include: {
            pontos: true,
          },
        },
      },
    });

    const rankingUnidades = unidades.map((unidade) => {
      const totalPontosUnidade = unidade.membros.reduce((accMembro, membro) => {
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
        nome: unidade.nome,
        totalPontos: totalPontosUnidade,
      };
    });

    rankingUnidades.sort((a, b) => b.totalPontos - a.totalPontos);
    const unidadeLider = rankingUnidades[0]?.nome || null;

    // Buscar conselheiro líder
    const conselheiros = membrosComPontos.filter((m) => {
      const membro = membros.find((mem) => mem.id === m.id);
      return membro?.cargo === "CONSELHEIRO";
    });
    const conselheiroLider = conselheiros[0] || null;

    return NextResponse.json({
      totalMembros,
      totalPontos,
      mediaPontos,
      top3,
      unidadeLider,
      conselheiroLider,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar resumo de pontuação" },
      { status: 500 }
    );
  }
}
