import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version");

    // Buscar anúncios ativos
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
        ...(version ? { version: { not: version } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Erro ao buscar anúncios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar anúncios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, version, startDate, endDate, isActive } = body;

    if (!title || !content || !version) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        version,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    return NextResponse.json(
      { error: "Erro ao criar anúncio" },
      { status: 500 }
    );
  }
}
