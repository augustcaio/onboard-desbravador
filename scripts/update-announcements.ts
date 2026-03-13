import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Atualizando anúncio 'Novidades Recentes'...");

  // Atualizar anúncio "Novidades Recentes" para remover Favicon
  await prisma.announcement.updateMany({
    where: {
      title: "Novidades Recentes!",
    },
    data: {
      content: `<div>
        <p>As seguintes funcionalidades foram adicionadas recentemente:</p>
        <h4>✨ Exclusão de Membros</h4>
        <p>Agora é possível excluir membros com uma confirmação de segurança.</p>
        <h4>🔒 Sincronização Automática de Permissões</h4>
        <p>As permissões são automaticamente calculadas com base no cargo do membro.</p>
      </div>`,
    },
  });

  console.log("Anúncio atualizado com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
