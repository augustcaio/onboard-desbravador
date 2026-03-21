import Image from "next/image";
import { getUnidadeBadge } from "@/lib/utils";

interface Props {
  nome: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function UnidadeBadge({ nome, size = "md" }: Props) {
  const badgeSrc = getUnidadeBadge(nome);

  return (
    <div 
      className={`${sizes[size]} relative flex items-center justify-center`}
      title={nome}
    >
      <Image
        src={badgeSrc}
        alt={nome}
        fill
        className="object-contain"
      />
    </div>
  );
}
