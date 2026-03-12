"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Pencil, ChevronLeft, ChevronRight, ClipboardList, Trash2 } from "lucide-react";
import { MembroFilters } from "./MembroFilters";
import type { Membro } from "./types";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";

export function MembroList() {
  const router = useRouter();
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Estado para o diálogo de confirmação
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Membro | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchMembros() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", pagination.page.toString());
        params.set("limit", pagination.limit.toString());
        
        if (filters.search) params.set("search", filters.search);
        if (filters.unidadeId) params.set("unidadeId", filters.unidadeId);
        if (filters.cargo) params.set("cargo", filters.cargo);
        if (filters.role) params.set("role", filters.role);

        const res = await fetch(`/api/membros?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setMembros(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembros();
  }, [filters, pagination.page, pagination.limit]);

  const getCargoLabel = (cargo: string) => {
    const labels: Record<string, string> = {
      DIRETOR: "Diretor",
      DIRETOR_ASSOCIADO: "Diretor Associado",
      SECRETARIO: "Secretário",
      TESOUREIRO: "Tesoureiro",
      INSTRUTOR: "Instrutor",
      CAPELAO: "Capelão",
      CONSELHEIRO: "Conselheiro",
      CAPITAO: "Capitão",
      SECRETARIO_UNIDADE: "Secretário de Unidade",
      TESOUREIRO_UNIDADE: "Tesoureiro de Unidade",
      ALMOXARIFE: "Almoxarife",
      DESBRAVADOR: "Desbravador",
    };
    return labels[cargo] || cargo;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      DIRETORIA: "bg-purple-100 text-purple-800",
      SECRETARIA: "bg-blue-100 text-blue-800",
      LIDERANCA: "bg-green-100 text-green-800",
      MEMBRO: "bg-gray-100 text-gray-800",
    };
    return styles[role] || "bg-gray-100 text-gray-800";
  };

  const handleDeleteClick = (membro: Membro) => {
    setMemberToDelete(membro);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/membros/${memberToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Atualizar a lista removendo o membro localmente
        setMembros(membros.filter(m => m.id !== memberToDelete.id));
        setDeleteDialogOpen(false);
        setMemberToDelete(null);
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao excluir membro");
      }
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
      alert("Erro ao excluir membro");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <MembroFilters filters={filters} onFiltersChange={setFilters} />

      {/* Tabela */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-3 text-sm font-medium w-16">Foto</th>
                <th className="text-left p-3 text-sm font-medium">Nome</th>
                <th className="text-left p-3 text-sm font-medium">Unidade</th>
                <th className="text-left p-3 text-sm font-medium">Cargo</th>
                <th className="text-left p-3 text-sm font-medium">Role</th>
                <th className="text-right p-3 text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : membros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Nenhum membro encontrado
                  </td>
                </tr>
              ) : (
                membros.map((membro) => (
                  <tr
                    key={membro.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        {membro.image ? (
                          <Image
                            src={membro.image}
                            alt={membro.nome}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                            {getInitials(membro.nome)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{membro.nome}</p>
                          {membro.googleEmail && (
                            <p className="text-xs text-muted-foreground">
                              {membro.googleEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{membro.unidadeNome}</td>
                    <td className="p-3">{getCargoLabel(membro.cargo)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getRoleBadge(
                          membro.role
                        )}`}
                      >
                        {membro.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/pontuacao/novo?membroId=${membro.id}`}
                          className="inline-flex p-2 hover:bg-muted rounded-md transition-colors"
                          title="Lançar Pontuação"
                        >
                          <ClipboardList className="w-4 h-4 text-green-600" />
                        </Link>
                        <Link
                          href={`/membros/${membro.id}`}
                          className="inline-flex p-2 hover:bg-muted rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(membro)}
                          className="inline-flex p-2 hover:bg-destructive/10 rounded-md transition-colors text-destructive"
                          title="Excluir membro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
              {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Membro"
        description={`Tem certeza que deseja excluir "${memberToDelete?.nome}"? Esta ação não pode ser desfeita e todas as pontuações associadas serão excluídas.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}
