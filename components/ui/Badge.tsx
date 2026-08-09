import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Selo mínimo — hoje usado só para marcar conteúdo de demonstração
 * (ex: "Exemplo demonstrativo" em `ProvasSociais`). Sem preenchimento
 * de fundo (evita se confundir com cartões que também usam `bg-surface`)
 * — só um contorno fino e texto pequeno em caixa alta.
 */
export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-theme border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary ${className}`}
    >
      {children}
    </span>
  );
}
