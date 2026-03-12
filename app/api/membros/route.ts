import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Cargo, Role, getCargoRole } from "@/types/cargo";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const unidadeId = searchParams.get("unidadeId") || undefined;
    const cargo = searchParams.get("cargo") as Cargo | undefined;
    const role = searchParams.get("role") as Role | undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { googleEmail: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (unidadeId) {
      where.unidadeId = unidadeId;
    }
    
    if (cargo) {
      where.cargo = cargo;
    }
    
    if (role) {
      where.role = role;
    }

    // Get total count
    const total = await prisma.membro.count({ where });

    // Get membros
    const membros = await prisma.membro.findMany({
      where,
      include: {
        unidade: true,
        user: true,
      },
      orderBy: { nome: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform to response format
    const membrosFormatados = membros.map((m) => ({
      id: m.id,
      nome: m.nome,
      email: m.email,
      googleEmail: m.googleEmail,
      role: m.role,
      cargo: m.cargo,
      unidadeId: m.unidadeId,
      unidadeNome: m.unidade.nome,
      image: m.user?.image || null,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({
      data: membrosFormatados,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar membros" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, googleEmail, cargo, role, unidadeId, novaUnidade } = body;

    if (!nome || !cargo || (!unidadeId && !novaUnidade)) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Calcular role baseada no cargo para garantir consistência
    const roleCalculada = getCargoRole(cargo as Cargo);

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

    // Criar membro
    const membro = await prisma.membro.create({
      data: {
        nome,
        googleEmail: googleEmail || null,
        cargo,
        role: roleCalculada, // Usa a role calculada do cargo
        unidadeId: unidadeIdFinal,
      },
    });

    return NextResponse.json(membro);
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return NextResponse.json(
      { error: "Erro ao criar membro" },
      { status: 500 }
    );
  }
}
