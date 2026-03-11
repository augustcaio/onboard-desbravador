"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createMembro } from "@/app/actions/membro";
import { CARGO_OPTIONS, CARGOS } from "@/types/cargo";

export default function NovoMembroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    const result = await createMembro(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/membros");
      router.refresh();
    }
  }

  // Group cargos by category
  const directoriaCargos = CARGO_OPTIONS.filter(
    (c) => ["DIRETOR", "DIRETOR_ASSOCIADO", "SECRETARIO", "TESOUREIRO", "INSTRUTOR", "CAPELAO"].includes(c.value)
  );
  
  const liderancaCargos = CARGO_OPTIONS.filter(
    (c) => ["CONSELHEIRO", "CAPITAO", "SECRETARIO_UNIDADE", "TESOUREIRO_UNIDADE", "ALMOXARIFE"].includes(c.value)
  );
  
  const membroCargos = CARGO_OPTIONS.filter(
    (c) => c.value === "DESBRAVADOR"
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Novo Membro
        </h1>

        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome Completo *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="João da Silva"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email (opcional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="joao@email.com"
            />
            <p className="text-xs text-muted-foreground">
              Pode ser adicionado depois para vincular ao Google
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="cargo" className="text-sm font-medium">
              Cargo *
            </label>
            <select
              id="cargo"
              name="cargo"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <optgroup label="Diretoria">
                {directoriaCargos.map((cargo) => (
                  <option key={cargo.value} value={cargo.value}>
                    {cargo.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Liderança de Unidade">
                {liderancaCargos.map((cargo) => (
                  <option key={cargo.value} value={cargo.value}>
                    {cargo.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Membro">
                {membroCargos.map((cargo) => (
                  <option key={cargo.value} value={cargo.value}>
                    {cargo.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="unidadeId" className="text-sm font-medium">
              Unidade *
            </label>
            <select
              id="unidadeId"
              name="unidadeId"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione uma unidade</option>
              <option value="new">+ Nova Unidade</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="novaUnidade" className="text-sm font-medium">
              Nome da Nova Unidade
            </label>
            <input
              id="novaUnidade"
              name="novaUnidade"
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-0"
              placeholder="Falcão"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Membro"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
