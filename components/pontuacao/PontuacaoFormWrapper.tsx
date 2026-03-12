"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PontuacaoForm } from "./PontuacaoForm";

export default function PontuacaoFormWrapper({ params }: { params: Promise<{ membroId?: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialMembroId, setInitialMembroId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembro() {
      const membroId = searchParams.get("membroId");
      
      if (membroId) {
        setInitialMembroId(membroId);
      }
      setLoading(false);
    }
    fetchMembro();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <PontuacaoForm initialMembroId={initialMembroId} />;
}
