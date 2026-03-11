import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function DashboardContent() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  const role = session.user.role;
  const userName = session.user.name;

  if (role === "DIRETORIA" || role === "SECRETARIA") {
    return (
      <DashboardAdmin userName={userName} role={role} />
    );
  }

  return (
    <DashboardDesbravador userId={session.user.id} userName={userName} />
  );
}

async function DashboardAdmin({ userName, role }: { userName?: string | null; role: string }) {
  const totalMembros = await prisma.membro.count();
  const totalUnidades = await prisma.unidade.count();
  const pontuacoesHoje = await prisma.pontuacao.count({
    where: {
      data: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {userName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestão do Clube Quetzal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Membros"
          value={totalMembros.toString()}
          description="Total de membros cadastrados"
          href="/membros"
        />
        <DashboardCard
          title="Unidades"
          value={totalUnidades.toString()}
          description="Unidades ativas"
          href="/unidades"
        />
        <DashboardCard
          title="Pontuações Hoje"
          value={pontuacoesHoje.toString()}
          description="Lançamentos hoje"
          href="/pontuacao"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard
          title="Membros"
          description="Gerenciar membros"
          href="/membros"
          icon="👥"
        />
        <ActionCard
          title="Pontuação"
          description="Lançar pontuações"
          href="/pontuacao"
          icon="📝"
        />
        <ActionCard
          title="Ranking"
          description="Ver rankings"
          href="/ranking"
          icon="🏆"
        />
        {role === "DIRETORIA" && (
          <ActionCard
            title="Relatórios"
            description="Relatórios gerais"
            href="/relatorios"
            icon="📊"
          />
        )}
      </div>
    </div>
  );
}

async function DashboardDesbravador({ userId, userName }: { userId: string; userName?: string | null }) {
  // Buscar membro logado
  const membro = await prisma.membro.findUnique({
    where: { id: userId },
    include: {
      unidade: true,
      pontos: {
        orderBy: { data: "desc" },
        take: 1,
      },
    },
  });

  // Calcular pontuação total
  const todasPontuacoes = await prisma.pontuacao.findMany({
    where: { membroId: userId },
  });

  const pontuacaoTotal = todasPontuacoes.reduce((acc, p) => {
    const positivos =
      p.kitEspiritual +
      p.lenco +
      p.pontualidade +
      p.cantil +
      p.bandeirim +
      p.atividadeCartao +
      p.especialidade +
      p.presencaEventos +
      p.dinamicas;
    
    const negativos = p.indisciplina + p.xingamentos + p.ofensa + p.agressao;
    
    return acc + positivos + negativos;
  }, 0);

  // Buscar ranking (posição do membro)
  const ranking = await prisma.membro.findMany({
    include: {
      pontos: true,
    },
  });

  const membrosComPontuacao = await Promise.all(
    ranking.map(async (m) => {
      const pts = await prisma.pontuacao.findMany({
        where: { membroId: m.id },
      });
      const total = pts.reduce((acc, p) => {
        const positivos =
          p.kitEspiritual +
          p.lenco +
          p.pontualidade +
          p.cantil +
          p.bandeirim +
          p.atividadeCartao +
          p.especialidade +
          p.presencaEventos +
          p.dinamicas;
        const negativos = p.indisciplina + p.xingamentos + p.ofensa + p.agressao;
        return acc + positivos + negativos;
      }, 0);
      return { ...m, pontuacaoTotal: total };
    })
  );

  membrosComPontuacao.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  const posicao = membrosComPontuacao.findIndex((m) => m.id === userId) + 1;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo, {userName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {membro?.unidade.nome} - {membro?.cargo}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🏆 Ranking</h2>
          <p className="text-4xl font-bold text-primary">
            #{posicao}º
          </p>
          <p className="text-muted-foreground">
            de {membrosComPontuacao.length} membros
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">⭐ Pontuação Total</h2>
          <p className="text-4xl font-bold text-primary">
            {pontuacaoTotal.toLocaleString("pt-BR")}
          </p>
          <p className="text-muted-foreground">pontos</p>
        </div>
      </div>

      {membro?.pontos[0] && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📅 Última Pontuação</h2>
          <p className="text-muted-foreground">
            {new Date(membro.pontos[0].data).toLocaleDateString("pt-BR")}
          </p>
        </div>
      )}

      <div className="bg-muted rounded-lg p-6">
        <p className="text-sm text-muted-foreground text-center">
          Em breve você poderá acompanhar sua evolução aqui!
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  href,
}: {
  title: string;
  value: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
    >
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </a>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors flex items-center gap-4"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  );
}
