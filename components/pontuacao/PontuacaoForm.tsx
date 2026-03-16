"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { MembroOption } from "./types";

interface PontuacaoFormProps {
  initialMembroId?: string | null;
}

export function PontuacaoForm({ initialMembroId }: PontuacaoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [membros, setMembros] = useState<MembroOption[]>([]);
  const [error, setError] = useState("");
  const [searchMembro, setSearchMembro] = useState("");
  const [showMembroList, setShowMembroList] = useState(false);

  const [formData, setFormData] = useState({
    membroId: "",
    data: new Date().toISOString().split("T")[0],
    kitEspiritual: 0,
    lenco: 0,
    pontualidade: 0,
    cantil: 0,
    bandeirim: 0,
    uniformeDomingo: 0,
    atividadeCartao: 0,
    especialidade: 0,
    presencaEventos: 0,
    visita: 0,
    dinamicas: 0,
    indisciplina: 0,
    xingamentos: 0,
    ofensa: 0,
    agressao: 0,
  });

  useEffect(() => {
    async function fetchMembros() {
      try {
        const res = await fetch("/api/pontuacao/membros");
        if (res.ok) {
          const data = await res.json();
          setMembros(data);
          
          // Se tem membro inicial, selecionar automaticamente
          if (initialMembroId) {
            const membro = data.find((m: MembroOption) => m.id === initialMembroId);
            if (membro) {
              setFormData((f) => ({ ...f, membroId: membro.id }));
              setSearchMembro(membro.nome);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      }
    }
    fetchMembros();
  }, [initialMembroId]);

  const filteredMembros = membros.filter(
    (m) =>
      m.nome.toLowerCase().includes(searchMembro.toLowerCase()) ||
      m.unidadeNome.toLowerCase().includes(searchMembro.toLowerCase())
  );

  const selectedMembro = membros.find((m) => m.id === formData.membroId);

  const calculateTotal = () => {
    const positivos =
      (formData.kitEspiritual || 0) +
      (formData.lenco || 0) +
      (formData.pontualidade || 0) +
      (formData.cantil || 0) +
      (formData.bandeirim || 0) +
      (formData.uniformeDomingo || 0) +
      (formData.atividadeCartao || 0) +
      (formData.especialidade || 0) +
      (formData.presencaEventos || 0) +
      (formData.visita || 0) +
      (formData.dinamicas || 0);

    const negativos =
      Math.abs(formData.indisciplina || 0) +
      Math.abs(formData.xingamentos || 0) +
      Math.abs(formData.ofensa || 0) +
      Math.abs(formData.agressao || 0);

    return positivos - negativos;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pontuacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/pontuacao");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao criar pontuação");
      }
    } catch (error) {
      setError("Erro ao criar pontuação");
    } finally {
      setLoading(false);
    }
  };

  const handleMembroSelect = (membro: MembroOption) => {
    setFormData((f) => ({ ...f, membroId: membro.id }));
    setSearchMembro(membro.nome);
    setShowMembroList(false);
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Membro e Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Membro *</label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-md border bg-background"
                placeholder="Buscar membro..."
                value={searchMembro}
                onChange={(e) => {
                  setSearchMembro(e.target.value);
                  setShowMembroList(true);
                  setFormData((f) => ({ ...f, membroId: "" }));
                }}
                onFocus={() => setShowMembroList(true)}
              />
              {showMembroList && filteredMembros.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredMembros.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-accent"
                      onClick={() => handleMembroSelect(m)}
                    >
                      <p className="font-medium">{m.nome}</p>
                      <p className="text-xs text-muted-foreground">{m.unidadeNome}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedMembro && (
              <p className="text-xs text-muted-foreground mt-1">
                Unidade: {selectedMembro.unidadeNome}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Data *</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={formData.data}
              onChange={(e) =>
                setFormData((f) => ({ ...f, data: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Pontuação Diária */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Pontuação Diária</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Kit Espiritual (max 20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.kitEspiritual}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    kitEspiritual: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Lenço (max 20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.lenco}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    lenco: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Pontualidade (max 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.pontualidade}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    pontualidade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Cantil (max 20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.cantil}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    cantil: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Bandeirim (max 20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.bandeirim}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    bandeirim: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Uniforme Domingo
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.uniformeDomingo}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    uniformeDomingo: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Pontuação Secundária */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Pontuação Secundária</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Atividade Cartão (max 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.atividadeCartao}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    atividadeCartao: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Especialidade (max 200)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.especialidade}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    especialidade: Math.min(200, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Presença Eventos (max 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.presencaEventos}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    presencaEventos: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Visita
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.visita}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    visita: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Dinâmicas */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Dinâmicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Dinâmicas (max 5000)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.dinamicas}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    dinamicas: Math.min(5000, Math.max(0, parseInt(e.target.value) || 0)),
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Perda de Pontos */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-red-600">Perda de Pontos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Indisciplina
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.indisciplina}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    indisciplina: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Xingamentos
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.xingamentos}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    xingamentos: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Ofensa
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.ofensa}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    ofensa: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Agressão
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 rounded-md border bg-background"
                value={formData.agressao}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    agressao: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total:</span>
            <span
              className={`text-2xl font-bold ${
                calculateTotal() >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {calculateTotal().toLocaleString("pt-BR")} pts
            </span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !formData.membroId}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Pontuação
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
  );
}
