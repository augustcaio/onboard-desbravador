"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { Unidade } from "./types";
import type { Cargo, Role } from "@/types/cargo";

interface MembroFiltersProps {
  filters: {
    search?: string;
    unidadeId?: string;
    cargo?: string;
    role?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function MembroFilters({ filters, onFiltersChange }: MembroFiltersProps) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    async function fetchUnidades() {
      try {
        const res = await fetch("/api/membros/unidades");
        if (res.ok) {
          const data = await res.json();
          setUnidades(data);
        }
      } catch (error) {
        console.error("Erro ao buscar unidades:", error);
      }
    }
    fetchUnidades();
  }, []);

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Busca por nome */}
        <div className="flex-1">
          <label className="text-sm text-muted-foreground mb-1 block">
            Buscar por nome
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Digite o nome..."
              className="w-full pl-9 pr-4 py-2 rounded-md border bg-background"
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value || undefined })
              }
            />
          </div>
        </div>

        {/* Filtro por unidade */}
        <div className="w-full md:w-48">
          <label className="text-sm text-muted-foreground mb-1 block">
            Unidade
          </label>
          <select
            className="w-full px-3 py-2 rounded-md border bg-background"
            value={filters.unidadeId || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                unidadeId: e.target.value || undefined,
              })
            }
          >
            <option value="">Todas</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por cargo */}
        <div className="w-full md:w-48">
          <label className="text-sm text-muted-foreground mb-1 block">
            Cargo
          </label>
          <select
            className="w-full px-3 py-2 rounded-md border bg-background"
            value={filters.cargo || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                cargo: e.target.value || undefined,
              })
            }
          >
            <option value="">Todos</option>
            <option value="DIRETOR">Diretor</option>
            <option value="DIRETOR_ASSOCIADO">Diretor Associado</option>
            <option value="SECRETARIO">Secretário</option>
            <option value="TESOUREIRO">Tesoureiro</option>
            <option value="INSTRUTOR">Instrutor</option>
            <option value="CAPELAO">Capelão</option>
            <option value="CONSELHEIRO">Conselheiro</option>
            <option value="CAPITAO">Capitão</option>
            <option value="SECRETARIO_UNIDADE">Secretário de Unidade</option>
            <option value="TESOUREIRO_UNIDADE">Tesoureiro de Unidade</option>
            <option value="ALMOXARIFE">Almoxarife</option>
            <option value="DESBRAVADOR">Desbravador</option>
          </select>
        </div>

        {/* Filtro por role */}
        <div className="w-full md:w-40">
          <label className="text-sm text-muted-foreground mb-1 block">
            Role
          </label>
          <select
            className="w-full px-3 py-2 rounded-md border bg-background"
            value={filters.role || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                role: e.target.value || undefined,
              })
            }
          >
            <option value="">Todas</option>
            <option value="DIRETORIA">Diretoria</option>
            <option value="SECRETARIA">Secretaria</option>
            <option value="LIDERANCA">Liderança</option>
            <option value="MEMBRO">Membro</option>
          </select>
        </div>

        {/* Botão limpar filtros */}
        {hasFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
