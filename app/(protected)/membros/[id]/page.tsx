"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import type { Unidade } from "@/components/membros/types";
import type { Cargo, Role } from "@/types/cargo";

interface MembroData {
  id: string;
  nome: string;
  email: string | null;
  googleEmail: string | null;
  role: Role;
  cargo: Cargo;
  unidadeId: string;
  unidadeNome: string;
}

export default function EditarMembroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    googleEmail: "",
    cargo: "DESBRAVADOR" as Cargo,
    role: "MEMBRO" as Role,
    unidadeId: "",
    novaUnidade: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch membro
        const resMembro = await fetch(`/api/membros/${id}`);
        if (resMembro.ok) {
          const membro: MembroData = await resMembro.json();
          setFormData((f) => ({
            ...f,
            nome: membro.nome,
            googleEmail: membro.googleEmail || "",
            cargo: membro.cargo,
            role: membro.role,
            unidadeId: membro.unidadeId,
          }));
        }

        // Fetch unidades
        const resUnidades = await fetch("/api/membros/unidades");
        if (resUnidades.ok) {
          const data = await resUnidades.json();
          setUnidades(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar dados do membro");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError("");

    try {
      const res = await fetch(`/api/membros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/membros");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar membro");
      }
    } catch (error) {
      setError("Erro ao atualizar membro");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const directoriaCargos = [
    { value: "DIRETOR", label: "Diretor" },
    { value: "DIRETOR_ASSOCIADO", label: "Diretor Associado" },
    { value: "SECRETARIO", label: "Secretário" },
    { value: "TESOUREIRO", label: "Tesoureiro" },
    { value: "INSTRUTOR", label: "Instrutor" },
    { value: "CAPELAO", label: "Capelão" },
  ];

  const liderancaCargos = [
    { value: "CONSELHEIRO", label: "Conselheiro" },
    { value: "CAPITAO", label: "Capitão" },
    { value: "SECRETARIO_UNIDADE", label: "Secretário de Unidade" },
    { value: "TESOUREIRO_UNIDADE", label: "Tesoureiro de Unidade" },
    { value: "ALMOXARIFE", label: "Almoxarife" },
  ];

  const membroCargos = [
    { value: "DESBRAVADOR", label: "Desbravador" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Membro</h1>
        <p className="text-muted-foreground">
          Atualize os dados do membro
        </p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.nome}
              onChange={(e) =>
                setFormData((f) => ({ ...f, nome: e.target.value }))
              }
              placeholder="João da Silva"
            />
          </div>

          {/* Google Email */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Email Google (opcional)
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.googleEmail}
              onChange={(e) =>
                setFormData((f) => ({ ...f, googleEmail: e.target.value }))
              }
              placeholder="joao@gmail.com"
            />
          </div>

          {/* Unidade */}
          <div>
            <label className="text-sm font-medium mb-1 block">Unidade *</label>
            <select
              required
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.unidadeId}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  unidadeId: e.target.value,
                  novaUnidade: "",
                }))
              }
            >
              <option value="">Selecione uma unidade</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
              <option value="new">+ Nova Unidade</option>
            </select>
          </div>

          {/* Nova Unidade */}
          {formData.unidadeId === "new" && (
            <div>
              <label className="text-sm font-medium mb-1 block">
                Nome da Nova Unidade
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.novaUnidade}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, novaUnidade: e.target.value }))
                }
                placeholder="Falcão"
              />
            </div>
          )}

          {/* Cargo */}
          <div>
            <label className="text-sm font-medium mb-1 block">Cargo *</label>
            <select
              required
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.cargo}
              onChange={(e) =>
                setFormData((f) => ({ ...f, cargo: e.target.value as Cargo }))
              }
            >
              <optgroup label="Diretoria">
                {directoriaCargos.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Liderança de Unidade">
                {liderancaCargos.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Membro">
                {membroCargos.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium mb-1 block">Role *</label>
            <select
              required
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.role}
              onChange={(e) =>
                setFormData((f) => ({ ...f, role: e.target.value as Role }))
              }
            >
              <option value="MEMBRO">Membro</option>
              <option value="LIDERANCA">Liderança</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="DIRETORIA">Diretoria</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loadingSubmit ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
