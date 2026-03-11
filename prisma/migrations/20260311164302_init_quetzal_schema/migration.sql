-- CreateTable
CREATE TABLE "Unidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membro" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT 'Desbravador',
    "unidadeId" TEXT NOT NULL,

    CONSTRAINT "Membro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pontuacao" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membroId" TEXT NOT NULL,
    "kitEspiritual" INTEGER NOT NULL DEFAULT 0,
    "lenco" INTEGER NOT NULL DEFAULT 0,
    "pontualidade" INTEGER NOT NULL DEFAULT 0,
    "cantil" INTEGER NOT NULL DEFAULT 0,
    "bandeirim" INTEGER NOT NULL DEFAULT 0,
    "uniformeDomingo" INTEGER NOT NULL DEFAULT 0,
    "atividadeCartao" INTEGER NOT NULL DEFAULT 0,
    "especialidade" INTEGER NOT NULL DEFAULT 0,
    "presencaEventos" INTEGER NOT NULL DEFAULT 0,
    "visita" INTEGER NOT NULL DEFAULT 0,
    "dinamicas" INTEGER NOT NULL DEFAULT 0,
    "indisciplina" INTEGER NOT NULL DEFAULT 0,
    "xingamentos" INTEGER NOT NULL DEFAULT 0,
    "ofensa" INTEGER NOT NULL DEFAULT 0,
    "agressao" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Pontuacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unidade_nome_key" ON "Unidade"("nome");

-- AddForeignKey
ALTER TABLE "Membro" ADD CONSTRAINT "Membro_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pontuacao" ADD CONSTRAINT "Pontuacao_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
