"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { Unidade } from "@/components/membros/types";

interface PontuacaoFiltersProps {
  filters: {
    search?: string;
    membroId?: string;
    unidadeId?: string;
    dataInicio?: string;
    dataFim?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function PontuacaoFilters({ filters, onFiltersChange }: PontuacaoFiltersProps) {
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
        {/* Data Início */}
        <div className="w-full md:w-40">
          <label className="text-sm text-muted-foreground mb-1 block">
            Data Início
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-md border bg-background"
            value={filters.dataInicio || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dataInicio: e.target.value || undefined })
            }
          />
        </div>

        {/* Data Fim */}
        <div className="w-full md:w-40">
          <label className="text-sm text-muted-foreground mb-1 block">
            Data Fim
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-md border bg-background"
            value={filters.dataFim || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dataFim: e.target.value || undefined })
            }
          />
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
              onFiltersChange({ ...filters, unidadeId: e.target.value || undefined })
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
