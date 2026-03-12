import { PrismaClient } from "@prisma/client";
import { getCargoRole, Cargo } from "@/types/cargo";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando correção das roles dos membros...");

  // Buscar todos os membros
  const membros = await prisma.membro.findMany();

  let updatedCount = 0;
  let skippedCount = 0;

  for (const membro of membros) {
    try {
      // Calcular a role esperada baseada no cargo
      const cargo = membro.cargo as Cargo;
      const expectedRole = getCargoRole(cargo);

      // Verificar se precisa atualizar
      if (membro.role !== expectedRole) {
        console.log(
          `Atualizando ${membro.nome}: ${membro.cargo} (${membro.role} -> ${expectedRole})`
        );

        await prisma.membro.update({
          where: { id: membro.id },
          data: { role: expectedRole },
        });

        updatedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`Erro ao processar membro ${membro.id}:`, error);
    }
  }

  console.log(`\nResumo:`);
  console.log(`- Membros processados: ${membros.length}`);
  console.log(`- Atualizados: ${updatedCount}`);
  console.log(`- Já corretos: ${skippedCount}`);
  console.log(`\nCorreção concluída!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
