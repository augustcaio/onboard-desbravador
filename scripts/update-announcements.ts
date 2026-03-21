import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Atualizando anúncios do sistema...\n");

  // Desativar todos os anúncios anteriores
  await prisma.announcement.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });
  console.log("✓ Anúncios anteriores desativados");

  // Criar novo anúncio com todas as funcionalidades
  const newAnnouncement = await prisma.announcement.create({
    data: {
      title: "Novas Funcionalidades do Sistema",
      content: `
        <p style="margin-bottom: 12px;">Olá! preparamos várias novidades para você. Confira:</p>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #59e865; margin-bottom: 8px; font-size: 14px;">📊 Ranking de Conselheiros</h4>
          <p style="color: #d1d5db; font-size: 13px;">Nova aba no ranking dedicada aos conselheiros, com card de destaque do líder e Top 3!</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #59e865; margin-bottom: 8px; font-size: 14px;">🎨 Cards de Destaque nos Rankings</h4>
          <p style="color: #d1d5db; font-size: 13px;">Todos os rankings agora possuem cards coloridos mostrando o Top 3 (ouro, prata e bronze) no topo!</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #59e865; margin-bottom: 8px; font-size: 14px;">🪶 Badges de Unidades</h4>
          <p style="color: #d1d5db; font-size: 13px;">Ícones das unidades (Falcão, Águia, Pardal, Quetzal) agora aparecem nas tabelas, cards e rankings!</p>
        </div>
        <div style="margin-bottom: 16px;">
          <h4 style="color: #59e865; margin-bottom: 8px; font-size: 14px;">🌙 Novo Design Dark Theme</h4>
          <p style="color: #d1d5db; font-size: 13px;">Interface completamente repaginada com background preto, textos brancos e destaque verde #59e865!</p>
        </div>
        <div style="margin-bottom: 8px;">
          <h4 style="color: #59e865; margin-bottom: 8px; font-size: 14px;">🔔 Popup de Novidades</h4>
          <p style="color: #d1d5db; font-size: 13px;">Agora você pode ocultar o popup de novidades por 7 dias com um clique!</p>
        </div>
      `,
      version: "2.0.0",
      isActive: true,
      startDate: new Date(),
      endDate: null,
    },
  });

  console.log(`✓ Novo anúncio criado (ID: ${newAnnouncement.id})`);
  console.log("\n✨ Anúncios atualizados com sucesso!");
}

main()
  .catch((error) => {
    console.error("❌ Erro ao atualizar anúncios:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
