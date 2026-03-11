import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Check if units already exist
  const existingUnits = await prisma.unidade.findMany();
  if (existingUnits.length > 0) {
    console.log("⚠️  Units already exist, skipping seed...");
    return;
  }

  // Create default units
  const units = [{ nome: "Falcão" }, { nome: "Águia" }, { nome: "Pardal" }];

  for (const unit of units) {
    await prisma.unidade.create({
      data: unit,
    });
    console.log(`✅ Created unit: ${unit.nome}`);
  }

  console.log("🌱 Seed completed!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
