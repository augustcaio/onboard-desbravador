import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Inserindo anúncios iniciais...");

  // Anúncio 1: Boas-vindas
  await prisma.announcement.create({
    data: {
      title: "Bem-vindo ao Clube Quetzal!",
      content: `<div>
        <p>Olá! Bem-vindo ao sistema de pontuação do Clube Quetzal.</p>
        <p>Este sistema foi desenvolvido para facilitar o gerenciamento de membros e a pontuação de desbravadores.</p>
        <h3>Funcionalidades disponíveis:</h3>
        <ul>
          <li>Login seguro com Google OAuth</li>
          <li>Dashboard para visualização geral (DIRETORIA)</li>
          <li>Gestão de membros (DIRETORIA/SECRETARIA)</li>
          <li>Sistema de pontuação diária e eventos</li>
          <li>Ranking de desbravadores</li>
          <li>Exclusão de membros com confirmação</li>
        </ul>
        <p>Comece explorando as funcionalidades!</p>
      </div>`,
      version: "1.0.0",
    },
  });

  // Anúncio 2: Novidades (sem Favicon)
  await prisma.announcement.create({
    data: {
      title: "Novidades Recentes!",
      content: `<div>
        <p>As seguintes funcionalidades foram adicionadas recentemente:</p>
        <h4>✨ Exclusão de Membros</h4>
        <p>Agora é possível excluir membros com uma confirmação de segurança.</p>
        <h4>🔒 Sincronização Automática de Permissões</h4>
        <p>As permissões são automaticamente calculadas com base no cargo do membro.</p>
      </div>`,
      version: "1.1.0",
    },
  });

  console.log("Anúncios inseridos com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
